import { Activity, Bell, Clock } from 'lucide-react'
import Card from '../components/ui/Card'
import { auditLog } from '../data/mockData'

export default function ActivityLogs() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Activity Logs
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review recent vault actions and nominee updates.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Log entries', value: String(auditLog.length), icon: Activity },
          { label: 'Last activity', value: 'Today', icon: Clock },
          { label: 'Alerts', value: 'On', icon: Bell },
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

      <Card hover={false} padding={false} className="overflow-hidden">
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(26,143,143,0.08)' }}>
          <Clock size={15} style={{ color: '#1a8f8f' }} />
          <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Audit trail
          </h2>
          <span className="ml-auto text-xs text-slate-400">Immutable</span>
        </div>
        <div>
          {auditLog.map((entry, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-6 py-4 transition-colors hover:bg-teal-50/30"
              style={{ borderBottom: i < auditLog.length - 1 ? '1px solid rgba(31,41,51,0.04)' : undefined }}
            >
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#1a8f8f' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">{entry.event}</p>
                <p className="text-xs text-slate-400 mt-0.5">{entry.actor}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 font-mono">{entry.ts}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
