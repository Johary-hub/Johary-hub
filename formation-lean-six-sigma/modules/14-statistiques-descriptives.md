# Module 14 — Les Statistiques Descriptives

> **Parcours Lean Six Sigma — Yellow Belt (SSYB)** · Séquence 3
> ⏱️ Durée estimée : 45 min · 🎓 Niveau : Yellow Belt

## 🎯 Objectifs du module
À la fin de ce module, vous serez capable de :
- **Distinguer** une population d'un échantillon et choisir le bon vocabulaire (paramètres vs estimateurs).
- **Calculer** les mesures du comportement du centre : moyenne, médiane et mode.
- **Calculer** les mesures de dispersion : étendue (range), variance et écart-type.
- **Choisir** l'indicateur le plus pertinent selon les données (notamment en présence de valeurs exceptionnelles / *outliers*).
- **Lire** une distribution à l'aide des représentations graphiques (dotplot, histogramme, courbe de distribution).
- **Relier** vos données à la loi normale et estimer des pourcentages grâce à la règle 68 / 95 / 99,7 %.

## 🧭 Prérequis
- Notions de base du Lean Six Sigma et de la démarche 6 Sigma (collecter des données, mesurer un processus).
- Aucun prérequis mathématique avancé : les quatre opérations et la racine carrée suffisent.

## 📚 Contenu

### 1. Pourquoi les statistiques descriptives ?
La statistique descriptive consiste à **utiliser des méthodes scientifiques pour collecter, organiser, résumer et présenter des données**. C'est l'un des enjeux clés du **6 Sigma** : avant d'améliorer un processus, il faut savoir le décrire objectivement avec des chiffres plutôt qu'avec des impressions.

Décrire un jeu de données, c'est répondre à trois questions :

| Question | Ce qu'on cherche | Outils |
|---|---|---|
| **Comportement du centre** | Où est le milieu ? | Moyenne, médiane, mode |
| **Dispersion** | Comment les données sont-elles dispersées ? | Étendue (range), variance, écart-type |
| **Allure de la distribution** | Comment les données sont-elles distribuées ? | Histogramme, courbe de distribution, loi normale… |

### 2. Population et échantillon

**Population** — La population est constituée de **toutes les valeurs** (en nombre fini ou infini) définies par un certain paramètre.

Exemples de populations :
- Toutes les ceintures Renault faites sur la ligne A.
- Toutes les demandes d'achats faites en 2003.
- Toutes les pièces fabriquées sur la machine D depuis la dernière modification.
- La taille de toutes les personnes aux USA.

**Échantillon** — Un échantillon est fait d'un **nombre restreint de valeurs** de la population. Il représente la population, sans pour autant être tenu à une représentation parfaite.

Exemples d'échantillons (correspondant aux populations ci-dessus) :
- 100 ceintures Renault de la ligne A.
- 20 demandes d'achat de chaque mois de 2003.
- Les 60 premières pièces faites sur la machine D après la dernière modification.
- La taille de 3 000 personnes venant de tous les états des USA.

> 💡 En pratique on travaille presque toujours sur un **échantillon** (mesurer toute la population coûte trop cher ou est impossible), puis on **généralise** à la population.

### 3. Notations : paramètres de la population vs estimateurs de l'échantillon
Une même grandeur se note différemment selon qu'elle décrit la **population** (lettres grecques) ou un **échantillon** (lettres romaines). L'échantillon **estime** le paramètre de la population.

| Grandeur | Estimateur de l'échantillon (lettres romaines) | Paramètre de la population (lettres grecques) |
|---|---|---|
| Taille | n | N |
| Moyenne | X̄ (« X barre ») | μ (mu) |
| Étendue (Range) | R | R |
| Écart-type (Standard Deviation) | s | σ (sigma) |
| Variance | s² | σ² |

**Notation mathématique utile :**
- **xᵢ** = la i-ème donnée : x₁, x₂, x₃, … (chaque valeur de la série).
- **n** = nombre de données dans l'échantillon.
- **Σ** (sigma majuscule) = « somme de… ».

### 4. Mesures du comportement du centre

