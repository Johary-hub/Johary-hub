import {joinRoom} from 'trystero'

// ---------------------------------------------------------------- Réglages

const APP_ID = 'chat-ephemere-duo-v1'
const DUREE_MS = 30000
const PSEUDO_MAX = 20
const PHRASE_MIN = 12
const TEXTE_MAX = 2000
const DELAI_ATTENTE_MS = 60000
const DELAI_PRESENCE_MS = 30000
const DELAI_HELLO_MS = 8000
const DELAI_PING_MS = 2500

// Serveurs TURN optionnels (utile en 4G/CGNAT). Vide par défaut.
// Format : [{urls: 'turn:exemple.org:3478', username: '…', credential: '…'}]
// Ne jamais committer d'identifiants dans un dépôt public.
const TURN = []

// Remplacé au build. `null` = relais Nostr publics par défaut de Trystero.
const RELAIS = __RELAIS__

const MSG_RESEAU =
  'Connexion directe impossible sur ce réseau. Essayez un autre réseau (Wi-Fi).'

// ---------------------------------------------------------------- DOM

const $ = id => document.getElementById(id)

const ecranEntree = $('ecran-entree')
const ecranChat = $('ecran-chat')
const champPseudo = $('champ-pseudo')
const champPhrase = $('champ-phrase')
const boutonVoir = $('bouton-voir')
const boutonRejoindre = $('bouton-rejoindre')
const erreurEntree = $('erreur-entree')
const etat = $('etat')
const avis = $('avis')
const zoneMessages = $('messages')
const champMessage = $('champ-message')
const boutonEnvoyer = $('bouton-envoyer')
const boutonQuitter = $('bouton-quitter')

// ---------------------------------------------------------------- État (mémoire vive uniquement)

let room = null
let actionMsg = null
let actionHello = null
let monPseudo = ''
let peerActif = null // identifiant du seul pair accepté
let peerReserve = null // pair en cours de poignée de main
let pairConfirme = false // son « hello » a été reçu
let complet = false
let jonctionEnCours = false
let minuterieAttente = null
let minuteriePresence = null
let minuterieHello = null

// Ne contient jamais le texte : {id, noeud, echeance, minuterie}
const messages = []

// ---------------------------------------------------------------- Outils

const sansControle = s => s.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')

const hex = tampon =>
  Array.from(new Uint8Array(tampon), o => o.toString(16).padStart(2, '0')).join(
    ''
  )

const deriverSalon = async phrase =>
  hex(
    await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode('salon:' + phrase)
    )
  )

const attendre = ms => new Promise(res => setTimeout(res, ms))

const arreter = minuterie => {
  if (minuterie !== null) clearTimeout(minuterie)
  return null
}

// ---------------------------------------------------------------- Affichage

const definirEtat = (code, texte) => {
  etat.dataset.etat = code
  etat.textContent = texte
}

const montrerAvis = texte => {
  avis.textContent = texte
  avis.hidden = false
}

const cacherAvis = () => {
  avis.textContent = ''
  avis.hidden = true
}

const activerSaisie = actif => {
  champMessage.disabled = !actif
  boutonEnvoyer.disabled = !actif
}

const ajusterHauteur = () => {
  champMessage.style.height = 'auto'
  champMessage.style.height = Math.min(champMessage.scrollHeight + 2, 120) + 'px'
}

const viderSaisie = () => {
  champMessage.value = ''
  ajusterHauteur()
}

// ---------------------------------------------------------------- Messages éphémères

const retirerMessage = id => {
  const i = messages.findIndex(m => m.id === id)
  if (i === -1) return
  const [m] = messages.splice(i, 1)
  clearTimeout(m.minuterie)
  m.noeud.firstChild.textContent = ''
  m.noeud.remove()
}

const toutEffacer = () => {
  while (messages.length) retirerMessage(messages[0].id)
  zoneMessages.textContent = ''
}

const purgerExpires = () => {
  const maintenant = Date.now()
  messages
    .filter(m => m.echeance <= maintenant)
    .forEach(m => retirerMessage(m.id))
}

const afficherMessage = (id, texte, deMoi) => {
  const bulle = document.createElement('div')
  bulle.className = 'bulle ' + (deMoi ? 'moi' : 'autre')

  const contenu = document.createElement('p')
  contenu.className = 'texte'
  contenu.textContent = texte

  const barre = document.createElement('div')
  barre.className = 'barre'
  barre.style.setProperty('--duree', DUREE_MS + 'ms')

  bulle.append(contenu, barre)
  zoneMessages.append(bulle)
  zoneMessages.scrollTop = zoneMessages.scrollHeight

  messages.push({
    id,
    noeud: bulle,
    echeance: Date.now() + DUREE_MS,
    minuterie: setTimeout(() => retirerMessage(id), DUREE_MS)
  })
}

// ---------------------------------------------------------------- Pair

const arreterMinuteries = () => {
  minuterieAttente = arreter(minuterieAttente)
  minuteriePresence = arreter(minuteriePresence)
  minuterieHello = arreter(minuterieHello)
}

