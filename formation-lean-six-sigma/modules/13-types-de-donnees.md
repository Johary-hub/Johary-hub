# Module 13 — Les Types de données

> **Parcours Lean Six Sigma — Yellow Belt (SSYB)** · Séquence 3
> ⏱️ Durée estimée : 30 min · 🎓 Niveau : Yellow Belt

## 🎯 Objectifs du module
À la fin de ce module, vous serez capable de :
- **Distinguer** les **données par attribut** (qualitatives / nominales) des **données variables** (quantitatives).
- **Classer** une donnée variable selon ses deux axes de découpage : **intervalle vs ratio** et **discrète vs continue**.
- **Expliquer** pourquoi le type de donnée détermine l'outil ou le test statistique utilisable lors de l'analyse.
- **Justifier** la préférence Lean Six Sigma pour les données variables (outils plus puissants, échantillons plus petits).
- **Transformer**, quand c'est possible, une donnée par attribut en donnée variable pour gagner en puissance d'analyse.
- **Choisir** le bon type de données à collecter sur votre propre processus.

## 🧭 Prérequis
- Module 12 — La VOC, les CTS et le SIPOC (savoir identifier ce qu'on mesure sur un processus).
- Notions de base sur les indicateurs d'un projet.

## 📚 Contenu

### 1. Pourquoi le type de donnée est‑il décisif ?
Avant même de mesurer, il faut savoir **quel type de donnée** on s'apprête à collecter. Deux raisons fondamentales :

- ❑ **Le type de donnée détermine quel test devra être utilisé** lors de l'analyse statistique. On ne peut pas appliquer n'importe quel outil à n'importe quelle donnée.
- ❑ **Certains types de données donnent accès à des outils plus puissants** que d'autres.

Autrement dit : le choix se fait **en amont**, à la conception de la collecte. Collecter la « mauvaise » nature de donnée, c'est se priver d'outils d'analyse — et parfois devoir tout recommencer.

> **Les deux grandes familles**
> - **Données par attribut** : données **qualitatives** ou **nominales**. Ce sont des caractéristiques permettant de **ranger les objets dans des catégories**.
> - **Données variables** : données **quantitatives** qui peuvent être **représentées sur un axe numérique**.

### 2. Les données par attribut (qualitatives / nominales)
**Définition.** Les **données par attribut** rangent les objets **dans des catégories**.

Leurs propriétés :
- ❑ Cela **range les objets dans des catégories**.
- ❑ **Pas d'ordre implicite** entre les catégories (le « bon » n'est pas « avant » le « pas bon » sur un axe).
- ❑ Également appelées **données nominales**.
- ❑ Elles sont **plus faciles à collecter** que les données variables.

**Inconvénient majeur :** elles font généralement l'objet d'une **interprétation par les évaluateurs** (deux personnes peuvent classer différemment le même objet).

**Exemples de données par attribut :**
- Bon – Pas bon
- Ford – Nissan – Toyota – Volvo
- Bleu – Rouge – Vert
- Petit – Grand

### 3. Les données variables (quantitatives)
**Définition.** Les **données variables** sont **représentées sur un axe numérique**.

Leurs propriétés :
- ❑ **Représentées sur un axe numérique.**
- ❑ Peuvent prendre **différentes valeurs**.
- ❑ Peuvent être **manipulées mathématiquement**.
- ❑ Également désignées par **données intervalle / ratio**.

**Exemples de données variables :**
- Pression d'un airbag
- Poids de gaz
- Diamètre d'une pièce
- Tenue à la traction d'une sangle

### 4. Deux façons de découper les données variables
Il y a **deux façons** de partager les données variables en sous‑groupes — et ces deux découpages sont **indépendants** (ils se combinent) :

- ❑ **Intervalle vs Ratio**
- ❑ **Discrète vs Continue**

```
                 Donnée variable
            ┌────────────┴────────────┐
   Intervalle  vs  Ratio      Continue  vs  Discrète
```

> 👉 Une même donnée variable porte donc **deux étiquettes** : une sur l'axe *intervalle/ratio*, une sur l'axe *discrète/continue*. (Schéma original : voir la fiche source Drive.)

### 5. Découpage 1 — Intervalle vs Ratio
La différence tient à **ce qu'on a le droit de faire mathématiquement** et au **sens du zéro**.

| Type | Opérations possibles | Le zéro | Exemples |
|---|---|---|---|
| **Donnée intervalle** | Peut être **ajoutée ou soustraite**, mais **pas multipliée ni divisée** de manière sensée | Le **zéro est arbitraire** | Température en °C ou °F · l'année (« anno domini ») · mesure d'une longueur par rapport à une valeur connue (référence) |
| **Donnée ratio** | Peut être **ajoutée, soustraite, multipliée et divisée** de manière sensée | Le **zéro n'est pas arbitraire** : zéro veut réellement dire « **il n'y a rien là** » | Quantité d'argent sur un compte en banque · température en degrés **Kelvin** · poids d'un échantillon de matière · mesure d'une longueur par rapport à zéro |

