import { useState } from 'react'
import { Shield, Key, Lock, FileCheck, Eye, ChevronDown, ChevronUp } from 'lucide-react'

const layers = [
  {
    icon: <Eye size={20} />,
    num: '01',
    title: 'Trigger',
    summary: 'Nothing happens unless a nominee initiates the process.',
    detail: 'The vault never auto-opens. A nominee must explicitly request access, supply their identity, and submit proof of death. The owner receives a notification at every stage of the process via email and SMS (if configured), so a living owner always knows something is in motion.',
  },
  {
    icon: <Shield size={20} />,
    num: '02',
    title: 'Fraud Resistance',
    summary: 'Independent corroboration + a 72-hour cooling window.',
    detail: "At least 2 of 3 independent nominees must separately confirm the event before the process advances. After that, a 72-hour cooling window opens during which the vault owner can cancel at any time with one click. This defeats single-actor fraud, collusion between one nominee and a third party, and accidental triggers.",
  },
  {
    icon: <Lock size={20} />,
    num: '03',
    title: 'Access Control',
    summary: 'Granular per-asset, per-nominee permissions.',
    detail: "Each asset has its own permission list. Nominees only see the specific assets they were explicitly granted access to — nothing else in the vault. The permission matrix is set by the owner while alive and cannot be changed by nominees or third parties.",
  },
  {
    icon: <Key size={20} />,
    num: '04',
    title: 'Key Security',
    summary: '2-of-3 Shamir Secret Sharing for the decryption key.',
    detail: "The vault's master decryption key is split into 3 shares using Shamir's Secret Sharing algorithm. Each nominee holds one share. Any 2 shares can reconstruct the key; a single share reveals nothing. This means no single person — not even a nominee — can access the vault alone, and Legacy Vault's servers never hold a complete key.",
  },
  {
    icon: <FileCheck size={20} />,
    num: '05',
    title: 'Storage',
    summary: 'Per-asset AES-256 encryption at rest.',
    detail: "Every individual asset is encrypted independently with AES-256-GCM before storage. Even if the database were breached, each asset would require its own decryption key derived from the master key. The master key is never stored on our servers — it exists only during a verified access session and is discarded when the session ends.",
  },
]

const faqs = [
  {
    q: "What stops someone from using a fake death certificate?",
    a: "Three safeguards combine: (1) The corroboration requirement — at least 2 of 3 nominees must independently confirm. Getting two unrelated people to corroborate a false claim is significantly harder. (2) The 72-hour cooling window — if you are alive, you will receive alerts and have time to cancel. (3) An audit trail — every step is timestamped and signed. If fraud is later discovered, the trail supports legal action.",
  },
  {
    q: "What if two key-holders collude?",
    a: "Key sharing defeats single-actor attacks, but two holders can technically reconstruct the key. This is why the corroboration and cooling-window layers come first — collusion still requires passing those checks. Additionally, the vault owner can choose nominees from different social circles (e.g., a family member and a lawyer), making collusion much less likely.",
  },
  {
    q: "How is this different from a password manager?",
    a: "Password managers store credentials for your own use while you're alive. Legacy Vault is designed specifically for the scenario where you are gone: it controls who can access what, enforces verification before releasing anything, splits the decryption key across multiple people, and provides legal-style documentation in the form of a digital will. It is about inheritance, not convenience.",
  },
  {
    q: "Can Legacy Vault staff access my vault?",
    a: "No. The vault's master decryption key is split among your nominees using Shamir's Secret Sharing. Legacy Vault's servers store only encrypted data and key shares. Without two shares contributed by nominees, not even our team can decrypt your assets.",
  },
]

export default function SecurityAbout() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Security & How It Works</h1>
        <p className="text-slate-500 text-sm mt-1">Five layered protections designed so that access is only ever granted when it should be.</p>
      </div>

      {/* 5 layers */}
      <div className="flex flex-col gap-4 mb-10">
        {layers.map((layer, i) => (
          <div key={i} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <span className="text-xs font-bold font-mono" style={{ color: '#d4a72c' }}>{layer.num}</span>
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>{layer.icon}</div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{layer.title}</h3>
                <p className="text-sm font-medium text-slate-600 mb-2">{layer.summary}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{layer.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual flow */}
      <div className="rounded-2xl p-6 mb-10" style={{ background: 'rgba(26,143,143,0.05)', border: '1px solid rgba(26,143,143,0.15)' }}>
        <h2 className="text-lg font-bold text-slate-800 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Protection flow</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {['Nominee trigger', 'Proof submission', '2-of-3 corroboration', '72h cooling window', '2-of-3 key shares', 'Access granted'].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.8)', color: '#157272', border: '1px solid rgba(26,143,143,0.2)' }}>{step}</div>
              {i < arr.length - 1 && <ChevronDown size={12} style={{ color: '#adb5bd', transform: 'rotate(-90deg)' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Common questions</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)' }}>
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,143,143,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="text-sm font-semibold text-slate-800 pr-4">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} style={{ color: '#1a8f8f', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: '#adb5bd', flexShrink: 0 }} />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t" style={{ borderColor: 'rgba(26,143,143,0.08)' }}>
                  <div className="pt-4">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
