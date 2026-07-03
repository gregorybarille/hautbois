import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Info, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Box, Container, Title, Text, Modal, ActionIcon } from "@mantine/core";
import { Button, Card } from "../../shared/components";
import { InstrumentConfig } from "../../shared/instruments";

interface NameFlashcardsProps {
  onBack: () => void;
  instrument: InstrumentConfig;
}

export const NameFlashcards = ({ onBack, instrument }: NameFlashcardsProps) => {
  const { t } = useTranslation();
  const NOTES = instrument.notes;
  const [currentNote, setCurrentNote] = useState<string>(NOTES[0]);
  const [isFingeringVisible, setIsFingeringVisible] = useState(false);

  const nextNote = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * NOTES.length);
    } while (NOTES[nextIndex] === currentNote && NOTES.length > 1);

    setCurrentNote(NOTES[nextIndex]);
    setIsFingeringVisible(false);
  };

  const toggleFingering = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFingeringVisible(!isFingeringVisible);
  };

  const renderNoteDisplay = (noteStr: string) => {
    if (noteStr.includes("Grave")) {
      const noteName = noteStr.replace(" Grave", "");
      return (
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <span>{noteName}</span>
          <ArrowDownRight
            style={{
              position: "absolute",
              left: "100%",
              marginLeft: "0.5rem",
              width: 96,
              height: 96,
              color: "#fa5252",
            }}
            strokeWidth={2}
          />
        </div>
      );
    }
    if (noteStr.includes("Aigu")) {
      const noteName = noteStr.replace(" Aigu", "");
      return (
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <span>{noteName}</span>
          <ArrowUpRight
            style={{
              position: "absolute",
              left: "100%",
              marginLeft: "0.5rem",
              width: 96,
              height: 96,
              color: "#228be6",
            }}
            strokeWidth={2}
          />
        </div>
      );
    }
    return <span>{noteStr}</span>;
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "2rem",
      }}
    >
      <Container size="sm">
        <Box mb="xl">
          <Button
            onClick={onBack}
            variant="subtle"
            leftSection={<ArrowLeft size={20} />}
          >
            {t("common.back")}
          </Button>
        </Box>

        <Title order={2} size="2rem" ta="center" mb="xl">
          {t("menu.nameFlashcards.title")}
        </Title>

        {/* Flashcard container */}
        <Box style={{ position: "relative", width: "100%" }}>
          <Card
            onClick={nextNote}
            noPadding
            shadow="lg"
            hover
            style={{
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              userSelect: "none",
            }}
          >
            {/* Info Button positioned absolute within the card */}
            <ActionIcon
              onClick={toggleFingering}
              variant="subtle"
              color="blue"
              size="lg"
              radius="xl"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
              }}
              aria-label="Show Fingering"
            >
              <Info size={24} />
            </ActionIcon>

            <Text
              size="6rem"
              fw={900}
              c="blue.6"
              style={{ fontSize: "6rem", lineHeight: 1 }}
            >
              {renderNoteDisplay(currentNote)}
            </Text>
            <Text
              size="sm"
              c="dimmed"
              fw={500}
              tt="uppercase"
              style={{
                position: "absolute",
                bottom: 24,
                letterSpacing: "0.1em",
              }}
            >
              Tap for next
            </Text>
          </Card>
        </Box>

        {/* Fingering Modal */}
        <Modal
          opened={isFingeringVisible}
          onClose={() => setIsFingeringVisible(false)}
          title={
            <Title order={3} size="1.5rem">
              Doigté : {currentNote}
            </Title>
          }
          size="md"
          centered
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              background: "white",
              borderRadius: 12,
              padding: "1rem",
            }}
          >
            <instrument.NoteChart note={currentNote} height={400} />
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};
