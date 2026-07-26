import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../redux/store'
import { authSucceeded } from '../redux/reducers/authReducer'
import api from '../services/api'

type Status = 'verifying' | 'success' | 'error'

export default function PaymentSuccess() {
  const [params]  = useSearchParams()
  const sessionId = params.get('session_id')
  const plan      = params.get('plan') || 'premium_monthly'

  const navigate  = useNavigate()
  const dispatch  = useDispatch<AppDispatch>()
  const user      = useSelector((state: RootState) => state.auth.user)

  const [status, setStatus]   = useState<Status>('verifying')
  const [message, setMessage] = useState('')
  const called = useRef(false)

  useEffect(() => {
    if (!sessionId || called.current) return
    called.current = true

    api.post('/subscription/verify-payment', { sessionId, plan })
      .then(() => {
        if (user) dispatch(authSucceeded({ ...user, plan: 'premium' }))
        setStatus('success')
        setTimeout(() => navigate('/home'), 3000)
      })
      .catch(err => {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        setMessage(msg || 'Payment verification failed. Please contact support.')
        setStatus('error')
      })
  }, [sessionId])

  if (status === 'verifying') {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <Loader2 size={40} className="animate-spin mx-auto mb-5 text-violet-500" />
        <h2 className="text-xl font-semibold text-slate-700" style={{ fontFamily: "'Playfair Display', serif" }}>
          Verifying your payment…
        </h2>
        <p className="text-slate-400 text-sm mt-2">Please wait, this takes just a moment.</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Payment Successful!
        </h2>
        <p className="text-slate-500 text-sm">Your Premium plan is now active. Redirecting to home…</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto text-center py-24">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: 'rgba(225,29,72,0.08)', color: '#e11d48' }}>
        <XCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Verification Failed
      </h2>
      <p className="text-slate-500 text-sm mb-6">{message}</p>
      <button
        onClick={() => navigate('/subscription')}
        className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#9f67fa)' }}
      >
        Back to Plans
      </button>
    </div>
  )
}
