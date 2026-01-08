import React from 'react'
import { useTranslation } from 'react-i18next'

interface HomeProps {
  onNavigate: (view: 'flashcards' | 'noteHelper') => void
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="text-7xl mb-4 animate-bounce">🎵</div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
          <p className="text-2xl text-base-content/60">{t('home.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Flashcards Card */}
          <div 
            className="card bg-base-100 shadow-2xl hover:shadow-primary/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-primary"
            onClick={() => onNavigate('flashcards')}
          >
            <div className="card-body p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="text-6xl">🎴</div>
              </div>
              <h2 className="card-title text-3xl justify-center mb-4">
                {t('home.flashcards.title')}
              </h2>
              <p className="text-center text-lg text-base-content/70 mb-6">
                {t('home.flashcards.description')}
              </p>
              <div className="card-actions justify-center flex-wrap gap-3">
                <div className="badge badge-primary badge-lg py-4 px-4">
                  {t('home.flashcards.noteNames')}
                </div>
                <div className="badge badge-secondary badge-lg py-4 px-4">
                  {t('home.flashcards.notesOnScore')}
                </div>
              </div>
            </div>
          </div>

          {/* Note Helper Card */}
          <div 
            className="card bg-base-100 shadow-2xl hover:shadow-secondary/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-secondary"
            onClick={() => onNavigate('noteHelper')}
          >
            <div className="card-body p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="text-6xl">🎼</div>
              </div>
              <h2 className="card-title text-3xl justify-center mb-4">
                {t('home.noteHelper.title')}
              </h2>
              <p className="text-center text-lg text-base-content/70 mb-6">
                {t('home.noteHelper.description')}
              </p>
              <div className="card-actions justify-center">
                <div className="badge badge-accent badge-lg py-4 px-4">
                  {t('home.noteHelper.fingeringGuide')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
