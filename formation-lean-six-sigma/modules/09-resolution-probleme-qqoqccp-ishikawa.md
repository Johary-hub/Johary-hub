# Module 9 — Résolution de problème : QQOQCCP, Ishikawa, PDCA

> **Parcours Lean Six Sigma — Yellow Belt (SSYB)** · Séquence 3
> ⏱️ Durée estimée : 55 min · 🎓 Niveau : Yellow Belt

## 🎯 Objectifs du module
À la fin de ce module, vous serez capable de :
- **Cadrer un problème** avec le **QQOQCCP** en établissant les faits (Qui, Quoi, Où, Quand, Comment, Combien, Pourquoi).
- **Construire un diagramme d'Ishikawa (5M)** pour lister et organiser les causes possibles d'un effet observé.
- **Remonter à la cause racine** en enchaînant Ishikawa et la technique des **5 Pourquoi**.
- **Structurer la résolution** d'un problème quotidien avec le cycle **PDCA (Plan-Do-Check-Act)** et ses 12 étapes.
- **Choisir le bon outil** de résolution selon la complexité du problème (Just-do-it, PDCA, QQOQCCP & 5P, A3/8D, DMAIC).
- **Décider sur des données** (faits, batonnage, Pareto) plutôt que sur des suppositions.

## 🧭 Prérequis
- Notions Lean Six Sigma de base : la définition d'un **problème** comme écart, la notion de **processus**, les **5M**, et le bon sens « parler avec des données ».
- Aucun prérequis logiciel : les outils sont des fiches papier / tableurs simples.

## 📚 Contenu

### 1. L'état d'esprit « Résolution de problème »

Avant tout outil, une posture. Chez Progress Partners, **tout nouveau problème est une opportunité d'amélioration**. À l'inverse, **les problèmes récurrents sont un échec de notre mode de gestion de l'entreprise** : s'ils reviennent, c'est que la cause racine n'a jamais été traitée.

> « Nous apprenons beaucoup plus des erreurs que nous faisons et des problèmes que nous surmontons que si notre vie ne connaissait aucun problème et si nous ne faisions jamais d'erreurs. »

**Définition fondatrice — un problème est l'écart entre une situation actuelle et une situation idéale.** On cherche à aller **vers le mieux** en maîtrisant une caractéristique : la situation idéale est la cible, la situation actuelle est le réel, et l'**écart** entre les deux est le problème à réduire.

```
        Situation idéale  ────────────────  (cible, "vers le mieux")
                 ▲
                 │   ÉCART  =  PROBLÈME
                 ▼
        Situation actuelle ───────────────  (le réel observé)
```

**La gestion des problèmes — l'image du niveau d'eau.** La majorité des problèmes se cachent **sous la surface**, tout comme les gaspillages : on ne voit d'abord que les **symptômes**, pas les **problèmes** eux-mêmes. L'objectif du leadership est de **faire baisser le niveau d'eau et de le maîtriser**, pour faire apparaître les problèmes immergés. Pour commencer, il faut **un processus, une structure et des compétences robustes** afin de définir des **contre-mesures** capables de résoudre les problèmes immédiatement visibles.

> 🖼️ *Schéma source non transcriptible : la métaphore « bateau / niveau d'eau / rochers » (symptômes en surface, problèmes immergés) figure dans « 12. Methode PDCA.pdf ». S'y reporter pour la projection visuelle.*

**PDCA ou « méthode pompier » ?** Le PDCA est l'opposé du **PANIC MODE** : au lieu de réagir dans l'urgence en boucle (éteindre des incendies), on déroule un cycle discipliné **Plan → Do → Check → Act**. La maîtrise s'acquiert d'abord par la **standardisation** : on passe du **SDCA** (Standardize-Do-Check-Act, tenir le standard existant) vers le **PDCA** (résolution de problème pour relever le standard). Un **standard** est défini comme *la meilleure manière, la plus facile et la plus sûre connue à ce jour*.

### 2. Quel outil, et quand l'utiliser ?

Tous les problèmes ne se valent pas. On adapte l'outil à la **complexité du problème** et au **nombre de personnes impliquées (« People Involvement »)**. Ordre de grandeur cité par la source : **≈ 80 % de problèmes simples, ≈ 15 % de problèmes transverses, ≈ 5 % de problèmes complexes.**

