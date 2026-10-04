import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Moments from './components/Moments'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import ScrollProgress from './components/ScrollProgress'
import PageIntro from './components/PageIntro'
import CursorFollower from './components/CursorFollower'
import { useLenis } from './hooks/useLenis'

export default function App() {
  const lenisRef = useLenis()

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <PageIntro />
        <CursorFollower />
        <ScrollProgress />
        <Navbar lenisRef={lenisRef} />
        <main className="w-full max-w-full">
          <Hero lenisRef={lenisRef} />
          <About />
          <Experience />
          <Moments />
          <Projects />
          <Skills />
          <Education />
          <Reviews />
          <Contact lenisRef={lenisRef} />
        </main>
      </div>
    </MotionConfig>
  )
}
