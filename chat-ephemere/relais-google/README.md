# Relais Google pour You & Me

À utiliser quand le réseau (pare-feu d'entreprise, filtrage FortiGuard…) bloque la connexion directe. Les messages passent alors par un Google Apps Script adossé à une Google Sheet.

- Le navigateur **chiffre** chaque message (AES-GCM, clé dérivée de la phrase secrète) avant l'envoi : le script et la feuille ne contiennent que du texte chiffré.
- Le script **supprime** un message dès qu'il est remis au destinataire, et au plus tard 30 secondes après son dépôt.
- Deux personnes au plus par salon ; la troisième est refusée par le script.

## Installation (une seule des deux personnes, 5 minutes)

1. Créez une Google Sheet vide (par exemple « You & Me relais »).
2. Menu **Extensions > Apps Script**. Supprimez le contenu de `Code.gs` et collez celui du fichier [`Code.gs`](Code.gs) de ce dossier. Enregistrez.
3. Dans la barre du haut, choisissez la fonction **`installer`** puis **Exécuter**. Acceptez les autorisations demandées (accès à cette feuille, déclencheurs). Cela crée les onglets `presence` et `messages` et un nettoyage automatique chaque minute.
4. **Déployer > Nouveau déploiement**, type **Application Web** :
   - *Exécuter en tant que* : **Moi**
   - *Qui a accès* : **Tout le monde**
5. Copiez l'**URL de l'application Web** : `https://script.google.com/macros/s/…/exec`.

Vérification : ouvrez cette URL dans le navigateur, elle doit afficher « You & Me : relais actif. »

## Utilisation

Dans l'application, sur l'écran d'entrée, ouvrez **« Réseau filtré ? Passer par un relais Google »** et collez l'URL. Les deux personnes doivent saisir la même URL et la même phrase secrète.

Pour ne pas la ressaisir à chaque fois, préremplissez-la dans le fichier :

- soit en ouvrant `index.html` dans un éditeur de texte et en collant l'URL entre les guillemets de la ligne `var RELAIS_GOOGLE = "";` (vers la fin du fichier) ;
- soit au build : `RELAIS_GOOGLE="https://script.google.com/macros/s/…/exec" npm run build`.

Laisser le champ vide rétablit la connexion directe (WebRTC).

## Après une modification de Code.gs

**Déployer > Gérer les déploiements > Modifier > Version : Nouvelle version > Déployer.** L'URL ne change pas.

## Limites

- **Les messages ne sont plus directs** : ils transitent par Google, chiffrés. Google voit les adresses IP, les horaires et la taille des messages, pas leur contenu.
- **Historique des versions** : Google Sheets conserve des versions antérieures du classeur. Des messages chiffrés déjà supprimés peuvent donc y subsister. Ils restent illisibles sans la phrase secrète ; pour les éliminer vraiment, supprimez le classeur (et videz la corbeille) de temps en temps, puis réinstallez.
- **Le propriétaire de la feuille** voit qu'une conversation a lieu (identifiant de salon haché, horaires), pas son contenu.
- **Latence** : le relais est interrogé toutes les 2 secondes ; comptez 2 à 4 secondes entre l'envoi et l'affichage. La disparition à 30 secondes court à partir de l'affichage chez chacun.
- **Quotas Apps Script** : chaque interrogation consomme du temps d'exécution (90 minutes par jour pour un compte gratuit, 6 heures pour Google Workspace, d'après la documentation Google). Ordre de grandeur non mesuré : une à deux heures de conversation ouverte par jour avec un compte gratuit. Fermez l'application quand vous ne discutez pas.
- **Onglet en arrière-plan** : le navigateur ralentit les onglets masqués ; après quelques minutes, l'autre personne peut voir « Connexion perdue ». Gardez l'onglet visible.
- L'URL du relais est publique pour qui la connaît : sans la phrase secrète elle ne donne accès à rien de lisible, mais ne la diffusez pas inutilement.
- Ce mode a été validé avec un simulateur local de Google Sheets, pas encore avec un vrai déploiement Google.
