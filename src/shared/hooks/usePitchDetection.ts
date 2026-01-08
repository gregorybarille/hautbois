import { useState, useRef, useCallback } from 'react'
import { PitchDetector } from 'pitchy'
import { frequencyToNote } from '../utils/noteUtils'
import { DETECTION_THROTTLE_MS } from '../constants/notes'

export function usePitchDetection() {
  const [isListening, setIsListening] = useState(false)
  const [detectedNote, setDetectedNote] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const detectorRef = useRef<PitchDetector<Float32Array> | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const startListening = useCallback(async () => {
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

      const detectPitch = () => {
        if (!analyserRef.current || !detectorRef.current) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
          return
        }

        const now = Date.now()
        if (now - lastDetectionTime >= DETECTION_THROTTLE_MS) {
          analyserRef.current.getFloatTimeDomainData(buffer)
          const [frequency, clarity] = detectorRef.current.findPitch(
            buffer,
            audioContextRef.current!.sampleRate
          )

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
      setErrorMessage('microphoneError')
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
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
  }, [])

  return {
    isListening,
    detectedNote,
    errorMessage,
    startListening,
    stopListening,
  }
}
