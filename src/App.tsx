import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Music, FileText, HandMetal } from "lucide-react";
import { Container, Title, Text, SimpleGrid, Box } from "@mantine/core";
import { MenuCard } from "./shared/components";
import { ScoreFlashcards } from "./features/score-flashcards";
import { NameFlashcards } from "./features/name-flashcards";
import { FingeringHelper } from "./features/fingering-helper";

type View = "menu" | "scoreFlashcards" | "nameFlashcards" | "fingeringHelper";

function App() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<View>("menu");

  const renderView = () => {
    switch (currentView) {
      case "scoreFlashcards":
        return <ScoreFlashcards onBack={() => setCurrentView("menu")} />;
      case "nameFlashcards":
        return <NameFlashcards onBack={() => setCurrentView("menu")} />;
      case "fingeringHelper":
        return <FingeringHelper onBack={() => setCurrentView("menu")} />;
      default:
        return (
          <Box
            style={{
              minHeight: "100vh",
              background: "#f5f5f5",
              padding: "2rem",
            }}
          >
            <Container size="xl">
              <Box mb={48} style={{ textAlign: "center" }}>
                <Title order={1} size="3.5rem" mb="md" c="gray.8">
                  {t("app.title")}
                </Title>
                <Text size="xl" c="gray.6">
                  {t("app.description")}
                </Text>
              </Box>
              <SimpleGrid cols={{ base: 1, sm: 1, md: 3 }} spacing="xl">
                <MenuCard
                  title={t("menu.scoreFlashcards.title")}
                  description={t("menu.scoreFlashcards.description")}
                  icon={Music}
                  onClick={() => setCurrentView("scoreFlashcards")}
                />
                <MenuCard
                  title={t("menu.nameFlashcards.title")}
                  description={t("menu.nameFlashcards.description")}
                  icon={FileText}
                  onClick={() => setCurrentView("nameFlashcards")}
                />
                <MenuCard
                  title={t("menu.fingeringHelper.title")}
                  description={t("menu.fingeringHelper.description")}
                  icon={HandMetal}
                  onClick={() => setCurrentView("fingeringHelper")}
                />
              </SimpleGrid>
            </Container>
          </Box>
        );
    }
  };

  return renderView();
}

export default App;
