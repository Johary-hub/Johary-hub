// Relais Nostr minimal, en mémoire, pour les tests automatisés uniquement.
const {WebSocketServer} = require('ws')

const correspond = (filtre, ev) =>
  Object.entries(filtre).every(([cle, valeur]) => {
    if (cle === 'kinds') return valeur.includes(ev.kind)
    if (cle === 'since') return ev.created_at >= valeur
    if (cle === 'until') return ev.created_at <= valeur
    if (cle === 'authors') return valeur.includes(ev.pubkey)
    if (cle === 'ids') return valeur.includes(ev.id)
    if (cle[0] === '#') {
      return ev.tags.some(t => t[0] === cle.slice(1) && valeur.includes(t[1]))
    }
    return true
  })

exports.demarrerRelais = port =>
  new Promise(res => {
    const serveur = new WebSocketServer({port, host: '127.0.0.1'})
    const abonnements = new Map() // socket -> Map(subId -> filtres)
    const journal = [] // contenu brut de tout ce qui transite

    serveur.on('connection', socket => {
      abonnements.set(socket, new Map())
      socket.on('close', () => abonnements.delete(socket))
      socket.on('message', brut => {
        let msg
        try {
          msg = JSON.parse(brut.toString())
        } catch {
          return
        }
        const [type, a, ...reste] = msg
        if (type === 'REQ') {
          abonnements.get(socket).set(a, reste)
          socket.send(JSON.stringify(['EOSE', a]))
        } else if (type === 'CLOSE') {
          abonnements.get(socket).delete(a)
        } else if (type === 'EVENT') {
          journal.push(brut.toString())
          socket.send(JSON.stringify(['OK', a.id, true, '']))
          for (const [client, subs] of abonnements) {
            for (const [subId, filtres] of subs) {
              if (filtres.some(f => correspond(f, a))) {
                client.send(JSON.stringify(['EVENT', subId, a]))
              }
            }
          }
        }
      })
    })

    serveur.on('listening', () =>
      res({
        url: `ws://127.0.0.1:${serveur.address().port}`,
        journal,
        fermer: () => new Promise(r => serveur.close(r))
      })
    )
  })
