import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ImagePlus, LogOut, Upload } from 'lucide-react'
import { assetBucket, ownerEmail, supabase, supabaseConfigured } from '../lib/supabase'

const emptyForm = { kind: 'achievement', title: '', description: '' }

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
}

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [email, setEmail] = useState(ownerEmail)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [feedback, setFeedback] = useState([])
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!supabaseConfigured) {
      setCheckingSession(false)
      return undefined
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCheckingSession(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setCheckingSession(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const isOwner = session?.user?.email?.toLowerCase() === ownerEmail.toLowerCase()

  const loadDashboard = useCallback(async () => {
    if (!isOwner) return
    setLoadError('')
    const [feedbackResult, itemsResult] = await Promise.all([
      supabase.from('feedback').select('id, name, email, message, is_public, created_at').order('created_at', { ascending: false }),
      supabase.from('portfolio_items').select('id, kind, title, description, image_path, file_path, created_at').order('created_at', { ascending: false }),
    ])
    if (feedbackResult.error || itemsResult.error) {
      setLoadError('Could not load dashboard data. Check that the Supabase setup SQL has been applied.')
      return
    }
    setFeedback(feedbackResult.data ?? [])
    setItems(itemsResult.data ?? [])
  }, [isOwner])

  useEffect(() => { loadDashboard() }, [loadDashboard])

  const handleSignIn = async (event) => {
    event.preventDefault()
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setAuthError('Sign in failed. Check the account and password, then try again.')
  }

  const handleReviewVisibility = async (entry) => {
    const { error } = await supabase.from('feedback').update({ is_public: !entry.is_public }).eq('id', entry.id)
    if (error) {
      setLoadError('Could not update review visibility. Check that the latest Supabase setup SQL has been applied.')
      return
    }
    setFeedback((current) => current.map((item) => item.id === entry.id ? { ...item, is_public: !entry.is_public } : item))
  }

  const uploadAsset = async (file, folder) => {
    if (!file) return null
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120)
    const path = `${folder}/${crypto.randomUUID()}-${safeName}`
    const { error } = await supabase.storage.from(assetBucket).upload(path, file, {
      cacheControl: '3600',
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })
    if (error) throw error
    return path
  }

  const handleCreateItem = async (event) => {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    const formElement = event.currentTarget
    const data = new FormData(formElement)
    const image = data.get('image')
    const file = data.get('file')
    const uploaded = []
    try {
      if (image?.size > 10 * 1024 * 1024) throw new Error('Choose an image under 10 MB.')
      if (file?.size > 25 * 1024 * 1024) throw new Error('Choose a file under 25 MB.')
      if (image?.size && !image.type.startsWith('image/')) throw new Error('Choose a supported image file.')
      const imagePath = image?.size ? await uploadAsset(image, 'images') : null
      if (imagePath) uploaded.push(imagePath)
      const filePath = file?.size ? await uploadAsset(file, 'files') : null
      if (filePath) uploaded.push(filePath)
      const { error } = await supabase.from('portfolio_items').insert({
        kind: form.kind,
        title: form.title.trim(),
        description: form.description.trim(),
        image_path: imagePath,
        file_path: filePath,
      })
      if (error) throw error
      setForm(emptyForm)
      formElement.reset()
      setStatus('Saved to your Supabase project.')
      await loadDashboard()
    } catch (error) {
      if (uploaded.length) await supabase.storage.from(assetBucket).remove(uploaded)
      setStatus(error.message || 'Could not save this item. Try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!supabaseConfigured) {
    return <SetupNotice />
  }

  if (checkingSession) {
    return <main className="private-page admin-page"><p className="admin-state">Checking secure session…</p></main>
  }

  if (!isOwner) {
    return (
      <main className="private-page admin-page admin-page--login">
        <a className="private-page__back" href="/"><ArrowLeft aria-hidden="true" size={16} /> Back to portfolio</a>
        <section className="admin-login">
          <p className="private-page__eyebrow">Private workspace</p>
          <h1>Owner sign in</h1>
          <p>Sign in with the owner account to view feedback and manage portfolio entries.</p>
          {session && <p className="admin-error">This account does not have access to the owner dashboard.</p>}
          <form className="admin-form" onSubmit={handleSignIn}>
            <label htmlFor="admin-email">Email address</label>
            <input autoComplete="username" id="admin-email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            <label htmlFor="admin-password">Password</label>
            <input autoComplete="current-password" id="admin-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            <button disabled={busy} type="submit">Sign in <ArrowUpRight aria-hidden="true" size={16} /></button>
            {authError && <p className="admin-error" role="alert">{authError}</p>}
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="private-page admin-page">
      <header className="admin-topbar">
        <a className="private-page__back" href="/"><ArrowLeft aria-hidden="true" size={16} /> Portfolio</a>
        <button className="admin-signout" onClick={() => supabase.auth.signOut()} type="button"><LogOut aria-hidden="true" size={16} /> Sign out</button>
      </header>
      <div className="admin-heading">
        <p className="private-page__eyebrow">Owner dashboard</p>
        <h1>Your portfolio, in one place.</h1>
        <p>Private client feedback and a place to save new work and achievements.</p>
      </div>

      {loadError && <p className="admin-error" role="alert">{loadError}</p>}

      <section className="admin-section" aria-labelledby="feedback-inbox-title">
        <div className="admin-section__heading">
          <div><p className="private-page__eyebrow">Client notes</p><h2 id="feedback-inbox-title">Feedback inbox</h2></div>
          <span className="admin-count">{feedback.length} {feedback.length === 1 ? 'message' : 'messages'}</span>
        </div>
        {feedback.length === 0 ? <p className="admin-empty">Feedback from the public site will appear here.</p> : (
          <div className="feedback-inbox">
            {feedback.map((entry) => (
              <article className="feedback-entry" key={entry.id}>
                <div className="feedback-entry__meta"><h3>{entry.name}</h3><a href={`mailto:${entry.email}`}>{entry.email}</a><time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time></div>
                <p>{entry.message}</p>
                <button className={`feedback-entry__publish${entry.is_public ? ' is-published' : ''}`} onClick={() => handleReviewVisibility(entry)} type="button">
                  {entry.is_public ? 'Published on portfolio' : 'Publish as a review'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section" aria-labelledby="portfolio-add-title">
        <div className="admin-section__heading">
          <div><p className="private-page__eyebrow">Keep it current</p><h2 id="portfolio-add-title">Add an achievement or project</h2></div>
        </div>
        <form className="admin-form admin-form--item" onSubmit={handleCreateItem}>
          <div className="admin-item-fields">
            <label htmlFor="item-kind">Type</label>
            <select id="item-kind" onChange={(event) => setForm({ ...form, kind: event.target.value })} value={form.kind}>
              <option value="achievement">Achievement</option><option value="project">Project</option>
            </select>
            <label htmlFor="item-title">Title</label>
            <input id="item-title" maxLength={180} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="A title people can scan" required value={form.title} />
            <label htmlFor="item-description">Details</label>
            <textarea id="item-description" maxLength={5000} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Add a description or context" required rows={4} value={form.description} />
          </div>
          <div className="admin-upload-fields">
            <label className="admin-file-field" htmlFor="item-image"><ImagePlus aria-hidden="true" /><span><strong>Add an image</strong><small>Optional · PNG, JPEG, WebP, or GIF · up to 10 MB</small></span><input accept="image/png,image/jpeg,image/webp,image/gif" id="item-image" name="image" type="file" /></label>
            <label className="admin-file-field" htmlFor="item-file"><Upload aria-hidden="true" /><span><strong>Attach a file</strong><small>Optional · up to 25 MB</small></span><input id="item-file" name="file" type="file" /></label>
          </div>
          <div className="admin-form__actions"><p aria-live="polite" role="status">{status}</p><button disabled={busy} type="submit">{busy ? 'Saving…' : 'Save to portfolio'} <ArrowUpRight aria-hidden="true" size={16} /></button></div>
        </form>
      </section>

      <section className="admin-section" aria-labelledby="saved-items-title">
        <div className="admin-section__heading"><div><p className="private-page__eyebrow">Stored in Supabase</p><h2 id="saved-items-title">Saved entries</h2></div><span className="admin-count">{items.length} total</span></div>
        {items.length === 0 ? <p className="admin-empty">Your achievements and projects will appear here after you save them.</p> : (
          <div className="admin-item-list">
            {items.map((item) => {
              const imageUrl = item.image_path ? supabase.storage.from(assetBucket).getPublicUrl(item.image_path).data.publicUrl : null
              const fileUrl = item.file_path ? supabase.storage.from(assetBucket).getPublicUrl(item.file_path).data.publicUrl : null
              return <article className="admin-item" key={item.id}>
                {imageUrl && <img alt="" src={imageUrl} />}
                <div><span className="admin-item__kind">{item.kind}</span><h3>{item.title}</h3><p>{item.description}</p><time dateTime={item.created_at}>{formatDate(item.created_at)}</time>{fileUrl && <a className="admin-item__file" href={fileUrl} rel="noreferrer" target="_blank">Open attached file <ArrowUpRight aria-hidden="true" size={14} /></a>}</div>
              </article>
            })}
          </div>
        )}
      </section>
    </main>
  )
}

function SetupNotice() {
  return (
    <main className="private-page admin-page">
      <a className="private-page__back" href="/"><ArrowLeft aria-hidden="true" size={16} /> Back to portfolio</a>
      <section className="admin-login"><p className="private-page__eyebrow">Setup needed</p><h1>Connect Supabase</h1><p>Add the project publishable key as <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> or <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in your local <code>.env.local</code> file, then apply <code>supabase/schema.sql</code> in the Supabase SQL editor.</p></section>
    </main>
  )
}
