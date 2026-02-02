# 🎵 Cartes-Partition - Module de Lecture Musicale

## Vue d'ensemble

**Cartes-Partition** est une fonctionnalité interactive d'entraînement à la lecture de partition musicale avec reconnaissance vocale intégrée. Conçue spécifiquement pour les musiciens débutants et intermédiaires, elle combine l'apprentissage visuel des notes sur une portée avec la validation vocale en temps réel.

## ✨ Fonctionnalités Principales

### 🎼 Partition Interactive
- Génération automatique de **10 notes aléatoires**
- Affichage sur une **portée musicale en clé de Sol**
- Rendu SVG haute qualité avec animations fluides
- Support des lignes supplémentaires pour toutes les notes

### 🎤 Reconnaissance Vocale
- **Dictée vocale en français** (API Web Speech)
- Reconnaissance en temps réel avec affichage du transcript
- Support de **multiples variantes de prononciation**
- Validation automatique instantanée

### 📊 Suivi de Progression
- Score en temps réel (bonnes/mauvaises réponses)
- Barre de progression visuelle
- Taux de réussite calculé automatiquement
- Feedback visuel immédiat (vert/rouge)

### 🎯 Double Validation
- **Automatique** : Par reconnaissance vocale
- **Manuelle** : Boutons Correct/Incorrect disponibles

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (version 14+)
- Navigateur compatible : Chrome, Edge ou Safari
- Microphone fonctionnel

### Installation

```bash
# Cloner le projet
git clone [votre-repo]

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Accès à la fonctionnalité
1. Ouvrir l'application dans votre navigateur
2. Depuis le menu principal, cliquer sur **"Cartes - Partition"**
3. Autoriser l'accès au microphone si demandé
4. Cliquer sur **"🎤 Commencer à dicter"**
5. Dicter les notes affichées sur la partition

## 🎯 Utilisation

### Étape 1 : Activation
```
Cliquez sur "🎤 Commencer à dicter"
→ Le bouton devient rouge : microphone actif
```

### Étape 2 : Dictée
```
Regardez la note en surbrillance bleue
→ Prononcez clairement le nom de la note
→ Le système valide automatiquement
```

### Étape 3 : Progression
```
✓ Note correcte → marquée en vert, passage automatique
✗ Note incorrecte → marquée en rouge, passage automatique
Score mis à jour en temps réel
```

### Étape 4 : Résultat
```
Après 10 notes → Affichage du score final
Option de générer une nouvelle série
```

## 📝 Variantes de Prononciation Acceptées

| Note | Prononciations valides |
|------|------------------------|
| Do | "do", "doh", "c" |
| Ré | "ré", "re", "d" |
| Mi | "mi", "e" |
| Fa | "fa", "f" |
| Sol | "sol", "g" |
| La | "la", "a" |
| Si | "si", "b" |
| Do# | "do dièse", "do diese", "do sharp" |
| Si♭ | "si bémol", "si bemol", "sib" |

## 🌐 Compatibilité

### ✅ Navigateurs Supportés
- **Google Chrome** (Desktop & Mobile) - ⭐ Recommandé
- **Microsoft Edge** (Desktop & Mobile)
- **Safari** (macOS & iOS 14.5+)

### ❌ Non Compatible
- Firefox (API Web Speech non disponible)
- Internet Explorer
- Navigateurs obsolètes

> **Note** : Un message d'alerte s'affiche automatiquement si votre navigateur n'est pas compatible. Vous pouvez toujours utiliser la validation manuelle.

## 🏗️ Architecture Technique

### Structure des Fichiers
```
src/features/score-flashcards/
├── ScoreFlashcards.tsx          # Composant principal
├── index.ts                      # Export
└── README.md                     # Documentation technique
```

### Composants React

#### ScoreFlashcards (Principal)
Gère la logique métier :
- Génération des notes aléatoires
- Reconnaissance vocale (Web Speech API)
- Validation et scoring
- État de progression

#### MusicalStaff (Rendu)
Affiche la partition :
- Portée musicale en SVG
- Positionnement des notes
- Animations et indicateurs visuels

### Technologies Utilisées
- **React 18** avec Hooks (useState, useEffect, useCallback, useRef)
- **TypeScript** (typage strict)
- **Mantine UI** (composants interface)
- **Lucide React** (icônes)
- **Web Speech API** (reconnaissance vocale native)
- **SVG** (rendu partition)

## 🎨 Interface Utilisateur

### Palette de Couleurs
- 🔵 **Bleu** : Note actuelle, actions principales
- 🟢 **Vert** : Validation correcte, succès
- 🔴 **Rouge** : Validation incorrecte, enregistrement actif
- ⚪ **Gris** : Notes en attente, état neutre

### Animations
- **Pulse** : Note actuelle (surbrillance bleue animée)
- **Fade In** : Transcript vocal
- **Transitions** : Changements d'état fluides

### Responsive Design
- Adapté mobile et tablette
- Partition scrollable horizontalement
- Contrôles optimisés tactile

## 📊 Système de Scoring

```typescript
Score = (Notes Correctes / Total Notes) × 100%