**Pourquoi ces exemples sont des données intervalle :**
- ❑ **Température en °C ou °F** → le zéro **ne veut pas dire** qu'il n'y a pas de température.
- ❑ **L'année « anno domini »** → le temps **n'a pas démarré** en l'an 0.
- ❑ **Mesure d'une longueur par rapport à une valeur connue** (et non par rapport à zéro absolu).

**Pourquoi ces exemples sont des données ratio :**
- ❑ **La quantité d'argent** sur un compte en banque.
- ❑ **Température en degrés Kelvin** (0 K = absence réelle de température).
- ❑ **Le poids** d'un échantillon de matière.
- ❑ **Mesure d'une longueur par rapport à zéro**.

> 💡 Repère mémo : si « **deux fois plus** » a un sens (40 cm = 2 × 20 cm), c'est du **ratio**. Si « deux fois plus » n'a pas de sens (20 °C ≠ 2 × 10 °C en chaleur réelle), c'est de l'**intervalle**.

### 6. Découpage 2 — Discrète vs Continue
La différence tient à **l'ensemble des valeurs** que la donnée peut prendre.

| Type | Caractéristique | Exemples |
|---|---|---|
| **Données continues** | Peut prendre **n'importe quelle valeur** | La longueur d'une pièce · la température de la pièce · la pression d'un airbag |
| **Données discrètes** | **Limitée à certaines valeurs**, certains **incréments** | Une somme d'argent physique (incréments de 1 centime) · la position d'un *locating* · un nombre de pièces |

> 💡 Repère mémo : si entre deux valeurs il existe **toujours** une valeur intermédiaire possible (12,5 mm puis 12,53 mm…), c'est **continu**. Si les valeurs « sautent » par paliers (3 pièces, puis 4, jamais 3,5), c'est **discret**.

### 7. La puissance des données variables
C'est le cœur du module : **on préconise les données variables**, parce qu'elles donnent accès à des **outils plus puissants**.

- ❑ **Les données par attribut n'ont pas de relation mathématique entre elles.**
  - ➢ *À quelle distance une pièce bonne est‑elle d'une mauvaise ?* → la question n'a pas de réponse chiffrée : il n'y a pas de « distance » entre deux catégories.
- ❑ **Beaucoup plus d'outils** peuvent être employés pour les **données variables** que pour les attributs.
- ❑ Pour obtenir **la même information** à partir de données par attribut (vs variable), il faudra de **gros échantillons**.

**Synthèse à garder en tête :**

| Critère | Données par attribut | Données variables |
|---|---|---|
| Nature | Qualitatives / nominales (catégories) | Quantitatives (axe numérique) |
| Manipulation mathématique | Non | Oui |
| Facilité de collecte | **Plus faciles** à collecter | Plus exigeantes |
| Risque d'interprétation | **Oui** (jugement de l'évaluateur) | Faible (mesure) |
| Outils statistiques disponibles | Peu | **Beaucoup (plus puissants)** |
| Taille d'échantillon nécessaire | **Grosse** | Plus petite |

> ✅ **Règle Lean Six Sigma :** chaque fois que c'est possible, **transformez une donnée par attribut en donnée variable**. Exemple : au lieu de compter « écran rayé / non rayé » (attribut), mesurez le **nombre de rayures** ou la **longueur de la rayure** (variable).

