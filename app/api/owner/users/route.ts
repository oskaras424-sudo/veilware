import { NextResponse } from 'next/server'
import { requireOwnerAccess } from '@/lib/owner'
import { createAdminClient } from '@/lib/supabase/admin'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type AccessRow = { user_id: string; role: 'owner' | 'admin'; created_at: string }
type AuditRow = { target_user_id: string; actor_user_id: string; action: 'grant' | 'revoke'; role: 'admin'; created_at: string }

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

async function getOwnerContext() {
  const context = await requireOwnerAccess()
  if (!context.user || context.role !== 'owner') return null
  return context
}

export async function GET(request: Request) {
  const context = await getOwnerContext()
  if (!context) return errorResponse('Owner access required.', 403)

  const query = new URL(request.url).searchParams.get('q')?.trim().toLowerCase() ?? ''
  const admin = createAdminClient()
  const [{ data: accessRows, error: accessError }, { data: auditRows, error: auditError }] = await Promise.all([
    admin.from('owner_access').select('user_id, role, created_at').order('created_at', { ascending: true }),
    admin.from('owner_access_audit').select('target_user_id, actor_user_id, action, role, created_at').order('created_at', { ascending: false }).limit(500),
  ])
  if (accessError || auditError) {
    console.error('[v0] owner user management read failed', { accessCode: accessError?.code, auditCode: auditError?.code })
    return errorResponse('Unable to load user access data.', 500)
  }

  const typedAccess = (accessRows ?? []) as AccessRow[]
  const typedAudit = (auditRows ?? []) as AuditRow[]
  const users = [] as Array<{ id: string; email?: string; created_at: string }>
  if (UUID_PATTERN.test(query)) {
    const { data, error: userError } = await admin.auth.admin.getUserById(query)
    if (userError) return errorResponse('Unable to search registered accounts.', 502)
    if (data.user) users.push({ id: data.user.id, email: data.user.email, created_at: data.user.created_at })
  } else {
    for (let page = 1; ; page += 1) {
      const { data: listedUsers, error: usersError } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
      if (usersError) return errorResponse('Unable to search registered accounts.', 502)
      users.push(...listedUsers.users.map((user) => ({ id: user.id, email: user.email, created_at: user.created_at })))
      if (listedUsers.users.length < 1000) break
    }
  }
  const emailById = new Map(users.map((user) => [user.id, user.email ?? 'No email']))
  const latestGrantByTarget = new Map<string, AuditRow>()
  for (const audit of typedAudit) {
    if (audit.action === 'grant' && !latestGrantByTarget.has(audit.target_user_id)) latestGrantByTarget.set(audit.target_user_id, audit)
  }

  const accessList = typedAccess.map((access) => {
    const grant = latestGrantByTarget.get(access.user_id)
    return {
      userId: access.user_id,
      email: emailById.get(access.user_id) ?? 'Registered account',
      role: access.role,
      grantedAt: grant?.created_at ?? access.created_at,
      grantedBy: grant ? emailById.get(grant.actor_user_id) ?? 'Owner account' : 'Owner account',
    }
  })

  const matchingAccounts = users
    .filter((user) => !query || user.id.toLowerCase() === query || user.email?.toLowerCase().includes(query))
    .slice(0, 25)
    .map((user) => ({
      userId: user.id,
      email: user.email ?? 'No email',
      createdAt: user.created_at,
      access: typedAccess.find((item) => item.user_id === user.id)?.role ?? null,
    }))

  return NextResponse.json({ accounts: matchingAccounts, accessList })
}

async function mutateAccess(request: Request, action: 'grant' | 'revoke') {
  const context = await getOwnerContext()
  if (!context) return errorResponse('Owner access required.', 403)

  const body = await request.json().catch(() => null) as { userId?: unknown } | null
  const userId = typeof body?.userId === 'string' ? body.userId.trim() : ''
  if (!UUID_PATTERN.test(userId)) return errorResponse('A valid account ID is required.', 400)
  if (userId === context.user.id) return errorResponse('The original owner cannot be changed.', 409)

  const admin = createAdminClient()
  const { error } = await admin.rpc(action === 'grant' ? 'grant_owner_admin' : 'revoke_owner_admin', {
    target_user_id: userId,
    actor_user_id: context.user.id,
  })
  if (error) {
    console.error(`[v0] owner ${action} failed`, { code: error.code, message: error.message })
    const status = error.code === '23505' ? 409 : error.code === 'P0002' ? 404 : error.code === '42501' ? 403 : 500
    const message = error.message.includes('access_already_granted') ? 'This account already has access.' : error.message.includes('admin_access_not_found') ? 'This account does not have admin access.' : error.message.includes('target_user_not_found') ? 'Only registered accounts can receive access.' : error.message.includes('owner_protected') ? 'The original owner cannot be changed.' : 'Unable to update account access.'
    return errorResponse(message, status)
  }

  return NextResponse.json({ ok: true, action })
}

export async function POST(request: Request) {
  return mutateAccess(request, 'grant')
}

export async function DELETE(request: Request) {
  return mutateAccess(request, 'revoke')
}
