import React, { useState, useEffect, useRef } from 'react'
import { Renderer, Stave, StaveNote, Formatter, Voice } from 'vexflow'
import * as Tone from 'tone'

interface FlashcardsProps {
  onBack: () => void
}

type FlashcardMode = 'noteNames' | 'notesOnScore'

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const octaves = [4, 5, 6]

const Flashcards: React.FC<FlashcardsProps> = ({ onBack }) => {
  const [mode, setMode] = useState<FlashcardMode>('noteNames')
  const [currentNote, setCurrentNote] = useState<string>('')
  const [currentOctave, setCurrentOctave] = useState<number>(4)
  const [showAnswer, setShowAnswer] = useState(false)
  const notationRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<Tone.Synth | null>(null)

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination()
    generateNewNote()
    return () => {
      synthRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (mode === 'notesOnScore' && notationRef.current) {
      renderNotation()
    }
  }, [currentNote, currentOctave, mode, showAnswer])

  const generateNewNote = () => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)]
    const randomOctave = octaves[Math.floor(Math.random() * octaves.length)]
    setCurrentNote(randomNote)
    setCurrentOctave(randomOctave)
    setShowAnswer(false)
  }

  const playNote = async () => {
    if (synthRef.current) {
      await Tone.start()
      synthRef.current.triggerAttackRelease(`${currentNote}${currentOctave}`, '8n')
    }
  }

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

    // Convert note to VexFlow format
    const vexNote = `${currentNote}/${currentOctave}`
    const staveNote = new StaveNote({
      keys: [vexNote],
      duration: 'w',
    })

    const voice = new Voice({ numBeats: 4, beatValue: 4 })
    voice.addTickable(staveNote)

    new Formatter().joinVoices([voice]).format([voice], width - 60)
    voice.draw(context, stave)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Flashcards</h1>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`btn ${mode === 'noteNames' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('noteNames')}
          >
            Note Names
          </button>
          <button
            className={`btn ${mode === 'notesOnScore' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('notesOnScore')}
          >
            Notes on Score
          </button>
        </div>

        {/* Flashcard */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body items-center text-center">
            {mode === 'noteNames' ? (
              <>
                <h2 className="text-6xl font-bold mb-4">
                  {currentNote}{currentOctave}
                </h2>
                <button className="btn btn-circle btn-primary" onClick={playNote}>
                  🔊
                </button>
              </>
            ) : (
              <>
                <div 
                  ref={notationRef} 
                  className="mb-4 flex justify-center"
                  style={{ minHeight: '200px', width: '100%' }}
                />
                <button className="btn btn-circle btn-primary" onClick={playNote}>
                  🔊
                </button>
                {showAnswer && (
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-success">
                      {currentNote}{currentOctave}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={generateNewNote}
          >
            Next Note
          </button>
        </div>
      </div>
    </div>
  )
}

export default Flashcards
