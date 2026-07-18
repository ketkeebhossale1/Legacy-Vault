import { useState } from 'react'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import AnimatedBlobs from './AnimatedBlobs'

interface AuthPageProps {
  onAuth: (user: { name: string; email: string }) => void
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [showPass, setShowPass] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAuth({ name: name || 'Demo User', email: email || 'demo@legacyvault.app' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: '#f7f8f6' }}>
      <AnimatedBlobs />

      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="glass rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 32px 80px rgba(26,143,143,0.18), 0 8px 32px rgba(0,0,0,0.08)' }}>
          <div className="flex flex-col md:flex-row min-h-[560px]">

            {/* Left branded panel */}
            <div
              className="flex flex-col items-center justify-center p-10 md:w-5/12 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #0f5555 0%, #1a8f8f 60%, #2aacac 100%)' }}
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
              <div className="relative z-10 flex flex-col items-center text-center gap-6">
                <div className="pulse-lock p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  <Lock size={42} strokeWidth={1.5} color="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Legacy Vault</h1>
                  <p className="text-sm opacity-80 font-light">AI-Powered Digital Legacy Manager</p>
                </div>
                <div
                  className="rounded-2xl p-5 text-left"
                  style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Shield size={16} className="mt-0.5 shrink-0 opacity-80" />
                    <p className="text-xs leading-relaxed opacity-90">
                      Multi-party verification, split-key encryption, and a cooling-off window before anything is ever released.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-3">
                    {['End-to-end encrypted vault', '2-of-3 split-key protection', '72h fraud cooling window', 'Full access audit trail'].map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(212,167,44,0.9)' }} />
                        <span className="text-xs opacity-85">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right form panel */}
            <div className="flex flex-col justify-center p-10 md:w-7/12">
              <h2 className="text-2xl font-semibold mb-1 text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {tab === 'signin' ? 'Welcome back' : 'Create your vault'}
              </h2>
              <p className="text-sm text-slate-500 mb-7">
                {tab === 'signin' ? 'Sign in to access your legacy vault.' : 'Start protecting your digital legacy today.'}
              </p>

              {/* Tabs */}
              <div className="flex gap-1 mb-7 p-1 rounded-xl" style={{ background: '#f1f3f5' }}>
                {(['signin', 'signup'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                    style={tab === t ? { background: 'white', color: '#1a8f8f', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } : { color: '#868e96' }}
                  >
                    {t === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {tab === 'signup' && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alex Sharma"
                      className="w-full px-4 py-3 rounded-xl text-sm border transition-all outline-none"
                      style={{ borderColor: '#dee2e6', background: '#fafbfc' }}
                      onFocus={e => (e.target.style.borderColor = '#1a8f8f')}
                      onBlur={e => (e.target.style.borderColor = '#dee2e6')}
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl text-sm border transition-all outline-none"
                    style={{ borderColor: '#dee2e6', background: '#fafbfc' }}
                    onFocus={e => (e.target.style.borderColor = '#1a8f8f')}
                    onBlur={e => (e.target.style.borderColor = '#dee2e6')}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 rounded-xl text-sm border transition-all outline-none"
                      style={{ borderColor: '#dee2e6', background: '#fafbfc' }}
                      onFocus={e => (e.target.style.borderColor = '#1a8f8f')}
                      onBlur={e => (e.target.style.borderColor = '#dee2e6')}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 mt-1"
                  style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {tab === 'signin' ? 'Sign In' : 'Create Vault'}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: '#e9ecef' }} />
                <span className="text-xs text-slate-400">or</span>
                <div className="flex-1 h-px" style={{ background: '#e9ecef' }} />
              </div>

              <button
                onClick={() => onAuth({ name: 'Demo User', email: 'demo@legacyvault.app' })}
                className="w-full py-3 rounded-xl font-medium text-sm border transition-all duration-200"
                style={{ borderColor: '#dee2e6', color: '#495057', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a8f8f'; e.currentTarget.style.color = '#1a8f8f' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#dee2e6'; e.currentTarget.style.color = '#495057' }}
              >
                Continue as Guest (Demo)
              </button>

              <p className="text-xs text-slate-400 text-center mt-5">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
