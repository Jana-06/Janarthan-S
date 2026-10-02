import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem('janarthan-portfolio-intro') === 'seen'
  } catch {
    return false
  }
}

export default function PageIntro() {
  const [visible, setVisible] = useState(() => !hasSeenIntro())
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!visible) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const duration = prefersReducedMotion ? 180 : 1550
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem('janarthan-portfolio-intro', 'seen')
      } catch {
        // The intro still works when browser storage is unavailable.
      }
      setVisible(false)
    }, duration)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
    }
  }, [visible, prefersReducedMotion])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="portfolio-intro"
          initial={{ y: 0 }}
          exit={{ y: '-100%', transition: { duration: prefersReducedMotion ? 0.18 : 0.82, ease: [0.76, 0, 0.24, 1] } }}
          aria-label="Loading portfolio"
          role="status"
        >
          <div className="portfolio-intro__top">
            <span className="portfolio-intro__mark">JS<span>.</span></span>
            <span className="portfolio-intro__meta">PERSONAL PORTFOLIO <span>·</span> 2026</span>
          </div>

          <div className="portfolio-intro__center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="portfolio-intro__eyebrow"
            >
              AI · PRODUCT · ENGINEERING
            </motion.p>
            <div className="portfolio-intro__name-window">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                Janarthan S<span>.</span>
              </motion.h1>
            </div>
          </div>

          <div className="portfolio-intro__bottom">
            <span>DESIGNED TO MAKE AN IMPACT</span>
            <div className="portfolio-intro__progress-track">
              <motion.div
                className="portfolio-intro__progress"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: prefersReducedMotion ? 0.16 : 1.3, delay: 0.08, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
            <span>01 — 08</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