| Type de problème | Outil recommandé | Qui / niveau d'implication |
|---|---|---|
| **Solution connue** — il suffit de suivre le standard | **Just-do-it** | Faire, sans projet |
| **Problèmes quotidiens** | **PDCA** | Équipe / opérationnel |
| **Problème lié à un processus, faisant intervenir plusieurs acteurs** | **QQOQCCP & 5P** (5 Pourquoi) | Groupe |
| **Problème lié à plusieurs processus** | **A3 / 8D** | Professionnel / champion |
| **Problèmes liés à de multiples processus, à fort enjeu client** | **6σ DMAIC (Green / Black Belt)** | High People Involvement |

> 🖼️ *Schéma source non transcriptible : la matrice « complexité × nombre de personnes impliquées » positionnant Just-do-it / PDCA / QQOQCCP-5P / A3-8D / DMAIC figure dans « 11. Résolution de Pb Méthode PDCA.pdf ». Le présent module couvre les briques **QQOQCCP**, **Ishikawa** et **PDCA**.*

**Les premières étapes, quel que soit l'outil.** Clarifier le problème, c'est : **définir le problème et ses impacts** (« un problème bien posé est déjà à moitié résolu »), et si besoin le **décomposer en sous-problèmes**. Puis :
- **Établir les faits** → **QQOQCCP**.
- **Investiguer toutes les causes potentielles** → **diagramme d'Ishikawa (5M)**.
- **Conserver les causes réelles et remonter à leurs racines** → **5 Pourquoi**.

### 3. Le QQOQCCP — établir les faits

Le **QQOQCCP** est une grille de questionnement systématique pour **cadrer un problème par les faits**, sans interprétation. Sept questions, sept lettres :

| Lettre | Question | Ce que l'on cherche |
|---|---|---|
| **Q — Qui ?** | Qui voit le problème ? Qui est concerné ? | Trouver **toutes les personnes concernées**. |
| **Q — Quoi ?** | De quoi s'agit-il exactement ? | **Observer comment apparaît physiquement** le problème. |
| **O — Où ?** | À quels endroits observe-t-on le problème ? | Localiser précisément. |
| **Q — Quand ?** | Quand est-il apparu ? Quelle fréquence d'apparition ? | Dater et mesurer la récurrence. |
| **C — Comment ?** | Dans quelles circonstances apparaît-il ? Peut-on établir des corrélations d'événements ? | **Observer si possible comment le problème arrive.** |
| **C — Combien ?** | Quelle quantité de problème (pourcentage, nombre, unité de mesure…) ? | **Quantifier** l'ampleur. |
| **P — Pourquoi ?** | Pourquoi est-ce un problème ? Pourquoi doit-on le résoudre ? | Trouver **l'enjeu** si on le résout, déterminer les **conséquences** si on le laisse, et **choisir**. |

> 💡 **Astuce de lecture.** On ne confond pas le **« Pourquoi ? » du QQOQCCP** (= pourquoi traiter ce problème, son enjeu) avec les **« 5 Pourquoi »** (= remonter aux causes racines, voir §5). Le premier justifie l'action ; les seconds expliquent le défaut.

La **fiche QQOQCCP** (formulaire source) comporte un cartouche de gestion : **Réf.**, **Màj** (mise à jour), **Propriétaire (Propr.)**, et les sept cases QUI / QUOI / OÙ / QUAND / COMMENT / COMBIEN / POURQUOI à renseigner.

> 🖼️ *Le formulaire « 11.QQOQCCP.pdf » est un **gabarit quasi vierge** (cartouche + 7 cases disposées en étoile autour du problème) : son contenu textuel se limite aux libellés des champs. Utiliser le fichier source comme trame d'impression.*

### 4. Le diagramme d'Ishikawa (5M) — chercher les causes

Le **diagramme d'Ishikawa**, aussi appelé **diagramme causes-effet** ou **arêtes de poisson** (*fishbone*), sert à **lister et organiser les causes possibles d'une situation**. On part de l'**effet** (le problème, à la tête du poisson, à droite) et on remonte les **arêtes**, une par grande famille de causes : les **5M**.

| M | Famille de causes | Exemples de questions |
|---|---|---|
| **Méthode** | Procédures, modes opératoires, façons de faire | Le processus est-il standardisé ? manuel ? |
| **Matière** | Matières premières, composants, consommables, informations entrantes | La matière est-elle conforme et stable ? |
| **Milieu** | Environnement de travail, conditions, ambiance | L'espace de travail est-il sale, bruyant, exigu ? |
| **Machine** | Équipements, outils, moyens | L'outil est-il adapté, en bon état ? |
| **Main d'œuvre (M.O.)** | Personnes, compétences, soin, technique | L'opérateur est-il formé ? la technique varie-t-elle ? |

