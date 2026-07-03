/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useRef } from "react";
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

interface ScoreFlashcardsProps {
  onBack: () => void;
}

interface NoteResult {
  note: string;
  status: "pending" | "correct" | "incorrect";
  userAnswer?: string;
}

// Notes naturelles uniquement (Do, Ré, Mi, Fa, Sol, La, Si)
const NATURAL_NOTES = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"];

export const ScoreFlashcards = ({ onBack }: ScoreFlashcardsProps) => {
  const { t } = useTranslation();
  const [generatedNotes, setGeneratedNotes] = useState<NoteResult[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string>("");
  const recognitionRef = useRef<any>(null);

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

  // Configuration de la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript
        .toLowerCase()
        .trim();

      console.log("🎤 Transcript brut:", transcript);
      console.log("📊 isFinal:", event.results[current].isFinal);

      setTranscript(transcript);

      if (event.results[current].isFinal) {
        // Normaliser le transcript (enlever accents)
        const normalizedTranscript = transcript
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        console.log("🔄 Transcript normalisé:", normalizedTranscript);

        // Mapping des variantes de prononciation
        const noteMapping: Record<string, string> = {
          do: "Do",
          doh: "Do",
          c: "Do",
          re: "Ré",
          ré: "Ré",
          d: "Ré",
          mi: "Mi",
          e: "Mi",
          fa: "Fa",
          f: "Fa",
          sol: "Sol",
          g: "Sol",
          la: "La",
          a: "La",
          si: "Si",
          b: "Si",
        };

        // Chercher quelle note a été dite
        const words = normalizedTranscript.split(/[^a-z]+/).filter(Boolean);
        let foundNote: string | undefined;
        for (const [variant, note] of Object.entries(noteMapping)) {
          const hasMatch =
            variant.length === 1
              ? words.includes(variant)
              : normalizedTranscript.includes(variant);
          if (hasMatch) {
            console.log(
              `✅ Match trouvé! Variante "${variant}" → Note "${note}"`,
            );
            foundNote = note;
            break;
          }
        }

        if (foundNote) {
          console.log("🎯 Note détectée:", foundNote);
          console.log(
            "🎵 Note attendue:",
            generatedNotes[currentNoteIndex]?.note,
          );
          checkAnswer(foundNote);
          setTranscript("");
        } else {
          console.log("❌ Aucune note détectée dans:", normalizedTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("❌ Erreur reconnaissance vocale:", event.error);
      console.error("📝 Message:", event.message);

      if (event.error === "network") {
        setVoiceError("Erreur réseau : Vérifiez votre connexion internet");
      } else if (event.error === "not-allowed") {
        setVoiceError("Accès au microphone refusé");
      } else {
        setVoiceError(`Erreur : ${event.error}`);
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("⏹️ Reconnaissance vocale terminée");
      // Ne redémarre PAS automatiquement si erreur
      if (isListening && !voiceError) {
        console.log("🔄 Redémarrage de la reconnaissance...");
        try {
          recognition.start();
        } catch (e) {
          console.error("Impossible de redémarrer:", e);
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, checkAnswer, voiceError, currentNoteIndex, generatedNotes]);

  // Toggle reconnaissance vocale
  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.log("⚠️ Reconnaissance vocale non initialisée");
      return;
    }

    if (isListening) {
      console.log("🛑 Arrêt de la dictée vocale");
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript("");
    } else {
      console.log("▶️ Démarrage de la dictée vocale");
      console.log("🎯 Note à trouver:", generatedNotes[currentNoteIndex]?.note);
      setVoiceError("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Erreur au démarrage:", e);
        setVoiceError("Impossible de démarrer la reconnaissance vocale");
      }
    }
  };

  // Calcul de la progression
  const progress = (currentNoteIndex / generatedNotes.length) * 100;
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

          {!voiceSupported && (
            <Alert color="orange" title="Dictée vocale non disponible" mb="md">
              Votre navigateur ne supporte pas la reconnaissance vocale.
              Utilisez les boutons pour répondre.
            </Alert>
          )}

          {voiceError && (
            <Alert color="red" title="Erreur de dictée vocale" mb="md">
              {voiceError}. Utilisez les boutons pour répondre.
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
            <MusicalStaff
              notes={generatedNotes}
              currentIndex={currentNoteIndex}
            />
          </Paper>

          {/* Sélection de notes */}
          {!isComplete ? (
            <Stack gap="lg">
              {/* Bouton micro */}
              <Group justify="center">
                <Tooltip
                  label={
                    !voiceSupported
                      ? "Dictée vocale non disponible sur ce navigateur"
                      : isListening
                        ? "Arrêter la dictée"
                        : "Activer la dictée vocale"
                  }
                >
                  <ActionIcon
                    onClick={toggleListening}
                    size="xl"
                    radius="xl"
                    variant={isListening ? "filled" : "light"}
                    color={isListening ? "red" : "blue"}
                    disabled={!voiceSupported}
                    style={{
                      width: 60,
                      height: 60,
                      animation: isListening
                        ? "pulse 2s ease-in-out infinite"
                        : "none",
                    }}
                  >
                    {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                  </ActionIcon>
                </Tooltip>
              </Group>

              {/* Transcript */}
              {transcript && (
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
                    {transcript}
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

// Composant pour afficher la partition musicale
interface MusicalStaffProps {
  notes: NoteResult[];
  currentIndex: number;
}

const MusicalStaff = ({ notes, currentIndex }: MusicalStaffProps) => {
  // Positions des notes sur la portée (relatif à la ligne supérieure)
  const NOTE_POSITIONS: Record<string, { step: number }> = {
    Do: { step: 10 },
    "Do#": { step: 10 },
    Ré: { step: 9 },
    "Mi♭": { step: 8 },
    Mi: { step: 8 },
    Fa: { step: 7 },
    "Fa#": { step: 7 },
    Sol: { step: 6 },
    "Sol#": { step: 6 },
    La: { step: 5 },
    "Si♭": { step: 4 },
    Si: { step: 4 },
  };

  const STAFF_Y_START = 50;
  const LINE_SPACING = 10;
  const STEP_HEIGHT = LINE_SPACING / 2;
  const NOTE_SPACING = 70;
  const START_OFFSET = 80;

  const width = START_OFFSET + notes.length * NOTE_SPACING + 40;
  const height = 160;

  const renderStaffLines = () => {
    const lines = [];
    for (let i = 0; i < 5; i++) {
      const y = STAFF_Y_START + i * LINE_SPACING;
      lines.push(
        <line
          key={i}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#374151"
          strokeWidth="1.5"
        />,
      );
    }
    return lines;
  };

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        scrollBehavior: "smooth",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}
      >
        {renderStaffLines()}

        {/* Clé de Sol */}
        <text
          x={10}
          y={STAFF_Y_START + 4 * LINE_SPACING - 5}
          fontFamily="serif"
          fontSize="65"
          fill="#1f2937"
        >
          𝄞
        </text>

        {notes.map((noteResult, index) => {
          const pos = NOTE_POSITIONS[noteResult.note];
          if (!pos) return null;

          const x = START_OFFSET + index * NOTE_SPACING;
          const cy = STAFF_Y_START + pos.step * STEP_HEIGHT;

          let noteColor = "#1f2937";
          if (noteResult.status === "correct") noteColor = "#22c55e";
          if (noteResult.status === "incorrect") noteColor = "#ef4444";
          if (index === currentIndex) noteColor = "#3b82f6";

          // Lignes supplémentaires si nécessaire
          const renderLedgerLines = () => {
            const lines = [];
            // Lignes en dessous de la portée
            for (let s = 10; s <= pos.step; s += 2) {
              const ly = STAFF_Y_START + s * STEP_HEIGHT;
              lines.push(
                <line
                  key={`bot-${s}`}
                  x1={x - 14}
                  y1={ly}
                  x2={x + 14}
                  y2={ly}
                  stroke="#374151"
                  strokeWidth="1.5"
                />,
              );
            }
            return lines;
          };

          return (
            <g key={`${noteResult.note}-${index}`}>
              {renderLedgerLines()}

              {/* Tête de note */}
              <ellipse
                cx={x}
                cy={cy}
                rx={8}
                ry={6}
                fill={noteColor}
                transform={`rotate(-20 ${x} ${cy})`}
                style={{
                  transition: "fill 0.3s ease",
                }}
              />

              {/* Hampe */}
              {pos.step <= 4 ? (
                <line
                  x1={x - 7}
                  y1={cy}
                  x2={x - 7}
                  y2={cy + 35}
                  stroke={noteColor}
                  strokeWidth="2"
                />
              ) : (
                <line
                  x1={x + 7}
                  y1={cy}
                  x2={x + 7}
                  y2={cy - 35}
                  stroke={noteColor}
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
