import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'

const moments = [
  {
    src: '/images/talk.webp',
    alt: 'Janarthan speaking at a lectern during an event',
    label: 'In the room',
    title: ['Build it.', 'Then share it.'],
    note: 'Good engineering means making ideas useful — and clear enough to bring other people in.',
    kind: 'talk',
  },
  {
    src: '/images/scholarship.webp',
    alt: 'Janarthan at a scholarship recognition ceremony',
    label: 'A milestone',
    title: ['A little progress', 'goes a long way.'],
    note: 'A memorable moment from my time at Hindustan Institute of Technology and Science.',
    kind: 'scholarship',
  },
  {
    src: '/images/award-team.webp',
    alt: 'Janarthan and teammates at an award presentation',
    label: 'Better, together',
    title: ['The best work', 'is shared work.'],
    note: 'The people beside you make the hard problems worth solving.',
    kind: 'team',
  },
]

function MomentSlide({ moment, index, progress }) {
  const center = (index + 0.5) / moments.length
  const start = Math.max(0, center - 0.22)
  const end = Math.min(1, center + 0.22)
  const imageScale = useTransform(progress, [start, center, end], [1.055, 1, 1.055])
  const copyOpacity = useTransform(progress, [start, center, end], [0.68, 1, 0.68])

  return (
    <article className={`moment-slide moment-slide--${moment.kind}`}>
      <figure className="moment-visual">
        <motion.img src={moment.src} alt={moment.alt} loading={index === 0 ? 'eager' : 'lazy'} style={{ scale: imageScale }} />
        <figcaption><span>{moment.label}</span><i>0{index + 1} / 03</i></figcaption>
      </figure>
      <motion.div className="moment-copy" style={{ opacity: copyOpacity }}>
        <p className="moment-copy__index">A PERSONAL FIELD NOTE <span>0{index + 1}</span></p>
        <h3>{moment.title[0]}<br /><span>{moment.title[1]}</span></h3>
        <p className="moment-copy__note">{moment.note}</p>
      </motion.div>
    </article>
  )
}

export default function Moments() {
  const sectionRef = useRef(null)
  const [activeMoment, setActiveMoment] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const trackX = useTransform(scrollYProgress, [0, 1], ['0vw', '-200vw'])
  const progressX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextMoment = Math.min(moments.length - 1, Math.floor(latest * moments.length))
    setActiveMoment((current) => current === nextMoment ? current : nextMoment)
  })

  return (
    <section ref={sectionRef} className="moments-section" aria-labelledby="moments-title">
      <div className="moments-pin">
        <header className="moments-heading">
          <div>
            <p className="section-kicker">Beyond the screen</p>
            <h2 id="moments-title">A few moments<br /><span>that stay with me.</span></h2>
          </div>
          <div className="moments-progress" role="progressbar" aria-label="Portfolio moments" aria-valuemin="1" aria-valuemax={moments.length} aria-valuenow={activeMoment + 1}>
            <span>{String(activeMoment + 1).padStart(2, '0')}</span><div><motion.i style={{ scaleX: progressX }} /></div><span>{String(moments.length).padStart(2, '0')}</span>
          </div>
        </header>

        <div className="moments-window">
          <motion.div className="moments-track" style={{ x: trackX }}>
            {moments.map((moment, index) => <MomentSlide key={moment.src} moment={moment} index={index} progress={scrollYProgress} />)}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
