import { useTranslation } from "react-i18next";
import { Music, FileText, HandMetal, ListMusic, Ear, Drum } from "lucide-react";
import { MenuCard, View } from "@/shared/components";

interface HomeProps {
  onNavigate: (view: View) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col justify-center py-4">
      <header className="mb-8 text-center sm:mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {t("app.title")}
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          {t("app.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MenuCard
          title={t("menu.scoreFlashcards.title")}
          description={t("menu.scoreFlashcards.description")}
          icon={Music}
          onClick={() => onNavigate("scoreFlashcards")}
        />
        <MenuCard
          title={t("menu.nameFlashcards.title")}
          description={t("menu.nameFlashcards.description")}
          icon={FileText}
          onClick={() => onNavigate("nameFlashcards")}
        />
        <MenuCard
          title={t("menu.fingeringHelper.title")}
          description={t("menu.fingeringHelper.description")}
          icon={HandMetal}
          onClick={() => onNavigate("fingeringHelper")}
        />
        <MenuCard
          title={t("menu.scales.title")}
          description={t("menu.scales.description")}
          icon={ListMusic}
          onClick={() => onNavigate("scales")}
        />
        <MenuCard
          title={t("menu.earTraining.title")}
          description={t("menu.earTraining.description")}
          icon={Ear}
          onClick={() => onNavigate("earTraining")}
        />
        <MenuCard
          title={t("menu.rhythm.title")}
          description={t("menu.rhythm.description")}
          icon={Drum}
          onClick={() => onNavigate("rhythm")}
        />
      </div>
    </div>
  );
};
