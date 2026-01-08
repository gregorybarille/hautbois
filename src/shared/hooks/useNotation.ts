import { useEffect, useRef } from 'react'
import { Renderer, Stave, StaveNote, Formatter, Voice } from 'vexflow'

interface UseNotationOptions {
  note: string // Note in English notation (e.g., 'C4')
  width?: number
  height?: number
}

export function useNotation({ note, width = 400, height = 200 }: UseNotationOptions) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !note) return

    // Clear previous notation safely
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    try {
      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
      renderer.resize(width, height)
      const context = renderer.getContext()

      const stave = new Stave(10, 40, width - 20)
      stave.addClef('treble').setContext(context).draw()

      // Convert note to VexFlow format (e.g., 'C/4')
      const noteName = note[0]
      const octave = note.slice(1)
      const vexNote = `${noteName}/${octave}`
      
      const staveNote = new StaveNote({
        keys: [vexNote],
        duration: 'w',
      })

      const voice = new Voice({ numBeats: 4, beatValue: 4 })
      voice.addTickable(staveNote)

      new Formatter().joinVoices([voice]).format([voice], width - 60)
      voice.draw(context, stave)
    } catch (error) {
      console.error('Error rendering notation:', error)
    }
  }, [note, width, height])

  return containerRef
}
