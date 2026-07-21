import { Outlet, Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import AnimatedBlobs from '../components/AnimatedBlobs'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'transparent' }}>
      <AnimatedBlobs />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="p-2 rounded-xl transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0f5555, #1a8f8f)', boxShadow: '0 4px 14px rgba(26,143,143,0.28)' }}
          >
            <Lock size={14} color="white" />
          </div>
          <span className="font-bold text-slate-800 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            Legacy Vault
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <Link to="/privacy-policy" className="hover:text-teal-600 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-teal-600 transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-teal-600 transition-colors">Contact</Link>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-10">
        <Outlet />
      </div>
    </div>
  )
}
