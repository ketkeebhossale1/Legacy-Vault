import { useNavigate } from 'react-router-dom'
import { Check, Zap, Crown } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { usePlan } from '../hooks/usePlan'

const FREE_FEATURES = [
  'Up to 2 nominees',
  'Up to 1 executor',
  'Generate & save Digital Will',
  'Basic Activity Logs (last 5 events)',
]

const PREMIUM_FEATURES = [
  'Unlimited nominees & executors',
  'Share Will with Advocate (PDF email)',
  'AI Advisor access',
  'Full Activity Timeline',
  'Priority Support',
]

export default function Subscription() {
  const navigate = useNavigate()
  const { plan } = usePlan()
  const isPremium = plan === 'premium'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Choose Your Plan
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Upgrade to Premium to unlock all features of Legacy Vault.
        </p>
        {isPremium && (
          <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            <Crown size={12} /> You are on the Premium plan
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <Card hover={false} className={`relative ${!isPremium ? 'ring-2' : ''}`}
          style={{ ringColor: !isPremium ? '#1a8f8f' : undefined }}>
          {!isPremium && (
            <span className="absolute -top-3 left-5 px-3 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ background: '#1a8f8f' }}>Current Plan</span>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
              <Zap size={18} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Free Plan</h2>
              <p className="text-xs text-slate-500">Everything to get started</p>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-slate-800">₹0</span>
            <span className="text-slate-500 text-sm ml-1">forever</span>
          </div>

          <ul className="space-y-2.5 mb-6">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <Check size={15} className="mt-0.5 shrink-0" style={{ color: '#1a8f8f' }} />
                {f}
              </li>
            ))}
          </ul>

          <Button variant="secondary" className="w-full justify-center" disabled>
            {isPremium ? 'Downgrade' : 'Current Plan'}
          </Button>
        </Card>

        {/* Premium */}
        <Card hover={false} className="relative"
          style={{ border: '2px solid #7c3aed' }}>
          <span className="absolute -top-3 left-5 px-3 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9f67fa)' }}>
            {isPremium ? 'Current Plan' : 'Recommended'}
          </span>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
              <Crown size={18} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Premium Plan</h2>
              <p className="text-xs text-slate-500">All features unlocked</p>
            </div>
          </div>

          <div className="mb-1">
            <span className="text-3xl font-bold text-slate-800">₹299</span>
            <span className="text-slate-500 text-sm ml-1">/month</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">or ₹2,499/year <span className="text-green-600 font-medium">(save 30%)</span></p>

          <ul className="space-y-2.5 mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Everything in Free, plus:</p>
            {PREMIUM_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <Check size={15} className="mt-0.5 shrink-0" style={{ color: '#7c3aed' }} />
                {f}
              </li>
            ))}
          </ul>

          {isPremium ? (
            <Button className="w-full justify-center" disabled
              style={{ background: 'linear-gradient(135deg,#7c3aed,#9f67fa)' }}>
              <Crown size={14} /> Active
            </Button>
          ) : (
            <div className="space-y-2">
              <Button className="w-full justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#9f67fa)' }}
                onClick={() => navigate('/payment?plan=premium_monthly')}>
                <Crown size={14} /> Get Premium — ₹299/month
              </Button>
              <Button variant="secondary" className="w-full justify-center"
                onClick={() => navigate('/payment?plan=premium_yearly')}>
                Annual — ₹2,499/year
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
