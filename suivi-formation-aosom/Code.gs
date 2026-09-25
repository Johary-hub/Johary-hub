/**
 * AOSOM FR — Suivi Formation : script UNIQUE pour tous les quiz.
 *
 * Ce script ne se remplace JAMAIS d'un quiz à l'autre. Chaque quiz HTML envoie
 * son résultat à la même URL /exec ; le nom du quiz (QUIZ.id) suffit à le distinguer.
 *
 *   POST (quiz HTML)      → 1 ligne dans SUIVI QUIZ + 1 ligne par question dans QUESTION QUIZ
 *                           → mise à jour de Catalogue quiz, Bilan quiz et Stats questions
 *   GET ?action=agents    → liste des prénoms (autocomplétion de l'écran d'accueil)
 *
 * Payload attendu (les clés marquées * sont facultatives, les anciens quiz restent compatibles) :
 *   { prenom, quiz, famille*, version*, seuil*, score, total, resultat, dureeSec, ratees, details }
 *
 * Après toute modification : Déployer → Gérer les déploiements → ✏️ Modifier
 * → Version : « Nouvelle version » → Déployer. (Ne PAS faire « Nouveau déploiement » : l'URL changerait.)
 */

const CONFIG = {
  SUIVI:     { gid: 1060293098, noms: ['SUIVI QUIZ', 'Suivi quiz'] },
  LOG:       { noms: ['QUESTION QUIZ', 'Log quiz'] },
  AGENTS:    'Agents',
  MATRICE:   'Matrice',
  CATALOGUE: 'Catalogue quiz',
  BILAN:     'Bilan quiz',
  STATS:     'Stats questions',

  // true  → un quiz « Validé » passe la case Agent × Famille de la Matrice à « ✅ Formé ».
  // false → la Matrice reste gérée à la main ; le résultat du quiz s'affiche seulement dans « Bilan quiz ».
  MAJ_MATRICE: false,
  FORME: '✅ Formé',
};

const COLS = {
  SUIVI: ['Horodatage', 'Matricule', 'Prénom', 'Quiz', 'Score', 'Total', 'Pourcentage', 'Résultat',
          'Durée (min)', 'Questions ratées', 'Contrôle prénom', 'Famille', 'Version'],
  LOG:   ['Horodatage', 'Matricule', 'Prénom', 'Quiz', 'Ligne suivi', 'N°', 'Type', 'Question',
          'Réponse donnée', 'Bonne réponse', 'Résultat'],
  // Colonnes auto (recalculées) puis colonnes manuelles (jamais écrasées).
  CATALOGUE_AUTO:   ['Quiz', 'Famille', 'Version', 'Nb questions', 'Seuil', '1re passation', 'Dernière passation',
                     'Passages', 'Agents', 'Agents validés', 'Taux de validation', 'Score moyen'],
  CATALOGUE_MANUEL: ['Lien HTML', 'Commentaire', 'Archivé'],
};

const TYPES = { qcm: 'QCM', qcm_multi: 'QCM multiple', vf: 'Vrai/Faux', ordre: 'Ordre', relier: 'Relier', trous: 'Texte à trous' };


/* ============================== POINTS D'ENTRÉE ============================== */

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';
  if (action === 'agents') return json_({ agents: lireAgents_().map(a => a.affichage).filter(String) });
  return json_({ ok: true, service: 'AOSOM FR — Suivi Formation' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ligne = enregistrer_(ss, p);
    try { recalculerTout_(ss); } catch (err) { console.error('Recalcul tableaux : ' + err); } // ne bloque jamais l'enregistrement
    return json_({ ok: true, ligne });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, erreur: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Menu dans le Sheet. */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🎓 Formation')
    .addItem('Recalculer Catalogue / Bilan / Stats', 'recalculer')
    .addItem('Installer / vérifier les onglets', 'installer')
    .addToUi();
}

function recalculer() { recalculerTout_(SpreadsheetApp.getActiveSpreadsheet()); }

function installer() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  entetes_(feuille_(ss, CONFIG.SUIVI), COLS.SUIVI);
  entetes_(feuille_(ss, CONFIG.LOG), COLS.LOG);
  recalculerTout_(ss);
}


/* ============================== ENREGISTREMENT ============================== */

