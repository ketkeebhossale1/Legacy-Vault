import { Globe, Shield, Moon, Sun } from 'lucide-react'
import Card from '../components/ui/Card'
import { useToast } from '../context/ToastContext'
import { useSettings } from '../hooks/useSettings'
import type { AppSettings } from '../hooks/useSettings'

const ITEMS: {
  id: keyof AppSettings
  label: string
  desc: string
  icon: typeof Globe
}[] = [
  {
    id: 'darkMode',
    label: 'Dark mode',
    desc: 'Switch to a dark colour scheme across the entire app.',
    icon: Sun,
  },
  {
    id: 'compact',
    label: 'Compact sidebar',
    desc: 'Collapse the sidebar to icon-only mode for more screen space.',
    icon: Globe,
  },
  {
    id: 'auditDigest',
    label: 'Audit email digest',
    desc: 'Receive a weekly summary of vault activity via email.',
    icon: Shield,
  },
  {
    id: 'reduceMotion',
    label: 'Reduce motion',
    desc: 'Minimise animations and transitions across the app.',
    icon: Moon,
  },
]

export default function Settings() {
  const { toast } = useToast()
  const { settings, update } = useSettings()

  const flip = (id: keyof AppSettings) => {
    update(id, !settings[id])
    toast('Preference saved', 'success')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Preferences for your vault experience.</p>
      </div>

      <Card hover={false} padding={false} className="overflow-hidden">
        {ITEMS.map((item, i) => {
          const Icon = item.icon
          const on = settings[item.id]
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-teal-50/30"
              style={{ borderBottom: i < ITEMS.length - 1 ? '1px solid rgba(31,41,51,0.05)' : undefined }}
            >
              <div className="p-2 rounded-lg" style={{ background: 'rgba(26,143,143,0.08)', color: '#1a8f8f' }}>
                <Icon size={15} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => flip(item.id)}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
                style={{ background: on ? '#1a8f8f' : '#ced4da' }}
                aria-pressed={on}
                aria-label={item.label}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ left: on ? 22 : 2 }}
                />
              </button>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
