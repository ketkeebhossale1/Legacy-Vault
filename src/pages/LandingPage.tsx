import { Link } from 'react-router-dom'
import { ArrowRight, Lock, Shield, Star } from 'lucide-react'
import AnimatedBlobs from '../components/AnimatedBlobs'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBlobs />
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-20">
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #0f5555, #1a8f8f)', boxShadow: '0 6px 18px rgba(26,143,143,0.3)' }}
            >
              <Lock size={18} color="white" />
            </div>
            <span className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Legacy Vault
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/home"><Button>Open App</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
                <Link to="/signup"><Button>Get Started</Button></Link>
              </>
            )}
          </div>
        </header>

        <div className="fade-in-up max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f', border: '1px solid rgba(26,143,143,0.18)' }}
          >
            <Star size={11} fill="currentColor" /> AI-Powered Digital Legacy
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Make sure the people you trust can find what they need.
          </h1>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-xl">
            Securely store digital accounts, create a structured will, and guide nominees through a fraud-resistant process — only when it truly matters.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={isAuthenticated ? '/home' : '/signup'}>
              <Button>
                Start Your Vault <ArrowRight size={15} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">
                <Shield size={15} /> Sign in to explore
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg">
          {[
            { value: '256-bit', label: 'AES encryption' },
            { value: '72h', label: 'Cooling window' },
            { value: '2-of-3', label: 'Key threshold' },
          ].map(s => (
            <div key={s.value} className="premium-card text-center py-5 px-2">
              <p className="text-xl font-bold mb-1" style={{ color: '#1a8f8f', fontFamily: "'Playfair Display', serif" }}>
                {s.value}
              </p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        <footer className="mt-24 flex flex-wrap gap-5 text-xs text-slate-400">
          <Link to="/privacy-policy" className="hover:text-teal-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-teal-600 transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-teal-600 transition-colors">Contact</Link>
          <Link to="/contact" className="hover:text-teal-600 transition-colors">Support</Link>
        </footer>
      </div>
    </div>
  )
}
