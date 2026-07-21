import { useNavigate } from 'react-router-dom'
import { ArrowRight, Users, FileText, Sparkles, Lock, Star } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-16 pt-4">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f', border: '1px solid rgba(26,143,143,0.18)' }}
        >
          <Star size={11} fill="currentColor" /> AI-Powered Digital Legacy
        </div>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", maxWidth: 700 }}
        >
          Make sure the people you trust can find what they need.
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-xl leading-relaxed">
          Legacy Vault helps you appoint nominees, allocate assets, and generate a shareable digital will — only for the people you choose.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/my-legacy')}>
            Manage Nominees <ArrowRight size={15} />
          </Button>
          <Button variant="secondary" onClick={() => navigate('/digital-will')}>
            Open Digital Will
          </Button>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          How it works
        </h2>
        <p className="text-slate-500 mb-8 text-sm">Three steps that take minutes to set up, but protect everything that matters.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              step: '01',
              icon: <Users size={20} />,
              title: 'Add your nominees',
              desc: 'Record each nominee with contact details, residential address, and the asset percentage they should receive.',
              path: '/my-legacy',
              cta: 'Go to My Legacy',
            },
            {
              step: '02',
              icon: <FileText size={20} />,
              title: 'Generate your will',
              desc: 'Create an editable digital will from your nominee allocations, then share it with an advocate or executor.',
              path: '/digital-will',
              cta: 'Open Digital Will',
            },
            {
              step: '03',
              icon: <Sparkles size={20} />,
              title: 'Get guided advice',
              desc: 'Use the AI Advisor for practical recommendations on allocations, sharing, and keeping your will up to date.',
              path: '/ai-advisor',
              cta: 'Ask AI Advisor',
            },
          ].map(item => (
            <Card key={item.step} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold" style={{ color: '#d4a72c', fontFamily: 'monospace', letterSpacing: 1 }}>
                  {item.step}
                </span>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
                  {item.icon}
                </div>
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{item.desc}</p>
              <button
                onClick={() => navigate(item.path)}
                className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-2"
                style={{ color: '#1a8f8f' }}
              >
                {item.cta} <ArrowRight size={12} />
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section className="premium-card-static p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          Built with your trust at the center
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { icon: <Lock size={18} />, label: 'Controlled sharing', desc: 'Share your will only with advocate or executor emails you choose' },
            { icon: <Users size={18} />, label: 'Nominee management', desc: 'Clear first/last name, contact, address, and asset percentage records' },
            { icon: <FileText size={18} />, label: 'Export-ready will', desc: 'Save and download your digital will as PDF or DOCX' },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center text-center gap-2 hover-glow rounded-xl p-3 transition-all">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
                {item.icon}
              </div>
              <p className="text-sm font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
