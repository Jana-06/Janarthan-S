import { ArrowLeft } from 'lucide-react'
import FeedbackForm from './FeedbackForm'

export default function FeedbackPage() {
  return (
    <main className="private-page feedback-page">
      <a className="private-page__back" href="/"> <ArrowLeft aria-hidden="true" size={16} /> Back to portfolio</a>
      <div className="feedback-page__heading">
        <p className="private-page__eyebrow">Feedback</p>
        <h1>A little feedback goes a long way.</h1>
        <p>Leave a review, a suggestion, or a note about your experience.</p>
      </div>
      <FeedbackForm standalone />
    </main>
  )
}
