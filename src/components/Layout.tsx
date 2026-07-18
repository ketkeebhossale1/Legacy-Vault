import { useState } from 'react'
import {
  Home, Shield, Users, FileText, Bell, Lock, Palette,
  LogOut, ChevronRight, Menu, X
} from 'lucide-react'
import AnimatedBlobs from './AnimatedBlobs'

type Page = 'home' | 'vault' | 'nominees' | 'will' | 'verify' | 'reminders' | 'security' | 'collaborate'

interface LayoutProps {
  page: Page
  onNavigate: (p: Page) => void
  user: { name: string; email: string }
  onLogout: () => void
  children: React.ReactNode
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={16} /> },
  { id: 'vault', label: 'Vault', icon: <Shield size={16} /> },
  { id: 'nominees', label: 'Nominees', icon: <Users size={16} /> },
  { id: 'will', label: 'Digital Will', icon: <FileText size={16} /> },
  { id: 'verify', label: 'Verification', icon: <Lock size={16} /> },
  { id: 'reminders', label: 'Reminders', icon: <Bell size={16} /> },
  { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  { id: 'collaborate', label: 'Collaborate', icon: <Palette size={16} /> },
]

export default function Layout({ page, onNavigate, user, onLogout, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ background: '#f7f8f6' }}>
      <AnimatedBlobs subtle />

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 240, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(26,143,143,0.1)' }}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #0f5555, #1a8f8f)' }}>
              <Lock size={16} color="white" />
            </div>
            <span className="font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17 }}>Legacy Vault</span>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 group"
              style={page === item.id
                ? { background: 'rgba(26,143,143,0.12)', color: '#1a8f8f' }
                : { color: '#495057' }
              }
              onMouseEnter={e => { if (page !== item.id) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={e => { if (page !== item.id) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={page === item.id ? { color: '#1a8f8f' } : { color: '#adb5bd' }}>{item.icon}</span>
              {item.label}
              {page === item.id && <ChevronRight size={14} className="ml-auto" style={{ color: '#1a8f8f' }} />}
            </button>
          ))}
        </nav>

        <div className="p-4 mx-3 mb-4 rounded-xl" style={{ background: 'rgba(26,143,143,0.06)', border: '1px solid rgba(26,143,143,0.12)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 overflow-x-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-5 py-4 border-b" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(26,143,143,0.1)' }}>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-slate-600" />
          </button>
          <span className="font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Legacy Vault</span>
        </div>

        <div className="flex-1 p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
