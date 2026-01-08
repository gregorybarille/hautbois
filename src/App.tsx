import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Music, FileText, HandMetal } from 'lucide-react';
import { MenuCard } from './shared/components';
import { ScoreFlashcards } from './features/score-flashcards';
import { NameFlashcards } from './features/name-flashcards';
import { FingeringHelper } from './features/fingering-helper';

type View = 'menu' | 'scoreFlashcards' | 'nameFlashcards' | 'fingeringHelper';

function App() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<View>('menu');

  const renderView = () => {
    switch (currentView) {
      case 'scoreFlashcards':
        return <ScoreFlashcards onBack={() => setCurrentView('menu')} />;
      case 'nameFlashcards':
        return <NameFlashcards onBack={() => setCurrentView('menu')} />;
      case 'fingeringHelper':
        return <FingeringHelper onBack={() => setCurrentView('menu')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 text-gray-800">
                  {t('app.title')}
                </h1>
                <p className="text-xl text-gray-600">{t('app.description')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MenuCard
                  title={t('menu.scoreFlashcards.title')}
                  description={t('menu.scoreFlashcards.description')}
                  icon={Music}
                  onClick={() => setCurrentView('scoreFlashcards')}
                />
                <MenuCard
                  title={t('menu.nameFlashcards.title')}
                  description={t('menu.nameFlashcards.description')}
                  icon={FileText}
                  onClick={() => setCurrentView('nameFlashcards')}
                />
                <MenuCard
                  title={t('menu.fingeringHelper.title')}
                  description={t('menu.fingeringHelper.description')}
                  icon={HandMetal}
                  onClick={() => setCurrentView('fingeringHelper')}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return renderView();
}

export default App;
