import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import { useToast } from '../context/ToastContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast('Reset link sent (demo)', 'success')
  }

  return (
    <div className="w-full max-w-md fade-in-up">
      <div
        className="glass-strong rounded-3xl p-8 md:p-10"
        style={{ boxShadow: '0 24px 60px rgba(26,143,143,0.12)' }}
      >
        {sent ? (
          <div className="text-center scale-in">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(26,143,143,0.12)', color: '#1a8f8f' }}
            >
              <CheckCircle size={28} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Check your email
            </h1>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              If an account exists for <strong>{email || 'that address'}</strong>, you&apos;ll receive a reset link shortly.
            </p>
            <Link to="/login">
              <Button className="w-full">Back to Sign In</Button>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 mb-6 transition-colors">
              <ArrowLeft size={13} /> Back to sign in
            </Link>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}
            >
              <Mail size={22} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Forgot password?
            </h1>
            <p className="text-sm text-slate-500 mb-6">Enter your email and we&apos;ll send a secure reset link.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field w-full px-4 py-3 rounded-xl text-sm border"
                  style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
                />
              </div>
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
