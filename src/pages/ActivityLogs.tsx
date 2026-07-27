import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Activity, Bell, Clock, UserPlus, UserCheck, FileText, Share2, RefreshCw } from 'lucide-react'
import Card from '../components/ui/Card'
import type { AppDispatch, RootState } from '../redux/store'
import type { AuditEntry } from '../redux/actions/auditActions'
import { fetchAuditLogsRequest } from '../redux/actions/auditActions'
import { usePlan } from '../hooks/usePlan'
import { useNavigate } from 'react-router-dom'
import { Crown } from 'lucide-react'

const TYPE_CONFIG: Record<string, { icon: typeof UserPlus; color: string; bg: string; label: string }> = {
  nominee_add:    { icon: UserPlus,   color: '#1a8f8f', bg: 'rgba(26,143,143,0.1)',  label: 'Nominee'  },
  nominee_update: { icon: RefreshCw,  color: '#d97706', bg: 'rgba(217,119,6,0.1)',   label: 'Nominee'  },
  executor_add:   { icon: UserCheck,  color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',  label: 'Executor' },
  executor_update:{ icon: RefreshCw,  color: '#d97706', bg: 'rgba(217,119,6,0.1)',   label: 'Executor' },
  will_saved:     { icon: FileText,   color: '#16a34a', bg: 'rgba(22,163,74,0.1)',   label: 'Will'     },
  will_updated:   { icon: FileText,   color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',  label: 'Will'     },
  advocate_share: { icon: Share2,     color: '#e11d48', bg: 'rgba(225,29,72,0.1)',   label: 'Shared'   },
}

function fallbackConfig() {
  return { icon: Activity, color: '#64748b', bg: 'rgba(100,116,139,0.1)', label: 'Event' }
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function groupByDate(entries: AuditEntry[]) {
  const groups: Record<string, AuditEntry[]> = {}
  entries.forEach(e => {
    const day = new Date(e.timestamp).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    if (!groups[day]) groups[day] = []
    groups[day].push(e)
  })
  return groups
}

export default function ActivityLogs() {
  const dispatch = useDispatch<AppDispatch>()
  const { entries: allEntries, loading, error, fetched } = useSelector((state: RootState) => state.audit)
  const { canViewFullActivity, isPremium } = usePlan()
  const navigate = useNavigate()

  const entries = canViewFullActivity ? allEntries : allEntries.slice(0, 5)

  useEffect(() => {
    if (!fetched) dispatch(fetchAuditLogsRequest())
  }, [dispatch])

  const lastActivity = entries[0]?.timestamp
    ? new Date(entries[0].timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'None'

  const nomineeCount  = entries.filter(e => e.type === 'nominee_add').length
  const willEvents    = entries.filter(e => e.type?.startsWith('will')).length
  const groups        = groupByDate(entries)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Activity Logs
        </h1>
        <p className="text-slate-500 text-sm mt-1">A complete history of changes across your vault.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total events',    value: String(entries.length), icon: Activity },
          { label: 'Last activity',   value: lastActivity,           icon: Clock    },
          { label: 'Nominees added',  value: String(nomineeCount),   icon: UserPlus },
          { label: 'Will events',     value: String(willEvents),     icon: FileText },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {s.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Timeline */}
      <Card hover={false} padding={false} className="overflow-hidden">
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(26,143,143,0.08)' }}>
          <Clock size={15} style={{ color: '#1a8f8f' }} />
          <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Activity Timeline
          </h2>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
            {entries.length} events
          </span>
        </div>

        {loading && (
          <p className="px-6 py-8 text-sm text-slate-500 text-center">Loading activity…</p>
        )}
        {error && (
          <p className="px-6 py-8 text-sm text-red-500 text-center">Unable to load activity: {error}</p>
        )}
        {!loading && !error && entries.length === 0 && (
          <div className="px-6 py-14 text-center">
            <Bell size={28} className="mx-auto mb-3 text-slate-200" />
            <p className="text-sm text-slate-500">No activity recorded yet.</p>
            <p className="text-xs text-slate-400 mt-1">Actions like adding nominees or generating your will will appear here.</p>
          </div>
        )}

        {!loading && !error && Object.entries(groups).map(([date, dayEntries]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="px-6 py-2 flex items-center gap-3"
              style={{ background: 'rgba(26,143,143,0.03)', borderBottom: '1px solid rgba(26,143,143,0.06)' }}>
              <span className="text-xs font-semibold text-slate-500">{date}</span>
            </div>

            {dayEntries.map((entry, i) => {
              const cfg = TYPE_CONFIG[entry.type] ?? fallbackConfig()
              const Icon = cfg.icon
              return (
                <div
                  key={`${entry.id}-${i}`}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors"
                  style={{ borderBottom: i < dayEntries.length - 1 ? '1px solid rgba(31,41,51,0.04)' : undefined }}
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    <Icon size={15} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-800">{entry.event}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                    {entry.name && (
                      <p className="text-xs text-slate-500 mt-0.5">{entry.name}</p>
                    )}
                    {entry.detail && entry.detail !== entry.name && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{entry.detail}</p>
                    )}
                  </div>

                  {/* Time */}
                  <span className="text-xs text-slate-400 shrink-0 font-mono whitespace-nowrap mt-1">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </Card>

      {/* Free plan gate */}
      {!isPremium && allEntries.length > 5 && (
        <div className="mt-4 px-5 py-4 rounded-xl flex items-center justify-between gap-3"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <div className="flex items-center gap-2">
            <Crown size={15} style={{ color: '#7c3aed' }} />
            <p className="text-sm text-slate-700">
              Showing 5 of {allEntries.length} events. Upgrade to see full history.
            </p>
          </div>
          <button onClick={() => navigate('/subscription')}
            className="text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            Upgrade
          </button>
        </div>
      )}
    </div>
  )
}