const armerAttente = () => {
  minuterieAttente = arreter(minuterieAttente)
  minuterieAttente = setTimeout(() => {
    if (room && !pairConfirme && !complet) montrerAvis(MSG_RESEAU)
  }, DELAI_ATTENTE_MS)
}

const salonComplet = () => {
  if (complet) return
  complet = true
  peerActif = null
  peerReserve = null
  pairConfirme = false
  arreterMinuteries()
  toutEffacer()
  viderSaisie()
  activerSaisie(false)
  cacherAvis()
  definirEtat('complet', 'Salon complet')
  fermerSalon()
}

const pairPerdu = () => {
  peerActif = null
  pairConfirme = false
  minuterieHello = arreter(minuterieHello)
  toutEffacer()
  viderSaisie()
  activerSaisie(false)
  definirEtat('perdu', 'Connexion perdue')
}

const pairVivant = async id => {
  const salon = room
  if (!salon) return false
  try {
    await Promise.race([
      salon.ping(id),
      attendre(DELAI_PING_MS).then(() => {
        throw new Error('délai')
      })
    ])
    return true
  } catch {
    return false
  }
}

// Exécutée par Trystero une fois le canal chiffré ouvert, avant que le pair
// ne devienne actif. Chacun annonce s'il est libre ; un pair déjà en
// conversation refuse le nouveau venu, qui affiche « Salon complet ».
const poigneeDeMain = async (peerId, envoyer, recevoir) => {
  try {
    if (peerActif && peerActif !== peerId && !(await pairVivant(peerActif))) {
      // L'ancien pair a disparu sans prévenir (rechargement, coupure).
      if (peerActif && peerActif !== peerId) pairPerdu()
    }

    const libre =
      !complet &&
      (!peerActif || peerActif === peerId) &&
      (!peerReserve || peerReserve === peerId)

    if (libre) peerReserve = peerId
    await envoyer({libre})

    const {data} = await recevoir()
    const autreLibre = Boolean(data) && data.libre === true

    if (!libre) {
      await attendre(300) // laisse partir l'annonce avant de couper
      throw new Error('salon complet')
    }

    if (!autreLibre) {
      salonComplet()
      throw new Error('salon complet')
    }
  } catch (err) {
    if (peerReserve === peerId) peerReserve = null
    throw err
  }
}

const surArrivee = peerId => {
  if (!room || complet) return

  if (peerActif) {
    if (peerId === peerActif) return
    // Troisième personne : ignorée. Si notre propre pair ne s'est pas encore
    // présenté, c'est nous qui sommes en trop.
    if (!pairConfirme && Object.keys(room.getPeers()).length >= 2) {
      salonComplet()
    }
    return
  }

  if (peerReserve && peerReserve !== peerId) return

  peerActif = peerId
  peerReserve = null
  pairConfirme = false
  minuteriePresence = arreter(minuteriePresence)

  actionHello.send({pseudo: monPseudo}, {target: peerId}).catch(() => {})

  minuterieHello = arreter(minuterieHello)
  minuterieHello = setTimeout(() => {
    if (peerActif === peerId && !pairConfirme) salonComplet()
  }, DELAI_HELLO_MS)
}

const surDepart = peerId => {
  if (peerId === peerReserve) peerReserve = null
  if (peerId !== peerActif) return
  pairPerdu()
}

const surHello = (data, {peerId}) => {
  if (!room || peerId !== peerActif || pairConfirme) return
  if (!data || typeof data !== 'object' || typeof data.pseudo !== 'string') {
    return
  }

  const pseudo = sansControle(data.pseudo).trim()
  if (!pseudo || pseudo.length > PSEUDO_MAX) return

  pairConfirme = true
  arreterMinuteries()
  cacherAvis()
  definirEtat('connecte', 'Connecté à ' + pseudo)
  activerSaisie(true)
  champMessage.focus()
}

const surMessage = (data, {peerId}) => {
  if (!room || peerId !== peerActif || !pairConfirme) return
  if (!data || typeof data !== 'object') return

  const {id, texte, envoyeA} = data
  if (typeof id !== 'string' || !id || id.length > 64) return
  if (typeof texte !== 'string' || !texte || texte.length > TEXTE_MAX) return
  if (typeof envoyeA !== 'number' || !Number.isFinite(envoyeA)) return
  if (messages.some(m => m.id === id)) return

  afficherMessage(id, texte, false)
}

const surErreurJonction = details => {
  if (!room || complet || pairConfirme) return

  const erreur = String((details && details.error) || '')
  const peerId = details && details.peerId

  if (peerId && peerId === peerReserve) peerReserve = null

  // Les refus de poignée de main sont gérés ailleurs (salon complet).
  if (erreur.startsWith('handshake')) return

  // Un pair est bien présent dans le salon, mais WebRTC n'aboutit pas.
  if (minuteriePresence === null) {
    minuteriePresence = setTimeout(() => {
      minuteriePresence = null
      if (room && !pairConfirme && !complet) montrerAvis(MSG_RESEAU)
    }, erreur.startsWith('could not connect') ? 0 : DELAI_PRESENCE_MS)
  }
}

