// Exécute le vrai relais-google/Code.gs dans Node, avec une Google Sheet
// simulée en mémoire, derrière un petit serveur HTTP. Tests uniquement.
const http = require('node:http')
const vm = require('node:vm')
const {readFileSync} = require('node:fs')
const {join} = require('node:path')

exports.demarrerRelaisGas = () =>
  new Promise(res => {
    const feuilles = {} // nom -> tableau de lignes
    const historique = [] // tout ce qui a été écrit, pour vérifier le chiffrement

    const feuille = nom => ({
      getLastRow: () => feuilles[nom].length,
      clearContents: () => {
        feuilles[nom] = []
      },
      getRange: (l, c, n, largeur) => ({
        getValues: () => feuilles[nom].slice(l - 1, l - 1 + n).map(x => x.slice(0, largeur)),
        setValues: lignes => {
          feuilles[nom] = lignes.map(x => x.slice())
          historique.push(JSON.stringify(lignes))
        }
      })
    })

    const classeur = {
      getSheetByName: nom => (feuilles[nom] ? feuille(nom) : null),
      insertSheet: nom => {
        feuilles[nom] = []
        return feuille(nom)
      }
    }

    const contexte = vm.createContext({
      SpreadsheetApp: {getActiveSpreadsheet: () => classeur},
      LockService: {getScriptLock: () => ({waitLock() {}, releaseLock() {}})},
      ContentService: {
        MimeType: {JSON: 'json'},
        createTextOutput: texte => ({texte, setMimeType() { return this }})
      },
      ScriptApp: {}
    })
    vm.runInContext(readFileSync(join(__dirname, '../relais-google/Code.gs'), 'utf8'), contexte)

    let coupe = false
    const serveur = http.createServer((req, rep) => {
      let corps = ''
      req.on('data', d => (corps += d))
      req.on('end', () => {
        if (coupe) return req.socket.destroy()
        const sortie =
          req.method === 'POST'
            ? contexte.doPost({postData: {contents: corps}})
            : contexte.doGet()
        rep.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        rep.end(sortie.texte)
      })
    })

    serveur.listen(0, '127.0.0.1', () =>
      res({
        url: `http://127.0.0.1:${serveur.address().port}/exec`,
        feuilles,
        historique,
        appeler: corps => JSON.parse(contexte.doPost({postData: {contents: JSON.stringify(corps)}}).texte),
        nettoyer: () => contexte.nettoyer(),
        // Décale l'horloge vue par le script (le contexte vm a son propre Date).
        avancer: ms => vm.runInContext(`Date.__reel = Date.__reel || Date.now; Date.now = () => Date.__reel() + ${Number(ms)}`, contexte),
        retablirHorloge: () => vm.runInContext('if (Date.__reel) Date.now = Date.__reel', contexte),
        couper: etat => (coupe = etat),
        fermer: () => new Promise(r => serveur.close(r))
      })
    )
  })