function enregistrer_(ss, p) {
  const now = new Date();
  const agent = trouverAgent_(p.prenom);
  const famille = String(p.famille || '').trim();
  const version = p.version || '';
  const prenom = agent ? agent.affichage : String(p.prenom || '').trim();
  const total = Number(p.total) || 0, score = Number(p.score) || 0;

  // 1) SUIVI QUIZ : une ligne par passage
  const suivi = feuille_(ss, CONFIG.SUIVI);
  const hS = entetes_(suivi, COLS.SUIVI);
  const ligne = suivi.getLastRow() + 1;
  ecrire_(suivi, ligne, hS, [{
    'Horodatage': now,
    'Matricule': agent ? agent.matricule : '',
    'Prénom': prenom,
    'Quiz': String(p.quiz || '').trim(),
    'Score': score,
    'Total': total,
    'Pourcentage': total ? score / total : '',
    'Résultat': p.resultat || '',
    'Durée (min)': Math.round((Number(p.dureeSec) || 0) / 6) / 10,
    'Questions ratées': p.ratees || '',
    'Contrôle prénom': agent ? 'OK' : 'Non reconnu',
    'Famille': famille,
    'Version': version,
  }]);
  if (hS['Pourcentage']) suivi.getRange(ligne, hS['Pourcentage']).setNumberFormat('0%');

  // 2) QUESTION QUIZ : une ligne par question
  const details = Array.isArray(p.details) ? p.details : [];
  if (details.length) {
    const log = feuille_(ss, CONFIG.LOG);
    const hL = entetes_(log, COLS.LOG);
    ecrire_(log, log.getLastRow() + 1, hL, details.map(d => ({
      'Horodatage': now,
      'Matricule': agent ? agent.matricule : '',
      'Prénom': prenom,
      'Quiz': String(p.quiz || '').trim(),
      'Ligne suivi': ligne,
      'N°': d.n,
      'Type': TYPES[d.type] || d.type || '',
      'Question': d.question || '',
      'Réponse donnée': d.donnee || '',
      'Bonne réponse': d.attendue || '',
      'Résultat': d.ok ? '✔ Juste' : '✘ Faux',
    })));
  }

  // 3) Catalogue : mémorise les infos que seul le payload connaît (seuil, nb questions)
  majCatalogueDepuisPayload_(ss, p, total);

  // 4) Matrice (optionnel)
  if (CONFIG.MAJ_MATRICE && agent && p.resultat === 'Validé') {
    const fam = famille || familleCatalogue_(ss, p.quiz);
    if (fam) marquerMatrice_(ss, agent.matricule, fam);
  }
  return ligne;
}

function majCatalogueDepuisPayload_(ss, p, total) {
  const cat = feuilleOuCree_(ss, CONFIG.CATALOGUE);
  const h = entetes_(cat, COLS.CATALOGUE_AUTO.concat(COLS.CATALOGUE_MANUEL));
  const id = String(p.quiz || '').trim();
  if (!id) return;
  const n = cat.getLastRow();
  const ids = n > 1 ? cat.getRange(2, h['Quiz'], n - 1, 1).getValues().map(r => String(r[0])) : [];
  let r = ids.indexOf(id);
  r = r < 0 ? n + 1 : r + 2;
  if (r > n) cat.getRange(r, h['Quiz']).setValue(id);
  if (total) cat.getRange(r, h['Nb questions']).setValue(total);
  if (p.seuil) cat.getRange(r, h['Seuil']).setValue(Number(p.seuil)).setNumberFormat('0%');
  if (p.famille) cat.getRange(r, h['Famille']).setValue(String(p.famille).trim());
  if (p.version) cat.getRange(r, h['Version']).setValue(p.version);
}

function marquerMatrice_(ss, matricule, famille) {
  const m = ss.getSheetByName(CONFIG.MATRICE);
  if (!m || m.getLastRow() < 2) return;
  const v = m.getDataRange().getValues();
  const c = v[0].map(norm_).indexOf(norm_(famille));
  const r = v.findIndex(row => String(row[0]).trim() === matricule);
  if (c >= 0 && r > 0) m.getRange(r + 1, c + 1).setValue(CONFIG.FORME);
}


/* ============================== TABLEAUX CALCULÉS ============================== */

function recalculerTout_(ss) {
  const passages = lirePassages_(ss);
  const catalogue = construireCatalogue_(ss, passages);
  construireBilan_(ss, passages, catalogue);
  construireStats_(ss);
}

