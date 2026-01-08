import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

interface FingeringHelperProps {
  onBack: () => void;
}

export const FingeringHelper = ({ onBack }: FingeringHelperProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="btn btn-ghost mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')}
        </button>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-4">{t('menu.fingeringHelper.title')}</h2>
            <p className="text-lg mb-6">{t('menu.fingeringHelper.description')}</p>
            <div className="alert alert-info">
              <span>Fonctionnalité en cours de développement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
