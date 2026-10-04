import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ImagePlus, LogOut, Pencil, Trash2, Upload } from 'lucide-react'
import { assetBucket, ownerEmail, supabase, supabaseConfigured } from '../lib/supabase'
import PortfolioCopilot from './PortfolioCopilot'

const emptyForm = { kind: 'achievement', title: '', description: '' }

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
}

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(supabaseConfigured)
  const [email, setEmail] = useState(ownerEmail)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [feedback, setFeedback] = useState([])
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingItem, setEditingItem] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionItemId, setActionItemId] = useState('')
  const [status, setStatus] = useState('')
  const [itemActionStatus, setItemActionStatus] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!supabaseConfigured) return undefined
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
    const [feedbackResult, itemsResult] = await Promise.all([
      supabase.from('feedback').select('id, name, email, message, created_at').order('created_at', { ascending: false }),
      supabase.from('portfolio_items').select('id, kind, title, description, image_path, file_path, created_at').order('created_at', { ascending: false }),
    ])
    if (feedbackResult.error || itemsResult.error) {
      setLoadError('Could not load dashboard data. Check that the Supabase setup SQL has been applied.')
      return
    }
    setLoadError('')
    setFeedback(feedbackResult.data ?? [])
    setItems(itemsResult.data ?? [])
  }, [isOwner])

  useEffect(() => {
    void Promise.resolve().then(loadDashboard)
  }, [loadDashboard])

  const handleSignIn = async (event) => {
    event.preventDefault()
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setAuthError('Sign in failed. Check the account and password, then try again.')
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

  const beginEditing = (item) => {
    setEditingItem(item)
    setForm({ kind: item.kind, title: item.title, description: item.description })
    setStatus('')
    document.getElementById('portfolio-add-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setForm(emptyForm)
    setStatus('')
    document.getElementById('portfolio-add-form')?.reset()
  }

  const handleSaveItem = async (event) => {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    const formElement = event.currentTarget
    const data = new FormData(formElement)
    const image = data.get('image')
    const file = data.get('file')
    const uploaded = []
    const wasEditing = Boolean(editingItem)
    let committed = false
    try {
      if (image?.size > 10 * 1024 * 1024) throw new Error('Choose an image under 10 MB.')
      if (file?.size > 25 * 1024 * 1024) throw new Error('Choose a file under 25 MB.')
      if (image?.size && !['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(image.type.toLowerCase())) throw new Error('Choose a PNG, JPEG, WebP, or GIF image.')
      const removeImage = data.get('remove-image') === 'on'
      const removeFile = data.get('remove-file') === 'on'
      const imagePath = image?.size ? await uploadAsset(image, 'images') : editingItem?.image_path && !removeImage ? editingItem.image_path : null
      if (image?.size) uploaded.push(imagePath)
      const filePath = file?.size ? await uploadAsset(file, 'files') : editingItem?.file_path && !removeFile ? editingItem.file_path : null
      if (file?.size) uploaded.push(filePath)
      const values = {
        kind: form.kind,
        title: form.title.trim(),
        description: form.description.trim(),
        image_path: imagePath,
        file_path: filePath,
      }
      const result = editingItem
        ? await supabase.from('portfolio_items').update(values).eq('id', editingItem.id).select('id').single()
        : await supabase.from('portfolio_items').insert(values).select('id').single()
      const { error } = result
      if (error) throw error
      committed = true
      const replacedAssets = editingItem
        ? [
            imagePath !== editingItem.image_path ? editingItem.image_path : null,
            filePath !== editingItem.file_path ? editingItem.file_path : null,
          ].filter(Boolean)
        : []
      let cleanupFailed = false
      if (replacedAssets.length) {
        try {
          const { error: cleanupError } = await supabase.storage.from(assetBucket).remove(replacedAssets)
          cleanupFailed = Boolean(cleanupError)
          if (cleanupError) console.error('Old portfolio asset cleanup failed:', cleanupError)
        } catch (cleanupError) {
          cleanupFailed = true
          console.error('Old portfolio asset cleanup failed:', cleanupError)
        }
      }
      setForm(emptyForm)
      setEditingItem(null)
      formElement.reset()
      setStatus(wasEditing
        ? (cleanupFailed ? 'Changes saved. An old attachment could not be removed; check your storage bucket.' : 'Your changes have been saved.')
        : 'Saved to your Supabase project.')
      try {
        await loadDashboard()
      } catch (refreshError) {
        console.error('Saved portfolio entry could not be reloaded:', refreshError)
        setLoadError('Your change was saved, but the list could not refresh. Reload the dashboard.')
      }
    } catch (error) {
      if (!committed && uploaded.length) {
        try {
          const { error: cleanupError } = await supabase.storage.from(assetBucket).remove(uploaded)
          if (cleanupError) console.error('Failed upload cleanup failed:', cleanupError)
        } catch (cleanupError) {
          console.error('Failed upload cleanup failed:', cleanupError)
        }
      }
      setStatus(committed
        ? 'Your change was saved, but a follow-up step failed. Reload the dashboard before trying again.'
        : error.message || 'Could not save this item. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.title}" from the portfolio? This cannot be undone.`)) return
    setActionItemId(item.id)
    setBusy(true)
    setItemActionStatus('')
    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', item.id).select('id').single()
      if (error) throw error
      const assetPaths = [item.image_path, item.file_path].filter(Boolean)
      let cleanupFailed = false
      if (assetPaths.length) {
        try {
          const { error: cleanupError } = await supabase.storage.from(assetBucket).remove(assetPaths)
          cleanupFailed = Boolean(cleanupError)
          if (cleanupError) console.error('Deleted entry asset cleanup failed:', cleanupError)
        } catch (cleanupError) {
          cleanupFailed = true
          console.error('Deleted entry asset cleanup failed:', cleanupError)
        }
      }
      if (editingItem?.id === item.id) cancelEditing()
      setItemActionStatus(cleanupFailed
        ? 'Entry deleted. One or more attachments could not be removed from public storage; check the storage bucket.'
        : 'Entry deleted from the portfolio.')
      try {
        await loadDashboard()
      } catch (refreshError) {
        console.error('Deleted portfolio entry could not be reloaded:', refreshError)
        setLoadError('The entry was deleted, but the list could not refresh. Reload the dashboard.')
      }
    } catch (error) {
      setItemActionStatus(error.message || 'Could not delete this entry. Try again.')
    } finally {
      setActionItemId('')
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

      <PortfolioCopilot
        accessToken={session.access_token}
        onDraft={(draft) => {
          setForm({ kind: draft.kind, title: draft.title, description: draft.description })
          setStatus('Julie’s draft is ready. Review the details before saving.')
          document.getElementById('portfolio-add-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

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
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section" aria-labelledby="portfolio-add-title">
        <div className="admin-section__heading">
          <div><p className="private-page__eyebrow">Keep it current</p><h2 id="portfolio-add-title">{editingItem ? 'Edit saved entry' : 'Add an achievement or project'}</h2></div>
        </div>
        <form className="admin-form admin-form--item" id="portfolio-add-form" onSubmit={handleSaveItem}>
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
            <div><label className="admin-file-field" htmlFor="item-image"><ImagePlus aria-hidden="true" /><span><strong>{editingItem?.image_path ? 'Replace image' : 'Add an image'}</strong><small>Optional · PNG, JPEG, WebP, or GIF · up to 10 MB</small></span><input accept="image/png,image/jpeg,image/webp,image/gif" id="item-image" name="image" type="file" /></label>{editingItem?.image_path && <label className="admin-file-remove"><input name="remove-image" type="checkbox" /> Remove current image</label>}</div>
            <div><label className="admin-file-field" htmlFor="item-file"><Upload aria-hidden="true" /><span><strong>{editingItem?.file_path ? 'Replace attachment' : 'Attach a file'}</strong><small>Optional · up to 25 MB</small></span><input id="item-file" name="file" type="file" /></label>{editingItem?.file_path && <label className="admin-file-remove"><input name="remove-file" type="checkbox" /> Remove current attachment</label>}</div>
          </div>
          <div className="admin-form__actions"><p aria-live="polite" role="status">{status}</p><div className="admin-item__form-actions">{editingItem && <button className="admin-item__cancel" onClick={cancelEditing} type="button">Cancel edit</button>}<button disabled={busy} type="submit">{busy ? 'Saving…' : editingItem ? 'Save changes' : 'Save to portfolio'} <ArrowUpRight aria-hidden="true" size={16} /></button></div></div>
        </form>
      </section>

      <section className="admin-section" aria-labelledby="saved-items-title">
        <div className="admin-section__heading"><div><p className="private-page__eyebrow">Stored in Supabase</p><h2 id="saved-items-title">Saved entries</h2></div><span className="admin-count">{items.length} total</span></div>
        <p className="admin-item__status" aria-live="polite" role="status">{itemActionStatus}</p>
        {items.length === 0 ? <p className="admin-empty">Your achievements and projects will appear here after you save them.</p> : (
          <div className="admin-item-list">
            {items.map((item) => {
              const imageUrl = item.image_path ? supabase.storage.from(assetBucket).getPublicUrl(item.image_path).data.publicUrl : null
              const fileUrl = item.file_path ? supabase.storage.from(assetBucket).getPublicUrl(item.file_path).data.publicUrl : null
              return <article className="admin-item" key={item.id}>
                {imageUrl && <img alt="" src={imageUrl} />}
                <div><span className="admin-item__kind">{item.kind}</span><h3>{item.title}</h3><p>{item.description}</p><time dateTime={item.created_at}>{formatDate(item.created_at)}</time>{fileUrl && <a className="admin-item__file" href={fileUrl} rel="noreferrer" target="_blank">Open attached file <ArrowUpRight aria-hidden="true" size={14} /></a>}<div className="admin-item__actions"><button disabled={Boolean(actionItemId) || busy} onClick={() => beginEditing(item)} type="button"><Pencil aria-hidden="true" size={15} /> Edit entry</button><button className="admin-item__delete" disabled={Boolean(actionItemId) || busy} onClick={() => handleDeleteItem(item)} type="button"><Trash2 aria-hidden="true" size={15} /> {actionItemId === item.id ? 'Deleting…' : 'Delete entry'}</button></div></div>
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