// ---------------------------------------------------------------- Salon

const fermerSalon = () => {
  const salon = room
  room = null
  actionMsg = null
  actionHello = null
  if (salon) {
    try {
      Promise.resolve(salon.leave()).catch(() => {})
    } catch {}
  }
}

const reinitialiser = () => {
  fermerSalon()
  arreterMinuteries()
  toutEffacer()
  viderSaisie()
  activerSaisie(false)
  cacherAvis()
  peerActif = null
  peerReserve = null
  pairConfirme = false
  complet = false
  monPseudo = ''
}

const montrerEntree = () => {
  champPseudo.value = ''
  champPhrase.value = ''
  champPhrase.type = 'password'
  boutonVoir.textContent = 'Afficher'
  boutonVoir.setAttribute('aria-pressed', 'false')
  erreurEntree.textContent = ''
  ecranChat.hidden = true
  ecranEntree.hidden = false
}

const rejoindre = async () => {
  if (room || jonctionEnCours) return

  const pseudo = sansControle(champPseudo.value).trim().slice(0, PSEUDO_MAX)
  const phrase = champPhrase.value

  if (!pseudo) {
    erreurEntree.textContent = 'Choisissez un pseudo.'
    champPseudo.focus()
    return
  }

  if (phrase.length < PHRASE_MIN) {
    erreurEntree.textContent =
      'La phrase secrète doit contenir au moins ' + PHRASE_MIN + ' caractères.'
    champPhrase.focus()
    return
  }

  if (
    !window.crypto ||
    !crypto.subtle ||
    !crypto.randomUUID ||
    !window.RTCPeerConnection
  ) {
    erreurEntree.textContent =
      'Ce navigateur ne permet pas la connexion directe chiffrée (WebRTC ou contexte sécurisé indisponible).'
    return
  }

  jonctionEnCours = true
  erreurEntree.textContent = ''

  try {
    const roomId = await deriverSalon(phrase)
    const config = {appId: APP_ID, password: phrase}

    if (TURN.length) config.turnConfig = TURN
    if (RELAIS) config.relayConfig = {urls: RELAIS}

    reinitialiser()
    monPseudo = pseudo

    room = joinRoom(config, roomId, {
      onJoinError: surErreurJonction,
      onPeerHandshake: poigneeDeMain
    })

    actionMsg = room.makeAction('msg')
    actionHello = room.makeAction('hello')
    actionMsg.onMessage = surMessage
    actionHello.onMessage = surHello
    room.onPeerJoin = surArrivee
    room.onPeerLeave = surDepart
  } catch {
    reinitialiser()
    erreurEntree.textContent = 'Impossible de rejoindre le salon. Réessayez.'
    jonctionEnCours = false
    return
  }

  jonctionEnCours = false

  // Rien ne reste dans les champs une fois le salon rejoint.
  champPseudo.value = ''
  champPhrase.value = ''
  champPhrase.type = 'password'

  definirEtat('attente', "En attente de l'autre personne…")
  armerAttente()
  ecranEntree.hidden = true
  ecranChat.hidden = false
}

const envoyer = () => {
  if (!room || !peerActif || !pairConfirme) return

  const texte = champMessage.value.slice(0, TEXTE_MAX)
  if (!texte.trim()) return

  const id = crypto.randomUUID()
  const cible = peerActif

  actionMsg
    .send({id, texte, envoyeA: Date.now()}, {target: cible})
    .catch(() => {})

  afficherMessage(id, texte, true)
  viderSaisie()
  champMessage.focus()
}

const quitter = () => {
  reinitialiser()
  montrerEntree()
  champPseudo.focus()
}

// ---------------------------------------------------------------- Événements

boutonRejoindre.addEventListener('click', rejoindre)

champPseudo.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault()
    champPhrase.focus()
  }
})

champPhrase.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault()
    rejoindre()
  }
})

boutonVoir.addEventListener('click', () => {
  const visible = champPhrase.type === 'password'
  champPhrase.type = visible ? 'text' : 'password'
  boutonVoir.textContent = visible ? 'Masquer' : 'Afficher'
  boutonVoir.setAttribute('aria-pressed', String(visible))
})

boutonEnvoyer.addEventListener('click', envoyer)

champMessage.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    envoyer()
  }
})

champMessage.addEventListener('input', ajusterHauteur)

boutonQuitter.addEventListener('click', quitter)

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') purgerExpires()
})

const surFermeture = () => {
  reinitialiser()
}

addEventListener('pagehide', surFermeture)
addEventListener('beforeunload', surFermeture)

// Page restaurée depuis le cache avant/arrière : repartir de zéro.
addEventListener('pageshow', e => {
  if (e.persisted) quitter()
})
