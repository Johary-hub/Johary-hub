// Test de bout en bout : plusieurs profils Chromium, un relais Nostr local,
// le fichier unique ouvert en file://. Nécessite Playwright (non installé par
// `npm ci` ; voir README). Durée : environ 1 min 30.
const {execFileSync} = require('node:child_process')
const {mkdtempSync, rmSync} = require('node:fs')
const {tmpdir} = require('node:os')
const {join} = require('node:path')
const {pathToFileURL} = require('node:url')
const {chromium} = require('playwright')
const {demarrerRelais} = require('./relais-local.cjs')

const racine = join(__dirname, '..')
const PHRASE = 'girafe-bleue-42-parapluie'
const AUTRE_PHRASE = 'une-phrase-totalement-differente'
const XSS = '<img src=x onerror=alert(1)>'

let echecs = 0
const verifier = (condition, libelle) => {
  console.log(`${condition ? 'ok  ' : 'ÉCHEC'}  ${libelle}`)
  if (!condition) echecs++
}

const etat = page => page.locator('#etat').innerText()
const attendreEtat = (page, texte, timeout = 30000) =>
  page.waitForFunction(
    t => document.getElementById('etat').textContent === t,
    texte,
    {timeout}
  )
const bulles = page => page.locator('.bulle').count()

