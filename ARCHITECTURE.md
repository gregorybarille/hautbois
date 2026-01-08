# Structure du Projet Hautbois

Ce projet utilise une **architecture basée sur les fonctionnalités** (feature-based architecture) pour une meilleure organisation et maintenabilité du code.

## Structure des Dossiers

```
src/
├── features/              # Fonctionnalités principales de l'application
│   ├── home/             # Page d'accueil avec menu
│   │   ├── Home.tsx
│   │   └── index.ts
│   ├── flashcards/       # Cartes mémoire pour la pratique
│   │   ├── Flashcards.tsx
│   │   └── index.ts
│   └── note-helper/      # Aide aux doigtés du hautbois
│       ├── NoteHelper.tsx
│       └── index.ts
├── shared/               # Code partagé entre les fonctionnalités
│   ├── components/       # Composants réutilisables
│   ├── hooks/           # Hooks React personnalisés
│   │   ├── useNotation.ts      # Rendu de notation musicale
│   │   ├── useAudioSynth.ts    # Synthèse audio
│   │   └── usePitchDetection.ts # Détection de hauteur
│   ├── utils/           # Fonctions utilitaires
│   │   └── noteUtils.ts        # Conversion de notes
│   └── constants/       # Constantes de l'application
│       └── notes.ts            # Notes, doigtés, constantes musicales
├── i18n/                # Internationalisation
│   ├── config.ts        # Configuration i18next
│   └── locales/
│       └── fr.ts        # Traductions françaises
├── App.tsx              # Composant principal
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

## Principes de l'Architecture

### 1. Features (Fonctionnalités)
Chaque fonctionnalité principale est isolée dans son propre dossier :
- **home** : Menu principal avec navigation
- **flashcards** : Pratique de reconnaissance des notes
- **note-helper** : Guide de doigtés pour le hautbois

### 2. Shared (Partagé)
Code réutilisable entre plusieurs fonctionnalités :
- **hooks** : Logique React réutilisable
- **utils** : Fonctions utilitaires pures
- **constants** : Valeurs constantes et configuration
- **components** : Composants UI réutilisables (futur)

### 3. i18n (Internationalisation)
Gestion des traductions avec i18next :
- Support du français par défaut
- Structure extensible pour d'autres langues

## Conventions de Code

### Hooks Personnalisés
- `useNotation` : Rendu de notation musicale avec VexFlow
- `useAudioSynth` : Lecture de notes avec Tone.js
- `usePitchDetection` : Détection de notes via microphone

### Utilitaires de Notes
- `toFrenchNote()` : Convertit notation anglaise (C4) en solfège français (Do4)
- `toEnglishNote()` : Convertit solfège français en notation anglaise
- `frequencyToNote()` : Convertit une fréquence en note
- `getDisplayNoteName()` : Obtient le nom d'affichage d'une note

### Constantes
- `NOTE_NAMES` : Noms de notes en solfège français
- `NOTE_MAP` : Mapping anglais → français
- `REVERSE_NOTE_MAP` : Mapping français → anglais
- `OBOE_FINGERING_CHART` : Tableau de doigtés du hautbois
- `A4_FREQUENCY`, `SEMITONES_PER_OCTAVE`, etc. : Constantes musicales

## Ajout d'une Nouvelle Fonctionnalité

1. Créer un nouveau dossier dans `src/features/`
2. Créer le composant principal de la fonctionnalité
3. Créer un fichier `index.ts` pour l'export
4. Ajouter les traductions dans `src/i18n/locales/fr.ts`
5. Mettre à jour la navigation dans `App.tsx`

## Internationalisation

L'application utilise `react-i18next` pour la gestion des traductions.

### Utilisation
```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('home.title')}</h1>
}
```

### Ajout de Traductions
Modifier `src/i18n/locales/fr.ts` :
```typescript
export default {
  myFeature: {
    title: 'Mon Titre',
    description: 'Ma Description',
  }
}
```

## Avantages de cette Architecture

1. **Séparation des préoccupations** : Chaque fonctionnalité est indépendante
2. **Réutilisabilité** : Code partagé facilement accessible
3. **Maintenabilité** : Plus facile de localiser et modifier le code
4. **Scalabilité** : Ajouter de nouvelles fonctionnalités sans impacter les existantes
5. **Tests** : Plus facile de tester chaque fonctionnalité isolément
