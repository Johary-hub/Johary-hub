# Module 1 — Lean, 6 Sigma & Lean Six Sigma

> **Parcours Lean Six Sigma — Yellow Belt (SSYB)** · Séquence 1
> ⏱️ Durée estimée : 45 min · 🎓 Niveau : Yellow Belt

## 🎯 Objectifs du module
À la fin de ce module, vous serez capable de :
- **Distinguer** le **Lean** (vitesse, flux, élimination des gaspillages) du **6 Sigma** (qualité, réduction de la variabilité) et expliquer ce que chacun apporte.
- **Expliquer** pourquoi et comment les deux approches se **combinent** en **Lean Six Sigma** pour « faire vite » *et* « faire bien ».
- **Lire** les **niveaux sigma** et leur traduction en **DPMO** (défauts par million d'opportunités) et en pourcentage de bon.
- **Utiliser** la **loi de Little** pour raisonner sur le délai d'exécution d'un processus.
- **Interpréter** la **loi normale** et sa table pour situer la performance d'un processus.
- **Décrire** la logique de l'amélioration continue (**Kaizen**) et la démarche structurée **DMAIC**.

## 🧭 Prérequis
- Module 0 — Démarrage & cahier du stagiaire (avoir choisi son **terrain d'application**).
- Aucune notion statistique préalable n'est exigée.

## 📚 Contenu

### 1. Le contexte : un monde qui change
L'entreprise fait face à de **nouveaux défis** qui rendent l'amélioration permanente indispensable :
- **Exigences clients élevées** sur le triptyque **Q.C.D.** (Qualité, Coût, Délai) ;
- **Compétition mondiale** ;
- **Diversité des références** (gammes produits de plus en plus larges) ;
- **Cycles de vie des produits courts** ;
- **Révolutions technologiques** ;
- **Respect de l'environnement**.

Pour relever ces défis, deux démarches complémentaires se sont imposées : le **Lean** et le **6 Sigma**.

---

### 2. Qu'est-ce que le Lean ?

#### 2.1 Définition « en quelques mots »
> **LEAN — Tendre vers le Zéro Muda.**
> Chacune des étapes de la chaîne de valeur est réalisée de façon **rapide**, **efficiente**, avec un effort sur le **zéro Muda** (zéro gaspillage).

Le **Lean** est une démarche d'**amélioration de la performance des processus par l'élimination de la non-valeur ajoutée** (les **Muda**) et par l'**amélioration continue**.

#### 2.2 Un peu d'histoire
Le Lean n'est pas né du jour au lendemain : c'est l'aboutissement d'un siècle d'évolution industrielle.

| Année | Jalon |
|---|---|
| À l'origine | L'**industrie textile** |
| **1927** | Henry **Ford** révolutionne l'industrie automobile grâce aux premières techniques de **production de masse** |
| **1936** | **Toyota** commence à produire des véhicules motorisés ; contraint d'adopter le **Juste à Temps (JIT)** pour l'approvisionnement des composants en **1946**, dans un souci de rentabilité |
| **1950** | L'ingénieur de production **Taiichi Ohno** commence à développer les techniques de production Toyota → naissance du **Toyota Production System (TPS)** |
| **1973** | **Choc pétrolier** → émergence de la notion de **gaspillage** |
| **Années 1980** | Début des **études** sur le TPS dans le monde occidental |
| **Années 1990** | Adoption du concept **« Lean Manufacturing »** |

**Quelques noms clés** (frise historique) : Eli **Whitney** (1800) · Frederick **Taylor** · Frank & Lillian **Gilbreth** · Henry **Ford** (1900-1910) · Sakichi **Toyoda** · W. E. **Deming** (1930) · Taiichi **Ohno** (1950) · Shigeo **Shingo** · Masaaki **Imai** (1970-1985) · James **Womack** & Dan **Jones** (1990).

#### 2.3 Les enjeux du Lean
> Une **entreprise Lean** est une entreprise **svelte et agile**, qui sait, par l'implication de ses équipes et par une démarche de changements structurée, relever tous ces nouveaux défis.

| Enjeu | Description | Moyen |
|---|---|---|
| **Enjeu humain** | Positionner l'**Homme au cœur de l'entreprise** | Mise en place d'un système, d'un mode de management et d'outils visant l'**implication de tous** dans la démarche |
| **Enjeu économique** | Assurer une **croissance durable** par l'amélioration globale des performances | Démonstration, structuration et **déploiement global** de la démarche d'amélioration continue |

#### 2.4 Les défis du Lean : changer les processus
Le Lean consiste à **changer les processus**. Deux exigences fondamentales :
- **Savoir exactement ce que le client apprécie** et **ce pour quoi il paiera** ;
- **Trouver la manière la meilleure, la plus sûre et la plus facile** de fournir cette valeur.

Le tout dans un environnement où les besoins **évoluent** et où la **réaction des clients** doit être anticipée.

#### 2.5 Chaîne (ou flux) de valeur : la cible
On distingue dans tout processus :
- la **Valeur Ajoutée (VA)** — ce pour quoi le client paie ;
- la **Non-Valeur Ajoutée (NVA)** — attentes, déplacements, stocks… que le client ne valorise pas.

Le **Lead Time** (temps de traversée / temps d'écoulement) est le temps total du processus. **Objectif Lean : réduire radicalement la NVA** pour rapprocher le Lead Time de la seule durée à valeur ajoutée.

> **Schéma source — « Chaîne ou Flux de Valeurs ».** Un processus « Avant… » avec de longues plages d'**attente / NVA** entrecoupées de courts segments de **VA** ; le **processus amélioré (cible)** comprime la NVA pour réduire le Lead Time. *(Voir la fiche outil et le PDF source.)*

#### 2.6 « Faire mieux avec l'existant »
Le Lean, **c'est quoi ?** Faire un **meilleur usage des ressources existantes** pour rendre le travail :
- **plus productif**,
- **moins fatigant**,
- **plus efficace**,
- **plus sûr**.

Et cela **en optimisant d'abord ce que l'on a** :
- **seulement avec le temps à disposition** ;
- **seulement avec le personnel en place** ;
- **seulement avec le budget prévu**.

#### 2.7 L'amélioration… en permanence
La dynamique Lean se déroule **dans le temps**, par étapes :
1. **Analyse de l'existant** ;
2. **Vision** (où veut-on aller) ;
3. **Améliorations**, déclinées en trois leviers :
   - **3-A Standardisation**,
   - **3-B Amélioration continue**,
   - **3-C Innovation**.

#### 2.8 Kaizen = Amélioration continue
> **KAI** = Changer · **ZEN** = Bien (vers le mieux)
> **KAIZEN** = **Changer continuellement pour le meilleur, dans l'action et dans la sérénité** = **Amélioration Continue**.

**Kaizen et Lean — processus vs résultat :** le **Kaizen** est le **processus** (la démarche au quotidien) ; le **Lean** en est le **résultat**.
> « Quand on démarre une approche Kaizen, il faut bien comprendre que c'est un **processus** et non un **projet** que l'on démarre. » — *Frederick Portal, Delphi Automotive Systems.*

#### 2.9 L'organisation Lean
L'organisation Lean est tournée vers la **satisfaction totale du client (Q.C.D.)**. Elle s'articule autour :
- des **besoins du client (Q.C.D.)** en entrée ;
- d'une **ligne de valeur ajoutée** ;
- du **GEMBA** (le terrain, le lieu réel où se crée la valeur), animé par trois rôles : **Animation**, **Aide**, et la recherche de la **satisfaction totale du client** ;
- des **fondements du Lean : 3 Principes et 7 Concepts** (détaillés dans les modules suivants).

#### 2.10 Gains / Coûts
- **Gains :** moins de stock, délais plus courts, moins de rebuts, plus de place, plus de sécurité, plus de confort…
- **Coûts :** le **seul véritable investissement** lié à cette démarche est **le temps qu'il faut y consacrer**.

#### 2.11 Une référence : la Maison TPS
Le **Toyota Production System** est souvent représenté comme une **maison** dont le toit est l'objectif et les piliers les moyens :
- **Toit / objectif :** **réduction des coûts par l'élimination radicale des MUDA** ;
- **Pilier 1 — Juste à Temps** (produire ce qu'il faut, quand il faut) ;
- **Pilier 2 — Jidoka / Auto-Activation** (qualité intégrée, arrêt automatique en cas de défaut) ;
- **Fondations :** **fluidification de la production**, **lissage de la demande**, **perception des besoins** et détermination des données d'entrée.

> **Schéma source — « Maison TPS ».** Représentation en maison (toit = réduction des coûts par élimination des MUDA ; piliers JIT et Jidoka ; base = lissage/fluidification). *(Voir le PDF source.)*

#### 2.12 L'état d'esprit Lean (les 10 principes)
1. **Abandonner les idées fixes**, refuser l'état actuel des choses.
2. Au lieu d'expliquer ce que l'on **ne peut pas** faire, réfléchir **comment** faire.
3. **Réaliser aussitôt** les bonnes propositions d'amélioration.
4. **Ne pas chercher la perfection : réaliser 60 % dès maintenant.**
5. **Corriger l'erreur immédiatement.**
6. **Trouver les idées dans la difficulté.**
7. **Chercher la cause réelle**, respecter les **« 5 pourquoi ? »**, et chercher **ensuite** la solution.
8. Prendre en compte les idées de **10 personnes** au lieu d'attendre l'idée géniale d'une seule.
9. **Essayer, puis valider.**
10. **L'amélioration est infinie.**

---

### 3. Qu'est-ce que le 6 Sigma ?

#### 3.1 Définition « en quelques mots »
> **6 SIGMA — Tendre vers le Zéro défaut, Zéro erreur.**
> **Amélioration des processus par la réduction de la variabilité, des défauts et des erreurs, orientée vers la satisfaction totale client.**

#### 3.2 Les idées fondatrices
- **Sigma « σ »** est la **lettre grecque** utilisée pour désigner la **variation** (la dispersion des données).
- Un **niveau de sigma** est une **mesure de la qualité**.
- Un processus évalué **6 sigma** ne produit **pratiquement pas de défauts**.
- **6 Sigma est une méthode de résolution de problème** :
  - **orientée client** ;
  - qui utilise la méthode **« DMAIC »** ;
  - qui **s'appuie sur des tests statistiques** pour prendre des décisions.

#### 3.3 Une mesure 6 Sigma de la qualité : 3,4 DPMO
> **Un processus 6 Sigma ne produit que 3,4 ppm (DPMO) !**
> *(ppm = parties par million ; DPMO = Défauts Par Million d'Opportunités.)*

Pour situer ce qu'un **niveau de sigma** représente, voici des activités de la vie courante positionnées sur l'échelle 1σ → 7σ (du plus défaillant au plus fiable) :

| Plus défaillant ◄───────────────────────► Plus fiable |
|---|
| **Avis d'imposition aux USA** (bas niveau de sigma) → **Ordonnances médicales** → **Factures de restaurant** → **Processus de paye** → **Gestion des bagages** → **Sécurité aérienne** (très haut niveau de sigma) |

> **Schéma source — « PPM vs Niveau de sigma ».** Courbe décroissante : l'axe vertical va de **1 000 000** à **1** PPM (échelle logarithmique : 1 000 000 / 100 000 / 10 000 / 1 000 / 100 / 10 / 1) ; l'axe horizontal de **1σ à 7σ**. Plus le niveau de sigma augmente, plus les PPM (défauts) chutent.

#### 3.4 Parfois, 99 % ne suffit pas !
La performance des processus doit être **plus élevée qu'on ne l'imagine généralement**. Comparaison entre **3,8 Sigma (99 %)** et **6 Sigma (99,9997 %)** :

| Activité | Défauts @ 99 % (3,8 Sigma) | Défauts @ 99,9997 % (6 Sigma) |
|---|---|---|
| **Distribution du courrier** | 20 000 courriers perdus par heure | 7 courriers perdus par heure |
| **Distribution d'eau potable** | Eau non potable **15 minutes par jour** | Eau non potable **2 minutes par an** |
| **Interventions médicales** | 5 000 procédures incorrectes par semaine | 2 procédures incorrectes par semaine |

#### 3.5 Le 6 Sigma, c'est…
- Un **moyen de diminuer la variabilité** et d'**améliorer les processus** ;
- **Orienté client** ;
- Au service de la **Qualité** des **Services & Produits** ;
- Une **méthode systématique** ;
- **Piloté par des données**.

#### 3.6 Une boîte à outils qui complète le Lean
La **boîte à outils Lean** (ex. **5 pourquoi**, **Ishikawa**…) est **étendue** par les **outils du 6 Sigma**, plus élaborés. L'efficacité est ainsi **plus grande pour résoudre des problèmes plus complexes**.

> **Schéma source — « Complexité des problèmes ».** Un escalier de complexité croissante : à la base les outils Lean simples (**5 pourquoi**, **Ishikawa**), puis les **outils LSS plus élaborés** pour les problèmes complexes.

#### 3.7 6 Sigma orienté client : parler avec des données
> « **Sans donnée, vous n'êtes qu'une personne avec une opinion.** »
> La clé pour atteindre la satisfaction client est de **parler avec des données**.

Quatre questions structurantes :
- **Qui est le client ?**
- Quelle est la **« Voice of the Customer »** (VOC) ?
- Quels sont les **« Critical to Quality »** (CTQ) ?
- Les projets sont **amorcés** par la satisfaction client et **mesurés** par cette même satisfaction client !

#### 3.8 6 Sigma méthodique : un langage commun d'amélioration
Suivre une **approche structurée** **lie les outils entre eux** et **renforce la puissance de chacun**. Le 6 Sigma s'inscrit dans la même famille que d'autres démarches structurées :

**La démarche 8D (8 étapes) :**
1. Former une équipe ;
2. Décrire le problème ;
3. Mettre en place les **actions conservatoires** ;
4. Identifier les **causes racines** ;
5. Choisir et appliquer les **actions correctives** ;
6. Évaluer les résultats ;
7. Empêcher la **récurrence** ;
8. Féliciter l'équipe.

**Correspondance entre les démarches d'amélioration :**

| PDCA (4 phases) | « 4 Steps » | **6 Sigma — DMAIC** |
|---|---|---|
| **Plan** (Planifier) | Comprendre le problème | **Define** (Définir) |
| **Do** (Faire) | Décrire la situation actuelle | **Measure** (Mesurer) |
| **Check** (Vérifier) | Fixer les attentes | **Analyze** (Analyser) |
| **Act** (Rendre durable) | Assurer le suivi | **Improve** (Améliorer) + **Control** (Maîtriser) |

#### 3.9 6 Sigma, une structure : les outils par phase DMAIC
À chaque phase du **DMAIC** correspondent des livrables et des outils :

| Phase | Livrables / outils |
|---|---|
| **Define** (Définir) | Équipe · Charte de projet · « Qui est le client ? » · Identifier les **CTQ** |
| **Measure** (Mesurer) | **Process Map** · Analyse des **systèmes de mesure** (MSA) · Études de **capabilité** · **Cartes de contrôle** |
| **Analyze** (Analyser) | **Matrice Cause-Effets** · **VMEA** (analyse de mode de défaillance) · Tests sur une variable · **Plans d'expérience** |
| **Improve** (Améliorer) | **Améliorations process** · Preuve de la performance · **Capabilité améliorée** |
| **Control** (Maîtriser) | **Control Plan** du process · **Anti-erreurs** (Poka-Yoke) · **Audits** · **Standards** |

#### 3.10 6 Sigma, une approche : la responsabilité du système
> « Un problème est généré dans **85 % des cas par l'organisation des processus**, et seulement dans **15 % des cas par les collaborateurs**. » — *W. Edwards Deming.*

> « Les collaborateurs travaillent **dans** une organisation ; le rôle d'un manager est de travailler **sur** l'organisation, de l'améliorer **avec l'aide** des collaborateurs. » — *Myron Tribus.*

#### 3.11 6 Sigma piloté par les données : réduire la variabilité
Le cœur du 6 Sigma : **réduire la variabilité**.
- **Grande variabilité** → **mauvais process**, beaucoup de **rejets** ;
- **Faible variabilité** → **bon process**, **pas de rejet**.

> **Schéma source — « Variabilité et limites ».** Deux courbes en cloche centrées sur la même **moyenne (Average)**, entre une **limite basse (Lower Limit)** et une **limite haute (Upper Limit)**. La courbe **large** (faible niveau de sigma) déborde des limites → **défauts** ; la courbe **étroite** (haut niveau de sigma) tient à l'intérieur → pas de défaut. **« 6 Sigma conduit à l'amélioration par la réduction de la variabilité. »**

#### 3.12 Le client ressent la variance, pas la moyenne
Point clé : **la variation impacte le client — le client ressent la variance, pas la moyenne.** Il faut donc **capturer la performance du point de vue client**.

**Exemple — délai de livraison.** Un processus a une **moyenne de 25 jours** et une **limite supérieure de spécification (USL) de 30 jours** :
- **Mesure basée sur la moyenne :** « 25 jours en moyenne, **nous sommes bons !** » ;
- **Mesure basée sur la variance :** une partie de la distribution **dépasse 30 jours** → **clients insatisfaits**, donc « **nous ne sommes pas assez bons !** ».

> **Deux façons de voir les données… deux conclusions différentes.** Regarder la moyenne seule masque les clients qui, dans la queue de distribution, subissent un délai > USL.

#### 3.13 Décider à partir des données (Professeur Tsuda)
**L'impact des réunions sans données :**
- Les décisions se prennent sur la base d'**impressions, d'opinions, de politique** ;
- Les gens **ne cherchent pas** à voir les problèmes, donc ils **nient** leur existence ;
- On ne fait **rien de très rationnel**.

**Les bénéfices des réunions avec des données** présentées et correctement analysées :
- Les décisions se prennent **sur base de données et d'analyse** ;
- Les **options et leur déploiement** sont envisagés ;
- Les gens **cherchent à résoudre** les problèmes au lieu de les **ignorer**.
*(Source : Professor Tsuda's Meeting Chart.)*

#### 3.14 Trois exemples « basés sur des données »

**a) Le directeur d'usine et la « médaille ».** On vous rapporte le **taux de rejets** d'un secteur ; vous lui donnez une **médaille** pour son record. Mais en regardant la **série complète** sur l'année, on constate **5 mois de croissance des rejets** → il faudrait plutôt **redemander la médaille**. *Leçon : une donnée isolée trompe ; il faut la tendance.*

| Mois | Taux de rejets | Mois | Taux de rejets |
|---|---|---|---|
| Jan-00 | 3,69 | Sep-00 | 2,66 |
| Feb-00 | 2,36 | Oct-00 | 4,13 |
| Mar-00 | 3,12 | Nov-00 | 2,35 |
| Apr-00 | 3,67 | Dec-00 | 2,80 |
| May-00 | 4,33 | Jan-01 | 2,97 |
| Jun-00 | 3,49 | Feb-01 | 3,65 |
| Jul-00 | 2,94 | Mar-01 | 3,71 |
| Aug-00 | 2,15 | | |

**b) Faut-il acheter la nouvelle machine ?** Un fournisseur propose une machine à **50 000 €** ; un gain de **2 secondes** de temps de cycle ferait gagner **100 000 €/an**. Échantillons de temps de cycle (5 mesures) :

| Ancienne | Nouvelle |
|---|---|
| 8,7 | 9,4 |
| 19,9 | 13,9 |
| 6,3 | 5,9 |
| 21,2 | 16,8 |
| 12,3 | 11,8 |
| **Moyenne 13,68** | **Moyenne 11,56** |

L'**ancienne** semble plus lente (13,68 vs 11,56). **Faut-il acheter ? NON !** Le **test t à 2 échantillons** donne une **valeur de p = 0,716** (≫ 0,05) : la différence **n'est pas statistiquement significative** ; au regard de la forte dispersion (écarts-types ≈ 6,64 et 4,17), l'écart de moyennes peut être dû au seul **hasard**. *Leçon : sans test statistique, on aurait dépensé 50 000 € à tort.*

**c) Quel facteur améliore la performance ?** Sur des données d'écurie de course, un **plan d'expérience** teste 3 facteurs sur la **vitesse de pointe (Top speed)** : **Fuel octane (A)**, **Tire brand (B)**, **Tire pressure (C)**. Le **diagramme de Pareto des effets normalisés** (α = 0,05, seuil ≈ 12,71) et le tableau des effets montrent que ce sont surtout les **interactions** qui pèsent — l'interaction **Tire brand × Tire pressure (BC)** ressort comme l'effet le plus fort (effet ≈ −2,75, valeur de p = 0,023, la seule sous 0,05). *Leçon : l'effet déterminant n'est pas toujours le facteur « évident », et peut être une interaction.*

> « **Essayer de maîtriser la variation sans la comprendre et la quantifier ne fait qu'ajouter une cause au problème !** »

#### 3.15 Domaines d'application du 6 Sigma
Selon le type de problème et de produit/processus, on mobilise des **familles d'outils** différentes (du Lean d'abord, puis les outils 6 Sigma élaborés). « **Maintenir le gain** » est l'objectif transversal à chaque étape :

| Situation | Familles d'outils |
|---|---|
| **Stabilisation & standardisation de la production** | **5S**, standards, travail d'équipe & implication, **élimination du Muda**, **TPM** |
| **Amélioration des processus (Kaizen / Lean)** | Pièce à pièce, **temps de takt**, **Kanban**, **Poka-Yoke**, **SMED** |
| **Produits & processus existants — problèmes durables & difficiles** | **Process Maps**, **cartes de contrôle (SPC)**, **capabilités** processus, **analyse multivariée**, **matrice Cause-Effet**, **VMEA**, **plans d'expérience**, **Control Plans** |
| **Nouveaux produits** | Outils d'ingénierie/conception élaborés pour faire **bon du 1ᵉʳ coup**, à temps et au bon coût : **DFSS**, **QFD**, **Concept Engineering**, **Plateaux Projets** |

#### 3.16 « Faire les choses mieux » = améliorations mesurables
> « **Faire les choses mieux** » veut dire être capable de **montrer des améliorations mesurables** pour les **clients**, les **employés** et les **actionnaires**.

Ces améliorations se traduisent par des **évolutions significatives** du **chiffre d'affaires**, des **charges**, des **temps de cycle**, des **stocks**, des **rebuts**, de la **sécurité**…

#### 3.17 6 Sigma — résumé
- **6 Sigma, c'est :** orienté **client** · **méthodique** · **basé sur des données** · un **moyen de s'améliorer** ;
- **6 Sigma est un kit d'outils supplémentaires** à la **boîte à outils Lean**.

---

### 4. La loi normale : l'outil statistique de fond

#### 4.1 Pourquoi la loi normale ?
La **loi normale** (courbe « en cloche » de Gauss) décrit la **dispersion** des données autour d'une **moyenne (μ)**. C'est le socle du 6 Sigma : un **niveau de sigma** mesure **combien d'écarts-types (σ)** séparent la moyenne des **limites de spécification**. Plus on en « loge » avant la limite, moins on produit de défauts.

#### 4.2 La règle empirique (répartition autour de μ)
Pour une loi normale, la répartition des données par tranche d'un écart-type est (valeurs de la fiche outil 6 Sigma) :
- entre **μ−1σ et μ+1σ** : **34,1 % + 34,1 % ≈ 68,2 %** des observations ;
- la tranche suivante (de 1σ à 2σ de chaque côté) : **13,6 %** de chaque côté ;
- la tranche de 2σ à 3σ : **2,1 %** de chaque côté ;
- au-delà de 3σ : **≈ 0,1 %** de chaque côté.

> **Schéma source — courbe de Gauss annotée.** Cloche symétrique centrée sur **μ**, graduée de **−3σ à +3σ**, avec les aires 0,1 % / 2,1 % / 13,6 % / 34,1 % / 34,1 % / 13,6 % / 2,1 % / 0,1 %.

#### 4.3 La loi normale centrée réduite et sa table
On **standardise** une valeur en variable centrée réduite afin d'utiliser une **table unique**. La table donne **F(x) = probabilité de trouver une valeur inférieure à x**, c'est-à-dire l'aire sous la courbe à gauche de x :

$$F(x) = \int_{-\infty}^{x} \frac{1}{\sqrt{2\pi}}\, e^{-\frac{u^{2}}{2}}\, du$$

**Lecture de la table** (extrait — la ligne donne le 1ᵉʳ décimal de x, la colonne le 2ᵉ) :

| x | 0,00 | 0,01 | 0,02 | 0,03 | 0,04 | 0,05 | 0,06 | 0,07 | 0,08 | 0,09 |
|---|---|---|---|---|---|---|---|---|---|---|
| **0,0** | 0,5000 | 0,5040 | 0,5080 | 0,5120 | 0,5160 | 0,5199 | 0,5239 | 0,5279 | 0,5319 | 0,5359 |
| **0,5** | 0,6915 | 0,6950 | 0,6985 | 0,7019 | 0,7054 | 0,7088 | 0,7123 | 0,7157 | 0,7190 | 0,7224 |
| **1,0** | 0,8413 | 0,8438 | 0,8461 | 0,8485 | 0,8508 | 0,8531 | 0,8554 | 0,8577 | 0,8599 | 0,8621 |
| **1,5** | 0,9332 | 0,9345 | 0,9357 | 0,9370 | 0,9382 | 0,9394 | 0,9406 | 0,9418 | 0,9429 | 0,9441 |
| **2,0** | 0,9772 | 0,9778 | 0,9783 | 0,9788 | 0,9793 | 0,9798 | 0,9803 | 0,9808 | 0,9812 | 0,9817 |
| **2,5** | 0,9938 | 0,9940 | 0,9941 | 0,9943 | 0,9945 | 0,9946 | 0,9948 | 0,9949 | 0,9951 | 0,9952 |
| **3,0** | 0,9987 | 0,9987 | 0,9987 | 0,9988 | 0,9988 | 0,9989 | 0,9989 | 0,9989 | 0,9990 | 0,9990 |
| **3,5** | 0,9998 | 0,9998 | 0,9998 | 0,9998 | 0,9998 | 0,9998 | 0,9998 | 0,9998 | 0,9998 | 0,9998 |

*Exemple de lecture : F(1,96) ≈ 0,975 → 97,5 % des valeurs sont inférieures à 1,96σ ; il reste 2,5 % dans la queue de droite.*

**Table pour les grandes valeurs de x** (utile pour comprendre les très hauts niveaux sigma) :

| x | 3 | 3,2 | 3,4 | 3,6 | 3,8 | 4 | 4,2 | 4,4 | 4,6 | 4,8 |
|---|---|---|---|---|---|---|---|---|---|---|
| **F(x)** | 0,99865003 | 0,99931280 | 0,99966302 | 0,99984085 | 0,99992763 | 0,99996831 | 0,99998665 | 0,99999458 | 0,99999789 | 0,99999921 |

> Table complète et formelle : voir le PDF source *2.Loi_normale.pdf* (source : http://odlv.free.fr).

---

### 5. Lean Six Sigma : la combinaison

#### 5.1 L'essentiel du Lean (rappel synthétique)
Le Lean, c'est avant tout la **vitesse et la fluidité du process** :
- **Réduction des délais d'exécution** des processus (*la réduction radicale du temps d'écoulement permet de supprimer les tâches sans valeur ajoutée*) ;
- **Identification et suppression des gaspillages** et des **activités sans valeur ajoutée** ;
- **Obligation de passer par des phases d'identification et de résolution des problèmes** (internes et externes) ;
- **Meilleure réactivité** aux changements au sein d'un processus ;
- **Charge de travail bien répartie** ;
- **Réduction des temps de changement de séries** (SMED) ;
- **Optimisation du flux** et **amélioration de l'efficacité des cycles** des processus ;
- **Maintenance Productive Totale (TPM)** ;
- **Systèmes de contrôle du travail**, **limitation du travail en cours (WIP)**, **flux tiré**.

#### 5.2 L'essentiel du Six Sigma (rappel synthétique)
Le Six Sigma, c'est l'**amélioration radicale de la qualité** en se focalisant sur le client et en utilisant l'approche **DMAIC** :
- **Projets d'amélioration centrés sur le client** ;
- **Nécessite l'évaluation de la capabilité du process (Cp)** ;
- **Amélioration basée sur des données statistiques** ;
- **Réduction de la variation** et résolution des **causes profondes** ;
- **Réduction des défauts et du re-travail** ;
- Les **contrôles et indicateurs de suivi** garantissent des **résultats durables** (« stage-gating » : on s'assure que les hypothèses de départ tiennent tout au long du projet) ;
- Création d'un **« langage commun »** pour toute optimisation de processus ;
- **Plans de déploiement duplicables** dans l'entreprise.

**Rappel des 5 phases DMAIC (point de vue Lean Six Sigma) :**

| Phase | Finalité |
|---|---|
| **Define** | Définir les possibilités, tant d'un point de vue **business** que **client** |
| **Measure** | Comprendre les **processus** et comment ils s'exécutent |
| **Analyze** | Rechercher les **facteurs clés (les « X » critiques)** qui ont le plus d'impact sur la performance et déterminer les **causes profondes** |
| **Improve** | Élaborer des **solutions** pour améliorer les « X » critiques |
| **Control** | **Déployer** les solutions retenues et les **contrôler** |

#### 5.3 Le niveau de sigma : la mesure universelle (DPMO)
Le **niveau de sigma** est une **mesure universelle de la performance d'un processus**. C'est l'origine de la terminologie « **Six Sigma** ».

| Niveau Sigma | Défauts par million de cas (DPMO) | Pourcentage de bon |
|---|---|---|
| **1** | 690 000 | 31 % |
| **2** | 308 537 | 69,2 % |
| **3** | 66 807 | 93,32 % |
| **4** | 6 210 | 99,379 % |
| **5** | 233 | 99,977 % |
| **6** | **3,4** | **99,9997 %** |

> À chaque niveau gagné, les défauts chutent d'un **ordre de grandeur** (voire davantage). Passer de 4σ à 6σ, c'est passer de **6 210** à **3,4** défauts par million.

#### 5.4 Contributions respectives : Six Sigma améliore, Lean élimine
> **Six Sigma améliore la qualité ; Lean élimine les étapes à NVA dans le flux de valeur.**

Point essentiel : la **qualité d'un processus se dégrade avec le nombre d'étapes**. Si chaque étape a un rendement r, le rendement global vaut r^(nombre d'étapes). D'où l'intérêt de **réduire le nombre d'étapes (Lean)** **et** d'**élever la qualité de chaque étape (Six Sigma)**.

**Rendement global selon le nombre d'étapes à valeur ajoutée et le niveau de qualité de chaque étape :**

| Nbre d'étapes | ±3σ | ±4σ | ±5σ | ±6σ |
|---|---|---|---|---|
| **1** | 93,32 % | 99,379 % | 99,9767 % | 99,99966 % |
| **7** | 61,63 % | 95,733 % | 99,839 % | 99,9976 % |
| **10** | 50,08 % | 93,96 % | 99,768 % | 99,9966 % |
| **20** | 25,08 % | 88,29 % | 99,536 % | 99,9932 % |
| **40** | 6,29 % | 77,94 % | 99,074 % | 99,9864 % |

*Lecture : à **±3σ**, un processus de **40 étapes** ne sort « bon » que **6,29 %** du temps ; à **±6σ**, le même processus reste à **99,9864 %**. (Source : Six Sigma Research Institute, Motorola University, Motorola, Inc.)*

#### 5.5 La loi de Little : la relation fondamentale du Lean
> **La loi de Little** est la relation fondamentale au sein du Lean.

$$\text{Délai d'exécution (Lead Time)} = \frac{\text{Nombre de tâches en cours (WIP)}}{\text{Taux moyen d'achèvement (vitesse de sortie du processus)}}$$

Pour **réduire le délai d'exécution** d'un processus, il existe **deux possibilités** :
1. **Investir du capital financier** dans les **ressources et les équipements** afin d'**augmenter le taux moyen d'achèvement** (le dénominateur) ;
   **OU**
2. **Investir du capital intellectuel** pour **réduire le nombre de tâches en cours (WIP)** — le numérateur — en utilisant :
   - les **outils Lean** : **flux tirés**, **méthode de démarrage rapide en 4 étapes**, **TQM**, etc. ;
   - les **outils Six Sigma** : **réduction des variations**.

> En clair : on accélère un flux soit en **augmentant la vitesse** (capital financier), soit, le plus souvent, en **diminuant le travail en cours** (capital intellectuel + outils LSS). La deuxième voie est généralement la moins coûteuse.

#### 5.6 Lean (faire vite) + Six Sigma (faire bien) = combinaison vertueuse
> Afin de produire les **meilleurs résultats**, **Lean (faire vite)** et **Six Sigma (faire bien)** doivent être **combinés**.

| | **Six Sigma** | **Lean** |
|---|---|---|
| **Focus** | **Qualité** | **Flux et vitesse d'écoulement** |
| **Objectif** | Améliorer l'efficacité par la **réduction de la variabilité et du nombre de défauts** | Améliorer l'efficacité par la **réduction des étapes inutiles et non créatrices de valeur** |
| **Méthode** | **Projet DMAIC** | **Chantier Kaizen** (PDCA et flux de valeur) |

**La puissance de la combinaison des deux approches** repose sur une boucle vertueuse :
- **La vitesse de Lean permet la qualité de Six Sigma** → cycles plus rapides d'expérimentation et de formation/apprentissage ;
- **La qualité de Six Sigma permet la vitesse de Lean** → moins de défauts = moins de reprises (re-travail).

> **Formule à retenir : Vitesse + Précision = € (gains).** Une combinaison **Lean** (*Vitesse + Coût bas*) et **Six Sigma** (*Culture + Qualité*) constitue une **boîte à outils puissante** permettant d'effectuer des **percées stratégiques** et d'obtenir le **« WoW » des clients**.

> **Représentation source — « LEAN SIX SIGMA ».** Deux flèches qui convergent : **LEAN — Tendre vers le Zéro Muda** + **6 SIGMA — Tendre vers le Zéro défaut, Zéro erreur** = **LEAN SIX SIGMA**.

#### 5.7 Illustration de bout en bout
Un même processus (Étapes 1 à 5 : 10 / 15 / 25 / 10 / 5 min, avec attentes de 1 à 3 jours entre étapes) est amélioré en **deux temps** :

1. **Étape ❶ — état initial :** temps de cycle long, **limite = 15 jours**, **défauts = 15 % (≈ 1 σ)** ; toutes les étapes A→F sont présentes ;
2. **Étape ❷ — action LEAN :** on **réduit les délais et optimise les coûts** (on supprime de la NVA, on resserre le flux) → **défauts = 2,5 % (≈ 2 σ)** ;
3. **Étape ❸ — action 6 σ :** on **réduit la variabilité** (il ne reste que les étapes à valeur A, C, F) → **défauts = 0,00034 % (6 σ)**.

> **Schéma source — illustration Lean puis 6σ.** On y voit la chaîne **Fournisseur → … → Client**, la distinction **Valeur ajoutée (A) / Sans valeur ajoutée (S)** par étape (sur-processus, transport, attente/stock), la distribution avec **LSL/USL**, la **moyenne**, la **zone de satisfaction client** et les **défauts** en queue de distribution. *(Voir le PDF source.)*

#### 5.8 Définition de Lean Six Sigma & bénéfices
> **Lean Six Sigma** = **fusionner** la stratégie axée sur la **réduction des délais** et l'**élimination des gaspillages** (inhérente au **Lean**) avec l'**approche culturelle**, les **processus organisationnels** et les **outils analytiques** du **Six Sigma**. Cela nous permet de **mieux répondre aux clients, plus rapidement, avec moins de pertes**.

**Bénéfices, tangibles et immatériels :**

| Gains tangibles | Gains immatériels |
|---|---|
| Réduction des **délais** · réduction des **coûts** · **gains financiers** · **qualité** · **sécurité** | **Fidélisation des clients** · **implication des employés** · **confiance des actionnaires** · **image de marque** |

#### 5.9 Gagner en compétitivité : les impératifs stratégiques
Les objectifs de **toute entreprise** doivent être orientés vers l'**amélioration de la qualité** et la **réduction des coûts et des délais**, parce que :
- la **qualité** est désormais une **caractéristique standard** sur le marché ;
- les clients **exigent des délais plus courts** ;
- la **fidélité et la conservation des clients** sont **critiques** ;
- la **pression permanente sur la baisse des prix** impose de **diminuer les coûts** ;
- de **moins en moins de capitaux** peuvent être investis → il faut **produire toujours plus avec moins**.

> **Lean Six Sigma permet d'optimiser la capacité, de réduire les délais d'exécution et d'éliminer la variabilité des processus.**

#### 5.10 Le mode projet : « le moteur » du LSS
Le déploiement LSS se fait **en cascade**, du sommet vers le terrain :

| Niveau | Rôle |
|---|---|
| **Top Management** | Fixe les **objectifs et cibles stratégiques** ; définit la **mesure des améliorations** sur l'output du processus |
| **Managers des processus & Process Owner** | Déclinent en **objectifs par département** ; **sélectionnent le projet** et le **responsable de projet** |
| **Process Pilot & équipe projet** | Réalisent la **form-action par le projet** avec le **support du Process Owner** ; produisent le **résultat du projet** |

> **Le mode projet est « le moteur » du LSS** : c'est lui qui transforme les objectifs stratégiques (input) en améliorations mesurées (output).

## 🧰 Outils & modèles associés
| Outil / modèle | À quoi ça sert | Source |
|---|---|---|
| **Le Lean — Fiche Outil** | Mémo synthétique : définition, principes clés (élimination des Muda, amélioration continue), schéma de la chaîne de valeur et de l'organisation Lean | [Ouvrir](https://drive.google.com/file/d/1JFktu2WPG_w6SScnLdIbPocxl028I7Jt/view) |
| **Le 6 Sigma — Fiche Outil** | Mémo synthétique : définition, DMAIC, schéma variabilité (bon/mauvais process), courbe de Gauss | [Ouvrir](https://drive.google.com/file/d/11rK5DfndCmqDEDjzWgVspu1Y6pmb7-T5/view) |
| **Table de la loi normale centrée réduite** | Lire la probabilité F(x) (aire à gauche de x) ; relier niveau sigma et % de bon | [Ouvrir](https://drive.google.com/file/d/1z70gfeB_XSPT4ZUzvL4_8E7BPkIyC6Od/view) |
| **Qu'est-ce que le Lean (présentation)** | Support complet : histoire, enjeux, Kaizen, Maison TPS, état d'esprit Lean | [Ouvrir](https://drive.google.com/file/d/1rz0D47faq6BqmckPs-yjLzvrg-__cCNs/view) |
| **Qu'est-ce que le 6 Sigma (présentation)** | Support complet : DMAIC, pilotage par les données, exemples statistiques | [Ouvrir](https://drive.google.com/file/d/1ScFJbzYOYIIBRaJn_NvnAA0JpY8Bot_M/view) |
| **Qu'est-ce que le Lean Six Sigma (présentation)** | Support complet : niveaux sigma, loi de Little, combinaison Lean+6σ, déploiement projet | [Ouvrir](https://drive.google.com/file/d/12cR3orYDegkIdepXfR0mvf37ooXILY6B/view) |

## ✅ Application directe — « À faire maintenant »
> Objectif : appliquer immédiatement, sur **votre propre terrain** (choisi au Module 0), ce que vous venez d'apprendre.

**Exercice 1 — Diagnostic Lean / 6 Sigma de mon processus**
1. Choisissez **un processus réel** de votre périmètre (ex. traitement d'une commande, montage d'un sous-ensemble, émission d'une facture).
2. Listez ses **étapes** dans l'ordre. Pour chacune, classez-la **VA** (valeur ajoutée — le client paierait pour ça) ou **NVA** (attente, transport, stock, retouche, sur-processus).
3. Estimez le **Lead Time total** (du début à la livraison) et le **temps réellement à valeur ajoutée**. Calculez le **ratio VA = temps VA / Lead Time** (souvent < 10 % — c'est normal).
4. Repérez **un défaut/erreur récurrent** du processus et estimez son **taux** (ex. 8 % de dossiers à reprendre).
5. Décidez : ce problème relève-t-il plutôt du **Lean** (flux trop long, trop d'attente/NVA) ou du **6 Sigma** (trop de variabilité/défauts) — ou des **deux** ?

- **Livrable attendu :** une **fiche d'une page** : la liste des étapes annotées VA/NVA, le **Lead Time**, le **ratio VA**, le **taux de défaut** estimé, et votre **verdict Lean / 6 Sigma / les deux**.
- **Critères de réussite :** chaque étape est classée VA ou NVA ; le ratio VA est chiffré ; au moins un défaut est quantifié ; le verdict est **justifié** par les chiffres (pas par une opinion).
- **Temps conseillé :** 20 min.

**Exercice 2 — Mini-décision « avec des données » (loi de Little)**
1. Sur le même processus, notez le **WIP** (nombre de dossiers/pièces « en cours » à un instant donné) et le **taux de sortie** (combien terminés par jour/heure).
2. Appliquez la **loi de Little** : `Lead Time = WIP / Taux de sortie`. Comparez le résultat à votre estimation de l'exercice 1.
3. Proposez **une action de réduction du WIP** (capital intellectuel) **et** chiffrez son effet attendu sur le Lead Time — au lieu de proposer d'acheter un équipement (capital financier).

- **Livrable attendu :** le **calcul de Little** + **une action de réduction du WIP** avec l'effet chiffré attendu.
- **Critères de réussite :** le calcul est cohérent (les 3 grandeurs s'accordent) ; l'action vise le **numérateur (WIP)** et son effet est **quantifié**.
- **Temps conseillé :** 15 min.

## 🧠 À retenir
- **Lean = faire vite** (flux, vitesse, **zéro Muda**) ; **6 Sigma = faire bien** (qualité, **réduction de la variabilité**, zéro défaut).
- **Lean Six Sigma = Vitesse + Précision = € ** : les deux approches se renforcent (la vitesse permet la qualité ; la qualité permet la vitesse).
- Le **niveau de sigma** est une **mesure universelle** : **6σ = 3,4 DPMO = 99,9997 %** de bon ; **99 % (3,8σ) ne suffit souvent pas**.
- **La qualité chute avec le nombre d'étapes** : réduire les étapes (**Lean**) **et** fiabiliser chacune (**6 Sigma**).
- **Loi de Little : Lead Time = WIP / Taux d'achèvement.** On accélère surtout en **réduisant le WIP**.
- **Le client ressent la variance, pas la moyenne** : « **Sans donnée, vous n'êtes qu'une personne avec une opinion.** »
- **85 % des problèmes** viennent de **l'organisation des processus**, 15 % des collaborateurs (Deming) → on travaille **sur** le système.
- **Kaizen = amélioration continue**, infinie : « réaliser **60 % dès maintenant** » plutôt que viser la perfection.

## 📝 Quiz de validation
1. Quelle phrase résume le mieux le couple Lean / 6 Sigma ?
   - a) Lean = qualité, 6 Sigma = vitesse
   - b) Lean = faire vite (flux, zéro Muda), 6 Sigma = faire bien (variabilité, défauts)
   - c) Les deux servent uniquement à réduire les coûts salariaux
   - d) Ce sont deux noms d'une même méthode identique
2. Un processus **6 Sigma** produit combien de défauts par million d'opportunités (DPMO) ?
   - a) 6 210 · b) 233 · c) 3,4 · d) 66 807
3. Écrivez correctement la **loi de Little**.
   - a) Lead Time = Taux d'achèvement × WIP
   - b) Lead Time = WIP / Taux d'achèvement
   - c) WIP = Lead Time × Taux d'achèvement / 2
   - d) Taux d'achèvement = WIP × Lead Time
