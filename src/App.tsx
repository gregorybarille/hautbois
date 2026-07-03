import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "@mantine/hooks";
import { Music, FileText, HandMetal } from "lucide-react";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Box,
  Group,
  SegmentedControl,
} from "@mantine/core";
import { MenuCard } from "./shared/components";
import {
  DEFAULT_INSTRUMENT,
  INSTRUMENTS,
  INSTRUMENT_IDS,
  InstrumentId,
} from "./shared/instruments";
import { ScoreFlashcards } from "./features/score-flashcards";
import { NameFlashcards } from "./features/name-flashcards";
import { FingeringHelper } from "./features/fingering-helper";

type View = "menu" | "scoreFlashcards" | "nameFlashcards" | "fingeringHelper";

function App() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<View>("menu");
  const [instrumentId, setInstrumentId] = useLocalStorage<InstrumentId>({
    key: "hautbois-instrument",
    defaultValue: DEFAULT_INSTRUMENT,
  });
  // Guard against stale/garbage localStorage values
  const instrument = INSTRUMENTS[instrumentId] ?? INSTRUMENTS[DEFAULT_INSTRUMENT];

  const renderView = () => {
    switch (currentView) {
      case "scoreFlashcards":
        return <ScoreFlashcards onBack={() => setCurrentView("menu")} />;
      case "nameFlashcards":
        return (
          <NameFlashcards
            onBack={() => setCurrentView("menu")}
            instrument={instrument}
          />
        );
      case "fingeringHelper":
        return (
          <FingeringHelper
            onBack={() => setCurrentView("menu")}
            instrument={instrument}
          />
        );
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
              <Group justify="center" mb={40}>
                <SegmentedControl
                  value={instrument.id}
                  onChange={(value) => setInstrumentId(value as InstrumentId)}
                  data={INSTRUMENT_IDS.map((id) => ({
                    value: id,
                    label: t(INSTRUMENTS[id].labelKey),
                  }))}
                  size="md"
                  radius="xl"
                  aria-label={t("menu.instrumentPicker")}
                />
              </Group>
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
