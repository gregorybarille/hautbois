import { useEffect, useRef, useState } from "react";

// Minimal typing of the vendor-prefixed Web Speech API (Chrome-only).
interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultLike[];
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (event: SpeechRecognitionErrorEventLike) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const getSpeechRecognitionAPI = (): SpeechRecognitionConstructor | undefined => {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

// Spoken variants (accents already stripped) → French note names.
const SPOKEN_NOTE_MAPPING: Record<string, string> = {
  do: "Do",
  doh: "Do",
  c: "Do",
  re: "Ré",
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

const findSpokenNote = (normalizedTranscript: string): string | undefined => {
  // Single-letter variants must match a whole word to avoid false positives.
  const words = normalizedTranscript.split(/[^a-z]+/).filter(Boolean);
  for (const [variant, note] of Object.entries(SPOKEN_NOTE_MAPPING)) {
    const matches =
      variant.length === 1
        ? words.includes(variant)
        : normalizedTranscript.includes(variant);
    if (matches) return note;
  }
  return undefined;
};

export interface NoteSpeechRecognition {
  supported: boolean;
  listening: boolean;
  transcript: string;
  error: string;
  toggle: () => void;
}

// French voice dictation of note names. Calls `onNote` with the recognized
// note ("Do".."Si"); always invokes the latest callback (kept in a ref).
export const useNoteSpeechRecognition = (
  onNote: (note: string) => void,
): NoteSpeechRecognition => {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const listeningRef = useRef(false);
  const errorRef = useRef("");
  const onNoteRef = useRef(onNote);

  useEffect(() => {
    onNoteRef.current = onNote;
  });

  useEffect(() => {
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();
    if (!SpeechRecognitionAPI) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      const heard = result[0].transcript.toLowerCase().trim();
      setTranscript(heard);

      if (result.isFinal) {
        const normalized = heard
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const foundNote = findSpokenNote(normalized);
        if (foundNote) {
          onNoteRef.current(foundNote);
          setTranscript("");
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Erreur reconnaissance vocale:", event.error);
      const message =
        event.error === "network"
          ? "Erreur réseau : Vérifiez votre connexion internet"
          : event.error === "not-allowed"
            ? "Accès au microphone refusé"
            : `Erreur : ${event.error}`;
      setError(message);
      errorRef.current = message;
      setListening(false);
      listeningRef.current = false;
    };

    recognition.onend = () => {
      // The API stops by itself after silence; restart unless the user
      // stopped intentionally or an error occurred.
      if (listeningRef.current && !errorRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Impossible de redémarrer la reconnaissance:", e);
          setListening(false);
          listeningRef.current = false;
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      listeningRef.current = false;
      recognition.stop();
    };
  }, []);

  const toggle = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listeningRef.current) {
      listeningRef.current = false;
      recognition.stop();
      setListening(false);
      setTranscript("");
    } else {
      setError("");
      errorRef.current = "";
      try {
        recognition.start();
        listeningRef.current = true;
        setListening(true);
      } catch (e) {
        console.error("Erreur au démarrage de la reconnaissance:", e);
        setError("Impossible de démarrer la reconnaissance vocale");
      }
    }
  };

  return { supported, listening, transcript, error, toggle };
};
