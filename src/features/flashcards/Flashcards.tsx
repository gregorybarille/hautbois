import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotation } from '../../shared/hooks/useNotation'
import { useAudioSynth } from '../../shared/hooks/useAudioSynth'
import { getDisplayNoteName } from '../../shared/utils/noteUtils'
import { ENGLISH_NOTES, OCTAVES } from '../../shared/constants/notes'

interface FlashcardsProps {
  onBack: () => void
}

type FlashcardMode = 'noteNames' | 'notesOnScore'

const Flashcards: React.FC<FlashcardsProps> = ({ onBack }) => {
  const { t } = useTranslation()
  const [mode, setMode] = useState<FlashcardMode>('noteNames')
  const [currentNote, setCurrentNote] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState(false)
  const { playNote } = useAudioSynth()
  const notationRef = useNotation({ note: currentNote })

  useEffect(() => {
    generateNewNote()
  }, [])

  const generateNewNote = () => {
    const randomNote = ENGLISH_NOTES[Math.floor(Math.random() * ENGLISH_NOTES.length)]
    const randomOctave = OCTAVES[Math.floor(Math.random() * OCTAVES.length)]
    setCurrentNote(`${randomNote}${randomOctave}`)
    setShowAnswer(false)
  }

  const handlePlayNote = async () => {
    await playNote(currentNote)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button className="btn btn-ghost" onClick={onBack}>
          ← {t('common.back')}
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">{t('flashcards.title')}</h1>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`btn ${mode === 'noteNames' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('noteNames')}
          >
            {t('flashcards.noteNames')}
          </button>
          <button
            className={`btn ${mode === 'notesOnScore' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('notesOnScore')}
          >
            {t('flashcards.notesOnScore')}
          </button>
        </div>

        {/* Flashcard */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body items-center text-center">
            {mode === 'noteNames' ? (
              <>
                <h2 className="text-6xl font-bold mb-4">
                  {getDisplayNoteName(currentNote)}
                </h2>
                <button className="btn btn-circle btn-primary" onClick={handlePlayNote}>
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
                <button className="btn btn-circle btn-primary" onClick={handlePlayNote}>
                  🔊
                </button>
                {showAnswer && (
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-success">
                      {getDisplayNoteName(currentNote)}
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
            {showAnswer ? t('flashcards.hideAnswer') : t('flashcards.showAnswer')}
          </button>
          <button 
            className="btn btn-primary"
            onClick={generateNewNote}
          >
            {t('flashcards.nextNote')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Flashcards
