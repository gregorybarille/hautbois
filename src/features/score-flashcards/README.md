# Cartes-Partition (Score Flashcards)

## Description

La fonctionnalité **Cartes-Partition** permet aux musiciens de s'entraîner à lire les notes sur une partition musicale en utilisant la reconnaissance vocale. Le système génère 10 notes aléatoires affichées sur une portée musicale, et l'utilisateur doit les dicter vocalement pour valider sa lecture.

## Fonctionnalités

### 🎵 Génération de Notes
- Génère automatiquement 10 notes aléatoires du registre médium
- Affichage sur une portée musicale avec clé de Sol
- Notes affichées avec hampes et lignes supplémentaires si nécessaire

### 🎤 Reconnaissance Vocale
- Utilise l'API Web Speech pour la reconnaissance vocale en français
- Écoute en continu et détecte automatiquement les notes dictées
- Support de multiples variantes de prononciation pour chaque note

### ✅ Validation et Scoring
- Validation automatique des notes dictées
- Marquage visuel des notes (correctes en vert, incorrectes en rouge)
- Mise en surbrillance de la note actuelle en bleu
- Calcul du score en temps réel
- Affichage du taux de réussite à la fin

### 🔄 Contrôles
- Bouton pour démarrer/arrêter la reconnaissance vocale
- Boutons de validation manuelle (Correct/Incorrect)
- Bouton de rafraîchissement pour générer une nouvelle série
- Progression visuelle avec barre de progression

## Variantes de Prononciation Supportées

Le système reconnaît plusieurs façons de prononcer chaque note :

- **Do** : "do", "doh", "c"
- **Ré** : "ré", "re", "d"
- **Mi** : "mi", "e"
- **Fa** : "fa", "f"
- **Sol** : "sol", "g"
- **La** : "la", "a"
- **Si** : "si", "b"
- **Notes altérées** : "do dièse", "mi bémol", etc.

## Compatibilité Navigateurs

La reconnaissance vocale nécessite un navigateur compatible avec l'API Web Speech :

✅ **Supporté** :
- Google Chrome (Desktop & Mobile)
- Microsoft Edge
- Safari (iOS 14.5+)

❌ **Non supporté** :
- Firefox (API non disponible)
- Anciens navigateurs

Un message d'alerte s'affiche automatiquement si le navigateur n'est pas compatible.

## Utilisation

1. Cliquez sur "Commencer à dicter" pour activer le microphone
2. Dictez le nom de la note affichée (note en surbrillance bleue)
3. Le système valide automatiquement votre réponse
4. Passez à la note suivante automatiquement
5. À la fin, consultez votre score et générez une nouvelle série

### Validation Manuelle

Si la reconnaissance vocale ne fonctionne pas correctement, vous pouvez utiliser les boutons :
- **Correct** ✓ : Marquer la note comme correcte
- **Incorrect** ✗ : Marquer la note comme incorrecte

## Architecture Technique

### Composants

#### `ScoreFlashcards`
Composant principal qui gère :
- La génération des notes aléatoires
- La reconnaissance vocale
- La validation et le scoring
- L'état de progression

#### `MusicalStaff`
Composant de rendu SVG pour :
- Afficher la portée musicale
- Positionner les notes correctement
- Afficher les indicateurs visuels de statut
- Animer la note actuelle

### État

```typescript
interface NoteResult {
  note: string;                                  // Nom de la note
  status: "pending" | "correct" | "incorrect";  // Statut de validation
  userInput?: string;                            // Ce que l'utilisateur a dit
}
```

### Algorithme de Positionnement

Les notes sont positionnées sur la portée en utilisant un système de "steps" :
- Step 0 = Ligne supérieure de la portée (Fa aigu)
- Step 10 = Do médium (sous la portée)
- Chaque step représente un demi-espace sur la portée

## Améliorations Futures

- [ ] Support de notes du registre aigu et grave
- [ ] Ajout d'altérations (dièses, bémols) de manière visible sur la partition
- [ ] Mode de difficulté (débutant, intermédiaire, avancé)
- [ ] Historique des sessions et statistiques de progression
- [ ] Export des résultats
- [ ] Mode entraînement avec feedback audio
- [ ] Support de la clé de Fa
- [ ] Exercices personnalisés (choix des notes à travailler)

## Dépendances

- **React** : Framework UI
- **Mantine** : Composants UI
- **Lucide React** : Icônes
- **Web Speech API** : Reconnaissance vocale (natif navigateur)

## Notes de Développement

- La reconnaissance vocale est configurée en français (`fr-FR`)
- Les résultats intermédiaires sont affichés en temps réel
- La validation est automatique après un résultat final de reconnaissance
- Les notes du registre médium sont privilégiées pour éviter les confusions (pas de "Grave" ou "Aigu")