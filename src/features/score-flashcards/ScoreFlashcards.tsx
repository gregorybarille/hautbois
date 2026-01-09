import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button, Card } from "../../shared/components";

interface ScoreFlashcardsProps {
  onBack: () => void;
}

export const ScoreFlashcards = ({ onBack }: ScoreFlashcardsProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t("common.back")}
        </Button>
        <Card>
          <h2 className="card-title text-3xl mb-4">
            {t("menu.scoreFlashcards.title")}
          </h2>
          <p className="text-lg mb-6">
            {t("menu.scoreFlashcards.description")}
          </p>
          <div className="alert alert-info">
            <span>Fonctionnalité en cours de développement</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
