import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Splits text into words and animates each word with a staggered
 * clip-path + translateY reveal — like letters emerging from below a line.
 *
 * Props:
 *   text       — string to animate
 *   as         — HTML tag (default: 'span')
 *   className  — applied to the outer wrapper
 *   delay      — initial delay in seconds (default: 0)
 *   duration   — per-word duration (default: 0.55)
 *   stagger    — delay between words (default: 0.045)
 *   once       — only animate once (default: true)
 */
export default function WordReveal({
  text = '',
  as: Tag = 'span',
  className = '',
  delay = 0,
  duration = 0.55,
  stagger = 0.045,
  once = true,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })

  const words = text.split(' ')

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const word = {
    hidden: {
      y: '110%',
      opacity: 0,
      rotateX: 20,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <Tag className={className}>
      <motion.span
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        aria-label={text}
        className="inline-flex flex-wrap gap-x-[0.25em]"
        style={{ perspective: '600px' }}
      >
        {words.map((w, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden"
            style={{ paddingBottom: '0.1em' }} // prevent clip on descenders
          >
            <motion.span
              variants={word}
              className="inline-block"
              style={{ transformOrigin: 'bottom center' }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
