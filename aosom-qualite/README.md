# Évaluation Qualité — AOSOM FR

Application HTML autonome de saisie des évaluations qualité (grilles Mail / Appel), connectée à un Google Sheet via un Web App Apps Script.

L'URL du Web App n'est **pas** versionnée (ce dépôt est public) : renseigne-la dans *Paramètres ▸ Connexion Google Sheet* (elle est mémorisée dans le navigateur) ou dans la constante `GAS_URL` d'une copie locale.

## Calibrage

Menu **Calibrage** : plusieurs évaluateurs notent le même contact, puis une note de référence est arrêtée en séance.

1. **Nouvelle session** : canal, version de grille, conseiller, référence, lien vers le contact, consigne.
2. **Noter** : chaque évaluateur remplit la grille à l'aveugle (les notes des autres restent masquées tant qu'il n'a pas noté).
3. **Définir la référence** : la grille est pré-remplie avec la notation majoritaire et affiche la répartition par critère. On l'ajuste en séance, puis on l'enregistre. Option : la reporter dans le Suivi Mail/Appel avec l'évaluateur « Calibrage ».
4. **Résultats** : matrice critères × évaluateurs, accord par critère, écart-type des notes, écart et verdict par évaluateur (Aligné / Écart mineur / Écart majeur, mêmes seuils que la contre-évaluation), critères à débattre avec les commentaires, export CSV.
5. Synthèse transverse : **alignement par évaluateur** (tendance plus sévère / plus indulgent) et **critères à recalibrer**.

Stockage : onglet `Suivi CALIBRAGE` du Sheet, via l'action générique `saveEval` (aucune modification d'Apps Script nécessaire). Une ligne par événement, colonne `Type` = `SESSION` | `NOTE` | `REFERENCE`, colonne `Session` = identifiant `CAL-…`. La dernière ligne fait foi : une nouvelle note du même évaluateur remplace l'ancienne.
