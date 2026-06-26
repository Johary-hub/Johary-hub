# Module 10 — La démarche DMAIC

> **Parcours Lean Six Sigma — Yellow Belt (SSYB)** · Séquence 3
> ⏱️ Durée estimée : 35 min · 🎓 Niveau : Yellow Belt

## 🎯 Objectifs du module
À la fin de ce module, vous serez capable de :
- **Décrire** la vision d'ensemble d'un projet **DMAIC** et la philosophie de l'approche dans sa globalité.
- **Situer** un projet ou un problème réel dans les **5 grandes phases** : Define, Measure, Analyze, Improve, Control.
- **Énoncer** l'objectif, le **livrable** et les **outils associés** de chacune des 5 phases.
- **Expliquer** la logique « entonnoir » qui fait passer de **100+ variables d'entrée** à **1 à 3 variables clés**.
- **Appliquer** la logique de **stage-gating** (revue de fin de phase) pour décider si l'on passe ou non à la phase suivante.

## 🧭 Prérequis
- Module 8 — Introduction au DMAIC & à la méthode PDCA (recommandé).
- Notions utiles : le **SIPOC**, la **VOC / CTS**, la charte de projet, les types de données.

## 📚 Contenu

### 1. Qu'est-ce que le DMAIC ?
**DMAIC** est la démarche structurée de résolution de problèmes du **Lean Six Sigma (6σ)**.
C'est l'acronyme de ses cinq phases, parcourues **dans l'ordre** :

| Lettre | Phase | Question centrale de la phase |
|---|---|---|
| **D** | **Define** (Définir) | *« Plusieurs projets potentiels »* → quel **projet** choisir ? |
| **M** | **Measure** (Mesurer) | *« Où en sommes-nous ? »* |
| **A** | **Analyze** (Analyser) | *« Plusieurs causes fondamentales possibles »* → quelle **cause** ? |
| **I** | **Improve** (Améliorer) | *« Quelle est la solution ? »* |
| **C** | **Control** (Maîtriser) | *« Comment maintenir les gains ? »* |

> **Schéma source (non transcriptible) — la roue DMAIC.** Le support présente les 5 phases
> disposées **en cercle autour du symbole 6σ**, dans l'ordre Define → Measure → Analyze →
> Improve → Control, pour signifier que la démarche est **cyclique** : la fin d'un projet
> (Control) alimente le choix du suivant (Define). Voir la diapositive d'ouverture du fichier
> *13.DMAIC Define Mesure Analyze Improve Control.pdf*.

### 2. À quoi sert le DMAIC ? (les objectifs)
Le DMAIC est **avant tout une structure**. Concrètement, il sert à :

- **Stratifier (ordonner) les étapes** nécessaires pour **réduire la variabilité**, **résoudre les
  problèmes**, **améliorer la qualité** et donc **éliminer les gaspillages**.
- **Identifier les outils pertinents** pour vos problématiques — le bon outil, au bon moment.
- **Créer une liaison efficiente entre chacun des outils** au fil des phases : la sortie d'un
  outil devient l'**entrée** du suivant (enchaînement d'outils).

En une phrase : le DMAIC garantit qu'on **résout le bon problème, dans le bon ordre, avec les
bons outils**, et qu'on **conserve** les gains obtenus.

### 3. La logique de fond : du problème concret au problème statistique
Le DMAIC fait passer un **problème concret** (vécu sur le terrain) par une **traduction
statistique**, puis revient à une **solution concrète**. C'est le cœur de la « puissance » de
l'approche.

| Monde **concret** (terrain) | ⟷ | Monde **statistique** (analyse) |
|---|---|---|
| **Problème concret** : quels sont les **Inputs (X)** ? | → | **Problème statistique** : `Y = f(X1, X2, X3 …)` |
| | | Quelles **relations** entre les différents **X** ? |
| | | Quelles **limites optimales** pour chacun des **X clés** ? |
| **Solution concrète** | ← | **Solution statistique** |

**Lecture de la formule `Y = f(X1, X2, X3 …)`** : le résultat qui nous intéresse (**Y**, la
sortie : un défaut, un délai, un coût…) est **fonction** d'un ensemble de variables d'entrée
(**les X**). Le projet consiste à **découvrir quels X comptent vraiment** et à **fixer leurs
limites optimales** pour piloter Y. On ne « pilote » pas Y directement : on agit sur ses causes,
les X.

