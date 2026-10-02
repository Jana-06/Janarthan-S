import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Wraps any element with a magnetic hover effect.
 * When the mouse enters within `radius` px of the element center,
 * the element subtly shifts toward the cursor.
 */
export default function MagneticButton({ children, className = '', strength = 0.35, radius = 60 }) {
  const ref = useRef(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, { stiffness: 200, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 200, damping: 18, mass: 0.6 })

  const handleMouseMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < radius) {
        rawX.set(dx * strength)
        rawY.set(dy * strength)
      }
    },
    [rawX, rawY, radius, strength]
  )

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-flex' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}
