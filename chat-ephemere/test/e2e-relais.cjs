// Test de bout en bout du mode « relais Google » : le vrai Code.gs tourne dans
// un simulateur local, trois profils Chromium ouvrent le fichier en file://.
const {execFileSync} = require('node:child_process')
const {mkdtempSync, rmSync} = require('node:fs')
const {tmpdir} = require('node:os')
const {join} = require('node:path')
const {pathToFileURL} = require('node:url')
const {chromium} = require('playwright')
const {demarrerRelaisGas} = require('./relais-gas-local.cjs')

const racine = join(__dirname, '..')
const PHRASE = 'girafe-bleue-42-parapluie'
const XSS = '<img src=x onerror=alert(1)>'

let echecs = 0
const verifier = (condition, libelle) => {
  console.log(`${condition ? 'ok  ' : 'ÉCHEC'}  ${libelle}`)
  if (!condition) echecs++
}

const attendreEtat = (page, texte, timeout = 40000) =>
  page.waitForFunction(t => document.getElementById('etat').textContent === t, texte, {timeout})
const etat = page => page.locator('#etat').innerText()
const bulles = page => page.locator('.bulle').count()

;(async () => {
  const relais = await demarrerRelaisGas()

  // ---- Le script seul : validation et limite à deux
  const id = n => `0000000${n}-0000-4000-8000-000000000000`
  const salon = 'ab'.repeat(16)
  verifier(relais.appeler({salon: 'x', moi: id(1)}).erreur === 'requete', 'script : requête invalide refusée')
  relais.appeler({salon, moi: id(1)})
  relais.appeler({salon, moi: id(2)})
  verifier(relais.appeler({salon, moi: id(3)}).complet === true, 'script : troisième client refusé')
  relais.appeler({salon, moi: id(1), envois: [{pour: id(2), c: 'QUJD'}, {pour: id(3), c: 'QUJD'}]})
  verifier(relais.feuilles.messages.length === 1, 'script : message pour un destinataire absent ignoré')
  const remis = relais.appeler({salon, moi: id(2)})
  verifier(
    remis.messages.length === 1 && remis.messages[0].c === 'QUJD' && relais.feuilles.messages.length === 0,
    'script : message remis une fois puis supprimé de la feuille'
  )
  relais.appeler({salon, moi: id(1), envois: [{pour: id(2), c: 'QUJD'}]})
  relais.avancer(31000)
  relais.nettoyer()
  relais.retablirHorloge()
  verifier(
    relais.feuilles.messages.length === 0 && relais.feuilles.presence.length === 0,
    'script : nettoyage — message non remis supprimé après 30 s, présences expirées'
  )

  // ---- L'application
  const dossier = mkdtempSync(join(tmpdir(), 'you-and-me-'))
  const fichier = join(dossier, 'index.html')
  execFileSync(process.execPath, [join(racine, 'build.mjs')], {
    env: {...process.env, RELAIS_GAS_TEST: relais.url, RELAIS_GOOGLE: relais.url, SORTIE: fichier},
    stdio: 'ignore'
  })

  const navigateur = await chromium.launch()
  const console_ = []
  let dialogues = 0

  const ouvrir = async () => {
    const page = await (await navigateur.newContext()).newPage()
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
    const a = await ouvrir()
    const b = await ouvrir()
    const d = await ouvrir()

    verifier((await a.inputValue('#champ-relais')) === relais.url, "adresse du relais préremplie depuis le fichier")

    await rejoindre(a, 'Alice', PHRASE)
    await rejoindre(d, 'Dan', 'une-phrase-totalement-differente')
    await rejoindre(b, 'Bob', PHRASE)
    await attendreEtat(a, 'Connecté à Bob')
    await attendreEtat(b, 'Connecté à Alice')
    verifier(true, 'même phrase : « Connecté à {pseudo} » des deux côtés via le relais')
    verifier((await etat(d)) === "En attente de l'autre personne…", 'phrase différente : salons isolés')

    await a.fill('#champ-message', XSS)
    await a.press('#champ-message', 'Enter')
    await b.waitForSelector('.bulle.autre')
    const recu = Date.now()
    verifier(
      (await b.locator('.bulle.autre .texte').innerText()) === XSS &&
        (await b.locator('.bulle img').count()) === 0 &&
        dialogues === 0,
      'message reçu et affiché comme du texte'
    )
    await b.waitForTimeout(500)
    verifier(relais.feuilles.messages.length === 0, 'feuille « messages » vide dès la remise')

    await b.fill('#champ-message', 'réponse de Bob')
    await b.press('#champ-message', 'Enter')
    await a.waitForFunction(() => document.body.innerText.includes('réponse de Bob'))
    verifier(true, 'réponse reçue dans l’autre sens')

    // Troisième personne
    const c = await ouvrir()
    await rejoindre(c, 'Chloé', PHRASE)
    await a.fill('#champ-message', 'réservé à Bob')
    await a.press('#champ-message', 'Enter')
    await b.waitForFunction(() => document.body.innerText.includes('réservé à Bob'))
    await attendreEtat(c, 'Salon complet')
    verifier(
      (await bulles(c)) === 0 && !(await c.content()).includes('réservé à Bob'),
      'troisième onglet : « Salon complet », aucun message reçu'
    )
    verifier(
      (await etat(a)) === 'Connecté à Bob' && (await etat(b)) === 'Connecté à Alice',
      'les deux premiers restent connectés'
    )

    // Disparition côté destinataire
    await b.waitForFunction(x => !document.documentElement.innerHTML.includes(x), XSS.slice(1, 12), {
      timeout: 40000,
      polling: 100
    })
    const duree = Date.now() - recu
    verifier(Math.abs(duree - 30000) <= 1000, `disparition 30 s ± 1 s après affichage (mesuré : ${(duree / 1000).toFixed(1)} s)`)

    // Panne du relais puis reprise
    relais.couper(true)
    await a.waitForFunction(() => !document.getElementById('avis').hidden, null, {timeout: 30000})
    verifier((await a.locator('#avis').innerText()).startsWith('Relais injoignable'), 'relais coupé : avis affiché')
    relais.couper(false)
    await a.waitForFunction(() => document.getElementById('avis').hidden, null, {timeout: 30000})
    verifier(true, 'relais rétabli : avis retiré')
    await attendreEtat(a, 'Connecté à Bob', 60000)
    await attendreEtat(b, 'Connecté à Alice', 60000)
    verifier(true, 'la conversation reprend après la panne')

    // Rechargement puis retour
    await b.reload()
    await attendreEtat(a, 'Connexion perdue')
    verifier((await bulles(a)) === 0, 'rechargement de B : écran de A vidé')
    await rejoindre(b, 'Bob2', PHRASE)
    await attendreEtat(a, 'Connecté à Bob2')
    verifier(true, 'B peut rejoindre à nouveau')

    // Quitter
    await a.click('#bouton-quitter')
    await attendreEtat(b, 'Connexion perdue')
    verifier((await a.locator('#ecran-entree').isVisible()) && (await bulles(b)) === 0, 'Quitter : tout est vidé des deux côtés')

    // Confidentialité
    const ecrit = relais.historique.join('\n')
    verifier(
      relais.historique.length > 0 &&
        ![PHRASE, 'Alice', 'Bob', 'réservé', 'onerror', 'réponse'].some(s => ecrit.includes(s)),
      'feuille : ni phrase, ni pseudo, ni message en clair, à aucun moment'
    )
    const stockage = await b.evaluate(async () => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookies: document.cookie,
      bases: indexedDB.databases ? (await indexedDB.databases()).length : 0
    }))
    verifier(Object.values(stockage).every(v => v === 0 || v === ''), 'aucun stockage navigateur utilisé')
    const bruit = console_.filter(l => !/ERR_(EMPTY_RESPONSE|CONNECTION|SOCKET)|Failed to load resource/.test(l))
    verifier(bruit.length === 0, `console sans avertissement CSP${bruit.length ? ' → ' + bruit.join(' | ') : ''}`)
  } catch (err) {
    echecs++
    console.log('ÉCHEC  ' + err.message.split('\n')[0])
    if (console_.length) console.log(console_.slice(0, 10).join('\n'))
  } finally {
    await navigateur.close()
    await relais.fermer()
    rmSync(dossier, {recursive: true, force: true})
  }

  console.log(echecs ? `\n${echecs} échec(s)` : '\nTout est bon.')
  process.exit(echecs ? 1 : 0)
})()
