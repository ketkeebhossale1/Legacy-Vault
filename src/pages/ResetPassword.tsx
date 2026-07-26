import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import api from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md fade-in-up">
        <div className="glass-strong rounded-3xl p-8 md:p-10 text-center" style={{ boxShadow: '0 24px 60px rgba(26,143,143,0.12)' }}>
          <p className="text-sm text-slate-500 mb-4">Invalid or missing reset link.</p>
          <Link to="/forgot-password"><Button>Request a new link</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md fade-in-up">
      <div className="glass-strong rounded-3xl p-8 md:p-10" style={{ boxShadow: '0 24px 60px rgba(26,143,143,0.12)' }}>
        {done ? (
          <div className="text-center scale-in">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(26,143,143,0.12)', color: '#1a8f8f' }}>
              <CheckCircle size={28} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Password updated!
            </h1>
            <p className="text-sm text-slate-500 mb-6">Redirecting you to sign in…</p>
            <Link to="/login"><Button className="w-full">Go to Sign In</Button></Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 mb-6 transition-colors">
              <ArrowLeft size={13} /> Back to sign in
            </Link>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
              <KeyRound size={22} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Set new password
            </h1>
            <p className="text-sm text-slate-500 mb-6">Choose a strong password for your Legacy Vault account.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="input-field w-full px-4 py-3 pr-11 rounded-xl text-sm border"
                    style={{ borderColor: error ? '#dc3545' : '#e8ebf0', background: '#fafbfc' }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className="input-field w-full px-4 py-3 rounded-xl text-sm border"
                  style={{ borderColor: error ? '#dc3545' : '#e8ebf0', background: '#fafbfc' }}
                />
                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
