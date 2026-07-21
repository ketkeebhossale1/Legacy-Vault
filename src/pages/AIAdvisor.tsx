import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MessageCircle, ArrowRight, Lightbulb } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useToast } from '../context/ToastContext'

const tips = [
  {
    title: 'Balance asset percentages',
    body: 'Keep nominee allocations totaling a clear plan — ideally 100% across related assets so nothing is left ambiguous.',
  },
  {
    title: 'Keep nominee emails current',
    body: 'An outdated nominee email is the #1 reason sharing and updates stall. Re-confirm annually.',
  },
  {
    title: 'Regenerate your will after changes',
    body: 'Whenever you add or update a nominee, regenerate your digital will so instructions stay consistent.',
  },
  {
    title: 'Share with advocate and executor',
    body: 'After saving your will, share it with a trusted advocate and executor so legal review can happen early.',
  },
]

export default function AIAdvisor() {
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const ask = () => {
    if (!question.trim()) return
    setLoading(true)
    setReply(null)
    setTimeout(() => {
      setReply(
        `Based on your setup: review nominee allocations in My Legacy, then regenerate and save your Digital Will. For “${question.trim().slice(0, 80)}”, ensure asset percentages are clear and share the will with your advocate or executor when ready.`,
      )
      setLoading(false)
      toast('Advisor response ready', 'success')
    }, 900)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}
        >
          <Sparkles size={12} /> AI Advisor
        </div>
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Legacy guidance
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Get practical recommendations for securing your vault — without changing how Legacy Vault works.
        </p>
      </div>

      <Card hover={false} className="mb-8">
        <label className="text-xs font-medium text-slate-600 mb-2 block">Ask the advisor</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MessageCircle size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask()}
              placeholder="e.g. How should I set permissions for crypto?"
              className="input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm border"
              style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
            />
          </div>
          <Button onClick={ask} disabled={loading}>
            {loading ? 'Thinking…' : 'Ask'}
          </Button>
        </div>
        {loading && (
          <div className="mt-4 space-y-2">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
            <div className="skeleton h-3 w-2/3" />
          </div>
        )}
        {reply && !loading && (
          <div
            className="mt-4 p-4 rounded-xl text-sm text-slate-600 leading-relaxed fade-in-up"
            style={{ background: 'rgba(26,143,143,0.06)', border: '1px solid rgba(26,143,143,0.1)' }}
          >
            {reply}
          </div>
        )}
      </Card>

      <h2 className="text-lg font-semibold text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        Recommended actions
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {tips.map(tip => (
          <Card key={tip.title}>
            <div className="flex gap-3">
              <div className="p-2 rounded-lg h-fit" style={{ background: 'rgba(212,167,44,0.12)', color: '#d4a72c' }}>
                <Lightbulb size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">{tip.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{tip.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/digital-will">
          <Button>Generate Digital Will <ArrowRight size={14} /></Button>
        </Link>
        <Link to="/my-legacy">
          <Button variant="secondary">Manage nominees</Button>
        </Link>
      </div>
    </div>
  )
}
