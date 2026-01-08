import { useState } from 'react'
import Home from './features/home'
import Flashcards from './features/flashcards'
import NoteHelper from './features/note-helper'

type View = 'home' | 'flashcards' | 'noteHelper'

function App() {
  const [currentView, setCurrentView] = useState<View>('home')

  const renderView = () => {
    switch (currentView) {
      case 'flashcards':
        return <Flashcards onBack={() => setCurrentView('home')} />
      case 'noteHelper':
        return <NoteHelper onBack={() => setCurrentView('home')} />
      default:
        return <Home onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      {renderView()}
    </div>
  )
}

export default App
