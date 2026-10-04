import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Bot, Hospital, GraduationCap, Cpu, Package } from 'lucide-react'
import { supabase, supabaseConfigured } from '../lib/supabase'

const projects = [
  {
    id: 'bloom',
    name: 'BLOOM',
    subtitle: 'Companion robot for ASD',
    award: 'Runner-up · ICRA 2026 NeuroDesign, Vienna',
    description:
      'A multimodal AI companion with a React interface, Firebase, a Supabase vector database, and a TensorFlow / OpenCV backend. Includes real-time WebRTC interaction and placed among 100+ global university teams.',
    tags: ['React', 'Python', 'TensorFlow', 'OpenCV', 'Firebase', 'Supabase', 'WebRTC'],
    icon: Bot,
    accent: '#647da1',
  },
  {
    id: 'medical',
    name: 'Clinical documentation',
    subtitle: 'Client project · California',
    award: 'Delivered to a paying hospital client',
    description:
      'A full-stack clinical transcription and data-extraction tool. Built with Flutter, Flask / FastAPI, MySQL, OpenAI Whisper, and Gemini, with JWT security, Docker, and CI/CD.',
    tags: ['Flutter', 'FastAPI', 'MySQL', 'Whisper', 'Gemini', 'Docker'],
    icon: Hospital,
    accent: '#698990',
  },
  {
    id: 'hits-platform',
    name: 'HITS placement platform',
    subtitle: 'Training & Placement Division',
    award: 'Live in production · 15,000+ students',
    description:
      'A full-stack platform serving more than 15,000 students with role-based workflows for achievements, grievances, discipline, registration, and analytics.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    icon: GraduationCap,
    accent: '#657fa7',
  },
  {
    id: 'julie',
    name: 'Julie',
    subtitle: 'Personal AI assistant',
    award: 'Local-first · in active development',
    description:
      'A private assistant in development, pairing Android app control with a laptop-hosted local model and one-task authorization for sensitive actions.',
    tags: ['Flutter', 'Android', 'Python', 'Ollama'],
    icon: Cpu,
    accent: '#828090',
  },
  {
    id: 'nfm',
    name: 'NFM',
    subtitle: 'Medicine delivery & pharmacy app',
    award: 'Native Android · JWT-secured APIs',
    description:
      'A native Android medicine delivery and pharmacy-management app with JWT-secured REST APIs and MySQL / MongoDB storage.',
    tags: ['Android', 'Kotlin', 'JWT', 'MySQL', 'MongoDB'],
    icon: Package,
    accent: '#92836e',
  },
]

const sitePreviews = [
  {
    name: 'NFM Medcare', label: 'PHARMACY · E-COMMERCE', url: 'https://nfm-web-5hxf.vercel.app/',
    image: '/previews/nfm.webp', alt: 'NFM Medcare pharmacy website homepage', summary: 'Medicine and pharmacy storefront',
  },
  {
    name: 'Deep Learning Workshop', label: 'EVENT · HINDUSTAN', url: 'https://workshop-alpha-nine.vercel.app/',
    image: '/previews/workshop.webp', alt: 'Hindustan practical deep learning workshop website', summary: 'A practical deep learning event at HITS',
  },
  {
    name: 'ADICTS Hindustan', label: 'CONFERENCE · HINDUSTAN', url: 'https://adicts-hindustan.vercel.app/',
    image: '/previews/adicts.webp', alt: 'ADICTS conference website homepage', summary: 'Conference site for Advances in Data Engineering',
  },
]

