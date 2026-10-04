import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './feedback.css'
import App from './App.jsx'
import FeedbackPage from './components/FeedbackPage.jsx'
import AdminPage from './components/AdminPage.jsx'

const path = window.location.pathname.replace(/\/$/, '')
const Page = path === '/feedback' ? FeedbackPage : path === '/admin' ? AdminPage : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
