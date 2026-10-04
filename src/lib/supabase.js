import { createClient } from '@supabase/supabase-js'

const projectUrl = 'https://mtxfyfvqrxaertelevbh.supabase.co'
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigured = Boolean(publishableKey)
export const supabase = supabaseConfigured
  ? createClient(projectUrl, publishableKey)
  : null

export const ownerEmail = '10cjanarthansrvspm@gmail.com'
export const assetBucket = 'portfolio-assets'
