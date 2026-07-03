import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import {
  Box,
  Container,
  Title,
  Text,
  Group,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { Button, Card } from "../../shared/components";
import { MusicScore } from "../../shared/components/music/MusicScore";
import { OboeFingeringChart } from "../../shared/components/oboe/OboeFingeringChart";
import { NOTES, OBOE_FINGERINGS } from "../../shared/constants/oboeFingerings";

interface FingeringHelperProps {
  onBack: () => void;
}

export const FingeringHelper = ({ onBack }: FingeringHelperProps) => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

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
        background: darkMode ? "#1a1a1a" : "#f5f5f5",
        padding: "2rem",
        transition: "background 0.3s ease",
      }}
    >
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <Button
            onClick={onBack}
            variant="subtle"
            leftSection={<ArrowLeft size={20} />}
            style={{ color: darkMode ? "#ffffff" : undefined }}
          >
            {t("common.back")}
          </Button>

          <ActionIcon
            onClick={() => setDarkMode(!darkMode)}
            size="lg"
            variant="subtle"
            radius="xl"
            style={{ color: darkMode ? "#ffffff" : "#000000" }}
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </ActionIcon>
        </Group>

        <Card
          noPadding
          style={{
            background: darkMode ? "#2a2a2a" : "white",
            transition: "background 0.3s ease",
          }}
        >
          <Box p="xl">
            <Title
              order={2}
              size="1.5rem"
              mb="xl"
              style={{ color: darkMode ? "#ffffff" : undefined }}
            >
              {t("menu.fingeringHelper.title")}
            </Title>

            <Flex
              gap="xl"
              direction={{ base: "column", md: "row" }}
              align={{ base: "center", md: "center" }}
              justify="space-between"
            >
              {/* Left side: Music score and variations */}
              <Box style={{ flex: 1, maxWidth: 600 }}>
                <MusicScore
                  notes={naturalNotes}
                  activeNote={currentBaseNote}
                  onNoteClick={handleScoreClick}
                  darkMode={darkMode}
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
                    style={{
                      letterSpacing: "0.05em",
                      color: darkMode ? "#9ca3af" : undefined,
                    }}
                  >
                    Variations
                  </Text>
                  <Group gap="md">
                    <ActionIcon
                      variant={
                        selectedNote.includes("♭") ? "filled" : "default"
                      }
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
                      variant={
                        selectedNote.includes("#") ? "filled" : "default"
                      }
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

              {/* Right side: Oboe fingering chart */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 300,
                }}
              >
                <Title
                  order={3}
                  size="2rem"
                  mb="md"
                  style={{ color: darkMode ? "#ffffff" : undefined }}
                >
                  {selectedNote}
                </Title>
                <OboeFingeringChart
                  keys={OBOE_FINGERINGS[selectedNote]}
                  height={650}
                  darkMode={darkMode}
                />
              </Box>
            </Flex>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};
