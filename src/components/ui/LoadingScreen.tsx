import { Lock } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{ background: 'var(--lv-bg-gradient)' }}
    >
      <div
        className="pulse-lock p-4 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #0f5555, #1a8f8f)',
          boxShadow: '0 12px 36px rgba(26,143,143,0.3)',
        }}
      >
        <Lock size={28} color="white" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="font-semibold text-slate-800 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
          Legacy Vault
        </p>
        <p className="text-xs text-slate-400 mt-1">Loading your secure space…</p>
      </div>
      <div className="w-40 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(26,143,143,0.12)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: '40%',
            background: 'linear-gradient(90deg, #1a8f8f, #2aacac)',
            animation: 'shimmer 1.2s ease-in-out infinite',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </div>
  )
}
