import React from 'react'

interface HomeProps {
  onNavigate: (view: 'flashcards' | 'noteHelper') => void
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">🎵 Hautbois</h1>
        <p className="text-xl text-base-content/70">Your Oboe Practice Companion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Flashcards Card */}
        <div 
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
          onClick={() => onNavigate('flashcards')}
        >
          <div className="card-body">
            <h2 className="card-title text-2xl">
              <span className="text-4xl mr-2">🎴</span>
              Flashcards
            </h2>
            <p className="text-base-content/70">
              Practice note recognition with interactive flashcards
            </p>
            <div className="card-actions justify-end mt-4">
              <div className="badge badge-primary">Notes Names</div>
              <div className="badge badge-secondary">Notes on Score</div>
            </div>
          </div>
        </div>

        {/* Note Helper Card */}
        <div 
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
          onClick={() => onNavigate('noteHelper')}
        >
          <div className="card-body">
            <h2 className="card-title text-2xl">
              <span className="text-4xl mr-2">🎼</span>
              Note Helper
            </h2>
            <p className="text-base-content/70">
              Learn oboe fingering positions for different notes
            </p>
            <div className="card-actions justify-end mt-4">
              <div className="badge badge-accent">Fingering Guide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
