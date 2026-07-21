import { useState } from 'react'
import { Bell, Moon, Globe, Shield } from 'lucide-react'
import Card from '../components/ui/Card'
import { useToast } from '../context/ToastContext'

interface SettingToggle {
  id: string
  label: string
  desc: string
  icon: typeof Bell
  on: boolean
}

export default function Settings() {
  const { toast } = useToast()
  const [items, setItems] = useState<SettingToggle[]>([
    { id: 'email', label: 'Email notifications', desc: 'Vault health and access alerts via email.', icon: Bell, on: true },
    { id: 'compact', label: 'Compact sidebar', desc: 'Prefer a denser navigation density on desktop.', icon: Globe, on: false },
    { id: 'audit', label: 'Audit email digest', desc: 'Weekly summary of vault activity.', icon: Shield, on: true },
    { id: 'motion', label: 'Reduce motion', desc: 'Minimize non-essential animations.', icon: Moon, on: false },
  ])

  const flip = (id: string) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, on: !i.on } : i)))
    toast('Preference saved', 'success')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Preferences for notifications and experience.</p>
      </div>

      <Card hover={false} padding={false} className="overflow-hidden">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-teal-50/30"
              style={{ borderBottom: i < items.length - 1 ? '1px solid rgba(31,41,51,0.05)' : undefined }}
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
                style={{ background: item.on ? '#1a8f8f' : '#ced4da' }}
                aria-pressed={item.on}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ left: item.on ? 22 : 2 }}
                />
              </button>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
