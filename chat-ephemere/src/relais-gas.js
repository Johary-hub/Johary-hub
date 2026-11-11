// Mode « relais Google » : pour les réseaux où WebRTC ou les relais Nostr sont
// filtrés. Les messages transitent par un Google Apps Script (voir
// relais-google/Code.gs), chiffrés ici en AES-GCM avec une clé dérivée de la
// phrase secrète : le script et la feuille ne voient que du texte chiffré.
//
// L'objet renvoyé imite la petite partie de l'API Trystero utilisée par app.js.

const SEL = 'you-and-me/relais/v1'
const ITERATIONS = 200000
const INTERVALLE_MS = 2000
const INTERVALLE_MASQUE_MS = 5000
const ECHECS_AVANT_ALERTE = 3
const MAX_ENVOIS = 10
// Après un rechargement, l'ancienne présence peut occuper la place quelques
// secondes : on insiste un peu avant de conclure que le salon est complet.
const PATIENCE_COMPLET_MS = 18000

const enc = new TextEncoder()
const dec = new TextDecoder()

const versHex = octets =>
  Array.from(octets, o => o.toString(16).padStart(2, '0')).join('')

const versB64 = octets => {
  let binaire = ''
  for (let i = 0; i < octets.length; i += 0x8000) {
    binaire += String.fromCharCode.apply(null, octets.subarray(i, i + 0x8000))
  }
  return btoa(binaire)
}

const depuisB64 = texte => Uint8Array.from(atob(texte), c => c.charCodeAt(0))

// Une seule dérivation lente (PBKDF2) donne l'identifiant du salon et la clé
// de chiffrement ; connaître l'un ne permet pas de retrouver l'autre.
export const deriverCles = async phrase => {
  const base = await crypto.subtle.importKey(
    'raw',
    enc.encode(phrase),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = new Uint8Array(
    await crypto.subtle.deriveBits(
      {name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(SEL), iterations: ITERATIONS},
      base,
      512
    )
  )
  const cle = await crypto.subtle.importKey(
    'raw',
    bits.slice(32, 64),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  )
  const salon = versHex(bits.slice(0, 16))
  bits.fill(0)
  return {salon, cle}
}

export const creerSalonGas = (url, {salon, cle}, {surComplet, surPanne, surReprise}) => {
  const moi = crypto.randomUUID()
  const actions = {}
  const file = [] // {pour, c} en attente d'envoi (déjà chiffrés)
  let pairs = []
  let ferme = false
  let enCours = false
  let minuterie = null
  let echecs = 0
  let completDepuis = 0

  const chiffrer = async objet => {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const chiffre = new Uint8Array(
      await crypto.subtle.encrypt(
        {name: 'AES-GCM', iv, additionalData: enc.encode(salon)},
        cle,
        enc.encode(JSON.stringify(objet))
      )
    )
    const tout = new Uint8Array(12 + chiffre.length)
    tout.set(iv)
    tout.set(chiffre, 12)
    return versB64(tout)
  }

  const dechiffrer = async texte => {
    const tout = depuisB64(texte)
    const clair = await crypto.subtle.decrypt(
      {name: 'AES-GCM', iv: tout.subarray(0, 12), additionalData: enc.encode(salon)},
      cle,
      tout.subarray(12)
    )
    return JSON.parse(dec.decode(clair))
  }

  const planifier = delai => {
    if (ferme) return
    if (minuterie !== null) clearTimeout(minuterie)
    minuterie = setTimeout(tour, delai)
  }

  const tour = async () => {
    minuterie = null
    if (ferme || enCours) return
    enCours = true

    const envois = file.splice(0, MAX_ENVOIS)
    let rep = null

    try {
      const r = await fetch(url, {
        method: 'POST',
        // text/plain : requête « simple », sans pré-vérification CORS.
        headers: {'Content-Type': 'text/plain;charset=utf-8'},
        body: JSON.stringify({salon, moi, envois}),
        credentials: 'omit',
        cache: 'no-store',
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
      })
      rep = await r.json()
      if (!rep || typeof rep !== 'object' || rep.erreur) throw new Error('relais')
    } catch {
      rep = null
    }

    enCours = false
    if (ferme) return

    if (!rep) {
      file.unshift(...envois)
      if (++echecs === ECHECS_AVANT_ALERTE) surPanne()
      planifier(INTERVALLE_MS * Math.min(echecs, 5))
      return
    }

    if (echecs >= ECHECS_AVANT_ALERTE) surReprise()
    echecs = 0

    if (rep.complet) {
      file.unshift(...envois)
      completDepuis = completDepuis || Date.now()
      if (Date.now() - completDepuis > PATIENCE_COMPLET_MS) surComplet()
      else planifier(3000)
      return
    }

    completDepuis = 0

    const presents = Array.isArray(rep.pairs)
      ? rep.pairs.filter(p => typeof p === 'string')
      : []
    const partis = pairs.filter(p => !presents.includes(p))
    const arrives = presents.filter(p => !pairs.includes(p))
    pairs = presents

    partis.forEach(p => salonGas.onPeerLeave && salonGas.onPeerLeave(p))
    arrives.forEach(p => salonGas.onPeerJoin && salonGas.onPeerJoin(p))

    for (const m of Array.isArray(rep.messages) ? rep.messages : []) {
      if (ferme) return
      if (!m || typeof m.de !== 'string' || typeof m.c !== 'string') continue
      if (!pairs.includes(m.de)) continue
      try {
        const {a, d} = await dechiffrer(m.c)
        const action = actions[a]
        if (action && action.onMessage) action.onMessage(d, {peerId: m.de})
      } catch {
        // Illisible (mauvaise clé ou contenu altéré) : ignoré.
      }
    }

    planifier(
      file.length
        ? 0
        : document.visibilityState === 'hidden'
          ? INTERVALLE_MASQUE_MS
          : INTERVALLE_MS
    )
  }

  const salonGas = {
    onPeerJoin: null,
    onPeerLeave: null,

    makeAction: nom =>
      (actions[nom] = {
        onMessage: null,
        send: async (donnees, {target}) => {
          const c = await chiffrer({a: nom, d: donnees})
          if (ferme) return
          file.push({pour: target, c})
          if (!enCours) planifier(0)
        }
      }),

    getPeers: () => Object.fromEntries(pairs.map(p => [p, true])),

    ping: async id => {
      if (!pairs.includes(id)) throw new Error('absent')
      return 0
    },

    leave: () => {
      if (ferme) return
      ferme = true
      if (minuterie !== null) clearTimeout(minuterie)
      file.length = 0
      const corps = JSON.stringify({salon, moi, quitter: true})
      try {
        // sendBeacon part même pendant la fermeture de la page.
        if (!navigator.sendBeacon || !navigator.sendBeacon(url, corps)) {
          fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain;charset=utf-8'},
            body: corps,
            credentials: 'omit',
            keepalive: true,
            mode: 'no-cors'
          }).catch(() => {})
        }
      } catch {}
    }
  }

  planifier(0)
  return salonGas
}