;(async () => {
  const relais = await demarrerRelais(0)
  const dossier = mkdtempSync(join(tmpdir(), 'chat-ephemere-'))
  const fichier = join(dossier, 'index.html')

  execFileSync(process.execPath, [join(racine, 'build.mjs')], {
    env: {...process.env, RELAIS_TEST: relais.url, SORTIE: fichier},
    stdio: 'ignore'
  })

  const navigateur = await chromium.launch()
  const console_ = []
  let dialogues = 0

  const ouvrir = async () => {
    const contexte = await navigateur.newContext()
    const page = await contexte.newPage()
    page.on('console', m => console_.push(`${m.type()}: ${m.text()}`))
    page.on('pageerror', e => console_.push(`pageerror: ${e.message}`))
    page.on('dialog', d => {
      dialogues++
      d.dismiss()
    })
    await page.goto(pathToFileURL(fichier).href)
    return page
  }

  const rejoindre = async (page, pseudo, phrase) => {
    await page.fill('#champ-pseudo', pseudo)
    await page.fill('#champ-phrase', phrase)
    await page.click('#bouton-rejoindre')
  }

  try {
    // ---- Phase 2 : connexion à deux
    const a = await ouvrir()
    const b = await ouvrir()
    const d = await ouvrir()

    await rejoindre(a, 'Alice', 'trop-court')
    verifier(
      await a.locator('#ecran-chat').isHidden(),
      'phrase de moins de 12 caractères refusée'
    )

    await rejoindre(a, 'Alice', PHRASE)
    verifier(
      await a.locator('#champ-message').isDisabled(),
      'saisie désactivée tant que personne n’est connecté'
    )
    await rejoindre(d, 'Dan', AUTRE_PHRASE)
    await rejoindre(b, 'Bob', PHRASE)

    await attendreEtat(a, 'Connecté à Bob')
    await attendreEtat(b, 'Connecté à Alice')
    verifier(true, 'même phrase : « Connecté à {pseudo} » des deux côtés')
    verifier(
      (await etat(d)) === "En attente de l'autre personne…",
      'phrase différente : les salons ne se voient pas'
    )

    // ---- Phases 3 et 5 : message éphémère, affiché comme du texte
    await a.fill('#champ-message', XSS)
    await a.press('#champ-message', 'Enter')
    const debut = Date.now()
    await b.waitForSelector('.bulle.autre')

    verifier(
      (await a.locator('.bulle.moi .texte').innerText()) === XSS &&
        (await b.locator('.bulle.autre .texte').innerText()) === XSS,
      'message visible des deux côtés, balises affichées comme du texte'
    )
    verifier(
      (await b.locator('.bulle img').count()) === 0 && dialogues === 0,
      'aucune balise interprétée, aucune alerte'
    )

    await b.fill('#champ-message', 'ligne 1')
    await b.press('#champ-message', 'Shift+Enter')
    await b.type('#champ-message', 'ligne 2')
    await b.press('#champ-message', 'Enter')
    await a.waitForSelector('.bulle.autre')
    verifier(
      (await a.locator('.bulle.autre .texte').innerText()) === 'ligne 1\nligne 2',
      'Maj+Entrée insère un retour à la ligne, Entrée envoie'
    )

    // ---- Phase 4 : troisième personne
    const c = await ouvrir()
    await rejoindre(c, 'Chloé', PHRASE)
    await attendreEtat(c, 'Salon complet')
    await a.fill('#champ-message', 'réservé à Bob')
    await a.press('#champ-message', 'Enter')
    await b.waitForFunction(
      () => document.body.innerText.includes('réservé à Bob')
    )
    await c.waitForTimeout(1500)
    verifier(
      (await bulles(c)) === 0 &&
        !(await c.content()).includes('réservé à Bob') &&
        (await c.locator('#champ-message').isDisabled()),
      'troisième onglet : « Salon complet », aucun message reçu'
    )
    verifier(
      (await etat(a)) === 'Connecté à Bob' && (await etat(b)) === 'Connecté à Alice',
      'les deux premiers restent connectés'
    )

    // ---- Phase 3 : disparition à 30 s
    await a.waitForFunction(
      x => !document.documentElement.innerHTML.includes(x),
      XSS.slice(1, 12),
      {timeout: 40000, polling: 100}
    )
    const ecoule = Date.now() - debut
    await b.waitForFunction(
      x => !document.documentElement.innerHTML.includes(x),
      XSS.slice(1, 12),
      {timeout: 5000, polling: 100}
    )
    verifier(
      Math.abs(ecoule - 30000) <= 1000,
      `disparition des deux côtés à 30 s ± 1 s (mesuré : ${(ecoule / 1000).toFixed(1)} s)`
    )
    verifier((await bulles(a)) >= 1, 'les messages plus récents restent affichés')

    // ---- Phase 5 : aucune persistance
    const stockage = await a.evaluate(async () => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookies: document.cookie,
      bases: indexedDB.databases ? (await indexedDB.databases()).length : 0,
      caches: 'caches' in self ? (await caches.keys().catch(() => [])).length : 0,
      sw: navigator.serviceWorker
        ? (await navigator.serviceWorker.getRegistrations().catch(() => [])).length
        : 0
    }))
    verifier(
      Object.values(stockage).every(v => v === 0 || v === ''),
      `aucun stockage utilisé (${JSON.stringify(stockage)})`
    )

    // ---- Phase 4 : rechargement
    await b.reload()
    await attendreEtat(a, 'Connexion perdue')
    verifier(
      (await bulles(a)) === 0 && (await a.locator('#champ-message').isDisabled()),
      'rechargement de B : écran de A vidé, saisie désactivée'
    )
    verifier(
      (await b.locator('#ecran-entree').isVisible()) &&
        (await b.inputValue('#champ-pseudo')) === '' &&
        (await b.inputValue('#champ-phrase')) === '',
      'rechargement de B : retour à l’écran d’entrée, champs vides'
    )

    await rejoindre(b, 'Bob2', PHRASE)
    await attendreEtat(a, 'Connecté à Bob2')
    await attendreEtat(b, 'Connecté à Alice')
    verifier(true, 'B peut rejoindre à nouveau')

    // ---- Onglet masqué : purge au retour
    await a.fill('#champ-message', 'à purger')
    await a.press('#champ-message', 'Enter')
    await b.waitForSelector('.bulle.autre')
    await b.evaluate(() => {
      const reel = Date.now
      Date.now = () => reel() + 31000
      document.dispatchEvent(new Event('visibilitychange'))
      Date.now = reel
    })
    verifier((await bulles(b)) === 0, 'retour au premier plan : messages échus retirés')

    // ---- Quitter
    await a.click('#bouton-quitter')
    verifier(
      (await a.locator('#ecran-entree').isVisible()) && (await bulles(a)) === 0,
      'Quitter : retour à l’écran d’entrée, tout est vidé'
    )
    await attendreEtat(b, 'Connexion perdue')
    verifier((await bulles(b)) === 0, 'Quitter : l’autre passe en « Connexion perdue »')

    // ---- Confidentialité de la signalisation et console
    const transit = relais.journal.join('\n')
    verifier(
      relais.journal.length > 0 &&
        ![PHRASE, 'Alice', 'Bob', 'réservé', 'onerror', 'candidate:', 'v=0'].some(
          s => transit.includes(s)
        ),
      'relais : ni phrase, ni pseudo, ni message, ni SDP en clair'
    )
    verifier(
      console_.length === 0,
      `console vide, aucun avertissement CSP${console_.length ? ' → ' + console_.join(' | ') : ''}`
    )
  } catch (err) {
    echecs++
    console.log('ÉCHEC  ' + err.message.split('\n')[0])
    if (console_.length) console.log(console_.join('\n'))
  } finally {
    await navigateur.close()
    await relais.fermer()
    rmSync(dossier, {recursive: true, force: true})
  }

  console.log(echecs ? `\n${echecs} échec(s)` : '\nTout est bon.')
  process.exit(echecs ? 1 : 0)
})()
