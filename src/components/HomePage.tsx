import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Users, ShieldCheck, FileText, Activity, ArrowRight,
  Plus, Sparkles, Clock, CheckCircle2, AlertCircle, Circle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../redux/store'
import { fetchAssetsRequest } from '../redux/actions/assetsActions'
import { fetchNomineesRequest } from '../redux/actions/nomineeActions'
import { fetchAuditLogsRequest } from '../redux/actions/auditActions'
import { fetchWillRequest } from '../redux/actions/willActions'
import Card from './ui/Card'
import Button from './ui/Button'

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const user = useSelector((state: RootState) => state.auth.user)
  const { items: assets } = useSelector((state: RootState) => state.assets)
  const { items: all, loading: nomineesLoading } = useSelector((state: RootState) => state.nominees)
  const { entries, fetched: auditFetched } = useSelector((state: RootState) => state.audit)
  const { text: willText, saved: willSaved } = useSelector((state: RootState) => state.will)

  const nominees = all.filter(n => !n.isExecutor)
  const executors = all.filter(n => n.isExecutor)
  const recentLogs = entries.slice(0, 5)

  useEffect(() => {
    dispatch(fetchAssetsRequest())
    dispatch(fetchWillRequest())
    if (!auditFetched) dispatch(fetchAuditLogsRequest())
  }, [dispatch])

  useEffect(() => {
    if (all.length === 0 && !nomineesLoading) {
      dispatch(fetchNomineesRequest())
    }
  }, [dispatch])

  // Vault health checklist
  const checklist = [
    { label: 'Add at least one nominee', done: nominees.length > 0 },
    { label: 'Assign an executor', done: executors.length > 0 },
    { label: 'Generate your digital will', done: !!willText },
    { label: 'Save your digital will', done: willSaved },
  ]
  const healthScore = Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ── Hero ── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <p className="text-sm text-slate-500 mb-1">{greeting}</p>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            {user?.name || 'Welcome'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's an overview of your digital estate.
          </p>
        </div>
        <Button onClick={() => navigate('/digital-will')}>
          <Sparkles size={14} /> {willText ? 'View Will' : 'Generate Will'}
        </Button>
      </section>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Nominees',
            value: nominees.length,
            icon: Users,
            color: '#1a8f8f',
            bg: 'rgba(26,143,143,0.08)',
            action: () => navigate('/my-legacy'),
          },
          {
            label: 'Executors',
            value: executors.length,
            icon: ShieldCheck,
            color: '#7c3aed',
            bg: 'rgba(124,58,237,0.08)',
            action: () => navigate('/my-legacy'),
          },
          {
            label: 'Digital Assets',
            value: assets.length,
            icon: Activity,
            color: '#d97706',
            bg: 'rgba(217,119,6,0.08)',
            action: () => navigate('/my-legacy'),
          },
          {
            label: 'Will Status',
            value: willSaved ? 'Saved' : willText ? 'Draft' : 'Not created',
            icon: FileText,
            color: willSaved ? '#16a34a' : willText ? '#d97706' : '#94a3b8',
            bg: willSaved ? 'rgba(22,163,74,0.08)' : willText ? 'rgba(217,119,6,0.08)' : 'rgba(148,163,184,0.08)',
            action: () => navigate('/digital-will'),
          },
        ].map(stat => (
          <Card
            key={stat.label}
            className="cursor-pointer group"
            onClick={stat.action}
          >
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg, color: stat.color }}
              >
                <stat.icon size={18} />
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
            </div>
            <p className="text-2xl font-bold text-slate-800 mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Nominees & Executors */}
        <div className="lg:col-span-2 space-y-5">

          {/* Nominees */}
          <Card hover={false} padding={false}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(26,143,143,0.08)' }}>
              <div className="flex items-center gap-2">
                <Users size={15} style={{ color: '#1a8f8f' }} />
                <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Nominees
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
                  {nominees.length}
                </span>
              </div>
              <button
                onClick={() => navigate('/my-legacy')}
                className="text-xs font-semibold flex items-center gap-1 transition-colors"
                style={{ color: '#1a8f8f' }}
              >
                Manage <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {nominees.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-500 mb-3">No nominees added yet</p>
                  <Button onClick={() => navigate('/my-legacy')}>
                    <Plus size={13} /> Add Nominee
                  </Button>
                </div>
              ) : nominees.slice(0, 4).map(n => (
                <div key={n.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}
                  >
                    {n.firstName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{n.firstName} {n.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{n.email}</p>
                  </div>
                  {n.assetName && (
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold" style={{ color: '#1a8f8f' }}>{n.assetPercentage}%</p>
                      <p className="text-xs text-slate-400 max-w-[100px] truncate">{n.assetName}</p>
                    </div>
                  )}
                </div>
              ))}
              {nominees.length > 4 && (
                <div className="px-5 py-3 text-center">
                  <button onClick={() => navigate('/my-legacy')}
                    className="text-xs font-medium" style={{ color: '#1a8f8f' }}>
                    +{nominees.length - 4} more nominees
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Executors */}
          <Card hover={false} padding={false}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(124,58,237,0.08)' }}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} style={{ color: '#7c3aed' }} />
                <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Executors
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
                  {executors.length}
                </span>
              </div>
              <button
                onClick={() => navigate('/my-legacy')}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: '#7c3aed' }}
              >
                Manage <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {executors.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-500 mb-3">No executor assigned yet</p>
                  <Button variant="secondary" onClick={() => navigate('/my-legacy')}>
                    <Plus size={13} /> Add Executor
                  </Button>
                </div>
              ) : executors.map(n => (
                <div key={n.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #9f67fa)' }}
                  >
                    {n.firstName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{n.firstName} {n.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{n.email}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                    style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
                    Executor
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card hover={false} padding={false}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(26,143,143,0.08)' }}>
              <div className="flex items-center gap-2">
                <Clock size={15} style={{ color: '#1a8f8f' }} />
                <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Recent Activity
                </h2>
              </div>
              <button
                onClick={() => navigate('/activity-logs')}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: '#1a8f8f' }}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div>
              {recentLogs.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-slate-400">No activity recorded yet.</p>
              ) : recentLogs.map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
                  style={{ borderBottom: i < recentLogs.length - 1 ? '1px solid rgba(31,41,51,0.04)' : undefined }}
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: '#1a8f8f' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{entry.event}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{entry.actor}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-mono">{timeAgo(entry.timestamp)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* Vault Health */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Vault Health
              </h2>
              <span
                className="text-lg font-bold"
                style={{ color: healthScore === 100 ? '#16a34a' : healthScore >= 50 ? '#d97706' : '#ef4444' }}
              >
                {healthScore}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full mb-5" style={{ background: 'rgba(26,143,143,0.1)' }}>
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${healthScore}%`,
                  background: healthScore === 100 ? '#16a34a' : healthScore >= 50 ? '#1a8f8f' : '#ef4444',
                }}
              />
            </div>

            <div className="space-y-3">
              {checklist.map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  {item.done
                    ? <CheckCircle2 size={16} className="shrink-0" style={{ color: '#16a34a' }} />
                    : <Circle size={16} className="shrink-0 text-slate-300" />
                  }
                  <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Digital Will status */}
          <Card hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} style={{ color: '#1a8f8f' }} />
              <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Digital Will
              </h2>
            </div>

            {!willText ? (
              <div className="text-center py-4">
                <AlertCircle size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm text-slate-500 mb-4">Your will hasn't been created yet.</p>
                <Button onClick={() => navigate('/digital-will')}>
                  <Sparkles size={13} /> Generate Will
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {willSaved
                    ? <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    : <AlertCircle size={14} style={{ color: '#d97706' }} />
                  }
                  <span className="text-sm font-medium" style={{ color: willSaved ? '#16a34a' : '#d97706' }}>
                    {willSaved ? 'Saved' : 'Unsaved draft'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {willText.slice(0, 140)}…
                </p>
                <button
                  onClick={() => navigate('/digital-will')}
                  className="text-xs font-semibold flex items-center gap-1"
                  style={{ color: '#1a8f8f' }}
                >
                  {willSaved ? 'View will' : 'Save will'} <ArrowRight size={12} />
                </button>
              </div>
            )}
          </Card>

          {/* Quick actions */}
          <Card hover={false}>
            <h2 className="font-semibold text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Add Nominee', icon: Users, path: '/my-legacy', color: '#1a8f8f' },
                { label: 'Add Executor', icon: ShieldCheck, path: '/my-legacy', color: '#7c3aed' },
                { label: 'Generate Will', icon: Sparkles, path: '/digital-will', color: '#d97706' },
                { label: 'Activity Logs', icon: Activity, path: '/activity-logs', color: '#0ea5e9' },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${action.color}15`, color: action.color }}
                  >
                    <action.icon size={14} />
                  </div>
                  {action.label}
                  <ArrowRight size={12} className="ml-auto text-slate-300" />
                </button>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
