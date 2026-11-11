// Produit dist/index.html : un seul fichier, CSS + JS + Trystero inlinés.
//
// Variables d'environnement réservées aux tests automatisés :
//   RELAIS_TEST  liste d'URL de relais séparées par des virgules (ex. ws://127.0.0.1:7777)
//   SORTIE       chemin du fichier produit (défaut : dist/index.html)
// Sans elles, le build utilise les relais Nostr publics de Trystero.

import {build} from 'esbuild'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const racine = dirname(fileURLToPath(import.meta.url))
const relaisTest = (process.env.RELAIS_TEST || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
const sortie = resolve(racine, process.env.SORTIE || 'dist/index.html')

const [js, css] = await Promise.all([
  build({
    entryPoints: [resolve(racine, 'src/app.js')],
    bundle: true,
    format: 'iife',
    minify: true,
    target: 'es2020',
    legalComments: 'none',
    drop: ['console', 'debugger'],
    write: false,
    define: {
      __RELAIS__: relaisTest.length ? JSON.stringify(relaisTest) : 'null'
    }
  }),
  build({
    entryPoints: [resolve(racine, 'src/style.css')],
    minify: true,
    write: false
  })
])

// Rien dans le bundle ne doit pouvoir fermer la balise qui le contient.
const scriptSur = js.outputFiles[0].text
  .trim()
  .replace(/<\/script/gi, '<\\/script')
  .replace(/<!--/g, '<\\!--')
const styleSur = css.outputFiles[0].text.trim().replace(/<\/style/gi, '<\\/style')

const gabarit = await readFile(resolve(racine, 'src/index.html'), 'utf8')

const html = gabarit
  .replace('__CONNECT_SRC__', () => (relaisTest.length ? 'wss: ws:' : 'wss:'))
  .replace('/*__CSS__*/', () => styleSur)
  .replace('/*__JS__*/', () => scriptSur)

// Garde-fous : fichier autonome, aucune persistance.
const interdits = [
  [/<script[^>]+\bsrc\s*=/i, 'balise <script src>'],
  [/<link[^>]+href\s*=\s*["']?(?:https?:)?\/\//i, 'feuille ou ressource externe'],
  [/<(?:img|iframe|video|audio|source)[^>]+\bsrc\s*=/i, 'média externe'],
  [/@import\b|url\(\s*["']?(?:https?:)?\/\//i, 'import CSS externe'],
  [/\b(?:localStorage|sessionStorage|indexedDB)\b/, 'stockage navigateur'],
  [/document\.cookie|\bcaches\.open\b|serviceWorker/, 'cookies, cache ou service worker'],
  [/\/\*__(?:CSS|JS)__\*\/|__CONNECT_SRC__|__RELAIS__/, "marqueur d'injection non remplacé"]
]

const problemes = interdits.filter(([motif]) => motif.test(html)).map(([, nom]) => nom)

if (problemes.length) {
  console.error('Build refusé : ' + problemes.join(', '))
  process.exit(1)
}

await mkdir(dirname(sortie), {recursive: true})
await writeFile(sortie, html)

console.log(`${sortie} — ${(Buffer.byteLength(html) / 1024).toFixed(1)} Ko`)