#### 4.1 La moyenne
La **moyenne** est **la somme de toutes les valeurs divisée par le nombre de valeurs**. C'est en général le **meilleur indicateur** du comportement du milieu.

**Formule :**

$$\bar{X} = \frac{x_1 + x_2 + \dots + x_n}{n} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

> En clair : on additionne toutes les valeurs, puis on divise par leur nombre.

**Exemple** — Série : 5, 3, 6, 4, 7, 5, 9, 6, 4, 3, 2, 6 (n = 12).
Somme = 60 ⟹ moyenne X̄ = 60 ÷ 12 = **5**.

#### 4.2 La médiane
La **médiane** est **la valeur du milieu** : une fois les valeurs rangées dans l'ordre, il y a **autant de valeurs au-dessus qu'en dessous**.

**Méthode :**
1. Ranger les valeurs dans l'ordre croissant.
2. Si **n est impair**, la médiane est la valeur centrale. Exemple (1, 1, 1, 3, 4, 8, 9) → médiane = **3**.
3. Si **n est pair**, la médiane est la moyenne des deux valeurs centrales.

**Exemple** — Série 5, 3, 6, 4, 7, 5, 9, 6, 4, 3, 2, 6 rangée : 9, 7, 6, 6, 6, 5, 5, 4, 4, 3, 3, 2.
Les deux valeurs centrales (6ᵉ et 7ᵉ) sont 5 et 5 ⟹ médiane = **5**.

#### 4.3 Le mode
Le **mode** est **la valeur la plus fréquente**, c'est-à-dire le **pic de la distribution**. C'est un **indicateur faible** du comportement du milieu. Une distribution qui présente **deux pics** est dite **bimodale**.

**Exemple** — Série 5, 3, 6, 4, 7, 5, 9, 6, 4, 3, 2, 6 : la valeur **6** apparaît trois fois ⟹ mode = **6**.

#### 4.4 Moyenne ou médiane ? Le cas des valeurs exceptionnelles
**Parfois la médiane est un meilleur indicateur** du comportement du milieu, en particulier **quand il y a des valeurs exceptionnelles (« outliers »)** dans les données.

Illustration — Salaires de fonctionnaires US pris au hasard :

| | Cas 1 | Cas 2 |
|---|---|---|
| Travailleur 1 | 30 000 $ | 30 000 $ |
| Travailleur 2 | 35 000 $ | 35 000 $ |
| Travailleur 3 | 40 000 $ | 40 000 $ |
| Travailleur 4 | 45 000 $ | 45 000 $ |
| Travailleur 5 / Président | 50 000 $ | **400 000 $** |
| **Moyenne** | 40 000 $ | 110 000 $ |
| **Médiane** | 40 000 $ | 40 000 $ |

➡️ Dans le **Cas 2**, l'outlier (400 000 $) tire la **moyenne** vers le haut (110 000 $) et ne représente plus le « salarié type ». La **médiane** (40 000 $) reste, elle, fidèle au milieu réel. *Calculez moyenne et médiane dans les deux cas pour vous en convaincre.*

### 5. Mesures de la dispersion
La dispersion répond à : « à quel point les valeurs s'écartent-elles les unes des autres ? ». Trois mesures principales :

| Mesure | Définition | À retenir |
|---|---|---|
| **Étendue (Range)** | La plus grande valeur moins la plus petite | Facile à calculer, bon pour les petits échantillons, **très influencée par un outlier** |
| **Variance** | Une mesure de la distance des points à la moyenne | Unité = unité des données **élevée au carré** ; utilisée dans les tests statistiques |
| **Écart-type (Standard Deviation)** | La **racine carrée de la variance** | Mesure de dispersion **la plus courante** ; **peu influencée** par les outliers |

#### 5.1 L'étendue (Range)
L'**étendue** est **la plus grande valeur moins la plus petite**. Elle est facile à calculer et adaptée aux petits échantillons, mais **très influencée par une valeur anormalement grande** (outlier).

**Formule :** R = (valeur max) − (valeur min)

**Exemple** — Série 9, 7, 6, 6, 6, 5, 5, 4, 4, 3, 3, 2 : R = 9 − 2 = **7**.