```
   MILIEU        MÉTHODE        MACHINE
       \            |            /
        \           |           /
         \____      |      ____/
              \     |     /
   ════════════╲════╪════╱════════════►  EFFET (le problème)
              ____/     \____
         /          |          \
        /           |           \
       /            |            \
  MAIN D'ŒUVRE   MATIÈRE
```

> 🖼️ *Le formulaire « 11. Formulaire Diagramme Ishikawa.pdf » est un **squelette vierge** d'arête de poisson, avec : cartouche **Pilote / Animateur** + **Date**, la case **Problème** à droite, et les cinq branches **Moyen (Machine)**, **Matière**, **Milieu**, **Méthode**, **M.O. (Main d'œuvre)**. À imprimer pour l'atelier.*

**Comment investiguer ?** Pour chaque M, on **liste les causes possibles** (idéalement en brainstorming, voir §7). On peut prolonger chaque arête par des **sous-causes** (arêtes secondaires).

**Exemple complet (cas source) — « Le tampon de certification est illisible ».** La source développe ce cas réel sur les 5M. Voici les causes recensées par famille :

| Famille (5M) | Causes identifiées sur le cas « tampon illisible » |
|---|---|
| **Méthode** | Le processus est **manuel** ; **variabilité liée à la technique** employée ; **rush** / process « à la bourre » en fin de poste ; pas de validation. |
| **Matière** | Le **tampon et la réserve d'encre sont séparés** ; la **nature de la carte est variable** ; la **réserve d'encre est rechargée manuellement** ; encrage inadapté. |
| **Milieu** | **Conditions de production trop stressantes** ; l'**espace de travail est sale** ; atelier **bruyant** (*« noisy » shop floor area*) ; surface de travail non plane / non rigide. |
| **Machine** | **Détérioration du tampon encreur** ; **surface d'encrage non plate, non rigide** ; **pas de localisation précise de la date** ; le tampon s'use (*stamp becomes worn*). |
| **Main d'œuvre** | **Manque de soin de l'opérateur** ; **manque de moyen de nettoyage** ; **pas d'emplacement de rangement** ; conscience / awareness opérateur. |

**Priorisation par Pareto (sur ce même cas).** L'analyse statistique du cas montre **≈ 288 problèmes (issues)**, soit **≈ 7 issues par MSN**, répartis ainsi :
- **A — Cartes manquantes dans le pack : 44 %** des problèmes,
- **B — Tampons manquants ou illisibles : 33 %**,
- **C — Données manquantes : 13 %**.
- Autres : D (fin dupliqué/illisible), E (n° de série dupliqué/en conflit), F (n° de pièce manquant), G (description manquante), H/I (autres).

➡️ **Les 3 premières causes (A + B + C) représentent ≈ 90 % des problèmes.** C'est la **loi de Pareto (80/20)** : on concentre l'effort sur le vital few.

### 5. Confirmer les causes, puis remonter aux racines avec les 5 Pourquoi

**Confirmer les causes réelles.** Le diagramme d'Ishikawa produit des causes **suggérées** ; il faut les **vérifier sur le terrain**. La source propose un tableau de confirmation : **N° · Quoi · Resp. (responsable) · Quand · Statut**. Trois actions :
1. **Affecter la responsabilité** de la confirmation d'une cause suggérée.
2. **Convenir du timing** pour réaliser ces vérifications.
3. **Confirmer les causes réelles.**

**Pourquoi aller plus loin que les causes apparentes ?** Les efforts de résolution permettent souvent d'identifier les problèmes, de déterminer des causes et de définir des solutions. **Néanmoins, si la cause racine n'est pas déterminée, le problème se reproduira.** Les **5 Pourquoi (5P)** sont une approche structurée, applicable à toutes les opérations, pour faciliter l'identification de la **vraie cause racine**.

**Principe : la Réponse est le point de départ de la Question suivante.** On demande « Pourquoi ? » de façon répétée (≈ 5 fois) jusqu'à atteindre une cause sur laquelle on peut agir.

**Exemple de 5P (cas « tampon illisible »).** Le problème se scinde en deux branches :

