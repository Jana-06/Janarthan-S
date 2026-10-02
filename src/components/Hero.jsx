import { motion } from 'framer-motion'
import { Download, ExternalLink } from 'lucide-react'
import CursorSpotlight from './CursorSpotlight'

export default function Hero({ lenisRef }) {
  const handleScroll = (href) => {
    const el = document.querySelector(href)
    if (el && lenisRef?.current) {
      lenisRef.current.scrollTo(el, { offset: -76, duration: 1.25 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="hero"
      className="hero-stage relative min-h-[100svh] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* A warm stage for the portfolio's 3D artwork */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-stage__light absolute top-1/4 right-[12%] w-[34rem] h-[34rem] rounded-full blur-[140px]" />
      </div>
      <CursorSpotlight colorFrom="rgba(255, 95, 46, 0.12)" colorTo="rgba(255, 95, 46, 0.035)" size={620} />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="hero-layout relative z-10 max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-14 lg:gap-20 pt-24">
        <div className="hero-copy">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="hero-eyebrow"
        >
          Product engineer <span aria-hidden="true">/</span> Chennai, India
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="hero-statement"
        >
          Useful software.<br /><span>Thoughtful details.</span>
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hero-description"
        >
          I’m Janarthan — an engineer working across product, AI, and full-stack development. I build for people, from clinical teams to a campus of 15,000+ students.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center gap-4"
        >
          <button
            id="hero-view-work-btn"
            onClick={() => handleScroll('#projects')}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black text-sm font-semibold tracking-wide hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            View Work
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <a
            id="hero-resume-btn"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white text-sm font-semibold tracking-wide hover:bg-white/5 hover:border-white/50 active:scale-95 transition-all duration-200"
          >
            <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            Get my resume
          </a>
        </motion.div>
        <p className="hero-location">Available for product-focused roles <span>·</span> Open to collaboration</p>
        </div>
      </div>

      <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.025, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          className="hero-portrait-wrap relative lg:justify-self-end w-full"
          aria-label="Portrait of Janarthan S."
        >
          <div className="hero-portrait-orbit" aria-hidden="true"><span /></div>
          <figure className="hero-portrait">
            <img
              src="/images/portrait.webp"
              alt="Janarthan in a charcoal suit, standing outdoors"
              fetchPriority="high"
              width="1065"
              height="1500"
            />
            <figcaption className="hero-portrait__caption">
              <span>Product engineer</span>
              <span>Chennai · India</span>
            </figcaption>
          </figure>
          <div className="hero-portrait-stamp" aria-hidden="true">
            <span>JS</span>
            <small>Building<br />with intent</small>
          </div>
        </motion.aside>

      <motion.h1
        className="hero-wordmark"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: 'inset(0% 0 0 0)' }}
        transition={{ duration: 1.05, delay: 0.42, ease: [0.76, 0, 0.24, 1] }}
      >
        JANARTHAN <span>S.</span>
      </motion.h1>
    </section>
  )
}