4. **Vrai ou faux :** « Le client ressent la moyenne du processus, pas sa variance. »
5. D'après Deming, quelle part des problèmes provient de **l'organisation des processus** (et non des collaborateurs) ?
   - a) 15 % · b) 50 % · c) 85 % · d) 100 %
6. Pourquoi le rendement global d'un processus de **40 étapes à ±3σ** n'est-il que de **6,29 %** ?
   - a) Parce que 3σ correspond à 6,29 % de bon par étape
   - b) Parce que la qualité globale = (qualité d'une étape)^(nombre d'étapes), et 0,9332^40 ≈ 6,29 %
   - c) Parce que le Lean supprime 94 % des étapes
   - d) C'est une erreur de la table

<details>
<summary>👉 Voir les réponses</summary>

1. **b** — Lean adresse la **vitesse/le flux** (zéro Muda) ; 6 Sigma la **qualité** (réduction de la variabilité et des défauts).
2. **c** — un processus 6 Sigma ne produit que **3,4 DPMO** (99,9997 % de bon).
3. **b** — **Lead Time = WIP / Taux moyen d'achèvement** : on réduit le délai en baissant le WIP ou en augmentant la vitesse de sortie.
4. **Faux** — c'est l'inverse : **le client ressent la variance, pas la moyenne** ; une bonne moyenne masque des clients servis hors spécification.
5. **c** — **85 %** des problèmes viennent de l'organisation des processus, 15 % des collaborateurs.
6. **b** — la qualité se **compose** étape après étape : 93,32 % à la puissance 40 ≈ **6,29 %**. D'où l'intérêt de réduire le nombre d'étapes (Lean) **et** d'élever le niveau sigma (6 Sigma).
</details>

