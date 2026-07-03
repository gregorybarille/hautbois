# Exemples Visuels - Cartes-Partition 🎵

## Interface Principale

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cartes - Partition                            │
│         Dictez vocalement les notes affichées sur la partition   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Progression : 3 / 10                    ✓ 2        ✗ 1         │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░ 30%                        │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Partition Musicale (Clé de Sol)            │   │
│  │                                                          │   │
│  │   𝄞  ○  ○  ○  ○  ○  ●  ○  ○  ○  ○                       │   │
│  │     ─────────────────────────────────────                │   │
│  │     ─────────────────────────────────────                │   │
│  │     ─────────────────────────────────────                │   │
│  │     ─────────────────────────────────────                │   │
│  │     ─────────────────────────────────────                │   │
│  │      ✓   ✓   ✗                    ↑                      │   │
│  │                               Note actuelle               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎤 Vous avez dit :                                      │   │
│  │     sol                                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎵 Note actuelle :                                      │   │
│  │                                                           │   │
│  │          Sol                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│     [ 🎤 Commencer à dicter ]  [ ✓ Correct ]  [ ✗ Incorrect ]  │
│                                                                   │
│                  [ ↻  Générer de nouvelles notes ]              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## État : Écoute Active

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  🎵 Note actuelle :                                              │
│                                                                   │
│          Ré                                                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎤 Vous avez dit :                                      │   │
│  │     ré                                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│     [ 🔴 Arrêter ]  [ ✓ Correct ]  [ ✗ Incorrect ]              │
│        (pulsant)                                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Écran de Résultats

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cartes - Partition                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Progression : 10 / 10                   ✓ 8        ✗ 2         │
│  ████████████████████████████████████████ 100%                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │   ✅  Exercice terminé !                                 │   │
│  │                                                           │   │
│  │   Score final : 8 / 10                                   │   │
│  │                                                           │   │
│  │   Taux de réussite : 80%                                 │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│                   [ ↻  Nouvelle série ]                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Partition Musicale - Détail des États

### Note en attente (gris foncé)
```
   ○
   │
   │
```

### Note correcte (vert)
```
   ✓
   ●  ← Vert
   │
   │
```

### Note incorrecte (rouge)
```
   ✗
   ●  ← Rouge
   │
   │
```

### Note actuelle (bleu avec animation)
```
   ┌─┐
   │●│ ← Bleu pulsant
   └─┘
    │
```

## Positionnement des Notes sur la Portée

```
Clé de Sol (𝄞)

Fa aigu    ─────●─────  (Ligne 1)
Mi aigu          ●      (Espace)
Ré aigu    ─────●─────  (Ligne 2)
Do aigu          ●      (Espace)
Si         ─────●─────  (Ligne 3)
La               ●      (Espace)
Sol        ─────●─────  (Ligne 4)
Fa               ●      (Espace)
Mi         ─────●─────  (Ligne 5)
           ─────────────
Ré               ●      (Sous la portée)
           ─────────────
Do               ●      (Ligne supplémentaire)
```

## Flux d'Utilisation

```
    ┌─────────────┐
    │  Démarrage  │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────┐
    │ Génération de       │
    │ 10 notes aléatoires │
    └──────┬──────────────┘
           │
           ▼
    ┌─────────────────┐
    │ Activation du   │
    │ microphone      │
    └──────┬──────────┘
           │
           ▼
    ┌─────────────────┐
    │ Dictée de la    │◄─────┐
    │ note actuelle   │      │
    └──────┬──────────┘      │
           │                 │
           ▼                 │
    ┌─────────────────┐      │
    │ Validation      │      │
    │ automatique     │      │
    └──────┬──────────┘      │
           │                 │
           ▼                 │
    ┌─────────────────┐      │
    │ Note suivante?  ├──OUI─┘
    └──────┬──────────┘
           │ NON
           ▼
    ┌─────────────────┐
    │ Affichage du    │
    │ score final     │
    └──────┬──────────┘
           │
           ▼
    ┌─────────────────┐
    │ Nouvelle série? │
    └─────────────────┘
```

## Exemples de Reconnaissance Vocale

### Exemple 1 : Note simple
```
Note affichée : Sol
Utilisateur dit : "sol"
Résultat : ✅ CORRECT
```

### Exemple 2 : Note avec dièse
```
Note affichée : Do#
Utilisateur dit : "do dièse"
Résultat : ✅ CORRECT

Ou bien : "do diese"
Résultat : ✅ CORRECT

Ou bien : "do sharp"
Résultat : ✅ CORRECT
```

### Exemple 3 : Note avec bémol
```
Note affichée : Si♭
Utilisateur dit : "si bémol"
Résultat : ✅ CORRECT

Ou bien : "si bemol"
Résultat : ✅ CORRECT

Ou bien : "sib"
Résultat : ✅ CORRECT
```

### Exemple 4 : Erreur
```
Note affichée : Fa
Utilisateur dit : "mi"
Résultat : ❌ INCORRECT
```

## Légende des Couleurs

```
🔵 Bleu    : Note actuelle / Bouton principal
🟢 Vert    : Note correcte / Succès
🔴 Rouge   : Note incorrecte / Microphone actif
⚪ Gris    : Notes en attente / Neutre
🟡 Jaune   : Avertissement (non utilisé actuellement)
```

## Statistiques Affichées

```
╔════════════════════════════════════════╗
║         TABLEAU DE BORD                ║
╠════════════════════════════════════════╣
║  Progression :  7 / 10                 ║
║                                        ║
║  ✓ Correctes :     5                   ║
║  ✗ Incorrectes :   2                   ║
║                                        ║
║  Barre : ████████████████░░░░░░  70%   ║
╚════════════════════════════════════════╝
```

## Message d'Erreur - Navigateur Non Compatible

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  Navigateur non supporté                                     │
│                                                                   │
│  Votre navigateur ne supporte pas la reconnaissance vocale.     │
│  Veuillez utiliser Chrome, Edge ou Safari.                      │
└─────────────────────────────────────────────────────────────────┘
```

## Responsive - Vue Mobile

```
┌───────────────────┐
│  Cartes-Partition │
├───────────────────┤
│                   │
│  3 / 10           │
│  ✓ 2    ✗ 1      │
│  ███░░░░░░ 30%   │
│                   │
├───────────────────┤
│   Partition       │
│                   │
│   𝄞  ○ ○ ● ○ ○   │
│   ─────────────   │
│   ─────────────   │
│   ─────────────   │
│   ─────────────   │
│   ─────────────   │
│      ✓ ✓ ↑       │
│                   │
├───────────────────┤
│  🎤 Vous :        │
│     sol           │
│                   │
├───────────────────┤
│  🎵 Actuelle :    │
│                   │
│     Sol           │
│                   │
├───────────────────┤
│                   │
│ [🎤 Dicter]       │
│                   │
│ [✓]    [✗]        │
│                   │
│ [↻ Nouvelles]     │
│                   │
└───────────────────┘
```

---

## Légende des Symboles

| Symbole | Signification |
|---------|---------------|
| 𝄞 | Clé de Sol |
| ● | Note (tête pleine) |
| ○ | Note en attente |
| │ | Hampe de note |
| ✓ | Validation correcte |
| ✗ | Validation incorrecte |
| ↑ | Indicateur note actuelle |
| 🎤 | Microphone |
| 🔴 | Enregistrement actif |
| ↻ | Rafraîchir |
| ▶ | Démarrer |
| ⏸ | Pause |
| ⏹ | Arrêter |

---

**Astuce** : Ces représentations sont simplifiées. L'interface réelle utilise des graphiques SVG haute qualité avec animations fluides et design moderne !