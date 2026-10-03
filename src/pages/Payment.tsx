import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, Upload, X, ImageIcon } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../context/ToastContext'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../redux/store'
import { authSucceeded } from '../redux/reducers/authReducer'
import api from '../services/api'

const PLAN_LABELS: Record<string, { label: string; price: string; amount: string; period: string }> = {
  premium_monthly: { label: 'Premium Monthly', price: '₹299',   amount: '299',  period: 'month' },
  premium_yearly:  { label: 'Premium Annual',  price: '₹2,499', amount: '2499', period: 'year'  },
}

export default function Payment() {
  const [params]  = useSearchParams()
  const plan      = params.get('plan') || 'premium_monthly'
  const planInfo  = PLAN_LABELS[plan] || PLAN_LABELS.premium_monthly

  const navigate  = useNavigate()
  const { toast } = useToast()
  const dispatch  = useDispatch<AppDispatch>()
  const user      = useSelector((state: RootState) => state.auth.user)

  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [preview,    setPreview]    = useState<string | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [done,       setDone]       = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=legacyvault@upi&pn=Legacy+Vault&am=${planInfo.amount}&cu=INR`
  )}`

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file', 'error')
      return
    }
    setScreenshot(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async () => {
    if (!screenshot) {
      toast('Please upload your payment screenshot first', 'error')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/subscription/manual-upgrade', { plan })
      if (user) dispatch(authSucceeded({ ...user, plan: 'premium' }))
      setDone(true)
      toast('Payment verified! Premium activated.', 'success')
      setTimeout(() => navigate('/home'), 2500)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast(msg || 'Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Payment Verified!
        </h2>
        <p className="text-slate-500 text-sm">Your Premium plan is now active. Redirecting…</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => navigate('/subscription')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Plans
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Complete Payment
        </h1>
        <p className="text-slate-500 text-sm mt-1">Scan the QR code and upload your payment screenshot.</p>
      </div>

      <Card hover={false} className="space-y-6">
        {/* Plan summary */}
        <div className="px-4 py-3 rounded-xl"
          style={{ background: 'rgba(26,143,143,0.06)', border: '1px solid rgba(26,143,143,0.15)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-slate-800">Legacy Vault {planInfo.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">One-time UPI payment</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold" style={{ color: '#1a8f8f' }}>{planInfo.price}</span>
              <p className="text-xs text-slate-400">per {planInfo.period}</p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-slate-700">Scan to pay via UPI</p>
          <div className="p-3 rounded-2xl border-2" style={{ borderColor: 'rgba(26,143,143,0.3)' }}>
            <img src={qrUrl} alt="UPI QR Code" width={220} height={220} className="rounded-xl" />
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Pay to: <span className="font-semibold text-slate-700">legacyvault@upi</span></p>
            <p className="text-xs text-slate-400 mt-0.5">Works with GPay, PhonePe, Paytm & all UPI apps</p>
          </div>
        </div>

        {/* Screenshot Upload */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Upload payment screenshot</p>
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
              style={{ borderColor: 'rgba(26,143,143,0.3)' }}
            >
              <Upload size={24} className="mx-auto mb-2" style={{ color: '#1a8f8f' }} />
              <p className="text-sm text-slate-600 font-medium">Click or drag & drop screenshot here</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG supported</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(26,143,143,0.2)' }}>
              <img src={preview} alt="Payment screenshot" className="w-full max-h-48 object-cover" />
              <button
                onClick={() => { setScreenshot(null); setPreview(null) }}
                className="absolute top-2 right-2 p-1 rounded-full bg-white shadow"
              >
                <X size={14} className="text-slate-600" />
              </button>
              <div className="px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(26,143,143,0.05)' }}>
                <ImageIcon size={13} style={{ color: '#1a8f8f' }} />
                <p className="text-xs text-slate-600 truncate">{screenshot?.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          className="w-full justify-center"
          onClick={handleSubmit}
          disabled={loading || !screenshot}
        >
          {loading ? 'Verifying payment…' : 'Confirm Payment & Activate Premium'}
        </Button>

        <p className="text-xs text-slate-400 text-center">
          Your screenshot will be reviewed. Premium activates immediately upon submission.
        </p>
      </Card>
    </div>
  )
}