*Branche 1 — « trop d'encre sur le tampon »*
- **Q : Pourquoi les tampons sont-ils illisibles ?** R : Trop d'encre sur le tampon.
- **Q : Pourquoi y a-t-il trop d'encre sur le tampon ?** R : Trop de pression sur l'encreur.
- **Q : Pourquoi applique-t-on trop de pression sur l'encreur ?** R : Il n'existe **aucun mécanisme de contrôle**.
- **Q : Pourquoi n'y a-t-il pas de mécanisme de contrôle ?** R : Opération **manuelle non standard** impliquant deux éléments.
- **Q : Pourquoi est-ce une opération manuelle non standard à deux éléments ?** R : **Les encreurs sont séparés des tampons.** *(cause racine)*

*Branche 2 — « manque de clarté du tampon »*
- **Q : Pourquoi le tampon manque-t-il de clarté ?** R : Le **caoutchouc du tampon est endommagé**.
- **Q : Pourquoi le caoutchouc est-il endommagé ?** R : Les tampons sont **stockés dans des conditions inadéquates**.
- **Q : Pourquoi sont-ils stockés dans des conditions inadéquates ?** R : **Pas de support de rangement disponible**.
- **Q : Pourquoi n'y a-t-il pas de support de rangement ?** R : **Aucun support de rangement n'est fourni.** *(cause racine)*

**Vérification de la cohérence (lecture remontante « Et donc, par conséquent… »).** Une chaîne de 5 Pourquoi se valide en la relisant de la racine vers l'effet :
> Les encreurs sont séparés des tampons + il n'y a pas de support de rangement fourni → **et donc** c'est une opération manuelle non standard / il n'y a pas de support disponible → **et donc** aucun mécanisme de contrôle + tampons mal stockés → **et donc** trop de pression sur l'encreur + caoutchouc endommagé → **et donc** trop d'encre sur le tampon → **et donc** le tampon manque de clarté → **et donc** le tampon est illisible.

Si chaque « et donc » s'enchaîne logiquement, la chaîne causale tient.

> 🖼️ *Schéma source non transcriptible : « Représentation d'un 5 Pourquoi » (arbre des Q/R des deux branches) dans « 11. Résolution de Pb Méthode PDCA.pdf ».*

**Et après les causes : trouver et choisir les solutions.** Une fois les causes racines supprimées :
- Utiliser le **brainstorming** pour produire des idées et les **classer par ordre d'importance** selon le thème choisi.
- **Définir les critères de choix** de la solution à retenir : **efficacité, retour sur investissement, délai et facilité de mise en œuvre, sécurité, respect des contraintes…**, puis **faire valider** la solution.

### 6. La méthode PDCA (Plan-Do-Check-Act) — la roue de Deming

