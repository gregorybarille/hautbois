# 🎵 Hautbois - Oboe Practice Companion

A modern web application to help you study music and practice the oboe.

## Features

### 🎴 Flashcards
Practice note recognition with two modes:
- **Note Names**: See the note name (e.g., C4, G5) and hear it played
- **Notes on Score**: See musical notation and identify the note

Each flashcard includes:
- Visual display (note name or musical staff)
- Audio playback with Tone.js
- Show/Hide answer functionality
- Random note generation

### 🎼 Note Helper
Learn oboe fingering positions:
- Select any note from C4 to B6
- View the note on a musical staff
- See detailed fingering instructions
- Play notes to hear their sound
- **Practice Mode**: Use your microphone to detect what note you're playing and get instant feedback

## Tech Stack

- **React 18** with **TypeScript** - Modern React with full type safety
- **Vite** - Fast build tool and dev server
- **TailwindCSS** + **DaisyUI** - Beautiful, responsive UI components
- **VexFlow** - Professional music notation rendering
- **Tone.js** - Web Audio framework for playing notes
- **Pitchy** - Real-time pitch detection from microphone input

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
The app will be available at `http://localhost:5173/`

## Usage

1. **Home Screen**: Choose between Flashcards or Note Helper
2. **Flashcards**: 
   - Select your practice mode
   - Click the speaker icon to hear the note
   - Use "Show Answer" to reveal the note name
   - Click "Next Note" for a new challenge
3. **Note Helper**:
   - Click any note button to see its fingering
   - Use "Play Note" to hear the sound
   - Enable "Start Listening" to practice with your oboe and get real-time feedback

## Project Structure

```
src/
├── components/
│   ├── Home.tsx          # Main menu with cards
│   ├── Flashcards.tsx    # Flashcard practice modes
│   └── NoteHelper.tsx    # Oboe fingering reference
├── App.tsx               # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Tailwind styles
```

## License

MIT

