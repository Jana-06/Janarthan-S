import { useState } from 'react'
import { ArrowDownToLine, Bot, LoaderCircle, Send } from 'lucide-react'

const endpoint = import.meta.env.VITE_JULIE_PRIVATE_ENDPOINT

export default function PortfolioCopilot({ accessToken, onDraft }) {
  const [request, setRequest] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const createDraft = async (event) => {
    event.preventDefault()
    const prompt = request.trim()
    if (!prompt || busy || !endpoint) return
    setBusy(true)
    setStatus('')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 120000)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ request: prompt }),
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Julie could not prepare a draft.')
      if (!data.draft || !['project', 'achievement'].includes(data.draft.kind)) throw new Error('Julie returned an invalid draft. Please try again.')
      onDraft(data.draft)
      setRequest('')
      setStatus('Draft loaded into the form below. Review it before saving.')
    } catch (error) {
      setStatus(error.name === 'AbortError' ? 'Julie took too long to answer. Please retry.' : error.message || 'Julie is offline. Check the private connection.')
    } finally {
      window.clearTimeout(timeout)
      setBusy(false)
    }
  }

  return (
    <section className="admin-section portfolio-copilot" aria-labelledby="portfolio-copilot-title">
      <div className="portfolio-copilot__intro">
        <span className="portfolio-copilot__mark"><Bot size={19} aria-hidden="true" /></span>
        <div><p className="private-page__eyebrow">Private · local Julie</p><h2 id="portfolio-copilot-title">Shape your next update.</h2></div>
      </div>
      <p>Ask Julie to turn your notes into a project or achievement draft. She can’t publish or save it; you review and save it yourself.</p>
      <form className="portfolio-copilot__form" onSubmit={createDraft}>
        <label className="sr-only" htmlFor="portfolio-copilot-request">Describe the portfolio update</label>
        <textarea id="portfolio-copilot-request" maxLength={3000} onChange={(event) => setRequest(event.target.value)} placeholder="Example: Turn this award and what I built into a concise achievement…" rows={3} value={request} />
        <div className="portfolio-copilot__actions"><span aria-live="polite" role="status">{status || (endpoint ? 'Only sent to Julie on your private connection.' : 'Set VITE_JULIE_PRIVATE_ENDPOINT to enable Julie.')}</span><button disabled={!endpoint || busy || !request.trim()} type="submit">{busy ? <LoaderCircle className="portfolio-copilot__spin" size={15} aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}{busy ? 'Working' : 'Make a draft'}</button></div>
      </form>
      <span className="portfolio-copilot__footnote"><ArrowDownToLine size={13} aria-hidden="true" /> Julie fills the form below. Nothing is saved until you choose Save to portfolio.</span>
    </section>
  )
}
