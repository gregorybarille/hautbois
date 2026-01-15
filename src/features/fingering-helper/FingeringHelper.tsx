import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Box, Container, Title, Text, Group, ActionIcon } from "@mantine/core";
import { Button, Card } from "../../shared/components";
import { MusicScore } from "../../shared/components/music/MusicScore";
import { OboeFingeringChart } from "../../shared/components/oboe/OboeFingeringChart";
import { NOTES, OBOE_FINGERINGS } from "../../shared/constants/oboeFingerings";

interface FingeringHelperProps {
  onBack: () => void;
}

export const FingeringHelper = ({ onBack }: FingeringHelperProps) => {
  const { t } = useTranslation();

  // Filter for natural notes only (no sharp or flat symbols)
  const naturalNotes = useMemo(
    () => NOTES.filter((n) => !n.includes("♭") && !n.includes("#")),
    [],
  );

  // Initialize with "Do" which is a safe middle note
  const [selectedNote, setSelectedNote] = useState("Do");

  // Determine base note (without accidental) of the currently selected note
  const currentBaseNote = useMemo(
    () => selectedNote.replace(/[♭#]/, ""),
    [selectedNote],
  );

  // Find available variations for the current base note
  const variations = useMemo(() => {
    return {
      flat: NOTES.find(
        (n) => n.replace(/[♭#]/, "") === currentBaseNote && n.includes("♭"),
      ),
      sharp: NOTES.find(
        (n) => n.replace(/[♭#]/, "") === currentBaseNote && n.includes("#"),
      ),
      natural: NOTES.find((n) => n === currentBaseNote),
    };
  }, [currentBaseNote]);

  const handleScoreClick = (note: string) => {
    // When clicking score (natural note), reset to natural
    setSelectedNote(note);
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "2rem",
      }}
    >
      <Container size="xl">
        <Button
          onClick={onBack}
          variant="subtle"
          leftSection={<ArrowLeft size={20} />}
          mb="xl"
        >
          {t("common.back")}
        </Button>

        <Box style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Card noPadding style={{ background: "white" }}>
            <Box p="xl">
              <Title order={2} size="1.5rem" mb="xl">
                {t("menu.fingeringHelper.title")}
              </Title>
              <MusicScore
                notes={naturalNotes}
                activeNote={currentBaseNote}
                onNoteClick={handleScoreClick}
              />

              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "1.5rem",
                }}
              >
                <Text
                  size="sm"
                  fw={600}
                  tt="uppercase"
                  c="dimmed"
                  mb="sm"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Variations
                </Text>
                <Group gap="md">
                  <ActionIcon
                    variant={selectedNote.includes("♭") ? "filled" : "default"}
                    color={selectedNote.includes("♭") ? "blue" : "gray"}
                    disabled={!variations.flat}
                    size={64}
                    radius="xl"
                    onClick={() => {
                      if (selectedNote.includes("♭") && variations.natural) {
                        setSelectedNote(variations.natural);
                      } else if (variations.flat) {
                        setSelectedNote(variations.flat);
                      }
                    }}
                    style={{
                      fontSize: "2rem",
                      fontFamily: "serif",
                      border: !selectedNote.includes("♭")
                        ? "2px solid var(--mantine-color-gray-3)"
                        : "none",
                    }}
                  >
                    ♭
                  </ActionIcon>
                  <ActionIcon
                    variant={selectedNote.includes("#") ? "filled" : "default"}
                    color={selectedNote.includes("#") ? "blue" : "gray"}
                    disabled={!variations.sharp}
                    size={64}
                    radius="xl"
                    onClick={() => {
                      if (selectedNote.includes("#") && variations.natural) {
                        setSelectedNote(variations.natural);
                      } else if (variations.sharp) {
                        setSelectedNote(variations.sharp);
                      }
                    }}
                    style={{
                      fontSize: "2rem",
                      fontFamily: "serif",
                      border: !selectedNote.includes("#")
                        ? "2px solid var(--mantine-color-gray-3)"
                        : "none",
                    }}
                  >
                    ♯
                  </ActionIcon>
                </Group>
              </Box>
            </Box>
          </Card>

          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Card
              noPadding
              style={{ width: "100%", maxWidth: 448, background: "white" }}
            >
              <Box
                p="xl"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Title order={3} size="2rem" mb="md">
                  {selectedNote}
                </Title>
                <OboeFingeringChart
                  keys={OBOE_FINGERINGS[selectedNote]}
                  height={500}
                />
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
