import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Thin gradient bar fixed below the navbar that fills
 * as the user scrolls through the page.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'var(--signal, #ff5733)',
      }}
    />
  )
}
