import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BookOpen, Award, Cloud, Code2 } from 'lucide-react'

const courses = [
  'Data Structures & Algorithms',
  'Object-Oriented Programming',
  'System Design',
  'Database Management Systems',
  'Operating Systems',
  'Computer Networks',
  'Machine Learning',
]

const awards = [
  {
    icon: Award,
    title: 'Runner-up, Most Popular Design',
    detail: 'ICRA 2026 NeuroDesign, HRI EXPO, Vienna — 100+ global university teams',
    accent: '#8ca6c6',
  },
  {
    icon: Award,
    title: 'Best Innovation Award',
    detail: 'National ML Datathon, SRM Institute — 1st among 60 teams',
    accent: '#8ca6c6',
  },
  {
    icon: Cloud,
    title: 'President, Excimer Cloud Club (AWS)',
    detail: 'HITS — Led 40+ member club',
    accent: '#8ca6c6',
  },
  {
    icon: Code2,
    title: 'Programming Lead',
    detail: 'Blue Screen Club, HITS',
    accent: '#8ca6c6',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Education() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="education"
      ref={ref}
      className="relative bg-[#111317] py-32 md:py-40 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d2d2d7] to-transparent" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Education */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="section-kicker mb-3"
        >
          Education
        </motion.p>

        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="rounded-3xl bg-[#1c1f24] border border-white/10 p-10 mb-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] relative overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-400/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-[#647d9d]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-[#1d1d1f] leading-snug">
                  B.Tech, Artificial Intelligence & Data Science
                </h3>
                <p className="text-[#6e6e73] font-medium mt-1">
                  Hindustan Institute of Technology and Science (HITS), Chennai
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex flex-col">
                <span className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Period</span>
                <span className="text-white/80 font-semibold">2023 – 2027</span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">CGPA</span>
                <span className="education-highlight text-3xl font-extrabold tracking-tight leading-none">9.44</span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Class</span>
                <span className="text-white/80 font-semibold">2027</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-white/45 mb-3">
                Coursework
              </p>
              <div className="flex flex-wrap gap-2">
                {courses.map((c) => (
                  <span
                    key={c}
                    className="education-chip text-xs px-3 py-1.5 rounded-lg border font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Awards & Leadership */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="section-kicker mb-6 mt-16"
        >
          Awards & Leadership
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {awards.map((award, i) => {
            const Icon = award.icon
            return (
            <motion.div
              key={i}
              custom={i + 3}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="group rounded-2xl bg-[#1c1f24] border border-white/10 p-6 hover:bg-[#22262d] hover:shadow-[0_18px_44px_rgba(0,0,0,0.24)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                  <Icon className="h-5 w-5" style={{ color: '#647d9d' }} strokeWidth={1.7} />
                </span>
                <div>
                  <h4 className="font-semibold text-white tracking-tight leading-snug">
                    {award.title}
                  </h4>
                  <p className="text-sm text-white/55 mt-1 font-light leading-relaxed">
                    {award.detail}
                  </p>
                </div>
              </div>
              <div
                className="h-0.5 mt-4 rounded-full opacity-30"
                style={{ background: `linear-gradient(90deg, ${award.accent}, transparent)` }}
              />
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