const moreSites = [
  { name: 'BLOOM', note: 'AI companion project', url: 'https://bloom-e35b2.web.app/' },
  { name: 'Portfolio archive', note: 'Earlier portfolio version', url: 'https://portfolio-janarthanx.vercel.app/' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeProject, setActiveProject] = useState(0)
  const [portfolioItems, setPortfolioItems] = useState([])

  useEffect(() => {
    if (!supabaseConfigured) return undefined
    let active = true
    supabase.from('portfolio_items').select('id, kind, title, description, created_at').order('created_at', { ascending: false })
      .then(({ data }) => { if (active && data) setPortfolioItems(data) })
    return () => { active = false }
  }, [])

  const visibleProjects = [
    ...projects,
    ...portfolioItems.map((item) => ({
      id: item.id,
      name: item.title,
      subtitle: item.kind === 'project' ? 'Portfolio project' : 'Achievement',
      award: item.kind === 'project' ? 'Selected work' : 'Portfolio highlight',
      description: item.description,
      tags: [],
      icon: item.kind === 'project' ? Package : Cpu,
      accent: item.kind === 'project' ? '#778a8d' : '#a07863',
    })),
  ]

  return (
    <section id="projects" ref={ref} className="projects-section relative overflow-hidden py-32 md:py-40">
      <div className="projects-grain" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="projects-heading">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55 }}
              className="section-kicker mb-4"
            >
              Selected work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="projects-title"
            >
              Built for the<br /><span>real world.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="projects-intro"
          >
            From clinical tools to products used across campus. Explore the work and the thinking behind it.
          </motion.p>
        </div>

        <div className="project-accordion">
          {visibleProjects.map((project, index) => {
            const Icon = project.icon
            const active = activeProject === index
            return (
              <motion.article
                key={project.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className={`project-accordion__card${active ? ' is-active' : ''}`}
                style={{ '--project-accent': project.accent }}
              >
                <button
                  type="button"
                  className="project-accordion__trigger"
                  data-cursor-label="EXPLORE"
                  onMouseEnter={() => setActiveProject(index)}
                  onFocus={() => setActiveProject(index)}
                  onClick={() => setActiveProject(index)}
                  aria-expanded={active}
                  aria-controls={`project-detail-${project.id}`}
                >
                  <span className="project-accordion__collapsed" aria-hidden={active}>
                    <Icon size={22} strokeWidth={1.5} />
                    <span>{project.name}</span>
                  </span>

                  <span className="project-accordion__expanded" aria-hidden={!active}>
                    <span className="project-accordion__topline">
                      <span className="project-accordion__icon"><Icon size={21} strokeWidth={1.6} /></span>
                      <span className="project-accordion__award">{project.award}</span>
                      <ArrowUpRight className="project-accordion__arrow" size={20} strokeWidth={1.6} />
                    </span>
                    <span className="project-accordion__copy" id={`project-detail-${project.id}`}>
                      <span className="project-accordion__subtitle">{project.subtitle}</span>
                      <span className="project-accordion__name">{project.name}</span>
                      <span className="project-accordion__description">{project.description}</span>
                      <span className="project-accordion__tags">
                        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </span>
                    </span>
                  </span>
                </button>
              </motion.article>
            )
          })}
        </div>

        <p className="project-accordion-hint">Other engineering, AI & platform builds · Choose an entry to read the build notes</p>

        <div className="live-sites" aria-label="Live websites">
          <div className="live-sites__heading">
            <p className="live-sites__label">Recent website work</p>
            <p className="live-sites__note">Real products and events, out in the world.</p>
          </div>
          <div className="site-preview-grid">
            {sitePreviews.map((site, index) => (
              <motion.a
                href={site.url} key={site.name} target="_blank" rel="noreferrer"
                data-cursor-label="VIEW"
                className={`site-preview${index === 2 ? ' site-preview--wide' : ''}`}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.12 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="site-preview__image-wrap">
                  <img src={site.image} alt={site.alt} loading="lazy" />
                  <span className="site-preview__open" aria-hidden="true"><ArrowUpRight size={19} /></span>
                </span>
                <span className="site-preview__caption">
                  <span><span className="site-preview__label">{site.label}</span><span className="site-preview__name">{site.name}</span><span className="site-preview__summary">{site.summary}</span></span>
                  <span className="site-preview__index">0{index + 1} / 03</span>
                </span>
              </motion.a>
            ))}
          </div>
          <div className="more-sites" aria-label="More live sites">
            <span className="more-sites__label">More work</span>
            {moreSites.map((site) => (
              <a href={site.url} key={site.name} target="_blank" rel="noreferrer" className="more-site">
                <span><strong>{site.name}</strong><small>{site.note}</small></span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
