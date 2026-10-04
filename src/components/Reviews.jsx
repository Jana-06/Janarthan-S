import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Quote } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase, supabaseConfigured } from '../lib/supabase'

gsap.registerPlugin(ScrollTrigger)

export default function Reviews() {
  const sectionRef = useRef(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    if (!supabaseConfigured) return undefined
    let active = true
    supabase.from('published_feedback').select('id, name, message, created_at')
      .order('created_at', { ascending: false }).limit(6)
      .then(({ data, error }) => {
        if (active && !error) setReviews(data ?? [])
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !reviews.length) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo('.review-card', { y: 32, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 78%', once: true },
      })
    }, section)
    return () => ctx.revert()
  }, [reviews])

  return (
    <section className="reviews-section" id="reviews" ref={sectionRef} aria-labelledby="reviews-title">
      <div className="reviews-shell">
        <div className="reviews-heading">
          <div>
            <p className="reviews-kicker">Kind words</p>
            <h2 id="reviews-title">Good work leaves<br /><span>a good feeling.</span></h2>
          </div>
          <p className="reviews-intro">A few notes from people I’ve had the pleasure of working with.</p>
        </div>

        {reviews.length ? (
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <article className={`review-card${index === 0 ? ' review-card--featured' : ''}`} key={review.id}>
                <div className="review-card__topline">
                  <span className="review-card__quote"><Quote size={19} aria-hidden="true" /></span>
                  <span className="review-card__source">SHARED WITH PERMISSION</span>
                </div>
                <blockquote>{review.message}</blockquote>
                <div className="review-card__byline">
                  <span className="review-card__avatar" aria-hidden="true">{review.name.trim().charAt(0).toUpperCase()}</span>
                  <div><strong>{review.name}</strong><span>Shared feedback</span></div>
                  <span className="review-card__index">0{index + 1}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="reviews-empty">
            <span className="reviews-empty__mark"><Quote size={22} aria-hidden="true" /></span>
            <p>Good things are better shared.</p>
            <span>Reviews will appear here soon.</span>
          </div>
        )}

        <a className="reviews-link" href="/feedback">Share your experience <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  )
}
