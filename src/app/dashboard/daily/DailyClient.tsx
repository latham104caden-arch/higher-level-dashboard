'use client'

import { useEffect, useMemo, useState } from 'react'

type AgencyUserId = 'caden' | 'hunter'

type TimeEntry = {
  id: string
  userId: AgencyUserId
  punchIn: string
  punchOut: string | null
  submitted: boolean
  createdAt: string
}

type Task = {
  id: string
  title: string
  assignedTo: AgencyUserId
  completed: boolean
  completedAt: string | null
  createdBy: AgencyUserId
  createdAt: string
}

const USER_LABELS: Record<AgencyUserId, string> = {
  caden: 'Caden',
  hunter: 'Hunter',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function durationMs(start: string, end: string | null) {
  const startMs = new Date(start).getTime()
  const endMs = end ? new Date(end).getTime() : Date.now()
  return Math.max(0, endMs - startMs)
}

function formatDuration(ms: number) {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}

export function DailyClient({
  currentUserId,
  currentUserName,
  initialEntries,
  initialTasks,
}: {
  currentUserId: AgencyUserId
  currentUserName: string
  initialEntries: TimeEntry[]
  initialTasks: Task[]
}) {
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [busy, setBusy] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState<AgencyUserId>(currentUserId)
  const [taskFilter, setTaskFilter] = useState<'all' | AgencyUserId>('all')

  const openEntry = useMemo(() => entries.find((e) => !e.punchOut) || null, [entries])
  const isPunchedIn = !!openEntry

  useEffect(() => {
    if (!isPunchedIn) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [isPunchedIn])

  const totalMs = useMemo(() => {
    return entries.reduce((sum, e) => sum + durationMs(e.punchIn, e.punchOut), 0)
  }, [entries, now])

  const allDayClosed = entries.length > 0 && entries.every((e) => e.punchOut)
  const allSubmitted = entries.length > 0 && entries.every((e) => e.submitted)

  async function callTime(action: 'punch_in' | 'punch_out' | 'submit_day') {
    setBusy(true)
    try {
      const res = await fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Request failed')

      const refresh = await fetch('/api/time')
      if (refresh.ok) setEntries(await refresh.json())
    } catch (err: any) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    setBusy(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, assignedTo: newTaskAssignee }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      const created: Task = await res.json()
      setTasks((prev) => [created, ...prev])
      setNewTaskTitle('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function toggleTask(task: Task) {
    const optimistic = !task.completed
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: optimistic } : t))
    )
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, completed: optimistic }),
      })
      if (!res.ok) throw new Error()
      const updated: Task = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
      )
    }
  }

  async function deleteTask(id: string) {
    if (!confirm('Delete this task?')) return
    const prev = tasks
    setTasks((p) => p.filter((t) => t.id !== id))
    try {
      const res = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setTasks(prev)
      alert('Failed to delete')
    }
  }

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'all') return tasks
    return tasks.filter((t) => t.assignedTo === taskFilter)
  }, [tasks, taskFilter])

  const cardStyle = {
    background: '#15161A',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Time Tracking */}
      <section className="rounded-xl p-6 sm:p-8" style={cardStyle}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#5C606C' }}>
              Time Clock
            </p>
            <h2 className="text-2xl font-semibold" style={{ color: '#F4F5F8' }}>
              {currentUserName}'s Hours
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#5C606C' }}>
              Today
            </p>
            <p className="text-xl font-mono font-semibold" style={{ color: '#F4F5F8' }}>
              {formatDuration(totalMs)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          {!isPunchedIn ? (
            <button
              onClick={() => callTime('punch_in')}
              disabled={busy || allSubmitted}
              className="flex-1 px-4 py-3 rounded-md text-sm font-bold transition-opacity disabled:opacity-40"
              style={{ background: '#21D19F', color: '#0B0C0F' }}
            >
              {busy ? '...' : 'Punch In'}
            </button>
          ) : (
            <button
              onClick={() => callTime('punch_out')}
              disabled={busy}
              className="flex-1 px-4 py-3 rounded-md text-sm font-bold transition-opacity disabled:opacity-40"
              style={{ background: '#E5484D', color: '#F4F5F8' }}
            >
              {busy ? '...' : 'Punch Out'}
            </button>
          )}
          <button
            onClick={() => {
              if (confirm('Submit hours for today? This locks today\'s entries.')) {
                callTime('submit_day')
              }
            }}
            disabled={busy || isPunchedIn || !allDayClosed || allSubmitted}
            className="px-4 py-3 rounded-md text-sm font-bold transition-opacity disabled:opacity-40"
            style={{ background: 'rgba(94,106,210,0.15)', border: '1px solid rgba(94,106,210,0.3)', color: '#A5ADE8' }}
          >
            {allSubmitted ? 'Submitted' : 'Submit Hours'}
          </button>
        </div>

        {isPunchedIn && (
          <div
            className="rounded-md px-3 py-2 mb-4 flex items-center gap-2"
            style={{ background: 'rgba(33,209,159,0.08)', border: '1px solid rgba(33,209,159,0.2)' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#21D19F' }} />
            <span className="text-xs font-medium" style={{ color: '#21D19F' }}>
              Clocked in since {formatTime(openEntry!.punchIn)} · {formatDuration(durationMs(openEntry!.punchIn, null))}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#5C606C' }}>
            Today's Entries
          </p>
          {entries.length === 0 ? (
            <p className="text-sm py-3" style={{ color: '#5C606C' }}>
              No entries yet. Punch in to start.
            </p>
          ) : (
            entries.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm"
                style={{ background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-2 font-mono" style={{ color: '#F4F5F8' }}>
                  <span>{formatTime(e.punchIn)}</span>
                  <span style={{ color: '#5C606C' }}>→</span>
                  <span>{e.punchOut ? formatTime(e.punchOut) : '...'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs" style={{ color: '#8A8F98' }}>
                    {formatDuration(durationMs(e.punchIn, e.punchOut))}
                  </span>
                  {e.submitted && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(94,106,210,0.15)', color: '#A5ADE8' }}
                    >
                      Submitted
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tasks */}
      <section className="rounded-xl p-6 sm:p-8" style={cardStyle}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#5C606C' }}>
              Daily Tasks
            </p>
            <h2 className="text-2xl font-semibold" style={{ color: '#F4F5F8' }}>
              Team Tasks
            </h2>
          </div>
          <div className="flex items-center gap-1 rounded-md p-0.5" style={{ background: '#0B0C0F' }}>
            {(['all', 'caden', 'hunter'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className="px-2.5 py-1 text-xs font-medium rounded transition-colors"
                style={
                  taskFilter === f
                    ? { background: 'rgba(94,106,210,0.18)', color: '#F4F5F8' }
                    : { color: '#8A8F98' }
                }
              >
                {f === 'all' ? 'All' : USER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 px-3 py-2 rounded-md text-sm outline-none"
            style={{
              background: '#0B0C0F',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F4F5F8',
            }}
          />
          <select
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value as AgencyUserId)}
            className="px-3 py-2 rounded-md text-sm outline-none"
            style={{
              background: '#0B0C0F',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F4F5F8',
            }}
          >
            <option value="caden">Caden</option>
            <option value="hunter">Hunter</option>
          </select>
          <button
            type="submit"
            disabled={busy || !newTaskTitle.trim()}
            className="px-4 py-2 rounded-md text-sm font-bold transition-opacity disabled:opacity-40"
            style={{ background: '#5E6AD2', color: '#F4F5F8' }}
          >
            Add
          </button>
        </form>

        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-sm py-3" style={{ color: '#5C606C' }}>
              No tasks. Add one above.
            </p>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 group"
                style={{ background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <button
                  onClick={() => toggleTask(t)}
                  className="flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors"
                  style={{
                    background: t.completed ? '#21D19F' : 'transparent',
                    borderColor: t.completed ? '#21D19F' : 'rgba(255,255,255,0.2)',
                  }}
                  aria-label={t.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {t.completed && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#0B0C0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span
                  className="flex-1 text-sm"
                  style={{
                    color: t.completed ? '#5C606C' : '#F4F5F8',
                    textDecoration: t.completed ? 'line-through' : 'none',
                  }}
                >
                  {t.title}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={
                    t.assignedTo === currentUserId
                      ? { background: 'rgba(94,106,210,0.15)', color: '#A5ADE8' }
                      : { background: 'rgba(255,255,255,0.05)', color: '#8A8F98' }
                  }
                >
                  {USER_LABELS[t.assignedTo]}
                </span>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  style={{ color: '#5C606C' }}
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