La **roue de Deming** (*Deming's wheel*) est la transposition graphique de la méthode de gestion de la qualité **PDCA (Plan-Do-Check-Act)**. C'est **avant tout un état d'esprit**, mais aussi un **cadre méthodologique vertueux** utilisé pour la résolution de problèmes, **en associant des outils à chaque étape**. Le cycle PDCA sert à **transformer une idée en action, et l'action en connaissance** ; l'utiliser correctement **nécessite discipline et effort**.

Le PDCA repose sur **trois piliers** :
- **Un état d'esprit** (accueil positif des problèmes),
- **Une méthode** (démarche structurée),
- **Des outils** (QQOQCCP, Ishikawa, 5P, Pareto, SPC…),

le tout **fondamentalement orienté travail de groupe**.

**Pourquoi utiliser une méthode ?** Avec une méthode :
- on **suit une démarche structurée**,
- on **aborde tous les points**,
- on **exploite au maximum les capacités d'un groupe**,
- on **simplifie le traitement du problème** et on **trouve rapidement des solutions** et des actions de progrès.

**Les 4 phases du cycle :**

| Phase | Nom (source) | Finalité |
|---|---|---|
| **P — Plan** | Planifier | Clarifier le problème, fixer les objectifs, bâtir le plan d'action et les indicateurs. |
| **D — Do** | Dérouler | Réaliser les actions préliminaires, informer/former, exécuter sur une période probatoire. |
| **C — Check** | Vérifier | Vérifier les résultats, identifier les écarts, analyser les causes racines, manager les écarts. |
| **A — Act** | Acter | Prévenir la récurrence, standardiser, capitaliser (REX) et déployer. |

### 7. Les 12 étapes de la résolution de problèmes (PDCA détaillé)

Le PDCA se décline en **12 étapes** réparties sur les 4 phases.

| Phase | # | Étape |
|---|---|---|
| **Plan** | 1 | **Clarifier le problème** et les objectifs |
| **Plan** | 2 | **Définir le plan d'action** |
| **Plan** | 3 | **Définir les KPIs, points de contrôle et jalons** |
| **Do** | 4 | **Mettre en œuvre les actions préliminaires** |
| **Do** | 5 | **Formation et information** |
| **Do** | 6 | **Exécuter et mettre en œuvre** |
| **Check** | 7 | **Vérifier les résultats** |
| **Check** | 8 | **Identifier les écarts et analyser les causes racines** |
| **Check** | 9 | **Manager les écarts** |
| **Act** | 10 | **Prévenir la récurrence** |
| **Act** | 11 | **Standardiser** |
| **Act** | 12 | **Déployer** |

#### P — Planifier (étapes 1 à 3)

**1 & 2 — Clarifier le problème & les objectifs, puis définir le plan d'action :**
- **Définir le problème et ses impacts.**
- Si besoin, **décomposer le problème (QQOQCCP)** sur la base de **faits**.
- **Trouver la cause racine** (Ishikawa, 5 Pourquoi).
- **Définir les objectifs** en lien avec les **attentes clients**.
- Pour le plan : *Quel est le meilleur moyen d'atteindre les objectifs ? De quelles ressources a-t-on besoin ?*

**Choisir le problème — matrice de priorisation.** On positionne chaque problème selon **l'impact** (axe horizontal : ++ / + / 0) et la **facilité de résolution** (axe vertical : Facile / Moyen / Difficile), et on note les cases pour prioriser (les cases « Facile × fort impact » sont prioritaires).

> 🖼️ *Schéma source non transcriptible : la grille de priorisation Impact × Facilité (cases numérotées 1 à 9) figure dans « 12. Methode PDCA.pdf ».*

**3 — Définir les indicateurs : jalons et points de vérification.**
- *Quels indicateurs traduiront une amélioration de la situation ?*
- *Quels indicateurs mettront le plan d'action sous contrôle ?*

**PARLER AVEC DES DONNÉES.** La résolution de problèmes se base sur des **FAITS et non sur des suppositions**. Outils cités :
- **Fiches de batonnage** : système simple à **5 barres** (« ▍▍▍▍╱ ») pour noter le nombre par type de défaut.
- **Analyse de Pareto** : priorisation des préoccupations / % du nombre total de problèmes.
- **SPC (Statistical Process Control)** : suivi de la **tendance** par rapport aux **limites supérieure (UCL)** et **inférieure (LCL)**.

#### D — Dérouler (étapes 4 à 6)

- **Réaliser les actions préliminaires** nécessaires à la mise en œuvre de la solution retenue.
- **Information & formation :**
  - **Informer** : date de mise en application, objectifs, le nouveau processus.
  - **Former** au nouveau processus et à la tenue des indicateurs.
  - Étudier les **mesures correctives** et évaluer leurs effets : *S'agit-il de mesures palliatives ponctuelles ? Empêcheront-elles la réapparition du problème ? Modifient-elles la façon de travailler ?*
  - **Définir les ressources et confirmer le délai** ; estimer les **impacts globaux** (processus amont/aval, **QCD**, organisation…).
  - Établir la **liste des personnes à informer et à former**, le **planning**, et **valider** information et formation des personnes concernées.
- **Exécution :**
  - Vérifier que **l'ensemble des moyens** sont à disposition des acteurs.
  - **Réaliser le changement décidé, si possible à petite échelle**, et **réversible**.
  - **Appliquer le nouveau processus sur une période probatoire suffisamment longue.**
  - Lorsque **plusieurs changements** sont programmés : essayer le **changement n°1**, analyser les résultats et **revenir à la situation initiale** ; puis le **changement n°2**, analyser, revenir ; et ainsi de suite (pour isoler l'effet de chacun).

#### C — Vérifier (étapes 7 à 9)

- **Vérifier les résultats :**
  - **Indicateurs de processus** : Avez-vous des dérives ? Sont-ils assez précis pour **anticiper** une dérive ?
  - **Indicateurs de résultats** : La période est-elle **représentative** ? Y a-t-il de la **variabilité** ?
- **Identifier les écarts et analyser les causes racines :**
  - **Comparer** les indicateurs aux **objectifs** pour identifier les écarts avec l'attendu.
  - **Réagir promptement sur le Gemba** (le terrain) s'il existe un **risque additionnel pour le client**.
  - **Rechercher sur le Gemba les causes racines** de ces écarts.
- **Manager les écarts.**

**La maîtrise de la dispersion (le « C » du PDCA).** Les données sont **naturellement dispersées autour d'une moyenne** ; il faut en rechercher les causes pour **réduire la dispersion** et **stabiliser le processus**. Points essentiels :
- **Éliminer les écarts aux standards** (analyser **moyenne & écart type**).
- **Maintenir le processus stable.** Les causes de variation par rapport à la moyenne sont de **deux ordres** :
  - **Causes communes** : la **variation naturelle** du processus, due à la variation naturelle des **5M**.
  - **Causes assignables** : la variation due à un **écart au standard**.

#### A — Acter (étapes 10 à 12)

- **Prévention des récurrences (10)** : définir ce qui est nécessaire pour que le problème **ne se reproduise plus**.
- **Standardiser (11)** :
  - **Formaliser les standards** à appliquer (mode opératoire, **management visuel**, photos…).
  - **Former** les personnes à ces nouveaux standards et **s'assurer de la bonne application**.
  - **Formaliser une confirmation de processus sur le Gemba** pour vérifier la bonne compréhension et application.
  - Objectifs du standard : **ne pas répéter la même erreur**, **pérenniser les résultats**, **réduire la variabilité et prévenir la récurrence**.
  - **Mettre à jour** les documents et plans modifiés ; **rendre les standards accessibles** ; prévoir si besoin la **confirmation du processus** par **audit régulier du management direct**, avec **affichage** des contrôles réalisés et des actions correctives.
- **Réflexion & déploiement (12)** :
  - *Qu'avons-nous appris ? Aurions-nous oublié quelque chose ?*
  - **Formaliser le Retour d'Expériences (REX)** et la **Leçon Apprise** ; décider **comment communiquer** dessus.
  - Chercher s'il existe des **processus similaires** susceptibles d'avoir le même problème.
  - **Manager le déploiement** (à qui, de quelle manière) et **généraliser** : les connaissances acquises pourront orienter d'autres études.
  - **Rendre compte de façon formalisée** (rapports **A3**) des résultats, points forts et points faibles.
  - **Lister les problèmes restants** et **planifier de nouveaux PDCA** pour les résoudre — la roue tourne à nouveau.

### 8. Comment les trois outils s'enchaînent

```
  ┌──────────────┐   ┌───────────────────┐   ┌────────────────────┐
  │   QQOQCCP    │ → │ ISHIKAWA (5M)     │ → │   5 POURQUOI       │
  │ Établir les  │   │ Lister/organiser  │   │ Remonter à la      │
  │ FAITS        │   │ les causes        │   │ cause RACINE       │
  └──────────────┘   └───────────────────┘   └────────────────────┘
          └───────────────  cadrés dans le cycle  ───────────────┘
                              ▼
              ┌─────────────────────────────────────┐
              │  PDCA — Plan / Do / Check / Act      │
              │  (12 étapes, du cadrage au déploiement)
              └─────────────────────────────────────┘
```

Dans le **PDCA**, QQOQCCP, Ishikawa et 5 Pourquoi sont les **outils de la phase Plan** (étape 1, « Clarifier le problème »). Pareto, batonnage et SPC outillent la **mesure** et le **Check**. Le standard et le REX outillent l'**Act**.

## 🧰 Outils & modèles associés

| Outil / modèle | À quoi ça sert | Source |
|---|---|---|
| **Fiche QQOQCCP** (formulaire) | Cadrer un problème par les faits (Qui/Quoi/Où/Quand/Comment/Combien/Pourquoi) — gabarit à imprimer | [Ouvrir](https://drive.google.com/file/d/1HWbbQQAf6R3DvDzSNPQwmqmumJ5PQvRc/view) |
| **Formulaire Diagramme d'Ishikawa** | Squelette d'arête de poisson (5M) à remplir en atelier — cartouche Pilote/Animateur + Date | [Ouvrir](https://drive.google.com/file/d/1tMNC8kc1xbxpkZahpUU1UUHRFabLlMTQ/view) |
| **Résolution de Pb — Méthode PDCA** (support) | QQOQCCP, Ishikawa (exemple « tampon »), 5 Pourquoi, choix de l'outil | [Ouvrir](https://drive.google.com/file/d/1w2bxVg3SykhVprDZC35GcZrtDpcgqq-8/view) |
| **Méthode PDCA** (support) | 12 étapes, détail P-D-C-A, matrice de priorisation, parler avec des données | [Ouvrir](https://drive.google.com/file/d/1Bk8O5k5qgwNcYDduEY9HXycQn3vCbzqI/view) |
| **PDCA — Fiche Outil** | Définition synthétique : roue de Deming, état d'esprit / méthode / outils, travail de groupe | [Ouvrir](https://drive.google.com/file/d/170NTmP74oaBL_BvyrW2LBO5Pw77SSCH0/view) |

## ✅ Application directe — « À faire maintenant »
> Objectif : appliquer immédiatement, sur votre propre terrain, ce que vous venez d'apprendre.

**Exercice 1 — Passer un problème réel au QQOQCCP + Ishikawa, puis cadrer un PDCA**

Choisissez **un problème réel et récurrent** de votre périmètre (un défaut, un retard, une réclamation, une rupture…).

1. **Formulez le problème comme un écart** : situation actuelle vs situation idéale (1 phrase).
2. **Remplissez une fiche QQOQCCP** (utilisez le gabarit Drive) : répondez aux 7 questions **par des faits**. Pour le « Combien ? », mettez **un chiffre** (%, nombre, fréquence). Pour le « Pourquoi ? », donnez **l'enjeu** (conséquence si on ne fait rien).
3. **Construisez une arête d'Ishikawa (5M)** (gabarit Drive) : pour **chaque M** (Méthode, Matière, Milieu, Machine, Main d'œuvre), notez **au moins 2 causes possibles**. Inscrivez le problème dans la case « effet ».
4. **Ciblez la cause la plus probable** et déroulez **5 Pourquoi** dessus jusqu'à une cause racine **actionnable** ; vérifiez la chaîne en la relisant « … et donc, par conséquent … ».
5. **Cadrez le PDCA** sur une demi-page : pour **Plan / Do / Check / Act**, écrivez 1 à 2 actions concrètes. Dans **Plan**, fixez **un objectif chiffré** et **un indicateur** (KPI). Dans **Check**, dites **comment** vous mesurerez l'écart.

- **Livrable attendu :** une **fiche QQOQCCP renseignée** + une **arête d'Ishikawa remplie** (5M) avec une **branche 5 Pourquoi** menant à une cause racine, + un **cadrage PDCA** d'une demi-page (≥ 1 action et 1 indicateur par phase).
- **Critères de réussite :**
  - Les 7 cases du QQOQCCP sont remplies par des **faits** (pas d'opinion) et le « Combien ? » est **chiffré**.
  - Chaque M de l'Ishikawa porte **≥ 2 causes** ; aucune branche n'est vide.
  - Les **5 Pourquoi** aboutissent à une cause **sur laquelle vous pouvez agir**, et la chaîne « et donc » est cohérente.
  - Le PDCA contient **un objectif chiffré**, **un indicateur** et un **moyen de vérification** dans Check.
- **Temps conseillé :** 30 min.

**Exercice 2 — Trier vos problèmes par la matrice de priorisation (optionnel, +10 min)**

1. Listez **5 problèmes** de votre service.
2. Positionnez chacun selon **Impact** (++ / + / 0) et **Facilité de résolution** (Facile / Moyen / Difficile).
3. Désignez le **Just-do-it** (solution connue), les candidats **PDCA** (quotidiens) et ceux à escalader en **QQOQCCP-5P / A3-8D / DMAIC**.

- **Livrable attendu :** une grille Impact × Facilité avec vos 5 problèmes positionnés et l'outil retenu pour chacun.
- **Critères de réussite :** au moins un problème classé « Facile × fort impact » est désigné comme **chantier prioritaire**.
- **Temps conseillé :** 10 min.

## 🧠 À retenir
- **Un problème = un écart** entre la situation actuelle et la situation idéale. **« Un problème bien posé est déjà à moitié résolu. »**
- **Tout nouveau problème est une opportunité ; un problème récurrent est un échec de gestion** (la cause racine n'a pas été traitée).
- **QQOQCCP = établir les faits** (7 questions). Le **« Pourquoi ? »** du QQOQCCP, c'est **l'enjeu** ; les **5 Pourquoi**, c'est la **cause racine**.
- **Ishikawa = lister/organiser les causes par les 5M** (Méthode, Matière, Milieu, Machine, Main d'œuvre), puis **confirmer les causes réelles** sur le terrain.
- **Sans cause racine traitée, le problème revient** : enchaînez Ishikawa → **5 Pourquoi** → solution.
- **Parler avec des données** (batonnage, **Pareto 80/20**, **SPC** entre UCL/LCL) — jamais sur des suppositions.
- **PDCA = Plan-Do-Check-Act** (roue de Deming), **12 étapes**, état d'esprit + méthode + outils, en **travail de groupe**.
- **On adapte l'outil à la complexité** : Just-do-it → PDCA → QQOQCCP-5P → A3/8D → DMAIC.
- **Act = standardiser + prévenir la récurrence + capitaliser (REX, A3) + déployer** : on fige le gain, puis la roue retourne.

## 📝 Quiz de validation
1. Dans le QQOQCCP, à quoi sert la question **« Combien ? »** ?
   - a) À identifier toutes les personnes concernées
   - b) À quantifier l'ampleur du problème (%, nombre, unité)
   - c) À trouver la cause racine
   - d) À fixer la date de mise en application

2. Quelles sont les **5M** du diagramme d'Ishikawa ?
   - a) Méthode, Matière, Milieu, Machine, Main d'œuvre
   - b) Mesure, Marché, Marge, Management, Méthode
   - c) Moyen, Money, Matière, Milieu, Manager
   - d) Matière, Machine, Mission, Milieu, Méthode

