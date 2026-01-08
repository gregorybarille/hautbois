import React, { useState, useEffect, useRef } from 'react'
import { Renderer, Stave, StaveNote, Formatter, Voice } from 'vexflow'
import * as Tone from 'tone'
import { PitchDetector } from 'pitchy'

interface NoteHelperProps {
  onBack: () => void
}

// Constants for pitch detection
const A4_FREQUENCY = 440
const A4_OFFSET = 4.75
const SEMITONES_PER_OCTAVE = 12

// Simplified oboe fingering chart (basic notes)
const oboeFingeringChart: Record<string, string[]> = {
  'C4': ['Left: Thumb + 1,2,3', 'Right: 1,2,3 + Low C'],
  'D4': ['Left: Thumb + 1,2,3', 'Right: 1,2,3'],
  'E4': ['Left: Thumb + 1,2', 'Right: 1,2,3'],
  'F4': ['Left: Thumb + 1,2', 'Right: 1,2'],
  'G4': ['Left: Thumb + 1,2', 'Right: 1'],
  'A4': ['Left: Thumb + 1', 'Right: 1'],
  'B4': ['Left: Thumb + 1', 'Right: -'],
  'C5': ['Left: Thumb + 1,2', 'Right: -'],
  'D5': ['Left: Thumb', 'Right: -'],
  'E5': ['Left: Thumb (half-hole) + 1', 'Right: -'],
  'F5': ['Left: Thumb (half-hole) + 1,2', 'Right: 1'],
  'G5': ['Left: Thumb (half-hole) + 1,2', 'Right: -'],
  'A5': ['Left: Thumb (half-hole) + 1', 'Right: -'],
  'B5': ['Left: Thumb (half-hole)', 'Right: -'],
  'C6': ['Left: Thumb (half-hole) + 2', 'Right: -'],
}

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const octaves = [4, 5, 6]

const NoteHelper: React.FC<NoteHelperProps> = ({ onBack }) => {
  const [selectedNote, setSelectedNote] = useState<string>('C4')
  const [isListening, setIsListening] = useState(false)
  const [detectedNote, setDetectedNote] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const notationRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<Tone.Synth | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const detectorRef = useRef<PitchDetector<Float32Array> | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination()
    renderNotation()
    
    return () => {
      synthRef.current?.dispose()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    renderNotation()
  }, [selectedNote])

  const renderNotation = () => {
    if (!notationRef.current) return

    // Clear previous notation safely
    while (notationRef.current.firstChild) {
      notationRef.current.removeChild(notationRef.current.firstChild)
    }

    const width = 400
    const height = 200

    const renderer = new Renderer(notationRef.current, Renderer.Backends.SVG)
    renderer.resize(width, height)
    const context = renderer.getContext()

    const stave = new Stave(10, 40, width - 20)
    stave.addClef('treble').setContext(context).draw()

    const note = selectedNote[0]
    const octave = selectedNote.slice(1)
    const vexNote = `${note}/${octave}`
    
    const staveNote = new StaveNote({
      keys: [vexNote],
      duration: 'w',
    })

    const voice = new Voice({ numBeats: 4, beatValue: 4 })
    voice.addTickable(staveNote)

    new Formatter().joinVoices([voice]).format([voice], width - 60)
    voice.draw(context, stave)
  }

  const playNote = async () => {
    if (synthRef.current) {
      await Tone.start()
      synthRef.current.triggerAttackRelease(selectedNote, '8n')
    }
  }

  const startListening = async () => {
    try {
      setErrorMessage('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      source.connect(analyserRef.current)

      const buffer = new Float32Array(analyserRef.current.fftSize)
      detectorRef.current = PitchDetector.forFloat32Array(analyserRef.current.fftSize)

      setIsListening(true)

      let lastDetectionTime = 0
      const DETECTION_THROTTLE_MS = 100 // Throttle to 10 detections per second

      const detectPitch = () => {
        if (!isListening || !analyserRef.current || !detectorRef.current) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
          return
        }

        const now = Date.now()
        if (now - lastDetectionTime >= DETECTION_THROTTLE_MS) {
          analyserRef.current.getFloatTimeDomainData(buffer)
          const [frequency, clarity] = detectorRef.current.findPitch(buffer, audioContextRef.current!.sampleRate)

          if (clarity > 0.9 && frequency > 0) {
            const noteFromFreq = frequencyToNote(frequency)
            setDetectedNote(noteFromFreq)
          }
          lastDetectionTime = now
        }

        animationFrameRef.current = requestAnimationFrame(detectPitch)
      }

      detectPitch()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setErrorMessage('Could not access microphone. Please check permissions.')
      setIsListening(false)
    }
  }

  const stopListening = () => {
    setIsListening(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setDetectedNote('')
  }

  const frequencyToNote = (frequency: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const c0 = A4_FREQUENCY * Math.pow(2, -A4_OFFSET)
    
    if (frequency < 1) return ''
    
    const halfSteps = SEMITONES_PER_OCTAVE * (Math.log(frequency / c0) / Math.log(2))
    const octave = Math.floor(halfSteps / SEMITONES_PER_OCTAVE)
    const note = Math.round(halfSteps % SEMITONES_PER_OCTAVE)
    
    return `${noteNames[note]}${octave}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Oboe Note Helper</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Note Selection and Display */}
          <div>
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body">
                <h2 className="card-title mb-4">Select Note</h2>
                
                {/* Note Selector */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {notes.map(note => 
                    octaves.map(octave => {
                      const noteKey = `${note}${octave}`
                      return (
                        <button
                          key={noteKey}
                          className={`btn btn-sm ${selectedNote === noteKey ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setSelectedNote(noteKey)}
                        >
                          {noteKey}
                        </button>
                      )
                    })
                  )}
                </div>

                {/* Notation Display */}
                <div 
                  ref={notationRef} 
                  className="mb-4 flex justify-center"
                  style={{ minHeight: '200px' }}
                />

                <button className="btn btn-primary w-full" onClick={playNote}>
                  🔊 Play Note
                </button>
              </div>
            </div>

            {/* Pitch Detection */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Practice Mode</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  Use your microphone to detect what note you're playing
                </p>
                
                {errorMessage && (
                  <div className="alert alert-error mb-4">
                    <span>{errorMessage}</span>
                  </div>
                )}
                
                {!isListening ? (
                  <button className="btn btn-secondary w-full" onClick={startListening}>
                    🎤 Start Listening
                  </button>
                ) : (
                  <button className="btn btn-error w-full" onClick={stopListening}>
                    ⏹️ Stop Listening
                  </button>
                )}

                {detectedNote && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-base-content/70">Detected:</p>
                    <p className="text-3xl font-bold text-success">{detectedNote}</p>
                    {detectedNote === selectedNote && (
                      <div className="badge badge-success badge-lg mt-2">✓ Match!</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fingering Chart */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Fingering Chart</h2>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {selectedNote}
                  </div>
                </div>

                {oboeFingeringChart[selectedNote] ? (
                  <div className="space-y-2">
                    {oboeFingeringChart[selectedNote].map((fingering, index) => (
                      <div key={index} className="alert bg-base-200">
                        <span className="font-mono text-sm">{fingering}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <span>Fingering not available for this note</span>
                  </div>
                )}

                <div className="divider">Legend</div>
                
                <div className="text-sm space-y-1 text-base-content/70">
                  <p>• <strong>Thumb</strong>: Octave key (half-hole for upper register)</p>
                  <p>• <strong>Numbers</strong>: Finger holes (1=index, 2=middle, 3=ring)</p>
                  <p>• <strong>Left/Right</strong>: Hand position on oboe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteHelper
