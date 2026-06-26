/* =====================================================================
   AOSOM FR — Suivi Formation
   App web statique : lit le fichier .xlsx (SheetJS) et reconstruit en
   direct le tableau de bord, la matrice de compétences et le suivi
   détaillé filtrable. Le tableur reste l'unique source de vérité.
   ===================================================================== */

'use strict';

const DATA_URL = 'data/suivi-formation.xlsx';

/* État global */
const state = {
  rows: [],          // lignes normalisées du suivi détaillé
  agents: [],        // agents distincts (ordre d'apparition)
  marketplaces: [],  // marketplaces distinctes
  formateurs: [],    // formateurs distincts
  charts: {},        // instances Chart.js
  sort: { col: null, dir: 1 },
};

/* ---------- Utilitaires ---------- */

// Normalise une chaîne : minuscules, sans accents, sans caractères spéciaux
function norm(s) {
  return (s == null ? '' : String(s))
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Retourne une feuille dont le nom contient le mot-clé (emojis/accents ignorés)
function findSheet(wb, keyword) {
  const k = norm(keyword);
  const name = wb.SheetNames.find((n) => norm(n).includes(k));
  return name ? wb.Sheets[name] : null;
}

// Catégorise un statut textuel (avec emoji) en clé stable
function classifyStatut(raw) {
  const s = norm(raw);
  if (!s) return { key: 'inconnu', label: '—', cls: 'na', icon: '·' };
  if (s.includes('nonform')) return { key: 'non_forme', label: 'Non formé', cls: 'no', icon: '🔴' };
  if (s.includes('encours')) return { key: 'en_cours', label: 'En cours', cls: 'prog', icon: '🟡' };
  if (s.includes('form'))     return { key: 'forme', label: 'Formé', cls: 'ok', icon: '✅' };
  return { key: 'autre', label: String(raw).trim(), cls: 'na', icon: '·' };
}

// Formate une valeur de date (Date JS, n° de série Excel, ou texte) en JJ/MM/AAAA
function fmtDate(v) {
  if (v == null || v === '') return '';
  if (v instanceof Date && !isNaN(v)) {
    const d = String(v.getDate()).padStart(2, '0');
    const m = String(v.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${v.getFullYear()}`;
  }
  if (typeof v === 'number' && XLSX.SSF) {
    const o = XLSX.SSF.parse_date_code(v);
    if (o) return `${String(o.d).padStart(2, '0')}/${String(o.m).padStart(2, '0')}/${o.y}`;
  }
  return String(v).trim();
}

// Distincts en conservant l'ordre d'apparition
function distinct(arr) {
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    if (v != null && v !== '' && !seen.has(v)) { seen.add(v); out.push(v); }
  }
  return out;
}

/* ---------- Chargement / parsing ---------- */

function parseWorkbook(wb) {
  const ws = findSheet(wb, 'SUIVI') || wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error('Feuille de suivi introuvable.');

  // Tableau de tableaux ; ligne 1 = entêtes
  const matrix = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, cellDates: true, defval: null });
  if (!matrix.length) throw new Error('Feuille de suivi vide.');

  const headers = matrix[0].map((h) => norm(h));
  const col = (kw) => headers.findIndex((h) => h.includes(norm(kw)));
  const idx = {
    agent: col('agent'),
    marketplace: col('marketplace'),
    statut: col('statut'),
    debut: col('debut'),
    fin: col('fin'),
    formateur: col('formateur'),
    duree: col('duree'),
    evaluation: col('evaluation'),
    commentaire: col('commentaire'),
    maj: headers.findIndex((h) => h.includes('maj') || h.includes('miseajour')),
  };
  if (idx.agent < 0 || idx.marketplace < 0) {
    throw new Error('Colonnes « Agent » / « Marketplace » introuvables dans la feuille de suivi.');
  }

  const get = (row, i) => (i >= 0 && i < row.length ? row[i] : null);
  const rows = [];
  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r];
    if (!row) continue;
    const agent = get(row, idx.agent);
    if (agent == null || String(agent).trim() === '') continue; // lignes vides ignorées
    const statut = classifyStatut(get(row, idx.statut));
    rows.push({
      agent: String(agent).trim(),
      marketplace: String(get(row, idx.marketplace) ?? '').trim(),
      statut,
      dateDebut: fmtDate(get(row, idx.debut)),
      dateFin: fmtDate(get(row, idx.fin)),
      formateur: get(row, idx.formateur) ? String(get(row, idx.formateur)).trim() : '',
      duree: get(row, idx.duree) != null ? get(row, idx.duree) : '',
      evaluation: get(row, idx.evaluation) ? String(get(row, idx.evaluation)).trim() : '',
      commentaire: get(row, idx.commentaire) ? String(get(row, idx.commentaire)).trim() : '',
      maj: fmtDate(get(row, idx.maj)),
    });
  }

  state.rows = rows;
  state.agents = distinct(rows.map((r) => r.agent));
  state.marketplaces = distinct(rows.map((r) => r.marketplace)).sort((a, b) => a.localeCompare(b, 'fr'));
  state.formateurs = distinct(rows.map((r) => r.formateur)).sort((a, b) => a.localeCompare(b, 'fr'));
}

async function loadFromUrl(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array', cellDates: true });
  parseWorkbook(wb);
  return url.split('/').pop();
}

function loadFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array', cellDates: true });
        parseWorkbook(wb);
        resolve(file.name);
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    reader.readAsArrayBuffer(file);
  });
}

/* ---------- Agrégations ---------- */

function computeStats() {
  const rows = state.rows;
  const by = { forme: 0, en_cours: 0, non_forme: 0, autre: 0, inconnu: 0 };
  for (const r of rows) by[r.statut.key] = (by[r.statut.key] || 0) + 1;
  const evaluable = by.forme + by.en_cours + by.non_forme;
  const taux = evaluable ? Math.round((by.forme / evaluable) * 1000) / 10 : 0;
  return {
    total: rows.length,
    agents: state.agents.length,
    marketplaces: state.marketplaces.length,
    formateurs: state.formateurs.length,
    forme: by.forme, en_cours: by.en_cours, non_forme: by.non_forme,
    taux,
  };
}

// Matrice agent × marketplace : statut le plus récent par couple
function computeMatrix() {
  const map = {}; // agent -> marketplace -> statut
  for (const r of state.rows) {
    (map[r.agent] = map[r.agent] || {})[r.marketplace] = r.statut;
  }
  const agents = state.agents.slice().sort((a, b) => a.localeCompare(b, 'fr'));
  const rows = agents.map((agent) => {
    const cells = state.marketplaces.map((mk) => map[agent]?.[mk] || null);
    const formed = cells.filter((c) => c && c.key === 'forme').length;
    const pct = Math.round((formed / state.marketplaces.length) * 100);
    return { agent, cells, pct };
  });
  return { agents, rows };
}

// Couverture par marketplace (pour le graphique et les besoins)
function computeByMarketplace() {
  const m = {};
  for (const mk of state.marketplaces) m[mk] = { forme: 0, en_cours: 0, non_forme: 0 };
  for (const r of state.rows) {
    if (!m[r.marketplace]) m[r.marketplace] = { forme: 0, en_cours: 0, non_forme: 0 };
    if (m[r.marketplace][r.statut.key] != null) m[r.marketplace][r.statut.key]++;
  }
  return state.marketplaces.map((mk) => ({ marketplace: mk, ...m[mk] }));
}

/* ---------- Rendu : Dashboard ---------- */

function renderDashboard() {
  const s = computeStats();

  document.getElementById('kpi-cards').innerHTML = [
    kpi('Agents suivis', s.agents, 'profils distincts', ''),
    kpi('Marketplaces', s.marketplaces, 'canaux couverts', ''),
    kpi('Formations', s.total, 'enregistrements', ''),
    kpi('Taux de formation', s.taux + ' %', `${s.forme}/${s.forme + s.en_cours + s.non_forme} validées`, 'ok'),
  ].join('');

  document.getElementById('status-strip').innerHTML = [
    `<span class="chip chip--ok">✅ ${s.forme} formé(s)</span>`,
    `<span class="chip chip--prog">🟡 ${s.en_cours} en cours</span>`,
    `<span class="chip chip--no">🔴 ${s.non_forme} non formé(s)</span>`,
  ].join('');

  renderStatusChart(s);
  renderMarketplaceChart();
  renderGaps();
}

function kpi(label, value, hint, cls) {
  return `<div class="kpi ${cls ? 'kpi--' + cls : ''}">
    <div class="kpi__label">${label}</div>
    <div class="kpi__value">${value}</div>
    <div class="kpi__hint">${hint}</div>
  </div>`;
}

function renderStatusChart(s) {
  const ctx = document.getElementById('chart-status');
  state.charts.status?.destroy();
  state.charts.status = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Formé', 'En cours', 'Non formé'],
      datasets: [{
        data: [s.forme, s.en_cours, s.non_forme],
        backgroundColor: ['#16a34a', '#d97706', '#dc2626'],
        borderWidth: 2, borderColor: '#fff',
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      cutout: '62%',
    },
  });
}

function renderMarketplaceChart() {
  const data = computeByMarketplace();
  const ctx = document.getElementById('chart-marketplace');
  state.charts.marketplace?.destroy();
  state.charts.marketplace = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map((d) => d.marketplace),
      datasets: [
        { label: 'Formé', data: data.map((d) => d.forme), backgroundColor: '#16a34a' },
        { label: 'En cours', data: data.map((d) => d.en_cours), backgroundColor: '#d97706' },
        { label: 'Non formé', data: data.map((d) => d.non_forme), backgroundColor: '#dc2626' },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true, ticks: { precision: 0 } }, y: { stacked: true } },
      plugins: { legend: { position: 'bottom' } },
    },
  });
}

function renderGaps() {
  const data = computeByMarketplace()
    .map((d) => ({ ...d, total: d.forme + d.en_cours + d.non_forme, manque: d.non_forme + d.en_cours }))
    .filter((d) => d.manque > 0)
    .sort((a, b) => b.manque - a.manque)
    .slice(0, 8);

  const el = document.getElementById('gaps');
  if (!data.length) { el.innerHTML = '<p class="muted">🎉 Aucun manque : tous les agents suivis sont formés.</p>'; return; }
  el.innerHTML = data.map((d) => {
    const ratio = d.total ? Math.round((d.manque / d.total) * 100) : 0;
    return `<div class="gap-item">
      <div class="gap-item__name">${d.marketplace}</div>
      <div class="gap-item__bar"><div class="gap-item__fill" style="width:${ratio}%"></div></div>
      <div class="gap-item__meta">${d.manque} à former / ${d.total} agents</div>
    </div>`;
  }).join('');
}

/* ---------- Rendu : Matrice ---------- */

function renderMatrice() {
  const { rows } = computeMatrix();
  const table = document.getElementById('matrice-table');
  const head = `<thead><tr><th>Agent</th>${
    state.marketplaces.map((mk) => `<th title="${mk}">${mk}</th>`).join('')
  }<th>% Complétude</th></tr></thead>`;

  const body = rows.map((r) => {
    const cells = r.cells.map((c) => {
      if (!c) return `<td class="cell cell--na" title="Non assigné">·</td>`;
      return `<td class="cell cell--${c.cls}" title="${c.label}">${c.icon}</td>`;
    }).join('');
    const pctCls = r.pct >= 80 ? 'hi' : r.pct >= 50 ? 'mid' : 'lo';
    return `<tr><td>${r.agent}</td>${cells}<td class="pct pct--${pctCls}">${r.pct}%</td></tr>`;
  }).join('');

  table.innerHTML = head + `<tbody>${body}</tbody>`;
}

/* ---------- Rendu : Détail ---------- */

const DETAIL_COLS = [
  { key: 'agent', label: 'Agent' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'statut', label: 'Statut' },
  { key: 'dateDebut', label: 'Début' },
  { key: 'dateFin', label: 'Fin' },
  { key: 'formateur', label: 'Formateur' },
  { key: 'duree', label: 'Durée (h)' },
  { key: 'evaluation', label: 'Évaluation' },
  { key: 'commentaire', label: 'Commentaires' },
];

function fillSelect(id, values, allLabel) {
  const sel = document.getElementById(id);
  const current = sel.value;
  sel.innerHTML = `<option value="">${allLabel}</option>` +
    values.map((v) => `<option value="${String(v).replace(/"/g, '&quot;')}">${v}</option>`).join('');
  sel.value = current;
}

function initFilters() {
  fillSelect('f-agent', state.agents.slice().sort((a, b) => a.localeCompare(b, 'fr')), 'Tous les agents');
  fillSelect('f-marketplace', state.marketplaces, 'Toutes les marketplaces');
  fillSelect('f-statut', ['Formé', 'En cours', 'Non formé'], 'Tous les statuts');
  fillSelect('f-formateur', state.formateurs, 'Tous les formateurs');
}

function currentFilter() {
  return {
    search: norm(document.getElementById('f-search').value),
    agent: document.getElementById('f-agent').value,
    marketplace: document.getElementById('f-marketplace').value,
    statut: norm(document.getElementById('f-statut').value),
    formateur: document.getElementById('f-formateur').value,
  };
}

function filteredRows() {
  const f = currentFilter();
  return state.rows.filter((r) => {
    if (f.agent && r.agent !== f.agent) return false;
    if (f.marketplace && r.marketplace !== f.marketplace) return false;
    if (f.formateur && r.formateur !== f.formateur) return false;
    if (f.statut && norm(r.statut.label) !== f.statut) return false;
    if (f.search) {
      const hay = norm(r.agent + ' ' + r.marketplace + ' ' + r.formateur + ' ' + r.evaluation + ' ' + r.commentaire);
      if (!hay.includes(f.search)) return false;
    }
    return true;
  });
}

function renderDetail() {
  let rows = filteredRows();

  if (state.sort.col) {
    const c = state.sort.col, dir = state.sort.dir;
    rows = rows.slice().sort((a, b) => {
      const va = c === 'statut' ? a.statut.label : a[c];
      const vb = c === 'statut' ? b.statut.label : b[c];
      if (va === vb) return 0;
      if (va === '' || va == null) return 1;
      if (vb === '' || vb == null) return -1;
      return (va > vb ? 1 : -1) * dir;
    });
  }

  const table = document.getElementById('detail-table');
  const head = '<thead><tr>' + DETAIL_COLS.map((c) => {
    const arrow = state.sort.col === c.key ? (state.sort.dir === 1 ? ' ▲' : ' ▼') : '';
    return `<th data-col="${c.key}">${c.label}${arrow}</th>`;
  }).join('') + '</tr></thead>';

  const body = rows.map((r) => `<tr>
    <td>${esc(r.agent)}</td>
    <td>${esc(r.marketplace)}</td>
    <td><span class="pill pill--${r.statut.cls}">${r.statut.icon} ${r.statut.label}</span></td>
    <td>${esc(r.dateDebut)}</td>
    <td>${esc(r.dateFin)}</td>
    <td>${esc(r.formateur)}</td>
    <td>${esc(r.duree)}</td>
    <td>${esc(r.evaluation)}</td>
    <td>${esc(r.commentaire)}</td>
  </tr>`).join('');

  table.innerHTML = head + `<tbody>${body}</tbody>`;
  document.getElementById('detail-count').textContent = rows.length;

  table.querySelectorAll('th').forEach((th) => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (state.sort.col === col) state.sort.dir *= -1;
      else { state.sort.col = col; state.sort.dir = 1; }
      renderDetail();
    });
  });
}

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function exportCsv() {
  const rows = filteredRows();
  const header = DETAIL_COLS.map((c) => c.label);
  const lines = [header].concat(rows.map((r) => [
    r.agent, r.marketplace, r.statut.label, r.dateDebut, r.dateFin,
    r.formateur, r.duree, r.evaluation, r.commentaire,
  ]));
  const csv = lines.map((line) => line.map((cell) => {
    const s = String(cell == null ? '' : cell);
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(';')).join('\r\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'suivi-formation-export.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---------- Orchestration ---------- */

function renderAll(sourceLabel) {
  document.getElementById('source-info').textContent =
    `${sourceLabel} · ${state.rows.length} formations`;
  document.getElementById('error').classList.add('hidden');
  document.getElementById('dropzone').classList.add('hidden');
  initFilters();
  renderDashboard();
  renderMatrice();
  renderDetail();
}

function showError(msg, withDropzone) {
  const el = document.getElementById('error');
  el.textContent = '⚠️ ' + msg;
  el.classList.remove('hidden');
  if (withDropzone) document.getElementById('dropzone').classList.remove('hidden');
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('tab--active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.add('hidden'));
      tab.classList.add('tab--active');
      document.getElementById('tab-' + tab.dataset.tab).classList.remove('hidden');
    });
  });
}

function setupInputs() {
  document.getElementById('file-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { renderAll(await loadFromFile(file)); }
    catch (err) { showError('Fichier illisible : ' + err.message, false); }
  });

  ['f-search', 'f-agent', 'f-marketplace', 'f-statut', 'f-formateur'].forEach((id) => {
    const evt = id === 'f-search' ? 'input' : 'change';
    document.getElementById(id).addEventListener(evt, renderDetail);
  });
  document.getElementById('f-reset').addEventListener('click', () => {
    ['f-search', 'f-agent', 'f-marketplace', 'f-statut', 'f-formateur'].forEach((id) => {
      document.getElementById(id).value = '';
    });
    state.sort = { col: null, dir: 1 };
    renderDetail();
  });
  document.getElementById('export-csv').addEventListener('click', exportCsv);

  // Glisser-déposer
  const dz = document.getElementById('dropzone');
  ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => {
    e.preventDefault(); dz.classList.add('dropzone--over');
  }));
  ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => {
    e.preventDefault(); dz.classList.remove('dropzone--over');
  }));
  dz.addEventListener('drop', async (e) => {
    const file = e.dataTransfer.files[0];
    if (!file) return;
    try { renderAll(await loadFromFile(file)); }
    catch (err) { showError('Fichier illisible : ' + err.message, true); }
  });
}

async function init() {
  setupTabs();
  setupInputs();
  try {
    const label = await loadFromUrl(DATA_URL);
    renderAll(label);
  } catch (err) {
    showError(
      "Impossible de charger automatiquement le fichier (" + err.message +
      "). Si vous avez ouvert la page en double-clic (file://), lancez plutôt un petit serveur local " +
      "ou chargez le fichier manuellement ci-dessous.",
      true,
    );
  }
}

document.addEventListener('DOMContentLoaded', init);
