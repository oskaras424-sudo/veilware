import { createClient } from '@/lib/supabase/server'

export async function requireOwnerAccess() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.warn('[v0] owner access authentication unavailable', {
      userPresent: Boolean(user),
      errorCode: userError?.code ?? null,
    })
    return { supabase, user: null, role: null as null }
  }

  const { data: access, error: accessError } = await supabase
    .from('owner_access')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (accessError || !access || !['owner', 'admin'].includes(access.role)) {
    console.warn('[v0] owner access denied', {
      accessRowFound: Boolean(access),
      accessErrorCode: accessError?.code ?? null,
      role: access?.role ?? null,
    })
    return { supabase, user: null, role: null as null }
  }

  return { supabase, user, role: access.role as 'owner' | 'admin' }
}
