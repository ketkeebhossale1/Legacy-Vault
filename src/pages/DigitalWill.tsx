import { useEffect, useState } from 'react'
import { FileText, Sparkles, Save, Download, Share2, Mail } from 'lucide-react'
import { jsPDF } from 'jspdf'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../context/ToastContext'
import { WILL_STORAGE_KEY, mockNominees, NOMINEES_STORAGE_KEY, type Nominee } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function loadNominees(): Nominee[] {
  try {
    const raw = localStorage.getItem(NOMINEES_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Nominee[]
  } catch { /* ignore */ }
  return mockNominees
}

function buildDefaultWill(ownerName: string, nominees: Nominee[]) {
  const lines = [
    'DIGITAL LEGACY WILL',
    `Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`,
    `Owner: ${ownerName}`,
    '',
    '─────────────────────────────────────────',
    'DECLARATION',
    '─────────────────────────────────────────',
    '',
    `I, ${ownerName}, hereby declare this document as my digital will concerning the allocation of my digital and financial assets managed through Legacy Vault.`,
    '',
    '─────────────────────────────────────────',
    'NOMINEE & ASSET ALLOCATIONS',
    '─────────────────────────────────────────',
    '',
  ]

  if (nominees.length === 0) {
    lines.push('No nominees have been configured yet. Please add nominees in My Legacy.')
  } else {
    nominees.forEach((n, i) => {
      lines.push(`${i + 1}. ${n.firstName} ${n.lastName}`)
      lines.push(`   Email: ${n.email}`)
      lines.push(`   Address: ${n.address}`)
      lines.push(`   Asset: ${n.assetName}`)
      lines.push(`   Allocation: ${n.assetPercentage}%`)
      lines.push('')
    })
  }

  lines.push('─────────────────────────────────────────')
  lines.push('EXECUTION')
  lines.push('─────────────────────────────────────────')
  lines.push('')
  lines.push('This will may be shared with an appointed Advocate and/or Executor for legal review and execution.')
  lines.push('This document was prepared digitally via Legacy Vault.')

  return lines.join('\n')
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function DigitalWill() {
  const { user } = useAuth()
  const { toast } = useToast()
  const ownerName = user?.name || 'Demo User'

  const [willText, setWillText] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [advocateEmail, setAdvocateEmail] = useState('')
  const [executorEmail, setExecutorEmail] = useState('')
  const [sharedWith, setSharedWith] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WILL_STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as { text: string; saved: boolean; sharedWith?: string[] }
        setWillText(data.text)
        setSaved(!!data.saved)
        setSharedWith(data.sharedWith || [])
      }
    } catch { /* ignore */ }
  }, [])

  const persist = (text: string, isSaved: boolean, shared: string[]) => {
    localStorage.setItem(
      WILL_STORAGE_KEY,
      JSON.stringify({ text, saved: isSaved, sharedWith: shared, updatedAt: new Date().toISOString() }),
    )
  }

  const generateWill = () => {
    const text = buildDefaultWill(ownerName, loadNominees())
    setWillText(text)
    setSaved(false)
    setSharedWith([])
    persist(text, false, [])
    toast('Digital will generated — you can edit it below', 'success')
  }

  const onEdit = (value: string) => {
    setWillText(value)
    setSaved(false)
  }

  const shareWill = () => {
    if (!willText) return
    const emails: string[] = []
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (advocateEmail.trim()) {
      if (!emailRe.test(advocateEmail.trim())) {
        toast('Enter a valid advocate email', 'error')
        return
      }
      emails.push(advocateEmail.trim())
    }
    if (executorEmail.trim()) {
      if (!emailRe.test(executorEmail.trim())) {
        toast('Enter a valid executor email', 'error')
        return
      }
      emails.push(executorEmail.trim())
    }
    if (emails.length === 0) {
      toast('Enter at least one advocate or executor email', 'error')
      return
    }

    const next = [...new Set([...sharedWith, ...emails])]
    setSharedWith(next)
    if (willText) persist(willText, saved, next)
    setAdvocateEmail('')
    setExecutorEmail('')
    toast(`Will shared with ${emails.join(', ')}`, 'success')
  }

  const saveWill = () => {
    if (!willText?.trim()) {
      toast('Generate a will before saving', 'error')
      return
    }
    setSaved(true)
    persist(willText, true, sharedWith)
    toast('Digital will saved successfully', 'success')
  }

  const downloadPdf = () => {
    if (!willText || !saved) return
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const margin = 48
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2
    const lines = doc.splitTextToSize(willText, pageWidth)
    let y = margin
    const lineHeight = 14
    const pageHeight = doc.internal.pageSize.getHeight() - margin

    doc.setFont('courier', 'normal')
    doc.setFontSize(10)
    lines.forEach((line: string) => {
      if (y > pageHeight) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += lineHeight
    })
    doc.save('LegacyVault_DigitalWill.pdf')
    toast('PDF downloaded', 'success')
  }

  const downloadDocx = () => {
    if (!willText || !saved) return
    const escaped = willText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>')

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>Digital Will</title></head>
        <body style="font-family: Georgia, serif; font-size: 12pt; line-height: 1.6;">
          <pre style="white-space: pre-wrap; font-family: Georgia, serif;">${escaped}</pre>
        </body>
      </html>
    `
    const blob = new Blob(['\ufeff', html], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    downloadBlob('LegacyVault_DigitalWill.docx', blob)
    toast('DOCX downloaded', 'success')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Digital Will
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Generate, edit, share, save, and download your digital will.
        </p>
      </div>

      {/* Step 1 */}
      {!willText && (
        <Card hover={false} className="text-center py-16 fade-in-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}
          >
            <FileText size={28} />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Create your digital will
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            We&apos;ll draft a will from your current nominee allocations. You can edit every line before sharing or saving.
          </p>
          <Button onClick={generateWill}>
            <Sparkles size={15} /> Generate Will
          </Button>
        </Card>
      )}

      {willText && (
        <div className="space-y-6 fade-in-up">
          {/* Step 2 — editable document */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={16} style={{ color: '#1a8f8f' }} />
                <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Editable Digital Will
                </h2>
              </div>
              <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={generateWill}>
                <Sparkles size={13} /> Regenerate
              </Button>
            </div>
            <textarea
              value={willText}
              onChange={e => onEdit(e.target.value)}
              rows={18}
              className="input-field w-full px-4 py-3 rounded-xl text-sm border resize-y leading-relaxed font-mono"
              style={{ borderColor: '#e8ebf0', background: '#fafbfc', minHeight: 320 }}
            />
            {!saved && (
              <p className="text-xs text-amber-700 mt-2">Unsaved changes — click Save Will to enable downloads.</p>
            )}
          </Card>

          {/* Step 3 — share */}
          <Card hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Share2 size={16} style={{ color: '#1a8f8f' }} />
              <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Share with Advocate / Executor
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Mail size={12} /> Advocate email
                </label>
                <input
                  type="email"
                  value={advocateEmail}
                  onChange={e => setAdvocateEmail(e.target.value)}
                  placeholder="advocate@lawfirm.com"
                  className="input-field w-full px-4 py-2.5 rounded-xl text-sm border"
                  style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Mail size={12} /> Executor email
                </label>
                <input
                  type="email"
                  value={executorEmail}
                  onChange={e => setExecutorEmail(e.target.value)}
                  placeholder="executor@example.com"
                  className="input-field w-full px-4 py-2.5 rounded-xl text-sm border"
                  style={{ borderColor: '#e8ebf0', background: '#fafbfc' }}
                />
              </div>
            </div>
            <Button variant="secondary" onClick={shareWill}>
              <Share2 size={14} /> Share Will
            </Button>
            {sharedWith.length > 0 && (
              <p className="text-xs text-slate-500 mt-3">
                Shared with: {sharedWith.join(', ')}
              </p>
            )}
          </Card>

          {/* Step 4 — save */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={saveWill}>
              <Save size={15} /> Save Will
            </Button>
          </div>

          {/* Step 5 — download after save */}
          {saved && (
            <Card hover={false} className="fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <Download size={16} style={{ color: '#1a8f8f' }} />
                <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Download Will
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">Your will is saved. Download a copy for your records.</p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={downloadPdf}>
                  <Download size={14} /> Download PDF
                </Button>
                <Button variant="secondary" onClick={downloadDocx}>
                  <Download size={14} /> Download DOCX
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