## 🧰 Outils & modèles associés
| Outil / modèle | À quoi ça sert | Source |
|---|---|---|
| **Fiche Outil — Types de données** | Mémo des définitions (attribut vs variable, intervalle/ratio, discrète/continue) et de leurs exemples | [Ouvrir](https://drive.google.com/file/d/1LIqGzN2BtAL3PfKz8dPiBDb3IFu6HFXK/view) |
| **Support — 17. Types de données** | Présentation complète avec schémas et exercices de classification corrigés | [Ouvrir](https://drive.google.com/file/d/1p8iDW7xUF5Uix6v28jMgbSC7oROj9dz0/view) |

## ✅ Application directe — « À faire maintenant »
> Objectif : appliquer immédiatement, sur votre propre terrain, ce que vous venez d'apprendre.

**Exercice 1 — Classer les données de mon terrain**
1. Sur votre processus (le « terrain d'application » choisi au Module 0), **listez 5 à 8 données** que vous mesurez ou pourriez mesurer (ex. nombre de retards, diamètre d'une pièce, OK/NOK d'un contrôle, température, montant facturé…).
2. Pour **chaque** donnée, remplissez le tableau ci‑dessous :
   - **Attribut ou variable ?**
   - Si variable : **intervalle ou ratio ?**
   - Si variable : **discrète ou continue ?**
3. Repérez vos **données par attribut** et demandez‑vous, pour chacune : *« Pourrais‑je la mesurer autrement pour en faire une donnée variable ? »* (cf. Exercice 2 du support).

| # | Donnée mesurée | Attribut / Variable | Intervalle / Ratio | Discrète / Continue | Transformable en variable ? |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |
| 7 | | | | | |
| 8 | | | | | |

- **Livrable attendu :** le tableau ci‑dessus rempli avec **5 à 8 données réelles** de votre processus, chacune correctement classée, plus **au moins une** proposition de passage attribut → variable.
- **Critères de réussite :** chaque donnée porte les **deux étiquettes** quand elle est variable (intervalle/ratio **et** discrète/continue) ; les justifications « zéro arbitraire ou non » et « valeurs continues ou par incréments » sont cohérentes ; au moins une donnée par attribut a une piste de transformation crédible.
- **Temps conseillé :** 15 min.

**Exercice 2 — Revue de mes indicateurs projet (en groupe)**
1. **Passez en revue les indicateurs** de vos projets.
2. **Identifiez de quel type de données** il s'agit (attribut / variable, et le sous‑type).
3. **Déterminez si vos données par attribut pourraient être mesurées différemment** pour en faire des **données variables**.

- **Livrable attendu :** une courte note listant chaque indicateur, son type, et les conversions possibles vers du variable.
- **Critères de réussite :** tous les indicateurs sont typés ; au moins une opportunité de « gagner en puissance d'analyse » est identifiée.
- **Temps conseillé :** 10 min.

## 🧠 À retenir
- Le **type de donnée se décide avant la collecte** : il **détermine le test statistique** utilisable.
- **Deux familles** : **attribut** (qualitatif / nominal, = catégories) et **variable** (quantitatif, = axe numérique).
- Une donnée variable se classe sur **deux axes indépendants** : **intervalle vs ratio** et **discrète vs continue**.
- **Intervalle** = on peut additionner/soustraire, **zéro arbitraire** (°C, années). **Ratio** = on peut aussi multiplier/diviser, **zéro = absence réelle** (poids, argent, Kelvin).
- **Continue** = n'importe quelle valeur ; **discrète** = valeurs limitées, par incréments.
- Les **données variables sont plus puissantes** : plus d'outils, **échantillons plus petits**. Les données par attribut **n'ont pas de relation mathématique** entre elles.
- Les données par attribut sont **plus faciles à collecter** mais **sujettes à l'interprétation** de l'évaluateur.
- **Convertissez attribut → variable** chaque fois que possible (compter/mesurer plutôt que classer en « bon / pas bon »).

## 📝 Quiz de validation
*(Plusieurs questions reprennent l'Exercice n°1 du support.)*

1. « Nombre de rayures sur un écran d'ordinateur » est une donnée…
   - a) Attribut · b) Variable, ratio et continue · c) Variable, ratio et discrète · d) Variable, intervalle et continue
2. « Cette voiture est grise, cette autre est rouge » est une donnée…
   - a) Attribut · b) Variable ratio · c) Variable intervalle · d) Variable discrète
3. « Longueur d'un pinceau » est une donnée…
   - a) Attribut · b) Variable, ratio et continue · c) Variable, intervalle et discrète · d) Variable, ratio et discrète
4. La **température en degrés Celsius** est une donnée de type…
   - a) Ratio (le zéro veut dire « rien ») · b) Intervalle (le zéro est arbitraire) · c) Attribut · d) Discrète
5. Pourquoi le Lean Six Sigma **préconise‑t‑il les données variables** ?
   - a) Elles sont plus faciles à collecter · b) Elles donnent accès à des outils plus puissants et demandent des échantillons plus petits · c) Elles évitent toute mesure · d) Elles n'ont pas d'unité
6. « Échantillons qui peuvent être triés entre rond, carré et triangulaire » est une donnée…
   - a) Variable continue · b) Variable discrète · c) Attribut · d) Variable intervalle

<details>
<summary>👉 Voir les réponses</summary>

1. **c** — Variable, **ratio et discrète** (on compte un nombre entier de rayures).
2. **a** — **Attribut** : une couleur range l'objet dans une catégorie, sans ordre ni relation mathématique.
3. **b** — Variable, **ratio et continue** : une longueur peut prendre n'importe quelle valeur et son zéro est absolu.
4. **b** — **Intervalle** : en °C le zéro est arbitraire (il ne signifie pas « pas de température »), donc on peut additionner/soustraire mais pas multiplier/diviser de façon sensée.
5. **b** — Plus d'outils, **plus puissants**, et **échantillons plus petits** pour la même information ; les données par attribut n'ont pas de relation mathématique entre elles.
6. **c** — **Attribut** : on range les pièces dans des catégories de forme (pas d'ordre implicite).

*Rappel des autres items du support : « Écrans rayés vs écrans non‑rayés » → Attribut · « Prix du journal » → Variable ratio et discrète · « Pression d'air dans un pneu » → Variable ratio et continue · « Lecture de la pression d'air sur une jauge digitale » → Variable ratio et discrète.*
</details>

## 🔗 Sources & pour aller plus loin
- 📄 *17. Types de données.pdf* — [Ouvrir dans Drive](https://drive.google.com/file/d/1p8iDW7xUF5Uix6v28jMgbSC7oROj9dz0/view)
- 📄 *17. Types de données Fiche Outil.pdf* — [Ouvrir dans Drive](https://drive.google.com/file/d/1LIqGzN2BtAL3PfKz8dPiBDb3IFu6HFXK/view)

---
*Contenu pédagogique d'après les supports Progress Partners — « La passion de la performance ».
Réorganisé en module de formation autoportant.*
