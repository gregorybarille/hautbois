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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button className="btn btn-ghost btn-lg gap-2" onClick={onBack}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('common.back')}
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('flashcards.title')}
          </h1>

          {/* Mode Selection */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              className={`btn btn-lg ${mode === 'noteNames' ? 'btn-primary' : 'btn-outline btn-primary'}`}
              onClick={() => setMode('noteNames')}
            >
              {t('flashcards.noteNames')}
            </button>
            <button
              className={`btn btn-lg ${mode === 'notesOnScore' ? 'btn-primary' : 'btn-outline btn-primary'}`}
              onClick={() => setMode('notesOnScore')}
            >
              {t('flashcards.notesOnScore')}
            </button>
          </div>

          {/* Flashcard */}
          <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl mb-10 border-2 border-primary/20">
            <div className="card-body items-center text-center p-12">
              {mode === 'noteNames' ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {getDisplayNoteName(currentNote)}
                    </h2>
                  </div>
                  <button className="btn btn-circle btn-primary btn-lg shadow-lg hover:shadow-primary/50 hover:scale-110 transition-all" onClick={handlePlayNote}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <div 
                    ref={notationRef} 
                    className="mb-6 flex justify-center bg-white rounded-lg p-6 shadow-inner"
                    style={{ minHeight: '200px', width: '100%' }}
                  />
                  <button className="btn btn-circle btn-primary btn-lg shadow-lg hover:shadow-primary/50 hover:scale-110 transition-all" onClick={handlePlayNote}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                  {showAnswer && (
                    <div className="mt-6">
                      <div className="badge badge-success badge-lg py-6 px-8 text-3xl font-bold">
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
              className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-secondary/50"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAnswer ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
              </svg>
              {showAnswer ? t('flashcards.hideAnswer') : t('flashcards.showAnswer')}
            </button>
            <button 
              className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-primary/50"
              onClick={generateNewNote}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              {t('flashcards.nextNote')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcards
