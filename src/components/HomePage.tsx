import { ArrowRight, ShieldCheck, Users, Key, FileCheck, Lock, Star } from 'lucide-react'

interface HomePageProps {
  onNavigate: (p: string) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-16 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f', border: '1px solid rgba(26,143,143,0.2)' }}>
          <Star size={11} fill="currentColor" /> AI-Powered Digital Legacy
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif", maxWidth: 700 }}>
          Make sure the people you trust can find what they need.
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-xl leading-relaxed">
          Legacy Vault securely stores your digital accounts, creates a structured will, and guides your nominees through a fraud-resistant process — only when it truly matters.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('vault')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Start Your Vault <ArrowRight size={15} />
          </button>
          <button
            onClick={() => onNavigate('verify')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all duration-200"
            style={{ borderColor: '#dee2e6', color: '#495057' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a8f8f'; e.currentTarget.style.color = '#1a8f8f' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#dee2e6'; e.currentTarget.style.color = '#495057' }}
          >
            See Verification Flow
          </button>
        </div>
      </div>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>How it works</h2>
        <p className="text-slate-500 mb-8 text-sm">Three steps that take minutes to set up, but protect everything that matters.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              step: '01',
              icon: <Lock size={20} />,
              title: 'Set up your vault',
              desc: "Add your accounts — banking, insurance, subscriptions, social media, crypto — with any notes you'd want your family to have. Each asset is encrypted individually.",
              action: () => onNavigate('vault'),
              cta: 'Go to Vault',
            },
            {
              step: '02',
              icon: <Users size={20} />,
              title: 'Choose your nominees',
              desc: "Assign trusted people — family or a lawyer — and control exactly which assets each can access. Each nominee holds one share of a 2-of-3 split decryption key.",
              action: () => onNavigate('nominees'),
              cta: 'Manage Nominees',
            },
            {
              step: '03',
              icon: <ShieldCheck size={20} />,
              title: "They're guided, only when it matters",
              desc: "If you pass, nominees submit proof, two must corroborate, a 72-hour cooling window opens so you can cancel if alive, then access is granted — nothing before that.",
              action: () => onNavigate('verify'),
              cta: 'See the Flow',
            },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col transition-all duration-200 hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(10px)' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold" style={{ color: '#d4a72c', fontFamily: 'monospace', letterSpacing: 1 }}>{item.step}</span>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>{item.icon}</div>
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{item.desc}</p>
              <button onClick={item.action} className="text-xs font-semibold flex items-center gap-1 transition-all" style={{ color: '#1a8f8f' }}
                onMouseEnter={e => (e.currentTarget.style.gap = '6px')}
                onMouseLeave={e => (e.currentTarget.style.gap = '4px')}>
                {item.cta} <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(10px)' }}>
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Built with your trust at the center</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { icon: <Lock size={18} />, label: 'Encrypted per-asset', desc: 'Every account stored independently encrypted' },
            { icon: <Users size={18} />, label: 'Multi-party verification', desc: '2 of 3 nominees must confirm before access' },
            { icon: <Key size={18} />, label: 'Split-key protection', desc: 'No single person holds the full decryption key' },
            { icon: <FileCheck size={18} />, label: 'Full audit trail', desc: 'Every access attempt is timestamped and logged' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>{item.icon}</div>
              <p className="text-sm font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-3 gap-4">
        {[
          { value: '256-bit', label: 'AES encryption per asset' },
          { value: '72h', label: 'Fraud cooling window' },
          { value: '2-of-3', label: 'Split key threshold' },
        ].map((s, i) => (
          <div key={i} className="text-center py-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(26,143,143,0.08)' }}>
            <p className="text-2xl font-bold mb-1" style={{ color: '#1a8f8f', fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
