import React from 'react'
import { useTranslation } from 'react-i18next'

interface HomeProps {
  onNavigate: (view: 'flashcards' | 'noteHelper') => void
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">🎵 {t('home.title')}</h1>
        <p className="text-xl text-base-content/70">{t('home.subtitle')}</p>
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
              {t('home.flashcards.title')}
            </h2>
            <p className="text-base-content/70">
              {t('home.flashcards.description')}
            </p>
            <div className="card-actions justify-end mt-4">
              <div className="badge badge-primary">{t('home.flashcards.noteNames')}</div>
              <div className="badge badge-secondary">{t('home.flashcards.notesOnScore')}</div>
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
              {t('home.noteHelper.title')}
            </h2>
            <p className="text-base-content/70">
              {t('home.noteHelper.description')}
            </p>
            <div className="card-actions justify-end mt-4">
              <div className="badge badge-accent">{t('home.noteHelper.fingeringGuide')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