#### 5.2 La variance
La **variance** est **une mesure de la distance entre les valeurs et la moyenne**. Elle est utilisée dans les tests statistiques pour représenter la dispersion. Attention : **son unité est l'unité des données initiales élevée au carré** (d'où l'usage de l'écart-type pour revenir à l'unité d'origine).

**Formule (variance d'un échantillon) :**

$$s^2 = \frac{1}{n-1}\sum_{i=1}^{n}\left(x_i - \bar{X}\right)^2$$

> Le diviseur **n − 1** s'appelle le nombre de **degrés de liberté**. On l'utilise pour la variance d'un **échantillon**.

#### 5.3 L'écart-type (Standard Deviation)
L'**écart-type** est **la racine carrée de la variance**. C'est la mesure de dispersion **la plus courante** pour les collections de **plus de 10 objets**, elle **marche aussi pour les petits échantillons** et elle est **peu influencée par les valeurs fortes** (outliers).

**Formule :**

$$s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}\left(x_i - \bar{X}\right)^2} = \sqrt{s^2}$$

#### 5.4 Calculer la variance et l'écart-type — méthode pas à pas
Procédure issue du support (à reproduire dans un tableau) :

1. **Compter** les valeurs (n) et les **additionner** pour obtenir le total.
2. **Diviser** le total par n pour trouver la **moyenne** X̄.
3. Pour chaque valeur, **retrancher la moyenne** (xᵢ − X̄) : c'est la distance à la moyenne.
4. **Élever au carré** chacune de ces distances : (xᵢ − X̄)².
5. **Additionner** tous les carrés pour obtenir la **« Sum of Squares »** Σ(xᵢ − X̄)².
6. **Diviser** la Sum of Squares par **n − 1** (degrés de liberté) → **variance** s².
7. **Prendre la racine carrée** de la variance → **écart-type** s.

**Exercice résolu** — Échantillon : 8, 13, 7, 10, 12, 11, 10, 9.

| Xᵢ | 8 | 13 | 7 | 10 | 12 | 11 | 10 | 9 | **Total** |
|---|---|---|---|---|---|---|---|---|---|
| Xᵢ | | | | | | | | | **80** |
| Xᵢ − X̄ | −2 | 3 | −3 | 0 | 2 | 1 | 0 | −1 | 0 |
| (Xᵢ − X̄)² | 4 | 9 | 9 | 0 | 4 | 1 | 0 | 1 | **28** |

- n = 8, total = 80 ⟹ **moyenne X̄ = 80 ÷ 8 = 10**.
- **Sum of Squares = 28**.
- **Variance s² = 28 ÷ (8 − 1) = 28 ÷ 7 = 4**.
- **Écart-type s = √4 = 2**.

#### 5.5 Quelle mesure choisir ? (exercice d'entraînement)
Pour chaque collection, repérez quelle(s) mesure(s) du **milieu** et de la **dispersion** sont les plus pertinentes (plusieurs réponses possibles). Indice : repérez d'abord la présence d'un **outlier**.

| Collection | Milieu (Moyenne / Médiane / Mode) | Dispersion (Étendue / Variance / Écart-type) |
|---|---|---|
| 2, 5, 3 | ? | ? |
| 3, 4, 6, 1, 4, 5, 7, 2, 4, 1, **1000**, 5, 7, 3 | ? | ? |
| 3, 4, 6, 1, 4, 5, 7, 2, 4, 1, 5, 7, 3, 3, 7, 4 | ? | ? |
| 2, 4, 6, **651** | ? | ? |

> 🔑 Repère de lecture : dès qu'une valeur extrême (1000, 651…) apparaît, la **médiane** est plus fiable que la moyenne et l'**écart-type** est préférable à l'étendue (l'étendue est dominée par l'outlier).

> ⚠️ **Important :** Moyenne, médiane, étendue, écart-type et variance **s'appliquent quelle que soit l'allure de la distribution** des valeurs. On peut donc toujours les calculer, même si la distribution n'est pas normale.

### 6. Allure de la distribution
L'**allure de la distribution** décrit **comment les données sont dispersées**. Principaux types de distributions :

