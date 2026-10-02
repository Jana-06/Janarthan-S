import { useEffect, useRef } from 'react'

/**
 * Initializes Lenis smooth scroll and keeps it in sync
 * with the browser's requestAnimationFrame loop.
 * Returns the lenis instance so consumers can add listeners.
 */
export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    let lenis
    let rafId
    let cancelled = false

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const init = async () => {
      const { default: Lenis } = await import('lenis')
      if (cancelled) return
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.2,
      })
      lenisRef.current = lenis

      function raf(time) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    init().catch((error) => console.error('Smooth scroll failed to initialize:', error))

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
