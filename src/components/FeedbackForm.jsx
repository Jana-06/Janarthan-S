import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { supabase, supabaseConfigured } from '../lib/supabase'

export default function FeedbackForm({ standalone = false }) {
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus('')
    const form = event.currentTarget
    const data = new FormData(form)

    if (!supabaseConfigured) {
      setStatus('Feedback is temporarily unavailable. Please try again later.')
      setSubmitting(false)
      return
    }

    const { error } = await supabase.from('feedback').insert({
      name: data.get('name').toString().trim(),
      email: data.get('email').toString().trim(),
      message: data.get('feedback').toString().trim(),
    })

    if (error) {
      console.error('Supabase feedback insert failed:', error)
      if (error.code === '42501') {
        setStatus('Supabase blocked this submission. Check the feedback insert policy in schema.sql.')
      } else if (error.code?.startsWith('PGRST')) {
        setStatus('Supabase could not find the feedback table. Run schema.sql in the project SQL Editor.')
      } else {
        setStatus('We could not save your feedback. Check the browser console for the Supabase error.')
      }
      setSubmitting(false)
      return
    }

    form.reset()
    setStatus('Thank you. Your feedback has been received.')
    setSubmitting(false)
  }

  return (
    <section className={`feedback-panel${standalone ? ' feedback-panel--standalone' : ''}`}>
      <div className="feedback-panel__intro">
        <p className="feedback-panel__eyebrow">A note from you</p>
        <h2>Help me make the next version better.</h2>
          <p>Your review and name will appear on the portfolio. Your email stays private.</p>
      </div>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="feedback-form__details">
          <label htmlFor={standalone ? 'feedback-name-page' : 'feedback-name'}>
            Your name
            <input autoComplete="name" id={standalone ? 'feedback-name-page' : 'feedback-name'} maxLength={120} name="name" placeholder="Name" required />
          </label>
          <label htmlFor={standalone ? 'feedback-email-page' : 'feedback-email'}>
            Email address
            <input autoComplete="email" id={standalone ? 'feedback-email-page' : 'feedback-email'} maxLength={254} name="email" placeholder="you@example.com" required type="email" />
          </label>
        </div>
        <label htmlFor={standalone ? 'feedback-message-page' : 'feedback-message'}>
          Feedback or review
          <textarea
            aria-describedby={standalone ? 'feedback-note-page' : 'feedback-note'}
            id={standalone ? 'feedback-message-page' : 'feedback-message'}
            maxLength={3000}
            name="feedback"
            placeholder="Share a thought about working together or exploring my work."
            required
            rows={5}
          />
        </label>
        <div className="feedback-form__actions">
          <p id={standalone ? 'feedback-note-page' : 'feedback-note'}>By sending this, you agree that your name and feedback will appear publicly as a portfolio review. Your email stays private.</p>
          <button disabled={submitting || !supabaseConfigured} type="submit">
            {submitting ? 'Sending…' : 'Send feedback'} <ArrowUpRight aria-hidden="true" />
          </button>
        </div>
        <p className="feedback-form__status" aria-live="polite" role="status">
          {status || (!supabaseConfigured ? 'Feedback is not connected yet.' : '')}
        </p>
      </form>
    </section>
  )
}