Exemple :
8 bonnes réponses sur 10 = 80% de réussite
```

**Affichage en temps réel** :
- Badge vert : Nombre de réponses correctes
- Badge rouge : Nombre de réponses incorrectes
- Barre de progression : Avancement visuel

## 🔧 Configuration Avancée

### Modifier le Nombre de Notes
```typescript
// Dans ScoreFlashcards.tsx
const generateNotes = useCallback(() => {
  const notes: NoteResult[] = [];
  for (let i = 0; i < 10; i++) {  // ← Modifier ici
    // ...
  }
}, []);
```

### Ajouter des Variantes de Prononciation
```typescript
const NOTE_VARIANTS: Record<string, string[]> = {
  "Do": ["do", "doh", "c", "nouvelle-variante"],
  // ...
};
```

### Changer la Langue de Reconnaissance
```typescript
recognition.lang = "fr-FR";  // ← Modifier (ex: "en-US")
```

## 🐛 Résolution de Problèmes

### Le microphone ne s'active pas
**Solutions** :
1. Vérifier les permissions du navigateur (icône cadenas dans la barre d'adresse)
2. Recharger la page et réessayer
3. Tester le micro dans les paramètres système
4. Utiliser la validation manuelle

### La reconnaissance ne fonctionne pas
**Solutions** :
1. Parler plus clairement et distinctement
2. Réduire les bruits de fond
3. Se rapprocher du microphone (30-50 cm)
4. Vérifier la connexion internet
5. Essayer un autre navigateur (Chrome recommandé)

### Les notes ne s'affichent pas
**Solutions** :
1. Vider le cache du navigateur
2. Vérifier la console JavaScript (F12)
3. Recharger avec Ctrl+F5 (hard refresh)

## 📚 Documentation Complète

- **[GUIDE_CARTES_PARTITION.md](./GUIDE_CARTES_PARTITION.md)** - Guide utilisateur détaillé
- **[CHANGELOG_CARTES_PARTITION.md](./CHANGELOG_CARTES_PARTITION.md)** - Historique des versions
- **[EXEMPLES_VISUELS.md](./EXEMPLES_VISUELS.md)** - Maquettes et diagrammes
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Détails techniques
- **[src/features/score-flashcards/README.md](./src/features/score-flashcards/README.md)** - Doc développeur

## 🎓 Conseils d'Apprentissage

### Débutant
- Concentrez-vous sur la **précision** plutôt que la vitesse
- Utilisez la validation manuelle si besoin
- Objectif : 70-80% de réussite

### Intermédiaire
- Essayez de lire **sans regarder le nom affiché**
- Augmentez votre vitesse de reconnaissance
- Objectif : 85-95% de réussite

### Avancé
- Lecture à vue instantanée
- Enchaînez plusieurs séries
- Objectif : 95-100% de réussite

## 🚀 Améliorations Futures

### Prochaines Versions
- [ ] Support registres aigu et grave complets
- [ ] Choix du niveau de difficulté
- [ ] Statistiques de progression multi-sessions
- [ ] Mode entraînement avec feedback audio
- [ ] Clé de Fa
- [ ] Rythmes musicaux (noires, blanches, rondes)
- [ ] Exercices personnalisés
- [ ] Export des résultats (PDF/CSV)
- [ ] Mode multi-joueurs / compétition
- [ ] Gamification (badges, achievements)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet fait partie de l'application Hautbois Assistant.

## 🙏 Remerciements

- **Mantine UI** pour les composants interface
- **Lucide** pour les icônes
- **Web Speech API** de W3C
- Tous les testeurs et contributeurs

## 📞 Support

Pour toute question ou suggestion :
- Ouvrir une issue sur GitHub
- Consulter la documentation complète
- Vérifier les exemples dans `EXEMPLES_VISUELS.md`

---

**Développé avec ❤️ pour les musiciens**

**Version** : 1.0.0  
**Dernière mise à jour** : 2024  
**Statut** : ✅ Production Ready

🎵 **Bon entraînement musical !** 🎶