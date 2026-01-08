# 🎵 Hautbois - Compagnon de Pratique du Hautbois

Application web moderne pour vous aider à étudier la musique et pratiquer le hautbois.

## Fonctionnalités

### 🎴 Cartes Mémoire
Pratiquez la reconnaissance des notes avec deux modes :
- **Noms de Notes** : Voir le nom de la note (Do4, Sol5, etc.) et l'entendre
- **Notes sur Portée** : Voir la notation musicale et identifier la note

Chaque carte mémoire inclut :
- Affichage visuel (nom de note ou portée musicale)
- Lecture audio avec Tone.js
- Fonctionnalité Afficher/Masquer la réponse
- Génération aléatoire de notes

### 🎼 Aide aux Notes
Apprenez les positions de doigté du hautbois :
- Sélectionnez n'importe quelle note de Do4 à Si6
- Visualisez la note sur une portée musicale
- Consultez les instructions de doigté détaillées
- Jouez les notes pour entendre leur son
- **Mode Pratique** : Utilisez votre microphone pour détecter la note que vous jouez et obtenez un retour instantané

## Stack Technique

- **React 18** avec **TypeScript** - React moderne avec sécurité de type complète
- **Vite** - Outil de build et serveur de développement rapide
- **TailwindCSS** + **DaisyUI** - Composants UI élégants et réactifs
- **VexFlow** - Rendu professionnel de notation musicale
- **Tone.js** - Framework Web Audio pour jouer des notes
- **Pitchy** - Détection de hauteur en temps réel depuis le microphone
- **i18next** - Internationalisation (français par défaut)

## Démarrage

### Prérequis
- Node.js 18+ et npm

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

### Développement
L'application sera disponible sur `http://localhost:5173/`

## Utilisation

1. **Écran d'Accueil** : Choisissez entre Cartes Mémoire ou Aide aux Notes
2. **Cartes Mémoire** : 
   - Sélectionnez votre mode de pratique
   - Cliquez sur l'icône haut-parleur pour entendre la note
   - Utilisez "Afficher la Réponse" pour révéler le nom de la note
   - Cliquez sur "Note Suivante" pour un nouveau défi
3. **Aide aux Notes** :
   - Cliquez sur n'importe quel bouton de note pour voir son doigté
   - Utilisez "Jouer la Note" pour entendre le son
   - Activez "Commencer l'Écoute" pour pratiquer avec votre hautbois et obtenir un retour en temps réel

## Structure du Projet

L'application utilise une **architecture basée sur les fonctionnalités** pour une meilleure organisation et maintenabilité.

```
src/
├── features/             # Fonctionnalités principales
│   ├── home/            # Menu principal
│   ├── flashcards/      # Cartes mémoire
│   └── note-helper/     # Aide aux doigtés
├── shared/              # Code partagé
│   ├── hooks/          # Hooks React personnalisés
│   ├── utils/          # Fonctions utilitaires
│   └── constants/      # Constantes
├── i18n/               # Configuration i18n
├── App.tsx             # Composant principal
├── main.tsx            # Point d'entrée
└── index.css           # Styles Tailwind
```

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour plus de détails sur l'organisation du code.

## Internationalisation

L'application utilise `i18next` et `react-i18next` pour la gestion des traductions.

- **Langue par défaut** : Français
- **Notation musicale** : Solfège français (Do, Ré, Mi, Fa, Sol, La, Si)
- **Structure extensible** : Prête pour l'ajout de nouvelles langues

### Ajouter une Traduction

1. Créer un nouveau fichier dans `src/i18n/locales/` (ex: `en.ts`)
2. Ajouter les traductions dans le même format que `fr.ts`
3. Importer et ajouter dans `src/i18n/config.ts`

## Licence

MIT