3. Pourquoi enchaîne-t-on Ishikawa avec les **5 Pourquoi** ?
   - a) Pour faire plus de réunions
   - b) Parce que si la cause racine n'est pas déterminée, le problème se reproduira
   - c) Pour remplacer le QQOQCCP
   - d) Parce que l'Ishikawa est interdit en Lean

4. Que signifie **PDCA** ?
   - a) Plan – Do – Check – Act
   - b) Prepare – Deploy – Control – Audit
   - c) Plan – Détecter – Corriger – Auditer
   - d) Produire – Distribuer – Contrôler – Améliorer

5. Dans la phase **Act**, que fait-on en priorité pour éviter que le problème revienne ?
   - a) On lance un nouveau brainstorming
   - b) On standardise et on prévient la récurrence (puis REX / déploiement)
   - c) On revient à la situation initiale
   - d) On supprime les indicateurs

6. « Parler avec des données » signifie que la résolution de problèmes se base sur… ?
   - a) L'intuition du chef
   - b) Des suppositions de l'équipe
   - c) Des faits (batonnage, Pareto, SPC)
   - d) L'ancienneté des opérateurs

<details>
<summary>👉 Voir les réponses</summary>

1. **b** — Le « Combien ? » quantifie le problème (pourcentage, nombre, unité de mesure).
2. **a** — Méthode, Matière, Milieu, Machine, Main d'œuvre (les arêtes du poisson). Le formulaire source nomme la branche Machine « Moyen » et Main d'œuvre « M.O. ».
3. **b** — « Si la cause racine n'est pas déterminée, le problème se reproduira » : les 5 Pourquoi remontent à la vraie racine.
4. **a** — Plan (Planifier) – Do (Dérouler) – Check (Vérifier) – Act (Acter), la roue de Deming.
5. **b** — Act = prévenir la récurrence, standardiser, puis capitaliser (REX, A3) et déployer.
6. **c** — La résolution se base sur des FAITS et non sur des suppositions : fiches de batonnage, analyse de Pareto, SPC.
</details>

