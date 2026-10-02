import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * A soft radial spotlight that follows the mouse cursor with spring easing.
 * Render inside a `relative overflow-hidden` parent.
 * Supports `colorFrom` and `colorTo` for gradient customization.
 */
export default function CursorSpotlight({
  colorFrom = 'rgba(0, 113, 227, 0.18)',
  colorTo = 'rgba(124, 58, 237, 0.08)',
  size = 700,
}) {
  const containerRef = useRef(null)

  const rawX = useMotionValue(-1000)
  const rawY = useMotionValue(-1000)

  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.8 })
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.8 })

  useEffect(() => {
    const el = containerRef.current?.parentElement
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      rawX.set(e.clientX - rect.left - size / 2)
      rawY.set(e.clientY - rect.top - size / 2)
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [rawX, rawY, size])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        style={{
          x,
          y,
          width: size,
          height: size,
          background: `radial-gradient(circle, ${colorFrom} 0%, ${colorTo} 40%, transparent 70%)`,
          borderRadius: '50%',
          position: 'absolute',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
