import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotation } from '../../shared/hooks/useNotation'
import { useAudioSynth } from '../../shared/hooks/useAudioSynth'
import { usePitchDetection } from '../../shared/hooks/usePitchDetection'
import { getDisplayNoteName, toFrenchNote } from '../../shared/utils/noteUtils'
import { ENGLISH_NOTES, OCTAVES, OBOE_FINGERING_CHART } from '../../shared/constants/notes'

interface NoteHelperProps {
  onBack: () => void
}

const NoteHelper: React.FC<NoteHelperProps> = ({ onBack }) => {
  const { t } = useTranslation()
  const [selectedNote, setSelectedNote] = useState<string>('C4')
  const { playNote } = useAudioSynth()
  const { isListening, detectedNote, errorMessage, startListening, stopListening } = usePitchDetection()
  const notationRef = useNotation({ note: selectedNote })

  const handlePlayNote = async () => {
    await playNote(selectedNote)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button className="btn btn-ghost" onClick={onBack}>
          ← {t('common.back')}
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">{t('noteHelper.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Note Selection and Display */}
          <div>
            <div className="card bg-base-100 shadow-xl mb-6">
              <div className="card-body">
                <h2 className="card-title mb-4">{t('noteHelper.selectNote')}</h2>
                
                {/* Note Selector */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {ENGLISH_NOTES.map(note => 
                    OCTAVES.map(octave => {
                      const noteKey = `${note}${octave}`
                      return (
                        <button
                          key={noteKey}
                          className={`btn btn-sm ${selectedNote === noteKey ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setSelectedNote(noteKey)}
                        >
                          {getDisplayNoteName(noteKey)}
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

                <button className="btn btn-primary w-full" onClick={handlePlayNote}>
                  {t('noteHelper.playNote')}
                </button>
              </div>
            </div>

            {/* Pitch Detection */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">{t('noteHelper.practiceMode')}</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  {t('noteHelper.practiceModeDescription')}
                </p>
                
                {errorMessage && (
                  <div className="alert alert-error mb-4">
                    <span>{t('noteHelper.microphoneError')}</span>
                  </div>
                )}
                
                {!isListening ? (
                  <button className="btn btn-secondary w-full" onClick={startListening}>
                    {t('noteHelper.startListening')}
                  </button>
                ) : (
                  <button className="btn btn-error w-full" onClick={stopListening}>
                    {t('noteHelper.stopListening')}
                  </button>
                )}

                {detectedNote && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-base-content/70">{t('noteHelper.detected')}</p>
                    <p className="text-3xl font-bold text-success">
                      {toFrenchNote(detectedNote)}
                    </p>
                    {detectedNote === selectedNote && (
                      <div className="badge badge-success badge-lg mt-2">
                        {t('noteHelper.match')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fingering Chart */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">{t('noteHelper.fingeringChart')}</h2>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {getDisplayNoteName(selectedNote)}
                  </div>
                </div>

                {OBOE_FINGERING_CHART[selectedNote] ? (
                  <div className="space-y-2">
                    {OBOE_FINGERING_CHART[selectedNote].map((fingering, index) => (
                      <div key={index} className="alert bg-base-200">
                        <span className="font-mono text-sm">{fingering}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <span>{t('noteHelper.fingeringNotAvailable')}</span>
                  </div>
                )}

                <div className="divider">{t('noteHelper.legend')}</div>
                
                <div className="text-sm space-y-1 text-base-content/70">
                  <p>• {t('noteHelper.legendThumb')}</p>
                  <p>• {t('noteHelper.legendNumbers')}</p>
                  <p>• {t('noteHelper.legendHands')}</p>
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
