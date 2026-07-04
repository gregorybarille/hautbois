// Lightweight Web Audio synth for playing notes/sequences with a soft
// envelope. A single shared AudioContext is created lazily on first use
// (after a user gesture, per browser autoplay policies).
let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isAudioSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.AudioContext ||
      (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext,
  );
}

// Schedule a single tone at the given absolute AudioContext time.
function scheduleTone(
  audio: AudioContext,
  frequency: number,
  startAt: number,
  duration: number,
) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "triangle";
  osc.frequency.value = frequency;

  const attack = 0.01;
  const release = 0.08;
  const peak = 0.18;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(peak, startAt + attack);
  gain.gain.setValueAtTime(
    peak,
    Math.max(startAt + attack, startAt + duration - release),
  );
  gain.gain.linearRampToValueAtTime(0, startAt + duration);

  osc.connect(gain).connect(audio.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

// Play one note immediately.
export function playFrequency(frequency: number, duration = 0.6) {
  const audio = getContext();
  if (!audio) return;
  scheduleTone(audio, frequency, audio.currentTime, duration);
}

// Short metronome click; accented beats are higher/louder.
export function playClick(accent = false) {
  const audio = getContext();
  if (!audio) return;
  scheduleTone(audio, accent ? 1600 : 1100, audio.currentTime, 0.05);
}

// Play a sequence of frequencies at the given tempo (notes per second).
// Returns the total duration in seconds.
export function playSequence(
  frequencies: number[],
  notesPerSecond = 2.5,
): number {
  const audio = getContext();
  if (!audio) return 0;
  const step = 1 / notesPerSecond;
  const noteDuration = step * 0.9;
  const start = audio.currentTime + 0.05;
  frequencies.forEach((freq, i) => {
    scheduleTone(audio, freq, start + i * step, noteDuration);
  });
  return frequencies.length * step;
}
