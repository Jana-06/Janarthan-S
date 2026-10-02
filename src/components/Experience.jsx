import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const experiences = [
  {
    role: 'Application Developer',
    company: 'HITS College Projects',
    period: '2026 – Present',
    type: 'Full-time',
    description:
      'Independently designed and built a full-stack React/TypeScript platform adopted by the HITS Placement & Training Division, now serving 15,000+ students — owned architecture, reusable components, role-based workflows, and access controls end to end.',
    tags: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    accent: '#8ca6c6',
  },
  {
    role: 'Frontend/Backend Developer',
    company: 'AI Medical Documentation System — Client, California',
    period: '2026',
    type: 'Client Project',
    description:
      'Built the Flutter client front end and the Flask/FastAPI + MySQL REST API layer for a real-time consultation transcription and clinical data extraction tool delivered to a paying hospital client; secured with JWT, containerized with Docker, CI/CD via GitHub Actions.',
    tags: ['Flutter', 'FastAPI', 'Flask', 'MySQL', 'Docker', 'JWT'],
    accent: '#8ca6c6',
  },
  {
    role: 'Android Developer Intern',
    company: 'Renu Sharma Organisation',
    period: 'Apr – Jul 2025',
    type: 'Internship',
    description:
      'Built native Android UI screens in Kotlin/XML with Firebase integration in a Git-based Agile workflow.',
    tags: ['Kotlin', 'Android', 'Firebase', 'Git'],
    accent: '#8ca6c6',
  },
  {
    role: 'AI & App Development Intern',
    company: 'Marcello Tech',
    period: 'Jul – Sep 2024',
    type: 'Internship',
    description:
      'Built cross-platform mobile UI in Flutter/Dart, integrated REST APIs, collaborated via Git/GitHub in an agile team.',
    tags: ['Flutter', 'Dart', 'REST APIs', 'Git'],
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

export default function Experience() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="experience"
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center bg-black py-32 md:py-40 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 w-full">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-3"
        >
          Experience
        </motion.p>
        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.04em] text-white mb-16 leading-tight"
        >
          Where I've
          <br />
          <span className="text-white/30">shipped things.</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

          <div className="flex flex-col gap-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                custom={i + 2}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="group relative md:pl-12"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-[11px] top-6 w-2.5 h-2.5 rounded-full hidden md:block ring-2 ring-black transition-all duration-300 group-hover:scale-150"
                  style={{ backgroundColor: exp.accent }}
                />

                {/* Card */}
                <div className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-7 hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-300 group-hover:-translate-y-0.5">
                  {/* Subtle top glow on hover */}
                  <div
                    className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${exp.accent}60, transparent)` }}
                  />

                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg tracking-tight leading-snug">
                        {exp.role}
                      </h3>
                      <p className="text-white/50 text-sm mt-0.5">{exp.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-white/40 text-sm font-medium whitespace-nowrap">
                        {exp.period}
                      </span>
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${exp.accent}20`, color: exp.accent }}
                      >
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/55 text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/[0.08] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
