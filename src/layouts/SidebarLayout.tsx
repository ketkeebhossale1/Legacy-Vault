import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  Home, Users, FileText, Bell, Lock,
  LogOut, ChevronRight, Menu, X,
  Settings, Sparkles,
} from 'lucide-react'
import AnimatedBlobs from '../components/AnimatedBlobs'
import PageTransition from '../components/ui/PageTransition'
import { useToast } from '../context/ToastContext'
import type { AppDispatch, RootState } from '../redux/store'
import { signOut } from '../redux/reducers/authReducer'

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/my-legacy', label: 'My Legacy', icon: Users },
  { to: '/digital-will', label: 'Digital Will', icon: FileText },
  { to: '/ai-advisor', label: 'AI Advisor', icon: Sparkles },
  { to: '/activity', label: 'Activity Logs', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function SidebarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const { toast } = useToast()
  const navigate = useNavigate()
  const width = collapsed ? 80 : 248

  const handleLogout = () => {
    dispatch(signOut())
    toast('Signed out successfully', 'info')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'transparent' }}>
      <AnimatedBlobs subtle />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden fade-in"
          style={{ background: 'rgba(31,41,51,0.28)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar-expand fixed left-0 top-0 h-full z-50 flex flex-col transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width,
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(24px) saturate(160%)',
          borderRight: '1px solid rgba(26,143,143,0.08)',
          boxShadow: '4px 0 24px rgba(31,41,51,0.03)',
        }}
      >
        <div className={`p-5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <Link to="/home" className="flex items-center gap-3 group">
            <div
              className="p-2 rounded-xl shrink-0 transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0f5555, #1a8f8f)', boxShadow: '0 4px 12px rgba(26,143,143,0.3)' }}
            >
              <Lock size={16} color="white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17 }}>
                Legacy Vault
              </span>
            )}
          </Link>
          <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                title={item.label}
                className={({ isActive }) =>
                  `nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 ${
                    isActive ? 'active' : ''
                  } ${collapsed ? 'justify-center' : ''}`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }
                    : { color: '#495057' }
                }
              >
                {({ isActive }) => (
                  <>
                    <span style={{ color: isActive ? '#1a8f8f' : '#adb5bd' }}>
                      <Icon size={16} />
                    </span>
                    {!collapsed && (
                      <>
                        {item.label}
                        {isActive && <ChevronRight size={14} className="ml-auto" style={{ color: '#1a8f8f' }} />}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className="hidden md:flex mx-3 mb-2 items-center justify-center py-2 rounded-lg text-xs text-slate-400 hover:text-teal-600 hover:bg-teal-50/50 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : 'Collapse'}
        </button>

        {user && (
          <div
            className={`mx-3 mb-4 rounded-xl ${collapsed ? 'p-2' : 'p-4'}`}
            style={{ background: 'rgba(26,143,143,0.06)', border: '1px solid rgba(26,143,143,0.1)' }}
          >
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'mb-3'}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}
              >
                {user.name.charAt(0)}
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-500 transition-colors"
              >
                <LogOut size={13} /> Sign out
              </button>
            )}
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col min-h-screen relative z-10 overflow-x-hidden min-w-0">
        <div
          className="md:hidden flex items-center gap-3 px-5 py-4 sticky top-0 z-30"
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(26,143,143,0.08)',
            boxShadow: 'var(--lv-shadow-sm)',
          }}
        >
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} className="text-slate-600" />
          </button>
          <span className="font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Legacy Vault
          </span>
        </div>

        <div className="flex-1 p-6 md:p-8 lg:p-10">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  )
}
