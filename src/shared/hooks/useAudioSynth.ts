import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

export function useAudioSynth() {
  const synthRef = useRef<Tone.Synth | null>(null)

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination()
    
    return () => {
      synthRef.current?.dispose()
    }
  }, [])

  const playNote = async (note: string) => {
    if (synthRef.current) {
      await Tone.start()
      synthRef.current.triggerAttackRelease(note, '8n')
    }
  }

  return { playNote }
}