- **Normale** (aussi appelée **Gaussienne** ou *« Bell curve »* — courbe en cloche).
- Distribution **F**.
- Distribution **T**.
- Distribution du **Chi deux** (χ²).
- Distribution **uniforme**.
- Distribution de **Weibull**.

#### 6.1 Des points à la courbe : dotplot, histogramme, courbe
Exemple fil rouge : *un sac de billes est trié en fonction du diamètre* (échelle 0,5 → 1,5 cm).

- **Dotplot** — On place un point (ou on empile des points) pour chaque bille, en fonction de son diamètre : on obtient la **fréquence** (nombre de cas) en fonction du diamètre. C'est le graphe le plus **naturel**.
- **Histogramme** — Si l'on remplace les points empilés par des **barres** dont la hauteur représente le nombre de billes, on obtient un **histogramme**.
- **Courbe de distribution** — Si l'on mesurait un **nombre infini** de billes avec un incrément de taille **infiniment petit**, l'histogramme deviendrait une **courbe de distribution** continue.
- **Fréquence estimée** — Le nombre de cas qui se produisent **entre deux valeurs** correspond approximativement à la **surface sous la courbe** entre ces deux valeurs.

> 🖼️ *Schémas non transcriptibles :* le support illustre la progression dotplot → histogramme → courbe en cloche sur l'axe 0,5–1,5 cm, ainsi que la surface sous la courbe entre deux bornes. Voir le PDF source « 18. Statistiques Descriptives.pdf » (lien en bas de module).

#### 6.2 Modèles mathématiques
Lorsqu'une distribution connue (un **modèle mathématique**) **coïncide avec vos données**, ce modèle peut servir à représenter la population. Intérêts :
- On utilise des **formules mathématiques pré-établies**.
- La population **toute entière** peut être définie avec **peu de paramètres** (par ex. moyenne et écart-type pour la loi normale).
- On peut **prédire les futurs points** de cette population.

### 7. La loi normale (Gaussienne)
La **distribution normale** est la plus importante en Six Sigma :

- **Fréquente dans la nature.**
- **Symétrique** : la moitié gauche est le miroir de la moitié droite.
- **La moyenne, la médiane et le mode** se produisent tous les trois **exactement au milieu** de la courbe.
- **Quand vous connaissez la moyenne et l'écart-type, vous connaissez la courbe entière.**

#### 7.1 La règle 68 / 95 / 99,7 %
Pour une distribution normale, autour de la moyenne :

| Intervalle autour de la moyenne | Pourcentage des cas |
|---|---|
| ± 1 écart-type (±1σ) | ≈ **68 %** |
| ± 2 écarts-types (±2σ) | ≈ **95 %** |
| ± 3 écarts-types (±3σ) | ≈ **99,7 %** |

> 🖼️ *Schéma non transcriptible :* courbe en cloche centrée sur la moyenne, avec les bandes −3σ, −2σ, −1σ, +1σ, +2σ, +3σ et les aires 68 % / 95 % / 99,7 %. Voir le PDF source.

#### 7.2 Application : le jeu de billes (estimer un taux de rejet)
Si la taille des billes est distribuée **normalement**, quel pourcentage de billes sera **rejeté** selon les spécifications ? (Solutions ci-dessous.)

<details>
<summary>👉 Voir les réponses du jeu de billes</summary>

1. **Spécifications à ±2 écarts-types autour de la moyenne** : ±2σ contient 95 % des billes ⟹ rejet = 100 % − 95 % = **5 %**.
2. **Limite haute = moyenne, limite basse = −12 écarts-types** : la moitié des billes est sous la moyenne et quasiment aucune au-delà de 12σ ⟹ rejet = 50 % − 0 % = **50 %**.
3. **De −6σ à +1σ** : 6σ sous la moyenne contient ≈ 50 % des billes ; +1σ au-dessus contient 68 % ÷ 2 = 34 %. Acceptées = 50 % + 34 % = 84 % ⟹ rejet = 100 % − 84 % = **16 %**.
4. **Probabilité d'avoir une bille à plus de 6σ sous la moyenne** (si rien ne perturbe le processus) : **à peu près zéro**.

