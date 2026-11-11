# Chat éphémère à deux

Un chat pour **deux personnes exactement**, livré en **un seul fichier** :
[`dist/index.html`](dist/index.html) (≈ 85 Ko, CSS, JS et Trystero inlinés).

- Les messages circulent **en direct** entre les deux navigateurs (WebRTC DataChannel, chiffré DTLS).
- **Rien n'est stocké** : ni serveur, ni disque, ni stockage navigateur.
- Chaque message **disparaît 30 secondes** après son affichage, des deux côtés.
- **Aucun historique** : recharger la page vide tout, chez soi et chez l'autre.

```
Navigateur A  <──── WebRTC DataChannel (chiffré DTLS) ────>  Navigateur B
      │                                                          │
      └──── relais publics Nostr (poignée de main seulement) ────┘
```

## Utilisation

1. Ouvrez la page (URL GitHub Pages, ou le fichier `dist/index.html` reçu et ouvert localement sur ordinateur).
2. Saisissez un pseudo et une **phrase secrète** d'au moins 12 caractères, convenue avec l'autre personne **par un autre moyen**.
3. « Rejoindre ». Dès que l'autre a saisi exactement la même phrase, le bandeau affiche « Connecté à {pseudo} ».
4. Entrée envoie, Maj+Entrée insère un retour à la ligne. « Quitter » ferme le salon et vide tout.

Rien n'est mémorisé : pseudo et phrase sont à ressaisir à chaque ouverture. Il n'y a pas de file d'attente : si l'autre n'est pas connecté, l'envoi est impossible.

## Développement

```bash
npm ci
```

```bash
npm run build
```

`build.mjs` bundle `src/app.js` (esbuild, IIFE minifié, appels `console.*` supprimés), l'injecte avec `src/style.css` dans `src/index.html` et écrit `dist/index.html`. Le build échoue si le résultat contient une ressource externe ou une API de stockage.

Dépendances fixées à la version exacte : `trystero` 0.26.0 (stratégie Nostr par défaut), `esbuild`, `ws` (tests uniquement).

### Test automatisé

```bash
npm test
```

Lance un relais Nostr local en mémoire, construit une variante de test pointant dessus et pilote quatre profils Chromium ouvrant le fichier en `file://` (≈ 1 min 30). Nécessite [Playwright](https://playwright.dev) (`npm i --no-save playwright && npx playwright install chromium`). Il vérifie : connexion à deux, phrases différentes isolées, message visible des deux côtés puis disparu à 30 s ± 1 s, `<img src=x onerror=alert(1)>` affiché comme du texte, troisième arrivant en « Salon complet » sans aucun message, rechargement et « Quitter » qui vident l'autre écran, aucun stockage utilisé, console vide (pas d'avertissement CSP), rien de lisible côté relais.

## Fonctionnement

| Sujet | Choix |
|---|---|
| Salon | `roomId` = SHA-256 hex de `"salon:" + phrase` (`crypto.subtle`) |
| Signalisation | Trystero / Nostr ; descriptions de session chiffrées (AES-GCM) avec la phrase (`password`) |
| Limite à deux | `peerActif` = premier pair accepté ; les envois le ciblent toujours explicitement ; tout message d'un autre pair est rejeté |
| Troisième arrivant | refusé pendant la poignée de main Trystero (`onPeerHandshake`) : il affiche « Salon complet » et quitte le salon |
| Messages | actions `msg` `{id, texte, envoyeA}` et `hello` `{pseudo}` ; types et longueurs validés ; affichage par `textContent` uniquement |
| Expiration | `DUREE_MS = 30000` ; un `setTimeout` par bulle, barre de progression en CSS ; le tableau en mémoire ne contient jamais le texte |
| Nettoyage | `pagehide` / `beforeunload` : `room.leave()` ; au retour d'un onglet masqué, purge des messages échus |
| CSP | `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src wss:; base-uri 'none'; form-action 'none'` |

`img-src data:` ne sert qu'à l'icône vide (`data:,`) qui évite une requête `favicon.ico`.

### TURN (réseaux mobiles)

En 4G/5G (CGNAT), la connexion directe peut échouer. `src/app.js` contient une constante `TURN = []` : remplissez-la avec vos serveurs (`{urls, username, credential}`) puis reconstruisez ; elle est passée à l'option `turnConfig` de Trystero. **Ne committez aucun identifiant TURN dans un dépôt public.** Sans TURN, l'application affiche après 60 s d'attente (ou dès que Trystero signale un pair présent mais injoignable) : « Connexion directe impossible sur ce réseau. Essayez un autre réseau (Wi-Fi). » — tout en continuant d'attendre.

## Déploiement

Le workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) construit le fichier et publie le site à chaque push sur `main` : le contenu de `docs/` reste à la racine, le chat est servi sous **`/chat/`** (`https://johary-hub.github.io/Johary-hub/chat/`).

Prérequis, une seule fois : *Settings > Pages > Source* = **GitHub Actions**.

L'hébergeur ne fait que servir le fichier ; il ne voit aucun message. Le même fichier fonctionne ouvert en `file://` sur ordinateur.

## Limites (non résolues, par nature)

- **Capture d'écran, photo de l'écran et copier-coller restent possibles** : la disparition à 30 s n'empêche pas l'autre de conserver un message.
- **Les relais Nostr publics voient** qu'une connexion s'établit (identifiant de salon haché, horaires) et **les adresses IP** des deux navigateurs ; ils ne voient ni la phrase, ni les pseudos, ni les messages.
- **Les deux pairs voient l'adresse IP l'un de l'autre** (connexion directe). Avec un serveur TURN, c'est lui qui voit les IP et relaie des données chiffrées.
- La sécurité repose sur la phrase secrète : quiconque la connaît peut prendre la place libre du salon. Choisissez-la longue et unique.
- Si trois personnes rejoignent au même instant avec la même phrase, toutes peuvent voir « Salon complet » ; il suffit de rejoindre à nouveau.
- Les relais publics sont un service tiers bénévole : leur disponibilité n'est pas garantie.
- Sur téléphone, ouvrir le fichier en `file://` est peu fiable selon les navigateurs : utilisez l'URL hébergée.

## Tests manuels

| # | Scénario | Résultat |
|---|---|---|
| 1 | Deux ordinateurs sur le même Wi-Fi | à faire |
| 2 | Ordinateur en Wi-Fi + téléphone en 4G | à faire |
| 3 | Deux téléphones en 4G (cas le plus risqué, TURN probablement nécessaire) | à faire |
| 4 | `dist/index.html` envoyé par messagerie, ouvert localement (Chrome, Firefox, Edge) | Chromium `file://` : OK (test automatisé) ; Firefox, Edge : à faire |
| 5 | Coupure réseau d'un côté → « Connexion perdue », messages effacés | à faire (détection en quelques secondes, délai ICE) |
| 6 | Onglet en arrière-plan plus de 30 s → aucun message expiré au retour | OK (test automatisé, horloge simulée) |

Les scénarios réseau (1, 2, 3, 5) demandent de vrais appareils et les relais publics : ils n'ont pas été exécutés dans l'environnement de développement.
