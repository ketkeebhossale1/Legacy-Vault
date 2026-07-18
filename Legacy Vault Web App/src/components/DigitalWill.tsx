import { useState } from 'react'
import { FileText, Sparkles, Download, ChevronRight } from 'lucide-react'
import { mockAssets, mockNominees, initialPermissions } from '../data/mockData'

const defaultWish = `I want my mother Priya to handle my Google Drive and personal photos — she can keep them or share them with family as she sees fit.

My HDFC bank account and LIC policy should be handled by both my parents together.

My Instagram account should be permanently deleted — I don't want it memorialized.

My crypto wallet instructions are in the physical safe. My father and mother should retrieve the seed phrase together.

My AWS account should be cancelled and all running instances shut down by my sister Kavya.`

export default function DigitalWill() {
  const [wishes, setWishes] = useState(defaultWish)
  const [generatedWill, setGeneratedWill] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const generateWill = () => {
    setGenerating(true)
    setTimeout(() => {
      const lines: string[] = []
      lines.push('DIGITAL LEGACY WILL')
      lines.push('Generated: ' + new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }))
      lines.push('Owner: Raj Sharma  |  Vault ID: LV-2024-88419')
      lines.push('')
      lines.push('─────────────────────────────────────────')
      lines.push('STRUCTURED ASSET INSTRUCTIONS')
      lines.push('─────────────────────────────────────────')
      lines.push('')

      mockAssets.forEach(asset => {
        const grantedNominees = mockNominees.filter(n => initialPermissions[asset.id]?.[n.id])
        lines.push(`▸ ${asset.name.toUpperCase()} (${asset.category})`)
        if (grantedNominees.length > 0) {
          lines.push(`  Access granted to: ${grantedNominees.map(n => `${n.name} (${n.relation})`).join(', ')}`)
        } else {
          lines.push(`  Action: DELETE — no nominee access granted`)
        }
        if (asset.notes) {
          lines.push(`  Notes: ${asset.notes}`)
        }
        lines.push('')
      })

      lines.push('─────────────────────────────────────────')
      lines.push('ADDITIONAL WISHES (from plain-language input)')
      lines.push('─────────────────────────────────────────')
      lines.push('')
      lines.push(wishes)
      lines.push('')
      lines.push('─────────────────────────────────────────')
      lines.push('VERIFICATION REQUIREMENTS')
      lines.push('─────────────────────────────────────────')
      lines.push('')
      lines.push('1. Death certificate or obituary link must be submitted by a nominee.')
      lines.push('2. At least 2 of 3 nominees must corroborate within 7 days.')
      lines.push('3. A 72-hour cooling-off window will open for owner cancellation.')
      lines.push('4. Two key-share holders must contribute shares to reconstruct the decryption key.')
      lines.push('')
      lines.push('This document was digitally signed and timestamped by Legacy Vault.')

      setGeneratedWill(lines.join('\n'))
      setGenerating(false)
    }, 1800)
  }

  const exportPDF = () => {
    if (!generatedWill) return
    const blob = new Blob([generatedWill], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'LegacyVault_DigitalWill.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Digital Will Builder</h1>
        <p className="text-slate-500 text-sm mt-1">Write your wishes in plain language. We'll structure them into a formal instruction set for your nominees.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} style={{ color: '#1a8f8f' }} />
            <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your wishes in plain language</h2>
          </div>
          <p className="text-xs text-slate-400 mb-4">Write naturally — who should get what, what should be deleted, any special instructions. Be as specific as you like.</p>
          <textarea
            value={wishes}
            onChange={e => setWishes(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none leading-relaxed"
            style={{ borderColor: '#dee2e6', background: '#fafbfc', fontFamily: "'Inter', sans-serif" }}
            onFocus={e => (e.target.style.borderColor = '#1a8f8f')}
            onBlur={e => (e.target.style.borderColor = '#dee2e6')}
          />
          <button
            onClick={generateWill}
            disabled={generating || !wishes.trim()}
            className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
                Generating...
              </>
            ) : (
              <><Sparkles size={15} /> Generate Digital Will</>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: '#d4a72c' }} />
              <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Generated Will</h2>
            </div>
            {generatedWill && (
              <button
                onClick={exportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f', border: '1px solid rgba(26,143,143,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,143,143,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(26,143,143,0.1)')}
              >
                <Download size={12} /> Export
              </button>
            )}
          </div>

          {!generatedWill && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 rounded-xl" style={{ background: 'rgba(26,143,143,0.04)', border: '2px dashed rgba(26,143,143,0.15)' }}>
              <FileText size={32} style={{ color: '#adb5bd', marginBottom: 12 }} />
              <p className="text-sm text-slate-400">Your structured will appears here after generation.</p>
              <p className="text-xs text-slate-300 mt-1">It maps your wishes to the permission matrix.</p>
            </div>
          )}

          {generatedWill && (
            <pre className="flex-1 text-xs leading-relaxed overflow-auto rounded-xl p-4 whitespace-pre-wrap" style={{ background: '#f8faf9', fontFamily: "'Inter', monospace", color: '#2a3535', lineHeight: 1.7, maxHeight: 420 }}>
              {generatedWill}
            </pre>
          )}
        </div>
      </div>

      {/* Asset summary */}
      <div className="mt-6 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(26,143,143,0.08)' }}>
        <h3 className="font-semibold text-slate-700 mb-4 text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Current asset disposition (from Nominees page)</h3>
        <div className="flex flex-col gap-2">
          {mockAssets.map(asset => {
            const grantedNominees = mockNominees.filter(n => initialPermissions[asset.id]?.[n.id])
            return (
              <div key={asset.id} className="flex items-center gap-3 text-sm">
                <ChevronRight size={12} style={{ color: '#1a8f8f', flexShrink: 0 }} />
                <span className="font-medium text-slate-700" style={{ minWidth: 200 }}>{asset.name}</span>
                {grantedNominees.length > 0
                  ? <span className="text-slate-400 text-xs">→ {grantedNominees.map(n => n.name.split(' ')[0]).join(', ')}</span>
                  : <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(220,53,69,0.08)', color: '#dc3545' }}>Delete</span>
                }
              </div>
            )
          })}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
