import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
  { label: 'Feedback', href: '/feedback' },
]

export default function Navbar({ lenisRef }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks
      .filter((link) => link.href.startsWith('#'))
      .map((link) => document.querySelector(link.href))
      .filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(`#${visible.target.id}`)
      },
      { rootMargin: '-24% 0px -60% 0px', threshold: [0, 0.15, 0.35, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e, href) => {
    if (href.startsWith('/')) {
      setMenuOpen(false)
      return
    }
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target && lenisRef?.current) {
      lenisRef.current.scrollTo(target, { offset: -76, duration: 1.25 })
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="site-nav fixed top-0 left-0 right-0 z-50"
    >
      <div className={`site-nav__inner max-w-6xl mx-auto px-5 md:px-7 flex items-center justify-between ${scrolled ? 'is-scrolled' : ''}`}>
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        >
          <div className="site-nav__monogram w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm tracking-tighter group-hover:scale-105 transition-transform duration-200">
            JS
          </div>
          <span className="text-white font-semibold text-sm tracking-tight hidden sm:block opacity-70 group-hover:opacity-100 transition-opacity">
            Janarthan S
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              aria-current={activeSection === link.href ? 'location' : undefined}
              className={`site-nav__link text-[13px] font-medium tracking-wide transition-colors duration-200 outline-none focus-visible:text-white ${activeSection === link.href ? 'is-active' : ''}`}
            >
              {link.label}
            </a>
          ))}

          {/* Resume — pill button: only show hover state, never stuck bg */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'text-[13px] font-semibold px-4 py-1.5 rounded-full',
              'border border-white/30 text-white/80',
              'hover:bg-white hover:text-black hover:border-transparent',
              'active:scale-95',
              'transition-all duration-200',
              'outline-none focus-visible:ring-2 focus-visible:ring-white/50',
              /* Explicitly kill browser default :visited / :focus backgrounds */
              '[&:visited]:bg-transparent [&:visited]:text-white/80',
            ].join(' ')}
          >
            Resume ↗
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          className="md:hidden flex flex-col gap-[5px] p-2 outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-[22px] h-[1.5px] bg-white/80 transition-all duration-300 origin-center ${
              menuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-[22px] h-[1.5px] bg-white/80 transition-all duration-300 ${
              menuOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block w-[22px] h-[1.5px] bg-white/80 transition-all duration-300 origin-center ${
              menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="site-nav__menu md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/[0.08] overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={activeSection === link.href ? 'location' : undefined}
                  className="text-white/70 hover:text-white text-base font-medium py-1 transition-colors outline-none"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm font-semibold px-5 py-2.5 rounded-full border border-white/30 text-white/80 hover:bg-white hover:text-black hover:border-transparent transition-all duration-200 w-fit outline-none"
              >
                Resume ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