</details>

## 🧰 Outils & modèles associés
| Outil / modèle | À quoi ça sert | Source |
|---|---|---|
| Fiche Outil « Statistique Descriptive » | Mémo de synthèse : définitions population/échantillon, mesures du centre et de dispersion, règle 68/95/99,7 % de la loi normale | [Ouvrir](https://drive.google.com/file/d/1dOJQHYrqXvon3spme7oIoHAVgNZFOWcn/view) |
| Support de formation « Statistiques Descriptives » | Cours complet avec exemples, exercices et schémas (dotplot, histogramme, courbe normale) | [Ouvrir](https://drive.google.com/file/d/13sJMTpQpoUkoyYJxOhriZy4Zy6M2fV93/view) |
| Tableau de calcul de la variance (Xᵢ / Xᵢ−X̄ / (Xᵢ−X̄)²) | Gabarit pas à pas pour calculer moyenne, Sum of Squares, variance et écart-type | Voir § 5.4 (reproductible dans un tableur) |

## ✅ Application directe — « À faire maintenant »
> Objectif : appliquer immédiatement, sur votre propre terrain, ce que vous venez d'apprendre.

**Exercice 1 — Décrire un jeu de données de votre terrain**
1. **Collectez ~10 valeurs** mesurables sur votre propre activité (ex. : durée d'une étape en minutes, nombre de défauts par lot, temps d'attente client, longueur d'une pièce, nombre d'appels par heure…). Notez l'unité.
2. **Rangez** vos valeurs dans l'ordre croissant.
3. Calculez la **moyenne** : X̄ = (somme des valeurs) ÷ n.
4. Calculez la **médiane** : valeur centrale (n impair) ou moyenne des deux valeurs centrales (n pair).
5. Calculez l'**étendue** : R = valeur max − valeur min.
6. Calculez l'**écart-type** en suivant le tableau du § 5.4 :
   - colonne 1 : vos valeurs Xᵢ ; colonne 2 : Xᵢ − X̄ ; colonne 3 : (Xᵢ − X̄)² ;
   - **Sum of Squares** = Σ(Xᵢ − X̄)² ; **variance** s² = Sum of Squares ÷ (n − 1) ; **écart-type** s = √s².
7. **Interprétez** : la moyenne et la médiane sont-elles proches ? Si elles diffèrent nettement, cherchez un **outlier** et indiquez quel indicateur est le plus représentatif. Que dit l'écart-type sur la **régularité** de votre processus (faible = régulier, élevé = dispersé) ?

- **Livrable attendu :** un petit tableau (10 valeurs + colonnes Xᵢ−X̄ et (Xᵢ−X̄)²) accompagné des 4 résultats chiffrés (moyenne, médiane, étendue, écart-type) et de 2–3 phrases d'interprétation.
- **Critères de réussite :**
  - les 4 indicateurs sont calculés avec les **bonnes formules** et les bonnes unités (l'écart-type est dans l'unité des données, la variance dans l'unité²) ;
  - le diviseur **n − 1** est bien utilisé pour la variance de l'échantillon ;
  - la présence (ou l'absence) d'un **outlier** est signalée et le choix moyenne/médiane est justifié ;
  - l'interprétation relie l'écart-type à la **dispersion** réelle du processus.
- **Temps conseillé :** 25 min.

**Exercice 2 — Estimer un pourcentage avec la loi normale (« taille des participants »)**
1. Recueillez la **taille** (ou une autre grandeur continue) de plusieurs personnes / pièces autour de vous.
2. Déterminez **moyenne, médiane, étendue et écart-type** de cette série.
3. En **supposant** les valeurs distribuées **normalement** et l'échantillon représentatif, estimez, à l'aide de la règle 68/95/99,7 %, **quel pourcentage dépasse un seuil donné** (par ex. : quel % de la population fait plus de 1 m 80 ?).
- **Livrable attendu :** les 4 indicateurs + une estimation chiffrée du pourcentage au-delà du seuil, avec le raisonnement (combien de σ sépare le seuil de la moyenne).
- **Critères de réussite :** le seuil est correctement converti en nombre d'écarts-types et le pourcentage est déduit de façon cohérente de la règle 68/95/99,7 %.
- **Temps conseillé :** 15 min.

## 🧠 À retenir
- **Décrire un jeu de données = répondre à 3 questions** : centre, dispersion, allure.
- La **moyenne** = somme ÷ nombre de valeurs ; c'est souvent le meilleur indicateur du centre… **sauf en présence d'outliers**, où la **médiane** est plus fiable.
- Le **mode** (valeur la plus fréquente) est un indicateur **faible** du centre ; deux pics ⟹ distribution **bimodale**.
- **Dispersion** : étendue (max − min, sensible aux outliers), variance (distance au carré à la moyenne), **écart-type = √variance** (le plus utilisé, peu sensible aux outliers).
- Pour un **échantillon**, on divise la Sum of Squares par **n − 1** (degrés de liberté).
- **Variance en unité², écart-type en unité d'origine** : c'est pour cela qu'on préfère l'écart-type pour communiquer.
- Lettres **romaines** = échantillon (X̄, s, s²) ; lettres **grecques** = population (μ, σ, σ²).
- Pour une **loi normale** : moyenne = médiane = mode au centre ; **68 % à ±1σ, 95 % à ±2σ, 99,7 % à ±3σ** ; connaître moyenne + écart-type suffit à connaître toute la courbe.

## 📝 Quiz de validation
1. La **moyenne** se calcule en…
   - a) prenant la valeur du milieu
   - b) divisant la somme des valeurs par leur nombre
   - c) prenant la valeur la plus fréquente
   - d) soustrayant le min du max
