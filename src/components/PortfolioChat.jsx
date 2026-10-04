import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Bot, LoaderCircle, MessageCircle, Send, X } from 'lucide-react'

const endpoint = import.meta.env.VITE_JULIE_PUBLIC_ENDPOINT
const greeting = {
  role: 'assistant',
  content: 'Hi, I’m Julie. Ask me about Janarthan’s projects, experience, or skills.',
}

export default function PortfolioChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([greeting])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  const sendMessage = async (event) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message || busy || !endpoint) return

    const history = messages
      .filter((entry) => entry !== greeting)
      .slice(-8)
      .map(({ role, content }) => ({ role, content }))
    setDraft('')
    setBusy(true)
    setMessages((current) => [...current, { role: 'user', content: message }])

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 45000)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        signal: controller.signal,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Julie is unavailable right now.')
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }])
    } catch (error) {
      const content = error.name === 'AbortError'
        ? 'That took too long. Please try again in a moment.'
        : error.message || 'Julie could not connect. Please try again later.'
      setMessages((current) => [...current, { role: 'assistant', content }])
    } finally {
      window.clearTimeout(timeout)
      setBusy(false)
    }
  }

  return (
    <div className="portfolio-chat">
      {open && (
        <section className="portfolio-chat__panel" aria-label="Chat with Julie">
          <header className="portfolio-chat__header">
            <span className="portfolio-chat__avatar"><Bot size={19} aria-hidden="true" /></span>
            <div><strong>Julie</strong><span>Portfolio assistant</span></div>
            <button className="portfolio-chat__close" type="button" aria-label="Close chat" onClick={() => setOpen(false)}>
              <X size={18} aria-hidden="true" />
            </button>
          </header>
          <div className="portfolio-chat__messages" ref={listRef} aria-live="polite" aria-relevant="additions">
            {messages.map((entry, index) => (
              <p className={`portfolio-chat__message portfolio-chat__message--${entry.role}`} key={`${entry.role}-${index}`}>
                {entry.content}
              </p>
            ))}
            {busy && <p className="portfolio-chat__thinking"><LoaderCircle size={14} aria-hidden="true" /> Julie is thinking</p>}
          </div>
          <form className="portfolio-chat__form" onSubmit={sendMessage}>
            <label className="sr-only" htmlFor="portfolio-chat-input">Ask Julie about the portfolio</label>
            <input
              autoComplete="off"
              id="portfolio-chat-input"
              maxLength={600}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={endpoint ? 'Ask about a project…' : 'Julie is offline for now'}
              value={draft}
              disabled={!endpoint || busy}
            />
            <button type="submit" aria-label="Send message" disabled={!endpoint || busy || !draft.trim()}>
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
          <p className="portfolio-chat__privacy">Answers use public portfolio details. Chats aren’t saved.</p>
        </section>
      )}
      <button
        className={`portfolio-chat__launcher${open ? ' is-open' : ''}`}
        type="button"
        aria-expanded={open}
        aria-label={open ? 'Close Julie chat' : 'Chat with Julie'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={21} aria-hidden="true" /> : <><MessageCircle size={19} aria-hidden="true" /><span>Ask Julie</span><ArrowUpRight size={15} aria-hidden="true" /></>}
      </button>
    </div>
  )
}
