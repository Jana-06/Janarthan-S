import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, ArrowUpRight } from 'lucide-react'
import FeedbackForm from './FeedbackForm'

// GitHub icon SVG component
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

// LinkedIn icon SVG component
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: '10cjanarthansrvspm@gmail.com',
    href: 'mailto:10cjanarthansrvspm@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 8072601898',
    href: 'tel:+918072601898',
  },
  {
    icon: GithubIcon,
    label: 'GitHub',
    value: 'github.com/Jana-06',
    href: 'https://github.com/Jana-06',
  },
  {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    value: 'linkedin.com/in/janarthan-s-8476b81b5',
    href: 'https://linkedin.com/in/janarthan-s-8476b81b5',
  },
]

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Contact({ lenisRef }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el && lenisRef?.current) {
      lenisRef.current.scrollTo(el, { offset: -76, duration: 1.25 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-black py-32 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Headline */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-3"
        >
          Contact
        </motion.p>
        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[clamp(3rem,8vw,7rem)] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6"
        >
          Let's build
          <br />
          <span className="text-[#91a8c7]">
            something.
          </span>
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-lg text-white/50 max-w-xl mb-16 font-light leading-relaxed"
        >
          Open to full-time roles, freelance projects, and research collaborations.
          Let's talk.
        </motion.p>

        {/* Contact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-24">
          {contacts.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                custom={i + 3}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-slate-300/15 transition-colors duration-300">
                  <Icon className="w-4 h-4 text-white/60 group-hover:text-slate-200 transition-colors duration-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-0.5">
                    {c.label}
                  </p>
                  <p className="text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors duration-200">
                    {c.value}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/20 ml-auto shrink-0 group-hover:text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </motion.a>
            )
          })}
        </div>

        <motion.div custom={7} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <FeedbackForm />
          <p className="feedback-panel__more"><a href="/feedback">Open the dedicated feedback page <ArrowUpRight aria-hidden="true" size={15} /></a></p>
        </motion.div>

        {/* Footer divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Footer row */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="site-nav__monogram w-7 h-7 rounded-lg flex items-center justify-center text-xs">
              JS
            </div>
            <span className="text-white/40 text-sm font-medium">Janarthan S</span>
          </div>

          {/* Footer nav */}
          <nav className="flex flex-wrap items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white/30 hover:text-white/60 text-xs font-medium transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-white/20 text-xs font-medium">
            © {new Date().getFullYear()} Janarthan S. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  )
}