function lirePassages_(ss) {
  const sh = feuille_(ss, CONFIG.SUIVI);
  if (sh.getLastRow() < 2) return [];
  const v = sh.getDataRange().getValues(), h = v[0].map(String);
  const col = n => h.indexOf(n);
  const [cD, cM, cP, cQ, cS, cT, cR, cF, cV] =
    ['Horodatage', 'Matricule', 'Prénom', 'Quiz', 'Score', 'Total', 'Résultat', 'Famille', 'Version'].map(col);
  return v.slice(1).filter(r => String(r[cQ]).trim()).map(r => ({
    date: r[cD], matricule: String(r[cM]).trim(), prenom: String(r[cP]).trim(), quiz: String(r[cQ]).trim(),
    score: Number(r[cS]) || 0, total: Number(r[cT]) || 0, valide: r[cR] === 'Validé',
    famille: cF >= 0 ? String(r[cF]).trim() : '', version: cV >= 0 ? r[cV] : '',
  }));
}

/** Catalogue : colonnes auto recalculées, colonnes manuelles conservées. Renvoie [{quiz, famille, archive}]. */
function construireCatalogue_(ss, passages) {
  const sh = feuilleOuCree_(ss, CONFIG.CATALOGUE);
  const cols = COLS.CATALOGUE_AUTO.concat(COLS.CATALOGUE_MANUEL);
  const h = entetes_(sh, cols);
  const largeur = sh.getLastColumn();

  // Lignes existantes (on garde tout ce qui a été saisi à la main)
  const exist = {}, ordre = [];
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, largeur).getValues().forEach(r => {
      const id = String(r[h['Quiz'] - 1]).trim();
      if (id && !exist[id]) { exist[id] = r; ordre.push(id); }
    });
  }
  const parQuiz = grouper_(passages, x => x.quiz);
  Object.keys(parQuiz).forEach(id => { if (!exist[id]) { exist[id] = new Array(largeur).fill(''); ordre.push(id); } });

  const lignes = ordre.map(id => {
    const r = exist[id].slice(), ps = parQuiz[id] || [];
    const set = (n, val) => { r[h[n] - 1] = val; };
    const get = n => r[h[n] - 1];
    const familles = ps.filter(x => x.famille).map(x => x.famille);
    set('Quiz', id);
    if (!get('Famille') && familles.length) set('Famille', familles[familles.length - 1]);
    const vers = ps.filter(x => x.version !== '').map(x => x.version);
    if (vers.length) set('Version', vers[vers.length - 1]);
    if (!get('Nb questions') && ps.length) set('Nb questions', ps[ps.length - 1].total);
    const dates = ps.map(x => x.date).filter(d => d instanceof Date).sort((a, b) => a - b);
    set('1re passation', dates[0] || '');
    set('Dernière passation', dates[dates.length - 1] || '');
    set('Passages', ps.length);
    const agents = uniques_(ps.map(cleAgent_));
    const valides = uniques_(ps.filter(x => x.valide).map(cleAgent_));
    set('Agents', agents.length);
    set('Agents validés', valides.length);
    set('Taux de validation', agents.length ? valides.length / agents.length : '');
    const pcts = ps.filter(x => x.total).map(x => x.score / x.total);
    set('Score moyen', pcts.length ? pcts.reduce((a, b) => a + b, 0) / pcts.length : '');
    return r;
  });

  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, largeur).clearContent();
  if (lignes.length) {
    sh.getRange(2, 1, lignes.length, largeur).setValues(lignes);
    ['Seuil', 'Taux de validation', 'Score moyen'].forEach(n => sh.getRange(2, h[n], lignes.length, 1).setNumberFormat('0%'));
    ['1re passation', 'Dernière passation'].forEach(n => sh.getRange(2, h[n], lignes.length, 1).setNumberFormat('dd/MM/yyyy HH:mm'));
  }
  return lignes.map(r => ({
    quiz: String(r[h['Quiz'] - 1]),
    famille: String(r[h['Famille'] - 1] || '').trim(),
    archive: /^(oui|x|true|1)$/i.test(String(r[h['Archivé'] - 1]).trim()),
  }));
}

/**
 * Bilan : une ligne par agent, une colonne par quiz.
 *   ✅ 86 %          validé (meilleur score)
 *   🟠 50 % ×2       passé, pas encore validé (meilleur score, nb de tentatives)
 *   🔴 À passer      jamais passé alors que l'agent est « ✅ Formé » sur la famille du quiz (Matrice)
 *   (vide)           non concerné
 */