## 🔗 Sources & pour aller plus loin
- 📄 *1. Qu'est-ce que le Lean.pdf* — [Ouvrir dans Drive](https://drive.google.com/file/d/1rz0D47faq6BqmckPs-yjLzvrg-__cCNs/view)
- 🖼️ *1. Le Lean — Fiche Outil.png* — [Ouvrir dans Drive](https://drive.google.com/file/d/1JFktu2WPG_w6SScnLdIbPocxl028I7Jt/view)
- 📄 *2. Qu'est-ce que le 6 Sigma.pdf* — [Ouvrir dans Drive](https://drive.google.com/file/d/1ScFJbzYOYIIBRaJn_NvnAA0JpY8Bot_M/view)
- 🖼️ *2. Le 6 Sigma — Fiche Outil.png* — [Ouvrir dans Drive](https://drive.google.com/file/d/11rK5DfndCmqDEDjzWgVspu1Y6pmb7-T5/view)
- 📄 *2. Loi normale.pdf* (table complète, source http://odlv.free.fr) — [Ouvrir dans Drive](https://drive.google.com/file/d/1z70gfeB_XSPT4ZUzvL4_8E7BPkIyC6Od/view)
- 📄 *3. Qu'est-ce que le Lean Six Sigma.pdf* — [Ouvrir dans Drive](https://drive.google.com/file/d/12cR3orYDegkIdepXfR0mvf37ooXILY6B/view)

---
*Contenu pédagogique d'après les supports Progress Partners — « La passion de la performance ».
Réorganisé en module de formation autoportant.*
