import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import AnimatedTabs from './ui/AnimatedTabs'
import Button from './ui/Button'
import type { AppDispatch, RootState } from '../redux/store'
import { signInRequest, signUpRequest } from '../redux/actions/authActions'
import { clearAuthError } from '../redux/reducers/authReducer'

type Mode = 'signin' | 'signup'

interface AuthPageProps {
  mode?: Mode
}

export default function AuthPage({ mode: modeProp }: AuthPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const routeMode: Mode = modeProp ?? (location.pathname.includes('signup') ? 'signup' : 'signin')
  const [tab, setTab] = useState<Mode>(routeMode)

  useEffect(() => {
    setTab(routeMode)
  }, [routeMode])
  const [showPass, setShowPass] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const switchTab = (id: string) => {
    const next = id as Mode
    setTab(next)
    dispatch(clearAuthError())
    navigate(next === 'signup' ? '/signup' : '/login', { replace: true })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (tab === 'signup' && !name.trim()) nextErrors.name = 'Enter your full name'
    if (!email.trim()) nextErrors.email = 'Enter your email address'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address'
    if (!password) nextErrors.password = 'Enter your password'
    else if (password.length < 8) nextErrors.password = 'Use at least 8 characters'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    if (tab === 'signup') dispatch(signUpRequest({ name, email, password }))
    else dispatch(signInRequest({ email, password, role: 'testator' }))
  }

  return (
    <div className="w-full max-w-4xl fade-in-up">
      <div
        className="glass-strong rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 32px 80px rgba(26,143,143,0.14), 0 8px 32px rgba(0,0,0,0.06)' }}
      >
        <div className="flex flex-col md:flex-row min-h-[560px]">
          <div
            className="flex flex-col items-center justify-center p-10 md:w-5/12 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #0f5555 0%, #1a8f8f 60%, #2aacac 100%)' }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 0%, transparent 60%)' }}
            />
            <div className="relative z-10 flex flex-col items-center text-center gap-6">
              <div
                className="pulse-lock p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <Lock size={42} strokeWidth={1.5} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Legacy Vault
                </h1>
                <p className="text-sm opacity-80 font-light">AI-Powered Digital Legacy Manager</p>
              </div>
              <div
                className="rounded-2xl p-5 text-left"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
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

          <div className="flex flex-col justify-center p-10 md:w-7/12">
            <h2 className="text-2xl font-semibold mb-1 text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {tab === 'signin' ? 'Welcome back' : 'Create your vault'}
            </h2>
            <p className="text-sm text-slate-500 mb-7">
              {tab === 'signin' ? 'Sign in to access your legacy vault.' : 'Start protecting your digital legacy today.'}
            </p>

            <AnimatedTabs
              tabs={[
                { id: 'signin', label: 'Sign In' },
                { id: 'signup', label: 'Sign Up' },
              ]}
              value={tab}
              onChange={switchTab}
              className="mb-7"
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === 'signup' && (
                <div className="fade-in">
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(current => ({ ...current, name: '' })) }}
                    placeholder="Alex Sharma"
                    className="input-field w-full px-4 py-3 rounded-xl text-sm border"
                    style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(current => ({ ...current, email: '' })) }}
                  placeholder="you@example.com"
                  className="input-field w-full px-4 py-3 rounded-xl text-sm border"
                  style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(current => ({ ...current, password: '' })) }}
                    placeholder="••••••••"
                    className="input-field w-full px-4 py-3 pr-12 rounded-xl text-sm border"
                    style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {tab === 'signin' && (
                <div className="flex justify-end -mt-1">
                  <Link to="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: '#1a8f8f' }}>
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}
              <Button type="submit" className="w-full mt-1" disabled={loading}>
                {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Vault'}
              </Button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-5">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="underline hover:text-teal-600">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy-policy" className="underline hover:text-teal-600">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
