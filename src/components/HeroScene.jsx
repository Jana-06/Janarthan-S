import { useEffect, useRef } from 'react'

export default function HeroScene() {
  const sceneRef = useRef(null)

  useEffect(() => {
    let context
    let cancelled = false

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollTriggerModule]) => {
      if (cancelled || !sceneRef.current) return
      const gsap = gsapModule.gsap
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger)
      const hero = sceneRef.current.closest('#hero')
      if (!hero) return
      context = gsap.context(() => {
        const artMotion = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
        artMotion
          .fromTo(sceneRef.current, { scale: 0.84, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'none' })
          .to(sceneRef.current, { scale: 0.9, opacity: 0.16, duration: 0.7, ease: 'none' })
      }, sceneRef)
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [])

  return (
    <div ref={sceneRef} className="hero-scene" role="img" aria-label="A luminous coral 3D core surrounded by orbiting rings">
      <div className="hero-art-aura" />
      <div className="hero-art">
        <div className="hero-art-ring hero-art-ring--one"><span /></div>
        <div className="hero-art-ring hero-art-ring--two"><span /></div>
        <div className="hero-art-ring hero-art-ring--three"><span /></div>
        <div className="hero-art-core-wrap">
          <div className="hero-art-core">
            <span className="hero-art-meridian hero-art-meridian--one" />
            <span className="hero-art-meridian hero-art-meridian--two" />
            <span className="hero-art-latitude" />
            <span className="hero-art-glint" />
          </div>
        </div>
        <div className="hero-art-satellite hero-art-satellite--blue" />
        <div className="hero-art-satellite hero-art-satellite--violet" />
        <div className="hero-art-satellite hero-art-satellite--white" />
      </div>
    </div>
  )
}