### 4. L'approche « entonnoir » : de 100+ variables à 1–3 variables clés
Le DMAIC fonctionne comme un **entonnoir** : à chaque phase, on **réduit le nombre de variables
candidates** jusqu'à isoler les **quelques X clés** sur lesquels agir. C'est ce qui rend la
démarche efficace : on ne traite pas tout, on **converge**.

| Phase | Question « entonnoir » | Variables d'entrée encore en jeu | Outils typiques (extrait source) |
|---|---|---|---|
| **Define** | « Plusieurs projets potentiels » → un projet choisi | **100+** (toutes les variables d'entrée possibles) | **Charte de projet**, **SIPOC** … |
| **Measure** | « Où en sommes-nous ? » → mesure de la situation de référence | **25 à 30** | **Cartographie** du processus, **Matrice C&E** (Causes & Effets), **Système de mesure** … |
| **Analyze** | « Plusieurs causes fondamentales possibles » → cause identifiée et vérifiée | **8 à 10** | **VMEA / AMDEC**, **Analyse statistique** … |
| **Improve** | « Quelle est la solution ? » → améliorations testées et mesurées | **3 à 6** | **Processus cible** … |
| **Control** | « Comment maintenir les gains ? » → processus déployé et sous contrôle | **1 à 3** (X clés, le « processus optimisé ») | **Plan de surveillance** (plan de contrôle) … |

> **Schéma source (non transcriptible) — l'entonnoir des variables.** Le support représente un
> **entonnoir** : large en haut (Define, *100+* variables) et étroit en bas (Control, *1 à 3*
> variables → *processus optimisé*). Les outils sont positionnés le long de l'entonnoir
> (Charte de projet, SIPOC, Cartographie, Matrice C&E, VMEA/AMDEC, Processus cible, Plan de
> surveillance), avec le **système de mesure** mis en place à hauteur de la phase Measure. Voir
> la diapositive « Approche entonnoir » du fichier source.

### 5. Les 5 phases, étape par étape
Pour chaque phase : son **objectif**, son **livrable de sortie** et ses **outils**. Les livrables
sont la matérialisation directe des étapes « entonnoir » de la section 4.

#### D — **Define** (Définir) : cadrer le projet
- **Objectif :** parmi *« plusieurs projets potentiels »*, **choisir et cadrer un projet** :
  préciser le problème, son périmètre, l'objectif chiffré, le client et sa **voix (VOC)**.
- **Livrable :** **un projet choisi**, formalisé par la **charte de projet** et un **SIPOC**.
- **Outils associés :** **Charte de projet**, **SIPOC**, **VOC / CTS**.
- **Variables encore en jeu :** **100+** (toutes les entrées possibles).

#### M — **Measure** (Mesurer) : établir la situation de référence
- **Objectif :** répondre à *« Où en sommes-nous ? »* en **mesurant la situation de référence
  (baseline)** du processus, de façon **fiable**.
- **Livrable :** une **mesure de la situation de référence** et un **système de mesure** validé ;
  une cartographie détaillée du processus.
- **Outils associés :** **Cartographie** du processus, **Matrice C&E** (Causes & Effets),
  **système de mesure**.
- **Variables encore en jeu :** **25 à 30**.

#### A — **Analyze** (Analyser) : trouver la cause fondamentale
- **Objectif :** parmi *« plusieurs causes fondamentales possibles »*, **identifier et vérifier
  la (les) cause(s) racine(s)** qui pilote(nt) réellement le **Y**.
- **Livrable :** une **cause fondamentale identifiée et vérifiée** (par les données).
- **Outils associés :** **VMEA / AMDEC**, **analyse statistique**.
- **Variables encore en jeu :** **8 à 10**.

#### I — **Improve** (Améliorer) : concevoir et tester la solution
- **Objectif :** répondre à *« Quelle est la solution ? »* en **concevant, testant et mesurant**
  des améliorations qui agissent sur les **X clés**.
- **Livrable :** des **améliorations testées et mesurées**, et un **processus cible** défini.
- **Outils associés :** définition du **processus cible**.
- **Variables encore en jeu :** **3 à 6**.

#### C — **Control** (Maîtriser) : pérenniser les gains
- **Objectif :** répondre à *« Comment maintenir les gains ? »* en **déployant le processus
  optimisé** et en le **mettant sous contrôle** dans la durée.
- **Livrable :** un **processus déployé et sous contrôle** (le **processus optimisé**, piloté par
  ses **1 à 3 X clés**).
- **Outils associés :** **plan de surveillance** (plan de contrôle).
- **Variables encore en jeu :** **1 à 3**.

### 6. La logique de « stage-gating » (revue de fin de phase)
Le DMAIC se parcourt **dans l'ordre, sans sauter d'étape**. Entre deux phases se trouve une
**porte (gate)** : une **revue** qui vérifie que la phase est réellement aboutie **avant**
d'autoriser le passage à la suivante.

- **Principe :** chaque phase a un **livrable** (cf. sections 4 et 5). On ne **franchit la porte**
  que si **ce livrable existe et tient la route**. Sinon, on **reste dans la phase** ou on
  **revient en arrière**.
- **Pourquoi ?** Sans porte, on risque de **chercher des solutions (Improve) avant d'avoir
  prouvé la cause (Analyze)**, ou d'**analyser avant d'avoir des mesures fiables (Measure)** :
  on traite alors le **mauvais X**, et les gains ne tiennent pas.
- **C'est aussi la logique entonnoir :** chaque porte n'autorise à descendre que les **variables
  qui ont survécu** au filtre de la phase. On **rétrécit** à chaque gate.

| Porte (gate) | Critère de passage (le livrable doit être prêt) |
|---|---|
| **Fin de Define → Measure** | Un **projet choisi** et cadré : charte de projet + SIPOC validés. |
| **Fin de Measure → Analyze** | Une **mesure de référence** fiable + **système de mesure** validé. |
| **Fin de Analyze → Improve** | Une **cause fondamentale identifiée *et vérifiée*** par les données. |
| **Fin de Improve → Control** | Des **améliorations testées et mesurées** (le gain est prouvé). |
| **Fin de Control → (clôture)** | Un **processus déployé et sous contrôle**, gains **maintenus**. |

> **À noter :** comme la roue DMAIC est cyclique, la **clôture** d'un projet (Control) nourrit le
> **choix du projet suivant** (retour en Define).

## 🧰 Outils & modèles associés
| Outil / modèle | À quoi ça sert | Source |
|---|---|---|
| Support **DMAIC — Define, Measure, Analyze, Improve, Control** | Vision d'ensemble : roue DMAIC, approche entonnoir, outils par phase | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |
| **Charte de projet** | Cadrer le projet en phase **Define** (problème, périmètre, objectif, client) | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |
| **SIPOC** | Vue macro du processus (Suppliers-Inputs-Process-Outputs-Customers) en **Define** | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |
| **Cartographie de processus** | Détailler le processus pour la **mesure de référence** (Measure) | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |
| **Matrice C&E (Causes & Effets)** | Hiérarchiser les entrées X selon leur impact sur Y (Measure) | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |
| **VMEA / AMDEC** | Évaluer/prioriser les modes de défaillance et causes racines (Analyze) | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |
| **Analyse statistique** | Vérifier par les données la cause fondamentale (Analyze) | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |
| **Processus cible** | Concevoir le processus amélioré à tester (Improve) | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |
| **Plan de surveillance (plan de contrôle)** | Maintenir les gains et garder le processus sous contrôle (Control) | [Ouvrir](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view) |

## ✅ Application directe — « À faire maintenant »
> Objectif : appliquer immédiatement, sur votre propre terrain, ce que vous venez d'apprendre —
> **situer un vrai problème dans les 5 phases du DMAIC**.

**Exercice — Mon problème dans le tunnel DMAIC**
1. Choisissez **un problème réel** de votre terrain d'application (ex. : *« le délai de traitement
   des commandes dépasse souvent 48 h »*). Nommez le **Y** mesurable (ici : le délai en heures).