function construireBilan_(ss, passages, catalogue) {
  const agents = lireAgents_();
  const quiz = catalogue.filter(q => !q.archive);
  const formes = lireMatrice_(ss);
  const parCle = grouper_(passages, x => cleAgent_(x) + '||' + x.quiz);

  const entete = ['Matricule', 'Agent', 'Quiz validés', 'À passer / à revoir']
    .concat(quiz.map(q => q.famille ? q.quiz + '\n(' + q.famille + ')' : q.quiz));
  const lignes = agents.map(a => {
    let ok = 0, reste = 0;
    const cases = quiz.map(q => {
      const ps = parCle[a.matricule + '||' + q.quiz] || [];
      if (!ps.length) {
        const concerne = q.famille && formes[a.matricule] && formes[a.matricule][norm_(q.famille)];
        if (concerne) { reste++; return '🔴 À passer'; }
        return '';
      }
      const best = Math.max.apply(null, ps.map(x => x.total ? x.score / x.total : 0));
      const pct = Math.round(best * 100) + ' %';
      if (ps.some(x => x.valide)) { ok++; return '✅ ' + pct; }
      reste++;
      return '🟠 ' + pct + (ps.length > 1 ? ' ×' + ps.length : '');
    });
    return [a.matricule, a.affichage, ok, reste].concat(cases);
  });

  // Passages non rattachés à un agent du référentiel (prénom non reconnu)
  const connus = {};
  agents.forEach(a => { connus[a.matricule] = true; });
  const inconnus = uniques_(passages.filter(x => !connus[x.matricule]).map(x => x.prenom || '?'));

  const sh = feuilleOuCree_(ss, CONFIG.BILAN);
  sh.clear();
  const data = [entete].concat(lignes);
  sh.getRange(1, 1, data.length, entete.length).setValues(data);
  sh.getRange(1, 1, 1, entete.length).setFontWeight('bold').setWrap(true).setVerticalAlignment('middle');
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);
  if (inconnus.length) {
    sh.getRange(data.length + 2, 1, 1, 2).setValues([['⚠ Prénoms non reconnus', inconnus.join(', ')]]);
  }
}

/** Stats : taux de réussite par question, les plus ratées en haut. */
function construireStats_(ss) {
  const log = feuille_(ss, CONFIG.LOG);
  const sh = feuilleOuCree_(ss, CONFIG.STATS);
  sh.clear();
  const entete = ['Quiz', 'N°', 'Type', 'Question', 'Réponses', 'Justes', 'Taux de réussite', 'Réponse attendue'];
  sh.getRange(1, 1, 1, entete.length).setValues([entete]).setFontWeight('bold');
  sh.setFrozenRows(1);
  if (log.getLastRow() < 2) return;

  const v = log.getDataRange().getValues(), h = v[0].map(String);
  const c = n => h.indexOf(n);
  const [cQ, cN, cT, cX, cB, cR] = ['Quiz', 'N°', 'Type', 'Question', 'Bonne réponse', 'Résultat'].map(c);
  const g = {};
  v.slice(1).forEach(r => {
    const k = r[cQ] + '||' + r[cN];
    if (!r[cQ]) return;
    const s = g[k] || (g[k] = { quiz: r[cQ], n: r[cN], type: '', q: '', att: '', tot: 0, ok: 0 });
    s.type = r[cT]; s.q = r[cX]; s.att = r[cB]; // dernière version de l'énoncé
    s.tot++; if (String(r[cR]).indexOf('✔') === 0) s.ok++;
  });
  const lignes = Object.keys(g).map(k => g[k])
    .sort((a, b) => a.ok / a.tot - b.ok / b.tot || String(a.quiz).localeCompare(String(b.quiz)) || a.n - b.n)
    .map(s => [s.quiz, s.n, s.type, s.q, s.tot, s.ok, s.ok / s.tot, s.att]);
  if (lignes.length) {
    sh.getRange(2, 1, lignes.length, entete.length).setValues(lignes);
    sh.getRange(2, 7, lignes.length, 1).setNumberFormat('0%');
  }
}


/* ============================== RÉFÉRENTIELS ============================== */

/** Agents : Matricule | Nom | Affichage | … */
function lireAgents_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.AGENTS);
  if (!sh || sh.getLastRow() < 2) return [];
  const v = sh.getDataRange().getValues(), h = v[0].map(norm_);
  const cM = h.indexOf('matricule'), cN = h.indexOf('nom'), cA = h.indexOf('affichage');
  return v.slice(1)
    .map(r => ({ matricule: String(r[cM]).trim(), nom: cN >= 0 ? String(r[cN]).trim() : '', affichage: String(r[cA]).trim() }))
    .filter(a => a.matricule);
}

function trouverAgent_(prenom) {
  const p = norm_(prenom);
  if (!p) return null;
  const agents = lireAgents_();
  return agents.find(a => norm_(a.affichage) === p)
      || agents.find(a => norm_(a.nom).split(/[\s.]+/).indexOf(p) >= 0)
      || null;
}

