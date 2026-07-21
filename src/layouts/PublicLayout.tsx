import { Link, Outlet } from 'react-router-dom'
import { Lock } from 'lucide-react'
import AnimatedBlobs from '../components/AnimatedBlobs'

export default function PublicLayout() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBlobs subtle />
      <header
        className="relative z-10 sticky top-0 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(26,143,143,0.08)',
        }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="p-2 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #0f5555, #1a8f8f)' }}
          >
            <Lock size={14} color="white" />
          </div>
          <span className="font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Legacy Vault
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/login" className="text-slate-500 hover:text-teal-600 transition-colors">Sign In</Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 rounded-lg font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}
          >
            Get Started
          </Link>
        </div>
      </header>
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
