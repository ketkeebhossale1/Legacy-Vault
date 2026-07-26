import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, Loader2, ShieldCheck, CreditCard, Smartphone, Building2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../context/ToastContext'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../redux/store'
import { authSucceeded } from '../redux/reducers/authReducer'
import api from '../services/api'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string
  description: string; order_id: string
  prefill?: { name?: string; email?: string }
  theme?: { color?: string }
  handler: (response: RazorpayResponse) => void
  modal?: { ondismiss?: () => void }
}
interface RazorpayInstance { open(): void }
interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

const PLAN_LABELS: Record<string, { label: string; price: string; period: string }> = {
  premium_monthly: { label: 'Premium Monthly', price: '₹299',   period: 'month' },
  premium_yearly:  { label: 'Premium Annual',  price: '₹2,499', period: 'year'  },
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Payment() {
  const [params]   = useSearchParams()
  const plan       = params.get('plan') || 'premium_monthly'
  const planInfo   = PLAN_LABELS[plan] || PLAN_LABELS.premium_monthly

  const navigate   = useNavigate()
  const { toast }  = useToast()
  const dispatch   = useDispatch<AppDispatch>()
  const user       = useSelector((state: RootState) => state.auth.user)

  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const handlePay = async () => {
    setLoading(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast('Failed to load payment gateway. Check your internet connection.', 'error')
        setLoading(false)
        return
      }

      const { data } = await api.post('/subscription/create-order', { plan })
      const orderData = data.data

      const options: RazorpayOptions = {
        key:         orderData.keyId,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        'Legacy Vault',
        description: `${planInfo.label} Plan`,
        order_id:    orderData.orderId,
        prefill:     { name: user?.name || '', email: user?.email || '' },
        theme:       { color: '#7c3aed' },
        handler: async (response: RazorpayResponse) => {
          try {
            await api.post('/subscription/verify-payment', {
              plan,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            })
            if (user) dispatch(authSucceeded({ ...user, plan: 'premium' }))
            setDone(true)
            toast('Plan upgraded to Premium!', 'success')
            setTimeout(() => navigate('/home'), 2500)
          } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast(msg || 'Payment verification failed. Contact support.', 'error')
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast('Payment cancelled.', 'error')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast(msg || 'Unable to initiate payment. Please try again.', 'error')
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
          Payment Successful!
        </h2>
        <p className="text-slate-500 text-sm">Your Premium plan is now active. Redirecting to home…</p>
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
        <p className="text-slate-500 text-sm mt-1">
          Secure payment powered by Razorpay — UPI, cards, netbanking & wallets.
        </p>
      </div>

      <Card hover={false} className="space-y-6">
        {/* Plan summary */}
        <div className="px-4 py-3 rounded-xl"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-slate-800">Legacy Vault {planInfo.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">Upgrade to Premium Plan</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold" style={{ color: '#7c3aed' }}>{planInfo.price}</span>
              <p className="text-xs text-slate-400">per {planInfo.period}</p>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-3">Accepted payment methods</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Smartphone, label: 'UPI',       sub: 'GPay · PhonePe · Paytm' },
              { icon: CreditCard, label: 'Cards',      sub: 'Visa · Mastercard · RuPay' },
              { icon: Building2,  label: 'Netbanking', sub: 'All major banks' },
            ].map(m => {
              const Icon = m.icon
              return (
                <div key={m.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
                  style={{ background: 'rgba(26,143,143,0.04)', border: '1px solid rgba(26,143,143,0.1)' }}>
                  <Icon size={18} style={{ color: '#1a8f8f' }} />
                  <p className="text-xs font-semibold text-slate-700">{m.label}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{m.sub}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.12)' }}>
          <ShieldCheck size={15} style={{ color: '#16a34a' }} className="shrink-0" />
          <p className="text-xs text-slate-600">
            256-bit SSL encrypted · PCI DSS compliant · Powered by Razorpay
          </p>
        </div>

        {/* Pay button */}
        <Button
          className="w-full justify-center"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#9f67fa)' }}
          onClick={handlePay}
          disabled={loading}
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> Opening payment…</>
            : <>Pay {planInfo.price} securely</>}
        </Button>

        <p className="text-xs text-slate-400 text-center">
          Your plan activates instantly after successful payment.
        </p>
      </Card>
    </div>
  )
}
