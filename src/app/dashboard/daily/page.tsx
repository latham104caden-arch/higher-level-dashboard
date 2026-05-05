import { redirect } from 'next/navigation'
import { getSession, AGENCY_USERS } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { DailyClient } from './DailyClient'

export const dynamic = 'force-dynamic'

function startOfDayISO() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.toISOString()
}

export default async function DailyPage() {
  const session = await getSession()
  if (!session || session.role !== 'agency' || !session.userId) redirect('/')

  const userId = session.userId
  const userName = AGENCY_USERS[userId].name

  const [entriesRes, tasksRes] = await Promise.all([
    supabaseAdmin
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('punch_in', startOfDayISO())
      .order('punch_in', { ascending: true }),
    supabaseAdmin
      .from('tasks')
      .select('*')
      .order('completed', { ascending: true })
      .order('created_at', { ascending: false }),
  ])

  const entries = (entriesRes.data || []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    punchIn: r.punch_in,
    punchOut: r.punch_out,
    submitted: r.submitted,
    createdAt: r.created_at,
  }))

  const tasks = (tasksRes.data || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    assignedTo: r.assigned_to,
    completed: r.completed,
    completedAt: r.completed_at,
    createdBy: r.created_by,
    createdAt: r.created_at,
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-10">
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Welcome, {userName}</p>
        <h1 className="font-serif italic text-4xl sm:text-5xl tracking-tight mb-3" style={{ color: '#F4F5F8' }}>
          Daily
        </h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>
          Track your hours and manage today's tasks.
        </p>
      </div>

      <DailyClient
        currentUserId={userId}
        currentUserName={userName}
        initialEntries={entries}
        initialTasks={tasks}
      />
    </main>
  )
}
