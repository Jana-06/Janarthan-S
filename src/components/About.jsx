import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stats = [
  { value: '15K+', label: 'Students served', note: 'A production platform used across HITS.' },
  { value: '9.44', label: 'Current CGPA', note: 'B.Tech, Artificial Intelligence & Data Science.' },
  { value: '4+', label: 'Production apps', note: 'Web, mobile, and AI products delivered.' },
  { value: '100+', label: 'Global teams', note: 'Teams represented at ICRA NeuroDesign.' },
]

function ScrubbedWords({ children, accent = false }) {
  return children.split(' ').map((word, index) => (
    <span className={`about-word${accent ? ' about-word--accent' : ''}`} key={`${word}-${index}`}>
      {word}{index < children.split(' ').length - 1 ? ' ' : ''}
    </span>
  ))
}

export default function About() {
  const ref = useRef(null)
  const quoteRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activeStat, setActiveStat] = useState(0)

  useEffect(() => {
    let context
    let cancelled = false

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollTriggerModule]) => {
      if (cancelled || !quoteRef.current) return
      const gsap = gsapModule.gsap
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger)
      context = gsap.context(() => {
        const words = gsap.utils.toArray('.about-word')
        gsap.fromTo(
          words,
          { opacity: 0.16, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.035,
            ease: 'none',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 82%',
              end: 'bottom 34%',
              scrub: 0.7,
            },
          },
        )
      }, quoteRef)
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [])

  const moveStat = (direction) => {
    setActiveStat((current) => (current + direction + stats.length) % stats.length)
  }

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-[100svh] flex items-center bg-[#f1eee7] overflow-hidden py-32 md:py-40"
    >
      <div className="about-halo" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-px bg-black/10" />

      <div className="about-layout max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="about-copy">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="section-kicker mb-7"
          >
            A little about me
          </motion.p>

          <motion.blockquote
            ref={quoteRef}
            aria-label="I like engineering work where the details matter: a clear interface, a dependable backend, and a product that holds up after launch."
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="about-quote"
          >
            <ScrubbedWords>I like engineering work where the</ScrubbedWords>{' '}
            <ScrubbedWords accent>details matter</ScrubbedWords>: 
            <ScrubbedWords>a clear interface, a dependable backend, and a product that holds up after launch.</ScrubbedWords>
          </motion.blockquote>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="about-description"
          >
            I work across React and TypeScript, Flutter, Python APIs, and applied AI. I care about the full path from a clear problem to a reliable product people can use.
          </motion.p>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="impact-panel"
          aria-label="Portfolio results"
        >
          <div className="impact-panel__top">
            <span>Selected results</span>
            <span className="impact-panel__spark" aria-hidden="true" />
          </div>

          <div className="impact-panel__stage" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stats[activeStat].label}
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(5px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="impact-panel__result"
              >
                <span className="impact-panel__value">{stats[activeStat].value}</span>
                <span className="impact-panel__label">{stats[activeStat].label}</span>
                <span className="impact-panel__note">{stats[activeStat].note}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="impact-panel__controls">
            <div className="impact-panel__dots" aria-label="Choose a result">
              {stats.map((stat, index) => (
                <button
                  key={stat.label}
                  type="button"
                  className={`impact-panel__dot${activeStat === index ? ' is-active' : ''}`}
                  onClick={() => setActiveStat(index)}
                  aria-label={`Show ${stat.label}`}
                  aria-current={activeStat === index ? 'true' : undefined}
                />
              ))}
            </div>
            <div className="impact-panel__arrows">
              <button type="button" onClick={() => moveStat(-1)} aria-label="Previous result">
                <ArrowLeft size={17} strokeWidth={1.7} />
              </button>
              <button type="button" onClick={() => moveStat(1)} aria-label="Next result">
                <ArrowRight size={17} strokeWidth={1.7} />
              </button>
            </div>
          </div>
          <span className="impact-panel__outline" aria-hidden="true">J</span>
        </motion.aside>
      </div>
    </section>
  )
}
