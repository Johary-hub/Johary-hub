# 📊 Suivi Formation — App web (AOSOM FR)

Application web **statique** qui transforme le fichier `AOSOM_FR - Suivi Formation.xlsx`
en tableau de bord interactif. **Le fichier Excel reste l'unique source de données** :
tout est lu et calculé dans le navigateur, aucun serveur ni base de données.

> C'est la concrétisation de l'**approche ①** (app web statique « zéro serveur »)
> parmi les 3 pistes proposées pour transformer le tableur en application.

## ✨ Fonctionnalités

- **🎯 Tableau de bord** — KPIs (agents, marketplaces, formations, taux de formation),
  répartition des statuts (graphique en anneau), couverture par marketplace
  (barres empilées) et top des besoins de formation.
- **🧩 Matrice de compétences** — grille agents × marketplaces recalculée *en direct*
  depuis le suivi détaillé, avec code couleur (✅ formé / 🟡 en cours / 🔴 non formé /
  · non assigné) et % de complétude par agent.
- **📋 Suivi détaillé** — table des 148 formations, filtrable (agent, marketplace,
  statut, formateur + recherche libre), triable par colonne, avec **export CSV**.

Toutes les valeurs sont **calculées dynamiquement** à partir de la feuille
`SUIVI_DETAILLE` : la cohérence est garantie même si les feuilles de synthèse du
classeur ne sont pas à jour.

## 📁 Structure

```
suivi-formation/
├── index.html              # page unique
├── assets/
│   ├── app.js              # lecture xlsx + agrégations + rendu
│   └── styles.css
├── vendor/                 # librairies embarquées (aucune dépendance réseau)
│   ├── xlsx.full.min.js    # SheetJS — lecture du .xlsx
│   └── chart.umd.min.js    # Chart.js — graphiques
└── data/
    └── suivi-formation.xlsx  # ← la source de données
```

## ▶️ Lancer en local

Le navigateur ne peut pas lire un fichier via `fetch()` quand la page est ouverte
en `file://`. Il faut donc un petit serveur local (ou utiliser le bouton
**« Charger un fichier »** / glisser-déposer, qui fonctionne sans serveur) :

```bash
cd suivi-formation
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## 🚀 Déployer sur GitHub Pages (gratuit)

1. Pousser le dossier sur le dépôt.
2. *Settings → Pages* → Source : `Deploy from a branch`, dossier `/` (racine).
3. L'app sera servie à `https://<utilisateur>.github.io/suivi-formation/`.

> Le dépôt `Johary-hub/Johary-hub` est le dépôt de profil : ses Pages sont servies
> à la racine du domaine, l'app sera donc accessible sous `/suivi-formation/`.

## 🔄 Mettre à jour les données

Deux possibilités :

1. **Remplacer** `data/suivi-formation.xlsx` par la nouvelle version et pousser :
   l'app se met à jour automatiquement.
2. **Charger ponctuellement** un autre fichier via le bouton « Charger un fichier »
   ou en le glissant sur la page (utile pour tester sans rien committer).

L'app s'adapte aux noms de feuilles (les emojis et accents sont ignorés) et repère
les colonnes par leur intitulé : `Agent`, `Marketplace`, `Statut`, `Date Début`,
`Date Fin`, `Formateur`, `Durée`, `Évaluation`, `Commentaires`.

## 🔒 Confidentialité

100 % côté client : le fichier n'est jamais envoyé sur un serveur. Idéal pour des
données RH/formation internes.
