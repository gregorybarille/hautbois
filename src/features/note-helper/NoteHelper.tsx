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

        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('noteHelper.title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Note Selection and Display */}
            <div className="space-y-6">
              <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border-2 border-primary/20">
                <div className="card-body p-8">
                  <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    {t('noteHelper.selectNote')}
                  </h2>
                  
                  {/* Note Selector */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {ENGLISH_NOTES.map(note => 
                      OCTAVES.map(octave => {
                        const noteKey = `${note}${octave}`
                        return (
                          <button
                            key={noteKey}
                            className={`btn btn-sm ${selectedNote === noteKey ? 'btn-primary shadow-lg' : 'btn-outline btn-primary'}`}
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
                    className="mb-6 flex justify-center bg-white rounded-lg p-6 shadow-inner"
                    style={{ minHeight: '200px' }}
                  />

                  <button className="btn btn-primary btn-lg w-full gap-2 shadow-lg hover:shadow-primary/50" onClick={handlePlayNote}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    {t('noteHelper.playNote')}
                  </button>
                </div>
              </div>

              {/* Pitch Detection */}
              <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border-2 border-secondary/20">
                <div className="card-body p-8">
                  <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {t('noteHelper.practiceMode')}
                  </h2>
                  <p className="text-base-content/70 mb-6">
                    {t('noteHelper.practiceModeDescription')}
                  </p>
                  
                  {errorMessage && (
                    <div className="alert alert-error shadow-lg mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t('noteHelper.microphoneError')}</span>
                    </div>
                  )}
                  
                  {!isListening ? (
                    <button className="btn btn-secondary btn-lg w-full gap-2 shadow-lg hover:shadow-secondary/50" onClick={startListening}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      {t('noteHelper.startListening')}
                    </button>
                  ) : (
                    <button className="btn btn-error btn-lg w-full gap-2 shadow-lg animate-pulse" onClick={stopListening}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      {t('noteHelper.stopListening')}
                    </button>
                  )}

                  {detectedNote && (
                    <div className="mt-6 text-center p-6 bg-success/10 rounded-lg border-2 border-success/30">
                      <p className="text-sm text-base-content/70 mb-2">{t('noteHelper.detected')}</p>
                      <p className="text-5xl font-bold text-success mb-4">
                        {toFrenchNote(detectedNote)}
                      </p>
                      {detectedNote === selectedNote && (
                        <div className="badge badge-success badge-lg gap-2 py-4 px-6 shadow-lg animate-bounce">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {t('noteHelper.match')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fingering Chart */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border-2 border-accent/20">
              <div className="card-body p-8">
                <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  {t('noteHelper.fingeringChart')}
                </h2>
                
                <div className="space-y-6">
                  <div className="text-center p-6 bg-primary/10 rounded-lg border-2 border-primary/30">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {getDisplayNoteName(selectedNote)}
                    </div>
                  </div>

                  {OBOE_FINGERING_CHART[selectedNote] ? (
                    <div className="space-y-3">
                      {OBOE_FINGERING_CHART[selectedNote].map((fingering, index) => (
                        <div key={index} className="alert bg-base-300/50 shadow-md border border-base-content/10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-mono text-sm">{fingering}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-warning shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{t('noteHelper.fingeringNotAvailable')}</span>
                    </div>
                  )}

                  <div className="divider text-lg font-semibold">{t('noteHelper.legend')}</div>
                  
                  <div className="space-y-3 text-sm bg-base-300/30 rounded-lg p-6 border border-base-content/10">
                    <p className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('noteHelper.legendThumb')}
                    </p>
                    <p className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('noteHelper.legendNumbers')}
                    </p>
                    <p className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('noteHelper.legendHands')}
                    </p>
                  </div>
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