## 🔗 Sources & pour aller plus loin
- 📄 **11.QQOQCCP.pdf** — [Ouvrir dans Drive](https://drive.google.com/file/d/1HWbbQQAf6R3DvDzSNPQwmqmumJ5PQvRc/view) *(formulaire / gabarit, texte limité aux libellés des champs)*
- 📄 **11. Formulaire Diagramme Ishikawa.pdf** — [Ouvrir dans Drive](https://drive.google.com/file/d/1tMNC8kc1xbxpkZahpUU1UUHRFabLlMTQ/view) *(squelette d'arête de poisson 5M à imprimer)*
- 📄 **11. Résolution de Pb Méthode PDCA.pdf** — [Ouvrir dans Drive](https://drive.google.com/file/d/1w2bxVg3SykhVprDZC35GcZrtDpcgqq-8/view)
- 📄 **12. Methode PDCA.pdf** — [Ouvrir dans Drive](https://drive.google.com/file/d/1Bk8O5k5qgwNcYDduEY9HXycQn3vCbzqI/view)
- 📄 **12. PDCA Fiche Outil.pdf** — [Ouvrir dans Drive](https://drive.google.com/file/d/170NTmP74oaBL_BvyrW2LBO5Pw77SSCH0/view) *(fiche outil synthétique)*

---
*Contenu pédagogique d'après les supports Progress Partners — « La passion de la performance ».
Réorganisé en module de formation autoportant.*
