import { useState } from 'react'
import { Send } from 'lucide-react'
import Button from '../components/ui/Button'
import { useToast } from '../context/ToastContext'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { toast } = useToast()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    toast('Message sent — we will reply soon', 'success')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="fade-in-up max-w-lg">
      <h1 className="text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Contact
      </h1>
      <p className="text-sm text-slate-500 mb-8">Questions about Legacy Vault? Send us a note.</p>

      <form
        onSubmit={submit}
        className="glass-strong rounded-2xl p-6 md:p-8 flex flex-col gap-4"
        style={{ boxShadow: 'var(--lv-shadow-lg)' }}
      >
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Name</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="input-field w-full px-4 py-3 rounded-xl text-sm border"
            style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-field w-full px-4 py-3 rounded-xl text-sm border"
            style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Message</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="input-field w-full px-4 py-3 rounded-xl text-sm border resize-none"
            style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
          />
        </div>
        <Button type="submit" className="self-start">
          <Send size={14} /> Send message
        </Button>
      </form>
    </div>
  )
}
