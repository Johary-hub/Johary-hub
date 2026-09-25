# AOSOM FR : suivi des formations et des quiz

**Un seul script Google pour tous les quiz.** On ne le remplace jamais quand on crée un nouveau quiz. Chaque quiz HTML envoie ses résultats à la même URL `/exec`, et le nom du quiz (`QUIZ.id`) suffit à le distinguer. Chaque passage s'écrit automatiquement sur la ligne suivante.

```
Skill aosom-quiz ──► quiz-xxx.html ──► agent ──POST──► Code.gs (unique) ──► Sheet « Suivi Formation »
                                                                              ├─ SUIVI QUIZ       1 ligne / passage
                                                                              ├─ QUESTION QUIZ    1 ligne / question
                                                                              ├─ Catalogue quiz   1 ligne / quiz (auto)
                                                                              ├─ Bilan quiz       agents × quiz (auto)
                                                                              ├─ Stats questions  questions les plus ratées (auto)
                                                                              └─ Matrice          (option) ✅ Formé si validé
```

## Contenu

| Fichier | Rôle |
|---|---|
| `Code.gs` | Le script Apps Script à coller une fois dans le Sheet |
| `skill-aosom-quiz/SKILL.md` | Skill `aosom-quiz` mis à jour : le quiz envoie aussi `famille`, `version` et `seuil` |

## Installation (une seule fois, environ 5 min)

1. Ouvre le Sheet, puis **Extensions → Apps Script**.
2. Remplace tout le contenu de `Code.gs` par celui de ce dossier, puis enregistre.
3. **Déployer → Gérer les déploiements → ✏️ (Modifier) → Version : « Nouvelle version » → Déployer.**
   ⚠️ Ne clique pas sur « Nouveau déploiement ». Sinon l'URL `/exec` change et les quiz déjà envoyés aux agents n'écrivent plus rien.
4. Recharge le Sheet. Un menu **🎓 Formation** apparaît. Lance **Installer / vérifier les onglets** et accepte les autorisations. Cela crée les onglets `Catalogue quiz`, `Bilan quiz` et `Stats questions`, et ajoute les colonnes `Famille` et `Version` à SUIVI QUIZ. L'historique existant est conservé.
5. Dans **Catalogue quiz**, renseigne la colonne `Famille` des anciens quiz (par exemple `QUIZ T4`), qui ne l'envoyaient pas encore.
6. Mets à jour le skill `aosom-quiz` avec `skill-aosom-quiz/SKILL.md`, par exemple en demandant à Claude de modifier le skill avec ce fichier.

## Utilisation au quotidien

1. Demande un quiz à Claude. Le skill produit le HTML avec `QUIZ.id`, `famille` et `version`.
2. Envoie le HTML aux agents.
3. C'est tout. Au premier passage, le quiz apparaît seul dans **Catalogue quiz**. Tu peux y coller le lien du fichier (`Lien HTML`) et marquer `Archivé = oui` pour le retirer du Bilan.

## Les onglets calculés

- **Catalogue quiz** : famille, version, nombre de questions, seuil, première et dernière passation, nombre de passages, agents, agents validés, taux de validation, score moyen. Les colonnes `Famille`, `Lien HTML`, `Commentaire` et `Archivé` sont modifiables à la main et ne sont jamais écrasées.
- **Bilan quiz** : une ligne par agent (onglet Agents), une colonne par quiz.
  - `✅ 90 %` : validé (meilleur score).
  - `🟠 50 % ×2` : passé mais pas encore validé (meilleur score, nombre de tentatives).
  - `🔴 À passer` : l'agent est « ✅ Formé » sur la famille du quiz dans la Matrice, mais ne l'a jamais passé.
  - Les prénoms non reconnus sont listés en bas.
- **Stats questions** : taux de réussite par question, les plus ratées en haut. Ce sont les points à reprendre en formation, ou les questions à reformuler.

Tout est recalculé à chaque passage. Tu peux aussi relancer le calcul à la main : **🎓 Formation → Recalculer**.

## Options

Au début de `Code.gs` :

- `MAJ_MATRICE: false` (par défaut) : la Matrice reste gérée à la main.
- `MAJ_MATRICE: true` : un quiz « Validé » passe la case Agent × Famille à « ✅ Formé ».

Après chaque modification du script, refais l'étape 3 (Nouvelle version).

## Bonnes pratiques

- `QUIZ.id` doit être court, unique et stable. Si tu corriges un quiz déjà diffusé, garde le même `id` et incrémente `version`.
- `famille` s'écrit exactement comme l'en-tête de la Matrice (`Mirakl`, `FNAC&DARTY`…). Le contrôle `check_quiz.js` du skill le vérifie.
- Pour tester : dans l'éditeur Apps Script, lance `testerUnPassage`, puis supprime les lignes « TEST — à supprimer » et fais **Recalculer**.
