import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// IMPORTANT: This uses the SERVICE_ROLE_KEY. It bypasses Row Level Security (RLS).
// NEVER use this on the frontend. Use this ONLY in Edge Functions or protected API routes.
export const createAdminClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
