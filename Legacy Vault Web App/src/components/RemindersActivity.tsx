import { useState } from 'react'
import { Bell, Activity, Shield, ToggleLeft, ToggleRight, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { auditLog } from '../data/mockData'

interface Toggle { id: string; label: string; desc: string; on: boolean }

export default function RemindersActivity() {
  const [toggles, setToggles] = useState<Toggle[]>([
    { id: 'monthly', label: 'Monthly check-in reminder', desc: 'Email reminder to review and update your vault contents.', on: true },
    { id: 'quarterly', label: 'Quarterly health review', desc: 'Full vault health audit with nominee confirmation prompts.', on: false },
    { id: 'login_gap', label: 'Login-gap pattern monitoring', desc: 'AI flags if you haven\'t signed in for an extended period.', on: true },
    { id: 'email_bounce', label: 'Email bounce detection', desc: 'Monitors if your account email starts returning bounces.', on: true },
    { id: 'nominee_confirm', label: 'Nominee re-confirmation (annual)', desc: 'Asks nominees to re-confirm their role once a year.', on: true },
    { id: 'will_outdated', label: 'Digital will outdated alert', desc: 'Alerts if asset changes haven\'t been reflected in the will.', on: false },
  ])

  const flip = (id: string) => setToggles(prev => prev.map(t => t.id === id ? { ...t, on: !t.on } : t))

  const logIcons: Record<string, React.ReactNode> = {
    'Vault viewed': <Activity size={13} style={{ color: '#1a8f8f' }} />,
    'Permission toggled': <Shield size={13} style={{ color: '#d4a72c' }} />,
    'New asset added': <CheckCircle size={13} style={{ color: '#1a7a3f' }} />,
    'Nominee confirmed': <CheckCircle size={13} style={{ color: '#1a8f8f' }} />,
    'Digital Will generated': <Info size={13} style={{ color: '#6c757d' }} />,
    'Vault created': <CheckCircle size={13} style={{ color: '#1a7a3f' }} />,
  }

  const getIcon = (event: string) => {
    for (const key of Object.keys(logIcons)) {
      if (event.includes(key)) return logIcons[key]
    }
    return <AlertCircle size={13} style={{ color: '#adb5bd' }} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Reminders &amp; Activity</h1>
        <p className="text-slate-500 text-sm mt-1">Configure intelligent alerts and review every vault action in the audit log.</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active reminders', value: String(toggles.filter(t => t.on).length), color: '#1a8f8f' },
          { label: 'Last check-in', value: 'Today', color: '#1a7a3f' },
          { label: 'Vault health', value: 'Good', color: '#1a8f8f' },
          { label: 'Log entries', value: String(auditLog.length), color: '#6c757d' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(8px)' }}>
            <p className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Toggles */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(12px)' }}>
          <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(26,143,143,0.08)' }}>
            <Bell size={15} style={{ color: '#1a8f8f' }} />
            <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Alert Settings</h2>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
            {toggles.map(t => (
              <div key={t.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/40">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                </div>
                <button onClick={() => flip(t.id)} className="shrink-0 transition-all">
                  {t.on
                    ? <ToggleRight size={28} style={{ color: '#1a8f8f' }} />
                    : <ToggleLeft size={28} style={{ color: '#ced4da' }} />
                  }
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audit log */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(12px)' }}>
          <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(26,143,143,0.08)' }}>
            <Clock size={15} style={{ color: '#1a8f8f' }} />
            <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Audit Log</h2>
            <span className="ml-auto text-xs text-slate-400">Immutable</span>
          </div>
          <div className="divide-y">
            {auditLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-4 transition-colors hover:bg-slate-50/40">
                <div className="shrink-0 mt-0.5">{getIcon(entry.event)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800">{entry.event}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{entry.actor}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0 font-mono">{entry.ts}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 text-xs text-slate-400 text-center border-t" style={{ borderColor: 'rgba(26,143,143,0.06)' }}>
            All entries are cryptographically signed and immutable.
          </div>
        </div>
      </div>
    </div>
  )
}