/** Matrice : { matricule: { famille_normalisée: true si « Formé » } } */
function lireMatrice_(ss) {
  const m = ss.getSheetByName(CONFIG.MATRICE);
  const out = {};
  if (!m || m.getLastRow() < 2) return out;
  const v = m.getDataRange().getValues(), fam = v[0].map(norm_);
  v.slice(1).forEach(r => {
    const mat = String(r[0]).trim();
    if (!mat) return;
    out[mat] = {};
    r.forEach((x, i) => { if (i > 1 && /form[ée]/i.test(String(x)) && !/non/i.test(String(x))) out[mat][fam[i]] = true; });
  });
  return out;
}

function familleCatalogue_(ss, quizId) {
  const sh = ss.getSheetByName(CONFIG.CATALOGUE);
  if (!sh || sh.getLastRow() < 2) return '';
  const v = sh.getDataRange().getValues(), h = v[0].map(String);
  const r = v.find(x => String(x[h.indexOf('Quiz')]).trim() === String(quizId).trim());
  return r ? String(r[h.indexOf('Famille')] || '').trim() : '';
}


/* ============================== OUTILS ============================== */

/** Onglet par gid puis par nom ; créé s'il n'existe pas. */
function feuille_(ss, def) {
  if (def.gid) {
    const byId = ss.getSheets().find(s => s.getSheetId() === def.gid);
    if (byId) return byId;
  }
  for (const n of def.noms) { const s = ss.getSheetByName(n); if (s) return s; }
  return ss.insertSheet(def.noms[0]);
}

function feuilleOuCree_(ss, nom) { return ss.getSheetByName(nom) || ss.insertSheet(nom); }

/** Ajoute les en-têtes manquants à droite, sans toucher aux existants. Renvoie { nom: n° de colonne }. */
function entetes_(sh, noms) {
  const lc = sh.getLastColumn();
  const act = lc ? sh.getRange(1, 1, 1, lc).getValues()[0].map(x => String(x).trim()) : [];
  const manquants = noms.filter(n => act.indexOf(n) < 0);
  if (manquants.length) {
    // Colonnes vides en fin de ligne 1 : on écrit juste après la dernière non vide.
    let fin = act.length; while (fin > 0 && !act[fin - 1]) fin--;
    sh.getRange(1, fin + 1, 1, manquants.length).setValues([manquants]).setFontWeight('bold');
    act.length = fin; act.push.apply(act, manquants);
  }
  const map = {};
  act.forEach((n, i) => { if (n && !map[n]) map[n] = i + 1; });
  return map;
}

/** Écrit des objets {en-tête: valeur} à partir de la ligne `ligne`, en respectant l'ordre des colonnes. */
function ecrire_(sh, ligne, h, objets) {
  const largeur = Math.max.apply(null, Object.keys(h).map(k => h[k]));
  const rows = objets.map(o => {
    const r = new Array(largeur).fill('');
    Object.keys(o).forEach(k => { if (h[k]) r[h[k] - 1] = o[k]; });
    return r;
  });
  sh.getRange(ligne, 1, rows.length, largeur).setValues(rows);
}

function grouper_(arr, f) { const g = {}; arr.forEach(x => { const k = f(x); (g[k] || (g[k] = [])).push(x); }); return g; }
function uniques_(arr) { return arr.filter((x, i) => x && arr.indexOf(x) === i); }
function cleAgent_(x) { return x.matricule || ('?' + norm_(x.prenom)); }
function norm_(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim(); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }


/* ============================== TEST MANUEL ============================== */

/**
 * À lancer depuis l'éditeur (▶ Exécuter) pour vérifier l'installation.
 * Écrit un passage « TEST — à supprimer » : supprime ensuite ses lignes dans SUIVI QUIZ et QUESTION QUIZ,
 * puis menu 🎓 Formation → Recalculer.
 */
function testerUnPassage() {
  doPost({ postData: { contents: JSON.stringify({
    prenom: 'Mialy', quiz: 'TEST — à supprimer', famille: '', version: 1, seuil: 0.8,
    score: 1, total: 2, resultat: 'À revoir', dureeSec: 95, ratees: 'Q2',
    details: [
      { n: 1, type: 'qcm', question: 'Question test 1', donnee: 'A', attendue: 'A', ok: true },
      { n: 2, type: 'vf', question: 'Question test 2', donnee: 'Vrai', attendue: 'Faux', ok: false },
    ],
  }) } });
}
