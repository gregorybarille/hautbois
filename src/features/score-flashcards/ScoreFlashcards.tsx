import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, RefreshCw, Mic, MicOff } from "lucide-react";
import {
  Box,
  Container,
  Title,
  Text,
  Progress,
  Badge,
  Stack,
  Group,
  Paper,
  SimpleGrid,
  Alert,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Button, Card } from "../../shared/components";
import { MusicScore } from "../../shared/components/music/MusicScore";
import { NOTE_BASES } from "../../shared/music/notes";
import { useNoteSpeechRecognition } from "../../shared/hooks/useNoteSpeechRecognition";

interface ScoreFlashcardsProps {
  onBack: () => void;
}

interface NoteResult {
  note: string;
  status: "pending" | "correct" | "incorrect";
  userAnswer?: string;
}

// Notes naturelles uniquement (Do, Ré, Mi, Fa, Sol, La, Si)
const NATURAL_NOTES: string[] = NOTE_BASES;

const STATUS_COLORS = {
  current: "#3b82f6",
  correct: "#22c55e",
  incorrect: "#ef4444",
};

export const ScoreFlashcards = ({ onBack }: ScoreFlashcardsProps) => {
  const { t } = useTranslation();
  const [generatedNotes, setGeneratedNotes] = useState<NoteResult[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  // Générer 10 notes aléatoires
  const generateNotes = useCallback(() => {
    const notes: NoteResult[] = [];
    for (let i = 0; i < 10; i++) {
      const randomNote =
        NATURAL_NOTES[Math.floor(Math.random() * NATURAL_NOTES.length)];
      notes.push({
        note: randomNote,
        status: "pending",
      });
    }
    setGeneratedNotes(notes);
    setCurrentNoteIndex(0);
    setScore({ correct: 0, incorrect: 0 });
  }, []);

  // Initialiser les notes au montage
  useEffect(() => {
    generateNotes();
  }, [generateNotes]);

  // Vérifier la réponse
  const checkAnswer = useCallback(
    (selectedNote: string) => {
      if (currentNoteIndex >= generatedNotes.length) return;

      const currentNote = generatedNotes[currentNoteIndex].note;
      const isCorrect = selectedNote === currentNote;

      const newNotes = [...generatedNotes];
      newNotes[currentNoteIndex] = {
        ...newNotes[currentNoteIndex],
        status: isCorrect ? "correct" : "incorrect",
        userAnswer: selectedNote,
      };
      setGeneratedNotes(newNotes);

      // Mettre à jour le score
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      }));

      // Passer à la note suivante directement
      setCurrentNoteIndex((prev) => prev + 1);
    },
    [currentNoteIndex, generatedNotes],
  );

  const voice = useNoteSpeechRecognition(checkAnswer);

  // Calcul de la progression
  const progress = generatedNotes.length
    ? (currentNoteIndex / generatedNotes.length) * 100
    : 0;
  const isComplete = currentNoteIndex >= generatedNotes.length;

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "2rem",
      }}
    >
      <Container size="lg">
        <Button
          onClick={onBack}
          variant="subtle"
          leftSection={<ArrowLeft size={20} />}
          mb="xl"
        >
          {t("common.back")}
        </Button>

        <Card>
          <Title order={2} size="2rem" mb="md">
            {t("menu.scoreFlashcards.title")}
          </Title>
          <Text size="lg" mb="xl" c="dimmed">
            Dictez ou cliquez sur la note correspondante
          </Text>

          {!voice.supported && (
            <Alert color="orange" title="Dictée vocale non disponible" mb="md">
              Votre navigateur ne supporte pas la reconnaissance vocale.
              Utilisez les boutons pour répondre.
            </Alert>
          )}

          {voice.error && (
            <Alert color="red" title="Erreur de dictée vocale" mb="md">
              {voice.error}. Utilisez les boutons pour répondre.
            </Alert>
          )}

          {/* Progression */}
          <Stack gap="md" mb="xl">
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Progression : {currentNoteIndex} / {generatedNotes.length}
              </Text>
              <Group gap="md">
                <Badge color="green" size="lg">
                  ✓ {score.correct}
                </Badge>
                <Badge color="red" size="lg">
                  ✗ {score.incorrect}
                </Badge>
              </Group>
            </Group>
            <Progress value={progress} size="lg" radius="xl" />
          </Stack>

          {/* Partition musicale */}
          <Paper
            p="xl"
            mb="xl"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
              border: "3px solid #228be6",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(34, 139, 230, 0.1)",
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            <MusicScore
              notes={generatedNotes.map((n) => n.note)}
              noteSpacing={70}
              noteColor={(_, index) => {
                if (index === currentNoteIndex) return STATUS_COLORS.current;
                const status = generatedNotes[index]?.status;
                return status === "pending" ? undefined : STATUS_COLORS[status];
              }}
            />
          </Paper>

          {/* Sélection de notes */}
          {!isComplete ? (
            <Stack gap="lg">
              {/* Bouton micro */}
              <Group justify="center">
                <Tooltip
                  label={
                    !voice.supported
                      ? "Dictée vocale non disponible sur ce navigateur"
                      : voice.listening
                        ? "Arrêter la dictée"
                        : "Activer la dictée vocale"
                  }
                >
                  <ActionIcon
                    onClick={voice.toggle}
                    size="xl"
                    radius="xl"
                    variant={voice.listening ? "filled" : "light"}
                    color={voice.listening ? "red" : "blue"}
                    disabled={!voice.supported}
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  >
                    {voice.listening ? <MicOff size={28} /> : <Mic size={28} />}
                  </ActionIcon>
                </Tooltip>
              </Group>

              {/* Transcript */}
              {voice.transcript && (
                <Paper
                  p="md"
                  bg="blue.0"
                  style={{
                    borderRadius: "8px",
                    border: "2px solid #228be6",
                    textAlign: "center",
                  }}
                >
                  <Text size="sm" c="dimmed" mb="xs">
                    🎤 Vous dites :
                  </Text>
                  <Text size="lg" fw={500} c="blue.7">
                    {voice.transcript}
                  </Text>
                </Paper>
              )}

              <Text size="lg" fw={500} ta="center" c="blue.7">
                Ou cliquez sur la note :
              </Text>

              <SimpleGrid cols={{ base: 3, sm: 4, md: 7 }} spacing="md">
                {NATURAL_NOTES.map((note) => (
                  <Button
                    key={note}
                    onClick={() => checkAnswer(note)}
                    size="xl"
                    variant="light"
                    color="blue"
                    style={{
                      height: "80px",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {note}
                  </Button>
                ))}
              </SimpleGrid>

              {/* Bouton refresh */}
              <Group justify="center" mt="md">
                <Button
                  onClick={generateNotes}
                  variant="outline"
                  leftSection={<RefreshCw size={20} />}
                >
                  Générer de nouvelles notes
                </Button>
              </Group>
            </Stack>
          ) : (
            <Stack gap="lg" align="center">
              <Paper
                p="xl"
                style={{
                  background:
                    "linear-gradient(135deg, #d0f4de 0%, #a9def9 100%)",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <Text size="xl" fw={700} mb="md" c="green.8">
                  ✅ Exercice terminé !
                </Text>
                <Text size="lg" mb="md" fw={500}>
                  Score final : {score.correct} / {generatedNotes.length}
                </Text>
                <Text size="md" c="dimmed">
                  Taux de réussite :{" "}
                  {Math.round((score.correct / generatedNotes.length) * 100)}%
                </Text>
              </Paper>

              <Button
                onClick={generateNotes}
                size="lg"
                leftSection={<RefreshCw size={24} />}
              >
                Nouvelle série
              </Button>
            </Stack>
          )}
        </Card>
      </Container>
    </Box>
  );
};
