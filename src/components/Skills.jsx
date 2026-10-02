import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const skillGroups = [
  {
    label: 'Languages',
    accent: '#8ca6c6',
    skills: ['Python', 'JavaScript', 'TypeScript', 'Kotlin', 'SQL', 'Dart'],
  },
  {
    label: 'Frontend',
    accent: '#8ca6c6',
    skills: ['React.js', 'Flutter', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    label: 'Backend & APIs',
    accent: '#8ca6c6',
    skills: ['Node.js', 'FastAPI', 'Flask', 'REST API Design', 'JWT / OAuth'],
  },
  {
    label: 'Databases',
    accent: '#8ca6c6',
    skills: ['MySQL', 'MongoDB', 'Firebase', 'Supabase (Vector DB)'],
  },
  {
    label: 'Cloud & DevOps',
    accent: '#8ca6c6',
    skills: ['Git / GitHub', 'Docker', 'CI/CD (GitHub Actions)', 'Linux'],
  },
  {
    label: 'AI-Native Engineering',
    accent: '#8ca6c6',
    skills: [
      'LLMs',
      'RAG',
      'Prompt Engineering',
      'MCP Protocol',
      'Agentic AI',
      'OpenAI Whisper',
      'Google Gemini API',
    ],
  },
]

const tools = [
  ['Figma', 'figma'], ['Postman', 'postman'], ['GitHub', 'github'],
  ['Docker', 'docker'], ['GitHub Actions', 'githubactions'], ['Linux', 'linux'],
  ['TensorFlow', 'tensorflow'], ['Python', 'python'], ['JavaScript', 'javascript'],
  ['TypeScript', 'typescript'], ['Kotlin', 'kotlin'], ['Dart', 'dart'],
  ['React', 'react'], ['Flutter', 'flutter'], ['HTML5', 'html5'],
  ['Tailwind CSS', 'tailwindcss'], ['Node.js', 'nodedotjs'], ['FastAPI', 'fastapi'],
  ['Flask', 'flask'], ['MySQL', 'mysql'], ['MongoDB', 'mongodb'],
  ['Firebase', 'firebase'], ['Supabase', 'supabase'],
].map(([name, slug]) => ({ name, logo: `/tool-logos/${slug}.svg` }))

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="skills"
      ref={ref}
      className="relative bg-black py-32 overflow-hidden"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-3"
        >
          Skills
        </motion.p>
        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.04em] text-white mb-16 leading-tight"
        >
          My toolkit.
        </motion.h2>

        <div className="flex flex-col gap-10">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              custom={gi + 2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-1.5 h-4 rounded-full"
                  style={{ backgroundColor: group.accent }}
                />
                <span className="text-white/40 text-xs font-semibold tracking-wider uppercase">
                  {group.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="group/pill relative px-4 py-2 rounded-full text-sm font-medium text-white/70 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all duration-200 cursor-default"
                  >
                    {skill}
                    {/* Glow effect */}
                    <span
                      className="absolute inset-0 rounded-full opacity-0 group-hover/pill:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ boxShadow: `0 0 20px ${group.accent}25` }}
                    />
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="toolkit">
          <div className="toolkit__heading">
            <div>
              <p className="section-kicker">The workbench</p>
              <h3>Tools I reach for.</h3>
            </div>
          </div>
          <div className="toolkit__viewport" role="region" aria-label="A continuously scrolling row of software tool logos.">
            <div className="toolkit__track">
              {[0, 1].map((loop) => (
                <div className="toolkit__group" key={loop} aria-hidden={loop === 1}>
                  {tools.map((tool) => {
                    return <span className="tool-logo" key={`${loop}-${tool.name}`}>
                      <img src={tool.logo} alt={loop === 0 ? tool.name : ''} loading={loop === 0 ? 'lazy' : 'eager'} />
                    </span>
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