2. Pour **chacune des 5 phases**, rédigez **en UNE phrase** l'**objectif** appliqué à *votre* cas.
   Exemple (à adapter) :
   - **Define :** *« Cadrer un projet visant à ramener le délai de traitement sous 24 h pour le
     client interne Logistique. »*
   - **Measure :** *« Mesurer le délai réel actuel (baseline) sur 4 semaines avec un comptage
     fiable. »*
   - **Analyze :** *« Identifier et vérifier par les données la cause principale des retards. »*
   - **Improve :** *« Concevoir et tester une solution qui réduit cette cause et mesurer le gain. »*
   - **Control :** *« Déployer la nouvelle façon de faire et la mettre sous plan de surveillance. »*
3. En face de chaque phase, notez le **livrable de sortie** attendu (projet choisi · mesure de
   référence · cause vérifiée · améliorations testées · processus sous contrôle) et **un outil**
   que vous utiliseriez (charte, SIPOC, cartographie, matrice C&E, AMDEC, plan de surveillance…).
4. Tracez les **4 portes (gates)** entre les phases et écrivez, pour chacune, **le critère** qui
   vous autoriserait à passer à la phase suivante.

- **Livrable attendu :** un tableau **« Mon problème → 5 phases DMAIC »** (1 page) : par ligne, la
  phase, son objectif en 1 phrase, le livrable, l'outil, et le critère de porte.
