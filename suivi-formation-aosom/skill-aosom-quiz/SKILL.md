---
name: "aosom-quiz"
description: "Crée un quiz HTML autonome AOSOM FR (QCM, vrai/faux, ordre, relier par flèches, trous) dont les résultats s'écrivent dans la feuille « Suivi quiz ». Déclencher sur : quiz, QCM, évaluation agents, test de connaissances."
---

# Quiz AOSOM FR → feuille « Suivi quiz »

Produit un fichier `.html` unique et autonome. L'agent saisit son prénom, répond, et son résultat part automatiquement sur la ligne libre suivante de la feuille « Suivi quiz » (Sheet `1JN4ZdJUs19Rsrv41B3rOZWkKbuJw2Im9mjIjlgn97hk`), via le script Apps Script déjà déployé. Le détail de chaque réponse est aussi journalisé dans l'onglet « Log quiz » (une ligne par question).

## 1. Ce qui ne change JAMAIS (le fonctionnement)

Le style est libre et peut évoluer. Le fonctionnement, lui, est figé. Chaque quiz doit respecter ces points :

- **URL d'envoi** : `https://script.google.com/macros/s/AKfycbzjEnC3Fj-LCRh3yv-giNXhXr91mMJJhNYlCp5EVEQvmKhMqbF9ni-otdktVatnrpk5vg/exec` (constante `WEB_APP`). Si l'utilisateur donne une nouvelle URL `/exec`, c'est la seule chose qu'on remplace.
- **Envoi** : `fetch(WEB_APP, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=UTF-8'}, body: JSON.stringify(payload) })`. Un seul envoi par passage, avec un bouton « Renvoyer » en cas d'échec réseau. Pas de relance en boucle.
- **Payload exact** (le script lit ces clés, rien d'autre) :
  `{ prenom, quiz, famille, version, seuil, score, total, resultat: 'Validé'|'À revoir', dureeSec, ratees: 'Q2, Q5', details }`
  `famille`, `version`, `seuil` alimentent l'onglet « Catalogue quiz » et le « Bilan quiz » (les anciens quiz sans ces clés restent acceptés).
  `details` = une entrée par question `{ n, type, question, donnee, attendue, ok }` → une ligne par question dans l'onglet « Log quiz ».
- **Écran prénom en premier**, avec l'autocomplétion alimentée par `GET WEB_APP?action=agents`. Le script rapproche le prénom de la colonne « Affichage » du référentiel pour retrouver le matricule. Un prénom inconnu est quand même enregistré, mais marqué « Non reconnu ».
- **`QUIZ.famille`** = la famille de formation testée, écrite **exactement** comme l'en-tête de colonne de l'onglet « Matrice » : Amazon, FNAC&DARTY, Tiktokshop, Mirakl, Rakuten, Veepee, Cdiscount&Bébéboutik, Manomano, aosom, Fichier retour, Paiement par virement, SCALAPAY, BOL, Xcotton. Vide seulement si le quiz est transverse (le formateur pourra la saisir dans « Catalogue quiz »). Si la famille n'est pas évidente d'après la source, demande-la dans le plan.
- **`QUIZ.version`** = 1 à la création. Si on corrige les questions d'un quiz déjà diffusé, on garde le même `id` et on incrémente `version`.
- **Un seul script pour tous les quiz** : on ne crée jamais de nouveau script Google ni de nouvelle URL pour un nouveau quiz. Le nouveau quiz se distingue uniquement par son `QUIZ.id`.
- **`QUIZ.id`** = le nom qui apparaît dans la colonne « Quiz ». Il doit être court, unique et stable (ex. `QUIZ T4`), car c'est la clé de filtrage dans le Sheet. Si l'utilisateur donne un nom, on l'utilise tel quel ; sous-titre vide sauf demande.
- **Une question = 1 point**, tout ou rien (un « relier » ou un « ordre » partiellement juste compte comme faux).
- **Fichier 100 % autonome** : images intégrées en base64, aucun fichier annexe. Seule dépendance externe tolérée : la police Google Fonts (le rendu retombe sur une police système si elle ne charge pas).

Le moteur ci-dessous (§6) applique tout cela. **On ne modifie que le bloc `QUIZ`** et, si on le souhaite, le bloc `STYLE`. On ne touche pas à la partie `MOTEUR`, sauf pour ajouter un nouveau type de question (voir §7).

## 2. Deux façons de créer un quiz

**A. L'utilisateur fournit les questions (texte, images, captures OMS/Shulex…)**
Transcris-les fidèlement dans le schéma (§3). Choisis le type le plus adapté quand il n'est pas précisé. Signale une réponse qui te paraît fausse ou ambiguë au regard des sources du projet, sans la corriger de ton propre chef. Construis directement. Si une bonne réponse n'est pas indiquée et que les sources ne permettent pas de trancher, écarte la question et signale-la (ou demande), plutôt que de deviner.

**B. L'utilisateur donne une source et demande le quiz complet**
1. Lis la source en entier (fichier joint, doc du projet : Récapitulatif Marketplaces, RMA Reasons V3, Garantie Point & Click, WIZMO, Amazon, Templates…).
2. Envoie d'abord un **plan court** : titre (`QUIZ.id`), famille (`QUIZ.famille`), nombre de questions, seuil, et pour chaque question la notion testée et son type. Attends la validation avant de construire (règle projet : valider la structure avant de produire).
3. Valeurs par défaut quand rien n'est précisé : 10 questions, seuil 80 %, types variés (au moins 3 types différents, pas plus de 50 % de QCM).

**Règle source-first (non négociable)** : chaque bonne réponse doit être vérifiable dans la source. On n'invente aucune règle process AOSOM (délai, code RMA, montant, canal). L'explication (`expl`) cite la règle et, si possible, la source (ex. « Récap Marketplaces V16 : HOMCOM = 45 jours »). Si la source est muette ou contradictoire, on écarte la question et on le signale.

## 3. Schéma des questions

Champs communs facultatifs : `expl` (affiché après validation, **toujours le remplir**), `image` (data URI base64, affichée sous l'énoncé), `melanger:false` (QCM uniquement : garde l'ordre des options, ex. « 14 j / 30 j / 45 j »).

```js
// QCM — une seule bonne réponse (index à partir de 0)
{ type:'qcm', q:"Délai de rétractation HOMCOM ?", options:["14 jours","30 jours","45 jours"], bonne:2, expl:"…" }

// QCM multiple — plusieurs bonnes réponses, toutes requises
{ type:'qcm_multi', q:"Quelles marketplaces ont un retour gratuit ?", options:["Rakuten","Cdiscount","Kaufland","Fnac"], bonne:[0,2], expl:"…" }

// Vrai / faux (binaire)
{ type:'vf', q:"Sur TEMU, on peut proposer une réexpédition.", bonne:false, expl:"…" }

// Organiser — items écrits dans le BON ordre, le moteur les mélange
{ type:'ordre', q:"Remets les étapes du traitement dans l'ordre", items:["Identifier la commande","Vérifier le délai","Créer le RMA","Répondre au client"], expl:"…" }

// Relier par flèches — paires [gauche, droite] correctes, la colonne de droite est mélangée
{ type:'relier', q:"Relie chaque marketplace à son délai", paires:[["Amazon","30 jours"],["HOMCOM","45 jours"],["Rakuten","14 jours"]], expl:"…" }

// Texte à trous — {{1}}, {{2}}… ; plusieurs réponses acceptées via un tableau (accents/majuscules ignorés) ; \n pour aller à la ligne
{ type:'trous', consigne:"Complète la règle", texte:"Sur HOMCOM le délai est de {{1}} jours et le retour est {{2}}.", reponses:[["45","quarante-cinq"],"payant"], expl:"…" }
```

Une option, un item ou un élément de paire peut être une image : `{ img:"data:image/…", txt:"légende facultative" }`. Le `txt` est aussi ce qui apparaît dans le « Log quiz » : donne-lui toujours une légende courte (ex. « Photo 1 »).

Contraintes vérifiées par `check_quiz.js` : ≥ 2 options par QCM, ≥ 3 items pour `ordre`, ≥ 3 paires pour `relier`, aucune valeur de droite en double dans `relier`, autant de `{{n}}` que de `reponses`, images en base64, moteur à jour (payload avec `details`).

## 4. Qualité pédagogique

- Niveau visé pour les agents : **Application** (Bloom). On teste des situations de traitement (« Un client Rakuten veut… que fais-tu ? »), pas la récitation.
- Distracteurs plausibles, tirés de vraies confusions (délai d'une autre marketplace, canal voisin, signe +/- inversé). Pas de « toutes les réponses » ni de pièges de formulation.
- Cas SKU réalistes : les erreurs réelles sont souvent minimes (même modèle, seule la couleur change en fin de SKU : BK → PK).
- Vrai/faux : répartis à peu près moitié vrai, moitié faux. Évite les doubles négations.
- `relier` : 3 à 6 paires. `ordre` : 3 à 7 items.
- Trous : réponses courtes et non ambiguës (chiffre, mot-clé). Liste les variantes acceptables.
- Registre : tutoiement, ton de formateur bienveillant dans les énoncés et les explications.

## 5. Construction et contrôle

1. Écris le moteur (§6) dans `quiz-aosom-<slug>.html` et remplace le bloc `QUIZ` (id, famille, version, sousTitre, seuil, questions).
2. Images fournies par l'utilisateur (y compris celles contenues dans un .docx : `word/media/`) : `python3 embed_image.py capture.png` (script §6) → colle la data URI dans `image` ou `img`. Largeur max 1100 px ; recadre les captures sur la zone utile ; garde le fichier sous ~3 Mo.
3. Contrôle : `node check_quiz.js quiz-aosom-<slug>.html`. Corrige jusqu'à ce qu'il affiche ✔.
4. Si Playwright/Chromium est disponible : ouvre le fichier, saisis un prénom, joue le quiz en interceptant `script.google.com` avec `page.route('https://script.google.com/**', …)` (pas un motif `https://**` trop large, qui fait échouer l'envoi), sans envoyer au vrai Sheet. Vérifie que le payload final est correct (dont `details` : une entrée par question), qu'il n'y a pas d'erreur JS, et qu'une réponse fausse est bien notée fausse. Regarde une capture de chaque type de question présent.
5. Livre le fichier `.html` (pas un artifact publié : l'envoi vers Apps Script doit partir du navigateur de l'agent). Récap en 2 lignes : titre, famille, nb de questions et types, seuil. Rappelle qu'il n'y a **rien à changer côté Google Sheets** : le quiz apparaîtra seul dans « Catalogue quiz » au premier passage (le formateur peut y coller le lien du fichier dans « Lien HTML »). Pour tester sans polluer le suivi, le formateur peut faire un passage puis supprimer ses lignes (Suivi quiz et Log quiz).

**Ne jamais** envoyer de POST de test vers la vraie URL `/exec` depuis l'environnement de construction : ça écrirait une ligne dans le suivi réel.

## 6. Fichiers de référence

### 6.1 Moteur — `quiz-engine.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Quiz AOSOM</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
/* ===================== STYLE (libre, peut évoluer) ===================== */
:root{--navy:#0B2440;--navy2:#0B1B33;--blue:#005DA8;--orange:#F5A623;--ok:#1E8E5A;--ko:#C0392B;--bg:#F4F6F9;--card:#fff;--line:#D5DCE5;--muted:#5B6B7F;}
*{box-sizing:border-box}
body{margin:0;font-family:'Nunito Sans',sans-serif;background:var(--bg);color:var(--navy2)}
header{background:var(--navy);color:#fff;padding:18px 16px}
header h1{margin:0;font-size:1.25rem;font-weight:800}
header p{margin:4px 0 0;opacity:.8;font-size:.9rem}
.bar{height:4px;background:rgba(255,255,255,.15);margin-top:12px;border-radius:2px;overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--orange);transition:width .3s}
main{max-width:760px;margin:24px auto;padding:0 16px}
.card{background:var(--card);border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(11,36,64,.08)}
label.lbl{font-weight:700;display:block;margin-bottom:8px}
input[type=text]{width:100%;padding:12px 14px;font:inherit;border:2px solid var(--line);border-radius:8px}
input[type=text]:focus{outline:none;border-color:var(--blue)}
.hint{color:var(--muted);font-size:.85rem;margin-top:6px}
button{font:inherit;font-weight:700;border:0;border-radius:8px;padding:12px 20px;cursor:pointer;background:var(--blue);color:#fff;margin-top:18px}
button:disabled{opacity:.45;cursor:not-allowed}
.q-num{color:var(--blue);font-weight:800;font-size:.85rem;text-transform:uppercase;letter-spacing:.04em}
.q-type{color:var(--muted);font-size:.8rem;font-weight:600}
.q-txt{font-size:1.1rem;font-weight:700;margin:8px 0 14px;white-space:pre-line}
.q-img{max-width:100%;border-radius:8px;border:1px solid var(--line);margin-bottom:14px;display:block}
.item img{max-width:100%;max-height:140px;display:block;border-radius:4px}
.opt{display:block;width:100%;text-align:left;background:#fff;color:var(--navy2);border:2px solid var(--line);margin:0 0 10px;font-weight:600}
.opt:hover:not(:disabled){border-color:var(--blue)}
.opt:disabled{opacity:1;cursor:default}
.opt img{max-width:100%;height:auto;display:block;border-radius:4px;margin-bottom:6px}
.opt.sel{border-color:var(--blue);background:#E6F0F9}
.good{border-color:var(--ok)!important;background:#E8F6EE!important}
.bad{border-color:var(--ko)!important;background:#FBECEA!important}
.vf{display:flex;gap:12px}.vf .opt{text-align:center}
.ord{display:flex;align-items:center;gap:8px;border:2px solid var(--line);border-radius:8px;padding:8px 10px;margin-bottom:8px;background:#fff}
.ord .n{font-weight:800;color:var(--blue);min-width:22px}
.ord .t{flex:1;font-weight:600}
.ord button{margin:0;padding:6px 10px;background:#E6F0F9;color:var(--navy)}
.rel{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:18px 70px}
.rel .col{display:flex;flex-direction:column;gap:10px;z-index:1}
.rel .item{border:2px solid var(--line);border-radius:8px;padding:10px 12px;background:#fff;cursor:pointer;font-weight:600;min-height:44px}
.rel .item.active{border-color:var(--orange);background:#FFF7E8}
.rel .item.linked{border-color:var(--blue)}
.rel svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2}
.trous input{display:inline-block;width:auto;min-width:110px;padding:4px 8px;margin:2px 4px;border-width:2px}
.trous{line-height:2.2;font-size:1.02rem;white-space:pre-line}
.expl{margin-top:14px;padding:12px 14px;border-left:4px solid var(--orange);background:#FFF7E8;border-radius:4px;font-size:.95rem;white-space:pre-line}
.verdict{font-weight:800;margin-top:14px}
.score{font-size:2.6rem;font-weight:800;color:var(--navy)}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-weight:800;color:#fff}
.status{margin-top:14px;font-weight:600}
.hidden{display:none!important}
@media(max-width:520px){.rel{gap:14px 36px}}
</style>
</head>
<body>
<header>
  <h1 id="title"></h1>
  <p id="subtitle"></p>
  <div class="bar"><i id="progress"></i></div>
</header>
<main>
  <section id="s-name" class="card">
    <label class="lbl" for="prenom">Ton prénom</label>
    <input type="text" id="prenom" list="agents" autocomplete="off" placeholder="ex : Mialy">
    <datalist id="agents"></datalist>
    <div class="hint">Écris ton prénom tel qu'il apparaît dans la liste de l'équipe.</div>
    <button id="start" disabled>Commencer</button>
  </section>
  <section id="s-quiz" class="card hidden">
    <div class="q-num" id="qnum"></div>
    <div class="q-type" id="qtype"></div>
    <div class="q-txt" id="qtxt"></div>
    <div id="qimg"></div>
    <div id="zone"></div>
    <div id="verdict" class="verdict hidden"></div>
    <div id="expl" class="expl hidden"></div>
    <button id="valider">Valider</button>
    <button id="next" class="hidden">Question suivante</button>
  </section>
  <section id="s-end" class="card hidden">
    <div class="q-num">Résultat</div>
    <div class="score" id="score"></div>
    <span class="badge" id="badge"></span>
    <div class="status" id="status"></div>
    <button id="retry" class="hidden">Renvoyer le résultat</button>
  </section>
</main>

<script>
/* ======================= CONTENU DU QUIZ (à remplir) ======================= */
const QUIZ = {
  id: 'NOM DU QUIZ',
  famille: '',      // en-tête exact de la Matrice (ex. 'Mirakl'), vide si transverse
  version: 1,
  sousTitre: '',
  seuil: 0.8,
  melanger: true,
  questions: [ /* voir schéma dans la compétence */ ]
};
/* ======================= MOTEUR (ne pas modifier) ======================= */
const WEB_APP = 'https://script.google.com/macros/s/AKfycbzjEnC3Fj-LCRh3yv-giNXhXr91mMJJhNYlCp5EVEQvmKhMqbF9ni-otdktVatnrpk5vg/exec';
const $ = id => document.getElementById(id);
const LABELS = {qcm:'Choix unique',qcm_multi:'Plusieurs réponses possibles',vf:'Vrai ou faux',ordre:'Remets dans le bon ordre',relier:'Relie chaque élément à sa correspondance',trous:'Complète les trous'};
let idx = 0, bonnes = 0, ratees = [], details = [], t0 = 0, payload = null, state = null, sent = false;

const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
function content(x){ const el = document.createElement('span');
  if (x && typeof x === 'object' && x.img){ const i = document.createElement('img'); i.src = x.img; i.alt = x.alt || ''; el.appendChild(i); if (x.txt){ const t=document.createElement('div'); t.textContent=x.txt; el.appendChild(t);} }
  else el.textContent = x; return el; }
const label = x => (x && typeof x === 'object') ? (x.txt || x.alt || 'image') : x;

$('title').textContent = 'Quiz AOSOM — ' + QUIZ.id;
$('subtitle').textContent = QUIZ.sousTitre || '';
fetch(WEB_APP + '?action=agents').then(r => r.json())
  .then(d => (d.agents || []).forEach(n => { const o = document.createElement('option'); o.value = n; $('agents').appendChild(o); })).catch(() => {});
$('prenom').addEventListener('input', e => $('start').disabled = e.target.value.trim().length < 2);
$('prenom').addEventListener('keydown', e => { if (e.key === 'Enter' && !$('start').disabled) $('start').click(); });
$('start').onclick = () => { t0 = Date.now(); $('s-name').classList.add('hidden'); $('s-quiz').classList.remove('hidden'); show(); };
window.addEventListener('beforeunload', e => { if (t0 && !sent) { e.preventDefault(); e.returnValue = ''; } });

function show(){
  const Q = QUIZ.questions[idx], n = QUIZ.questions.length;
  $('qnum').textContent = `Question ${idx + 1} / ${n}`;
  $('qtype').textContent = LABELS[Q.type] || '';
  $('qtxt').textContent = Q.type === 'trous' ? (Q.consigne || '') : Q.q;
  $('qimg').innerHTML = ''; if (Q.image){ const i = document.createElement('img'); i.src = Q.image; i.className = 'q-img'; i.alt = ''; $('qimg').appendChild(i); }
  $('zone').innerHTML = ''; ['verdict','expl','next'].forEach(k => $(k).classList.add('hidden'));
  $('valider').classList.remove('hidden'); $('valider').disabled = true;
  $('progress').style.width = (idx / n * 100) + '%';
  RENDER[Q.type](Q, $('zone'));
}

const RENDER = {
  qcm(Q, z, multi = false){
    const order = QUIZ.melanger && Q.melanger !== false ? shuffle(Q.options.map((_, i) => i)) : Q.options.map((_, i) => i);
    state = { sel: new Set(), btns: {} };
    order.forEach(k => { const b = document.createElement('button'); b.className = 'opt'; b.appendChild(content(Q.options[k]));
      b.onclick = () => { if (!multi) { state.sel.clear(); Object.values(state.btns).forEach(x => x.classList.remove('sel')); }
        state.sel.has(k) ? state.sel.delete(k) : state.sel.add(k); b.classList.toggle('sel', state.sel.has(k)); $('valider').disabled = state.sel.size === 0; };
      state.btns[k] = b; z.appendChild(b); });
  },
  qcm_multi(Q, z){ RENDER.qcm(Q, z, true); },
  vf(Q, z){
    const w = document.createElement('div'); w.className = 'vf'; state = { sel: null, btns: {} };
    [[true,'Vrai'],[false,'Faux']].forEach(([v, t]) => { const b = document.createElement('button'); b.className = 'opt'; b.textContent = t;
      b.onclick = () => { state.sel = v; Object.values(state.btns).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); $('valider').disabled = false; };
      state.btns[v] = b; w.appendChild(b); }); z.appendChild(w);
  },
  ordre(Q, z){
    let cur = shuffle(Q.items.map((_, i) => i)); if (cur.every((v, i) => v === i) && cur.length > 1) cur.reverse();
    state = { cur }; $('valider').disabled = false;
    const draw = () => { z.innerHTML = ''; state.rows = [];
      state.cur.forEach((k, pos) => { const r = document.createElement('div'); r.className = 'ord';
        r.innerHTML = `<span class="n">${pos + 1}</span>`; const t = document.createElement('span'); t.className = 't'; t.appendChild(content(Q.items[k])); r.appendChild(t);
        [['▲',-1],['▼',1]].forEach(([s, d]) => { const b = document.createElement('button'); b.textContent = s; b.disabled = state.locked || pos + d < 0 || pos + d >= state.cur.length;
          b.onclick = () => { [state.cur[pos], state.cur[pos + d]] = [state.cur[pos + d], state.cur[pos]]; draw(); }; r.appendChild(b); });
        state.rows.push(r); z.appendChild(r); }); };
    state.draw = draw; draw();
  },
  relier(Q, z){
    const wrap = document.createElement('div'); wrap.className = 'rel';
    const L = document.createElement('div'), R = document.createElement('div'); L.className = R.className = 'col';
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const rOrder = shuffle(Q.paires.map((_, i) => i));
    state = { links: {}, active: null, L: [], R: {}, svg, wrap, colors: {} };
    Q.paires.forEach((p, i) => { const d = document.createElement('div'); d.className = 'item'; d.appendChild(content(p[0]));
      d.onclick = () => { if (state.locked) return; if (state.links[i] !== undefined) { delete state.links[i]; } state.active = i; refresh(); };
      state.L[i] = d; L.appendChild(d); });
    rOrder.forEach(j => { const d = document.createElement('div'); d.className = 'item'; d.appendChild(content(Q.paires[j][1]));
      d.onclick = () => { if (state.locked || state.active === null) return;
        for (const k in state.links) if (state.links[k] === j) delete state.links[k];
        state.links[state.active] = j; state.active = null; refresh(); };
      state.R[j] = d; R.appendChild(d); });
    wrap.append(L, R, svg); z.appendChild(wrap);
    const hint = document.createElement('div'); hint.className = 'hint'; hint.textContent = 'Clique un élément à gauche, puis sa correspondance à droite. Re-clique à gauche pour changer.'; z.appendChild(hint);
    function refresh(){ state.L.forEach((d, i) => { d.classList.toggle('active', state.active === i); d.classList.toggle('linked', state.links[i] !== undefined); });
      Object.entries(state.R).forEach(([j, d]) => d.classList.toggle('linked', Object.values(state.links).includes(+j)));
      $('valider').disabled = Object.keys(state.links).length !== Q.paires.length; lines(); }
    state.refresh = refresh; setTimeout(lines, 50);
  },
  trous(Q, z){
    const p = document.createElement('div'); p.className = 'trous'; state = { inputs: [] };
    Q.texte.split(/(\{\{\d+\}\})/).forEach(part => { const m = part.match(/^\{\{(\d+)\}\}$/);
      if (m) { const i = document.createElement('input'); i.type = 'text'; i.dataset.k = m[1] - 1; i.oninput = () => $('valider').disabled = state.inputs.some(x => !x.value.trim()); state.inputs.push(i); p.appendChild(i); }
      else p.appendChild(document.createTextNode(part)); });
    z.appendChild(p);
  }
};

function lines(){
  if (!state || !state.svg) return; const s = state.svg, box = state.wrap.getBoundingClientRect();
  s.innerHTML = '<defs>' + [['b','#005DA8'],['g','#1E8E5A'],['r','#C0392B']].map(([k, c]) => `<marker id="ah-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="${c}"/></marker>`).join('') + '</defs>';
  for (const i in state.links){ const a = state.L[i].getBoundingClientRect(), b = state.R[state.links[i]].getBoundingClientRect();
    const l = document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('x1', a.right - box.left); l.setAttribute('y1', a.top + a.height/2 - box.top);
    l.setAttribute('x2', b.left - box.left - 2); l.setAttribute('y2', b.top + b.height/2 - box.top);
    l.setAttribute('stroke', state.colors[i] || '#005DA8'); l.setAttribute('stroke-width', 3); l.setAttribute('stroke-linecap','round'); const c = state.colors[i]; l.setAttribute('marker-end', `url(#ah-${c === '#1E8E5A' ? 'g' : c === '#C0392B' ? 'r' : 'b'})`); s.appendChild(l); }
}
window.addEventListener('resize', lines);

const CHECK = {
  qcm(Q){ const good = new Set([].concat(Q.bonne)); Object.entries(state.btns).forEach(([k, b]) => { b.disabled = true; if (good.has(+k)) b.classList.add('good'); else if (state.sel.has(+k)) b.classList.add('bad'); });
    return good.size === state.sel.size && [...good].every(k => state.sel.has(k)); },
  qcm_multi(Q){ return CHECK.qcm(Q); },
  vf(Q){ Object.entries(state.btns).forEach(([v, b]) => { b.disabled = true; if ((v === 'true') === Q.bonne) b.classList.add('good'); else if (state.sel === (v === 'true')) b.classList.add('bad'); });
    return state.sel === Q.bonne; },
  ordre(Q){ state.locked = true; state.draw(); state.rows.forEach((r, pos) => r.classList.add(state.cur[pos] === pos ? 'good' : 'bad'));
    return state.cur.every((k, pos) => k === pos); },
  relier(Q){ state.locked = true; let ok = true;
    for (const i in state.links){ const g = state.links[i] === +i; ok = ok && g; state.colors[i] = g ? '#1E8E5A' : '#C0392B'; state.L[i].classList.add(g ? 'good' : 'bad'); }
    lines(); return ok; },
  trous(Q){ let ok = true; state.inputs.forEach(i => { i.disabled = true; const acc = [].concat(Q.reponses[i.dataset.k]).map(norm); const g = acc.includes(norm(i.value)); ok = ok && g; i.classList.add(g ? 'good' : 'bad'); });
    return ok; }
};

function correction(Q){
  if (Q.type === 'ordre') return 'Bon ordre : ' + Q.items.map((x, i) => `${i + 1}. ${label(x)}`).join('  →  ');
  if (Q.type === 'relier') return 'Bonnes associations :\n' + Q.paires.map(p => `• ${label(p[0])} → ${label(p[1])}`).join('\n');
  if (Q.type === 'trous') return 'Réponses : ' + Q.reponses.map((r, i) => `(${i + 1}) ${[].concat(r)[0]}`).join(' · ');
  return '';
}

$('valider').onclick = () => {
  const Q = QUIZ.questions[idx]; const ok = CHECK[Q.type](Q);
  if (ok) bonnes++; else ratees.push('Q' + (idx + 1));
  details.push({ n: idx + 1, type: Q.type, question: enonce(Q), donnee: repDonnee(Q), attendue: repAttendue(Q), ok });
  $('verdict').textContent = ok ? '✔ Bonne réponse' : '✘ Réponse incorrecte'; $('verdict').style.color = ok ? 'var(--ok)' : 'var(--ko)';
  $('verdict').classList.remove('hidden');
  const txt = [ok ? '' : correction(Q), Q.expl || ''].filter(Boolean).join('\n\n');
  if (txt) { $('expl').textContent = txt; $('expl').classList.remove('hidden'); }
  $('valider').classList.add('hidden');
  $('next').textContent = idx === QUIZ.questions.length - 1 ? 'Voir mon résultat' : 'Question suivante';
  $('next').classList.remove('hidden');
};
/* Journal détaillé : une ligne par question dans l'onglet « Log quiz » */
const cut = (t, n = 500) => { t = String(t); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
function enonce(Q){ return cut(Q.type === 'trous' ? [Q.consigne, Q.texte].filter(Boolean).join(' — ') : Q.q); }
function repDonnee(Q){
  if (Q.type === 'qcm' || Q.type === 'qcm_multi') return [...state.sel].map(k => label(Q.options[k])).join(' + ');
  if (Q.type === 'vf') return state.sel ? 'Vrai' : 'Faux';
  if (Q.type === 'ordre') return state.cur.map(k => label(Q.items[k])).join(' > ');
  if (Q.type === 'relier') return Q.paires.map((p, i) => label(p[0]) + ' → ' + (state.links[i] !== undefined ? label(Q.paires[state.links[i]][1]) : '?')).join(' | ');
  if (Q.type === 'trous') return state.inputs.map(i => i.value.trim()).join(' | ');
  return '';
}
function repAttendue(Q){
  if (Q.type === 'qcm' || Q.type === 'qcm_multi') return [].concat(Q.bonne).map(k => label(Q.options[k])).join(' + ');
  if (Q.type === 'vf') return Q.bonne ? 'Vrai' : 'Faux';
  if (Q.type === 'ordre') return Q.items.map(label).join(' > ');
  if (Q.type === 'relier') return Q.paires.map(p => label(p[0]) + ' → ' + label(p[1])).join(' | ');
  if (Q.type === 'trous') return Q.reponses.map(r => [].concat(r)[0]).join(' | ');
  return '';
}
$('next').onclick = () => { idx++; idx < QUIZ.questions.length ? show() : finish(); };

function finish(){
  $('progress').style.width = '100%'; $('s-quiz').classList.add('hidden'); $('s-end').classList.remove('hidden');
  const total = QUIZ.questions.length, ok = bonnes / total >= QUIZ.seuil;
  $('score').textContent = `${bonnes} / ${total}`; $('badge').textContent = ok ? 'Validé' : 'À revoir'; $('badge').style.background = ok ? 'var(--ok)' : 'var(--ko)';
  payload = { prenom: $('prenom').value.trim(), quiz: QUIZ.id, famille: QUIZ.famille || '', version: QUIZ.version || 1, seuil: QUIZ.seuil, score: bonnes, total, resultat: ok ? 'Validé' : 'À revoir',
              dureeSec: Math.round((Date.now() - t0) / 1000), ratees: ratees.join(', '), details };
  send();
}
function send(){
  $('retry').classList.add('hidden'); $('status').textContent = 'Envoi du résultat…';
  fetch(WEB_APP, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(payload) })
    .then(() => { sent = true; $('status').textContent = '✔ Résultat envoyé à ton formateur. Tu peux fermer cette page.'; })
    .catch(() => { $('status').textContent = '⚠ Envoi impossible (connexion ?). Ne ferme pas la page et réessaie.'; $('retry').classList.remove('hidden'); });
}
</script>
</body>
</html>
```

### 6.2 Contrôle — `check_quiz.js`

```js
// Usage : node check_quiz.js quiz.html  → vérifie le bloc QUIZ et le moteur
const fs = require('fs'), vm = require('vm');
const html = fs.readFileSync(process.argv[2], 'utf8');
const WEB_APP = 'https://script.google.com/macros/s/AKfycbzjEnC3Fj-LCRh3yv-giNXhXr91mMJJhNYlCp5EVEQvmKhMqbF9ni-otdktVatnrpk5vg/exec';
const err = [];
const m = html.match(/const QUIZ = ([\s\S]*?);\s*\/\* =+ MOTEUR/);
if (!m) { console.log('✘ Bloc QUIZ introuvable'); process.exit(1); }
const Q = vm.runInNewContext('(' + m[1] + ')');
if (!html.includes(`const WEB_APP = '${WEB_APP}'`)) err.push('URL WEB_APP modifiée ou absente');
if (!html.includes('ratees.join(\', \'), details }')) err.push('moteur ancien : details (Log quiz) absent du payload');
if (!html.includes('famille: QUIZ.famille')) err.push('moteur ancien : famille/version/seuil absents du payload');
const FAMILLES = ['Amazon', 'FNAC&DARTY', 'Tiktokshop', 'Mirakl', 'Rakuten', 'Veepee', 'Cdiscount&Bébéboutik', 'Manomano', 'aosom', 'Fichier retour', 'Paiement par virement', 'SCALAPAY', 'BOL', 'Xcotton'];
if (!Q.id || Q.id === 'NOM DU QUIZ') err.push('QUIZ.id manquant');
if (Q.famille && !FAMILLES.includes(Q.famille)) err.push(`famille « ${Q.famille} » inconnue : utiliser un en-tête de la Matrice (${FAMILLES.join(', ')})`);
if (!Q.famille) console.log('ℹ famille vide : le quiz ne sera rattaché à aucune famille (à saisir dans « Catalogue quiz »)');
if (!Number.isInteger(Q.version) || Q.version < 1) err.push('QUIZ.version doit être un entier ≥ 1');
if (!(Q.seuil > 0 && Q.seuil <= 1)) err.push('seuil doit être entre 0 et 1');
if (!Q.questions || !Q.questions.length) err.push('aucune question');
const rng = (i, n) => Number.isInteger(i) && i >= 0 && i < n;
(Q.questions || []).forEach((q, k) => {
  const p = `Q${k + 1} (${q.type})`;
  switch (q.type) {
    case 'qcm': if (!q.q || !Array.isArray(q.options) || q.options.length < 2 || !rng(q.bonne, q.options.length)) err.push(`${p} : q, options (≥2) et bonne (index) requis`); break;
    case 'qcm_multi': if (!q.q || !Array.isArray(q.options) || !Array.isArray(q.bonne) || !q.bonne.length || !q.bonne.every(b => rng(b, q.options.length))) err.push(`${p} : bonne doit être un tableau d'index valides`); break;
    case 'vf': if (!q.q || typeof q.bonne !== 'boolean') err.push(`${p} : bonne doit être true ou false`); break;
    case 'ordre': if (!q.q || !Array.isArray(q.items) || q.items.length < 3) err.push(`${p} : items (≥3, dans le BON ordre) requis`); break;
    case 'relier': if (!q.q || !Array.isArray(q.paires) || q.paires.length < 3 || !q.paires.every(x => Array.isArray(x) && x.length === 2)) err.push(`${p} : paires [[gauche, droite], …] (≥3) requis`);
      else if (new Set(q.paires.map(x => JSON.stringify(x[1]))).size !== q.paires.length) err.push(`${p} : deux éléments de droite identiques → correction ambiguë`); break;
    case 'trous': { const n = (q.texte || '').match(/\{\{\d+\}\}/g) || [];
      if (!n.length || !Array.isArray(q.reponses) || n.length !== q.reponses.length) err.push(`${p} : ${n.length} trou(s) {{n}} pour ${(q.reponses || []).length} réponse(s)`); break; }
    default: err.push(`${p} : type inconnu`);
  }
  if (q.image && !/^data:image\//.test(q.image)) err.push(`${p} : image non intégrée en base64 (le fichier ne serait pas autonome)`);
});
const kb = Math.round(Buffer.byteLength(html) / 1024);
if (err.length) { console.log('✘ ' + err.length + ' problème(s) :\n- ' + err.join('\n- ')); process.exit(1); }
const types = {}; Q.questions.forEach(q => types[q.type] = (types[q.type] || 0) + 1);
console.log(`✔ « ${Q.id} » (${Q.famille || 'sans famille'}, v${Q.version}) — ${Q.questions.length} questions ${JSON.stringify(types)} — seuil ${Q.seuil * 100} % — ${kb} Ko`);
```

### 6.3 Images — `embed_image.py`

```python
# Usage : python3 embed_image.py image.png [largeur_max=1100] → imprime une data URI prête à coller dans "image"/"img"
import sys, io, base64
from PIL import Image
src = sys.argv[1]; wmax = int(sys.argv[2]) if len(sys.argv) > 2 else 1100
im = Image.open(src); im.load()
if im.width > wmax: im = im.resize((wmax, round(im.height * wmax / im.width)), Image.LANCZOS)
buf = io.BytesIO()
if im.mode in ('RGBA', 'LA', 'P'):   # transparence / captures nettes → PNG
    im.save(buf, 'PNG', optimize=True); mime = 'png'
else:
    im.convert('RGB').save(buf, 'JPEG', quality=82, optimize=True); mime = 'jpeg'
print(f'data:image/{mime};base64,' + base64.b64encode(buf.getvalue()).decode())
```

## 7. Faire évoluer

- **Changer le style** : modifie librement le bloc `<style>` (couleurs, mise en page, animations, logo en base64 dans le header). Garde les `id` utilisés par le moteur : `title`, `subtitle`, `progress`, `s-name`, `prenom`, `agents`, `start`, `s-quiz`, `qnum`, `qtype`, `qtxt`, `qimg`, `zone`, `verdict`, `expl`, `valider`, `next`, `s-end`, `score`, `badge`, `status`, `retry`. Charte AOSOM par défaut : navy #0B2440, bleu #005DA8, orange #F5A623, Nunito Sans.
- **Ajouter un type de question** : ajoute une entrée dans `LABELS`, `RENDER` (affichage, active `#valider` quand la réponse est complète), `CHECK` (retourne `true`/`false` et colore bonnes/mauvaises réponses), `correction()` si utile, `repDonnee()` / `repAttendue()` (texte du Log quiz), et une règle dans `check_quiz.js`. Le scoring et l'envoi restent inchangés. Mets à jour cette compétence avec le nouveau type.
- **Nouvelle URL `/exec`** (nouveau déploiement dans un autre projet Apps Script) : remplace `WEB_APP` dans le moteur et dans `check_quiz.js`. Un simple « Nouvelle version » du même déploiement garde la même URL.

## 8. Côté Google Sheets (déjà en place)

Un **seul** script `Code.gs`, lié au Sheet « 📊 AOSOM FR - Suivi Formation » et déployé en Application Web (Exécuter en tant que : moi, Accès : tout le monde), reçoit **tous** les quiz. On ne le remplace jamais pour un nouveau quiz. Code de référence : `suivi-formation-aosom/Code.gs` (dépôt Johary-hub).

À chaque passage il :
- ajoute une ligne dans « SUIVI QUIZ » (gid `1060293098`) : Horodatage, Matricule, Prénom, Quiz, Score, Total, Pourcentage, Résultat, Durée (min), Questions ratées, Contrôle prénom, Famille, Version ;
- ajoute une ligne par question dans « QUESTION QUIZ » (ex « Log quiz ») : Horodatage, Matricule, Prénom, Quiz, Ligne suivi, N°, Type, Question, Réponse donnée, Bonne réponse, Résultat ;
- recalcule « Catalogue quiz » (un quiz par ligne ; colonnes manuelles Lien HTML / Commentaire / Archivé conservées), « Bilan quiz » (agents × quiz : ✅ validé, 🟠 à revoir, 🔴 à passer si l'agent est formé sur la famille) et « Stats questions » (taux de réussite par question, les plus ratées en haut) ;
- optionnel (`CONFIG.MAJ_MATRICE = true`) : passe la case Agent × Famille de la « Matrice » à « ✅ Formé » quand le quiz est validé.

Il ajoute les en-têtes manquants sans toucher aux existants et pose un verrou contre les collisions. Toute modification de `Code.gs` exige Déployer → Gérer les déploiements → ✏️ Modifier → **Nouvelle version** (jamais « Nouveau déploiement », qui changerait l'URL).