2. En présence d'une **valeur exceptionnelle (outlier)**, quel indicateur du centre est généralement le plus représentatif ?
   - a) La moyenne
   - b) La médiane
   - c) Le mode
   - d) L'étendue
3. L'**écart-type** est…
   - a) le carré de la variance
   - b) la racine carrée de la variance
   - c) le max moins le min
   - d) la valeur la plus fréquente
4. Pour l'échantillon **8, 13, 7, 10, 12, 11, 10, 9** (moyenne = 10, Sum of Squares = 28), la **variance** vaut :
   - a) 28
   - b) 3,5
   - c) 4
   - d) 2
5. Dans une distribution **normale**, le pourcentage de cas compris entre **±2 écarts-types** autour de la moyenne est d'environ :
   - a) 68 %
   - b) 95 %
   - c) 99,7 %
   - d) 50 %
6. **Vrai ou faux ?** Moyenne, médiane, étendue, variance et écart-type ne peuvent se calculer que si la distribution est normale.
   - a) Vrai
   - b) Faux

<details>
<summary>👉 Voir les réponses</summary>

1. **b** — La moyenne = somme de toutes les valeurs ÷ nombre de valeurs.
2. **b** — La médiane n'est pas tirée par les valeurs extrêmes, contrairement à la moyenne.
3. **b** — L'écart-type est la racine carrée de la variance (s = √s²).
4. **c** — Variance d'échantillon = Sum of Squares ÷ (n − 1) = 28 ÷ 7 = 4 (et l'écart-type = √4 = 2).
5. **b** — Règle 68/95/99,7 % : ±2σ ≈ 95 % des cas.
6. **b (Faux)** — Ces mesures s'appliquent **quelle que soit l'allure** de la distribution ; la normalité n'est requise que pour appliquer la règle 68/95/99,7 %.

</details>

## 🔗 Sources & pour aller plus loin
- 📄 **18. Statistiques Descriptives.pdf** — [Ouvrir dans Drive](https://drive.google.com/file/d/13sJMTpQpoUkoyYJxOhriZy4Zy6M2fV93/view)
- 📄 **18. Statistique Descriptive Fiche Outil.pdf** — [Ouvrir dans Drive](https://drive.google.com/file/d/1dOJQHYrqXvon3spme7oIoHAVgNZFOWcn/view)

---
*Contenu pédagogique d'après les supports Progress Partners — « La passion de la performance ».
Réorganisé en module de formation autoportant.*