- **Critères de réussite :**
  - le **Y** est mesurable et le problème est **réel** ;
  - les **5 objectifs** sont distincts et respectent **l'ordre logique** (on ne propose pas la
    solution en Define, on ne mesure pas en Analyze) ;
  - chaque **porte** a un **critère vérifiable** (« le livrable existe et tient la route »).
- **Temps conseillé :** 20 min.

## 🧠 À retenir
- **DMAIC** = **D**efine · **M**easure · **A**nalyze · **I**mprove · **C**ontrol, **dans l'ordre**.
- C'est **avant tout une structure** : stratifier les étapes, choisir les **bons outils** et les
  **enchaîner** (la sortie d'un outil = l'entrée du suivant).
- Logique de fond : **problème concret → problème statistique `Y = f(X…)` → solution concrète**.
  On pilote **les X (causes)**, pas Y directement.
- **Approche entonnoir** : on passe de **100+** variables (Define) à **1 à 3** X clés (Control).
- **Livrables par phase :** projet choisi → mesure de référence → cause vérifiée → améliorations
  testées → processus sous contrôle.
- **Stage-gating** : à chaque **porte**, on ne passe à la phase suivante **que si le livrable est
  prêt** ; sinon on reste ou on revient.
- La roue DMAIC est **cyclique** : Control alimente le prochain Define.

## 📝 Quiz de validation
1. Que signifie l'acronyme **DMAIC** ?
   - a) Define · Manage · Audit · Improve · Close
   - b) Define · Measure · Analyze · Improve · Control
   - c) Decide · Measure · Act · Implement · Control
   - d) Define · Model · Analyze · Iterate · Confirm
2. Dans l'approche « entonnoir », combien de variables d'entrée reste-t-il **en fin de Control** ?
   - a) 100+ · b) 25 à 30 · c) 8 à 10 · d) 1 à 3
3. La formule `Y = f(X1, X2, X3 …)` signifie que…
   - a) on agit directement sur Y
   - b) Y (la sortie) est fonction des X (les entrées), donc on agit sur les X
   - c) les X sont sans effet sur Y
   - d) il faut autant de X que de Y
4. À quelle phase associe-t-on le **plan de surveillance** (plan de contrôle) ?
   - a) Define · b) Measure · c) Analyze · d) Control
5. Qu'est-ce que la logique de **stage-gating** ?
   - a) On peut sauter une phase si on est pressé
   - b) On ne passe à la phase suivante que si le **livrable** de la phase en cours est prêt
   - c) On traite toutes les phases en parallèle
   - d) On commence toujours par Improve
6. Vrai ou faux : le **livrable** de la phase **Analyze** est *« une cause fondamentale identifiée
   et vérifiée »*.

<details>
<summary>👉 Voir les réponses</summary>

1. **b** — Define, Measure, Analyze, Improve, Control.
2. **d** — l'entonnoir converge de 100+ (Define) vers **1 à 3** X clés (Control).
3. **b** — la sortie Y dépend des entrées X ; on pilote Y **via** ses causes, les X.
4. **d** — le **plan de surveillance** sert à **maintenir les gains** en phase **Control**.
5. **b** — la **porte** n'autorise le passage que si le livrable de la phase est abouti.
6. **Vrai** — c'est exactement le livrable de sortie d'**Analyze**.
</details>

## 🔗 Sources & pour aller plus loin
- 📄 *13.DMAIC Define Mesure Analyze Improve Control.pdf* — [Ouvrir dans Drive](https://drive.google.com/file/d/1XvmPWqSwqT3e0-iomUv_9AzX_Orilx2m/view)

---
*Contenu pédagogique d'après les supports Progress Partners — « La passion de la performance ».
Réorganisé en module de formation autoportant.*
