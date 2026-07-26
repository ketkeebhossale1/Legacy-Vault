import { useEffect, useRef, useState } from 'react'
import {
  FileText, Sparkles, Save, Share2, Mail, Loader2, Lock,
  UserPlus, ShieldCheck, Upload, CheckCircle2, X, AlertCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlan } from '../hooks/usePlan'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../context/ToastContext'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../redux/store'
import { fetchWillRequest, saveWillRequest } from '../redux/actions/willActions'
import { fetchNomineesRequest } from '../redux/actions/nomineeActions'
import api from '../services/api'

// ─── Step indicator ────────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, label: 'Add Nominee'          },
  { num: 2, label: 'Generate & Save Will' },
  { num: 3, label: 'Health Certificate'   },
  { num: 4, label: 'Share with Advocate'  },
]

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const done    = current > s.num
        const active  = current === s.num
        return (
          <div key={s.num} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: done ? '#16a34a' : active ? '#7c3aed' : 'rgba(100,116,139,0.15)',
                  color:      done || active ? '#fff' : '#94a3b8',
                }}
              >
                {done ? <CheckCircle2 size={15} /> : s.num}
              </div>
              <span className="text-[10px] font-medium whitespace-nowrap"
                style={{ color: done ? '#16a34a' : active ? '#7c3aed' : '#94a3b8' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-10 h-0.5 mx-1 mb-4 rounded-full shrink-0 transition-all"
                style={{ background: done ? '#16a34a' : 'rgba(100,116,139,0.15)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Gate card ─────────────────────────────────────────────────────────────────
function GateCard({ icon: Icon, title, body, action }: {
  icon: typeof UserPlus; title: string; body: string; action: React.ReactNode
}) {
  return (
    <Card hover={false} className="text-center py-16 fade-in-up">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
        <Icon size={28} />
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{body}</p>
      {action}
    </Card>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function DigitalWill() {
  const navigate          = useNavigate()
  const { canShareWill }  = usePlan()
  const dispatch          = useDispatch<AppDispatch>()
  const { toast }         = useToast()

  const { text: remoteText, saved: remoteSaved, sharedWith: remoteSharedWith } =
    useSelector((state: RootState) => state.will)
  const nominees  = useSelector((state: RootState) => state.nominees.items ?? [])
  const executors = nominees.filter(n => n.isExecutor)

  const [willText,      setWillText]      = useState<string | null>(null)
  const [saved,         setSaved]         = useState(false)
  const [advocateEmail, setAdvocateEmail] = useState('')
  const [sharedWith,    setSharedWith]    = useState<string[]>([])
  const [generating,    setGenerating]    = useState(false)
  const [sharing,       setSharing]       = useState(false)

  // certificate state
  const [certFile,      setCertFile]      = useState<File | null>(null)
  const [certUploaded,  setCertUploaded]  = useState(false)
  const [certName,      setCertName]      = useState<string | null>(null)
  const [uploading,     setUploading]     = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasNominees  = nominees.filter(n => !n.isExecutor).length > 0

  useEffect(() => {
    dispatch(fetchNomineesRequest())
    dispatch(fetchWillRequest())
  }, [dispatch])

  useEffect(() => {
    if (remoteText !== null) {
      setWillText(remoteText)
      setSaved(remoteSaved)
      setSharedWith(remoteSharedWith)
    }
  }, [remoteText, remoteSaved, remoteSharedWith])

  // Load certificate status from will API response stored in redux or fetch fresh
  useEffect(() => {
    api.get('/will').then(res => {
      const data = res.data?.data
      if (data?.certificateFile) {
        setCertUploaded(true)
        setCertName(data.certificateFile)
      }
    }).catch(() => {})
  }, [])

  // Derive current step
  const currentStep = !hasNominees ? 1
    : (!willText || !saved)        ? 2
    : !certUploaded                ? 3
    : 4

  // ── Actions ──────────────────────────────────────────────────────────────────

  const generateWill = async () => {
    setGenerating(true)
    try {
      const res  = await api.post('/will/generate')
      const text: string = res.data.data.text
      setWillText(text)
      setSaved(false)
      dispatch(saveWillRequest({ text, saved: false, sharedWith: [] }))
      toast('Will generated — review and edit before saving', 'success')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast(msg || 'Failed to generate will. Please try again.', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const saveWill = () => {
    if (!willText?.trim()) { toast('Generate a will before saving', 'error'); return }
    setSaved(true)
    dispatch(saveWillRequest({ text: willText!, saved: true, sharedWith }))
    toast('Digital will saved successfully', 'success')
  }

  const handleCertFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast('Only PDF, JPG, PNG, or WEBP files are accepted', 'error')
      e.target.value = ''
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast('Certificate must be under 10 MB', 'error')
      e.target.value = ''
      return
    }
    setCertFile(file)
  }

  const removeCertFile = () => {
    setCertFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadCertificate = async () => {
    if (!certFile) { toast('Please select your health certificate file', 'error'); return }
    setUploading(true)
    try {
      const form = new FormData()
      form.append('certificate', certFile)
      const res = await api.post('/will/certificate', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const data = res.data?.data
      setCertUploaded(true)
      setCertName(data?.certificateFile ?? certFile.name)
      setCertFile(null)
      toast('Health certificate uploaded successfully', 'success')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast(msg || 'Failed to upload certificate. Please try again.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const shareWill = async () => {
    if (!willText) return
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!advocateEmail.trim() || !emailRe.test(advocateEmail.trim())) {
      toast('Enter a valid advocate email', 'error')
      return
    }
    setSharing(true)
    try {
      await api.post('/advocate/share', { email: advocateEmail.trim() })
      const next = [...new Set([...sharedWith, advocateEmail.trim()])]
      setSharedWith(next)
      setAdvocateEmail('')
      toast(`Will sent to ${advocateEmail.trim()}`, 'success')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast(msg || 'Failed to share will. Please try again.', 'error')
    } finally {
      setSharing(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Digital Will
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Complete all four steps to finalise and share your digital will.
        </p>
      </div>

      <StepBar current={currentStep} />

      {/* ── STEP 1: No nominees ── */}
      {currentStep === 1 && (
        <div className="space-y-4 fade-in-up">
          <Card hover={false} className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
              <UserPlus size={28} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Add a nominee first
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Your will is built from your nominees. Add at least one nominee before generating your will.
              You can also add an executor to manage the will.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button onClick={() => navigate('/my-legacy')}
                style={{ background: 'linear-gradient(135deg,#1a8f8f,#2db5b5)' }}>
                <UserPlus size={15} /> Add Nominee
              </Button>
              <Button onClick={() => navigate('/my-legacy?tab=executor')} variant="secondary">
                <UserPlus size={15} /> Add Executor
              </Button>
            </div>
          </Card>

          {/* Show existing counts even if not enough */}
          {(nominees.length > 0) && (
            <div className="flex gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl flex items-center gap-3"
                style={{ background: 'rgba(26,143,143,0.06)', border: '1px solid rgba(26,143,143,0.12)' }}>
                <UserPlus size={16} style={{ color: '#1a8f8f' }} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">{nominees.filter(n => !n.isExecutor).length} Nominee{nominees.filter(n => !n.isExecutor).length !== 1 ? 's' : ''}</p>
                  <p className="text-xs text-slate-400">Added so far</p>
                </div>
              </div>
              <div className="flex-1 px-4 py-3 rounded-xl flex items-center gap-3"
                style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)' }}>
                <UserPlus size={16} style={{ color: '#7c3aed' }} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">{executors.length} Executor{executors.length !== 1 ? 's' : ''}</p>
                  <p className="text-xs text-slate-400">Added so far</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Generate & Save Will ── */}
      {currentStep === 2 && (
        <div className="space-y-6 fade-in-up">
          {!willText ? (
            <Card hover={false} className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
                <FileText size={28} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Generate your digital will
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                We&apos;ll draft a will from your {nominees.filter(n => !n.isExecutor).length} nominee{nominees.filter(n => !n.isExecutor).length !== 1 ? 's' : ''}
              {executors.length > 0 ? ` and ${executors.length} executor${executors.length !== 1 ? 's' : ''}` : ''}. You can edit every line before saving.
              </p>
              <Button onClick={generateWill} disabled={generating}>
                {generating
                  ? <><Loader2 size={15} className="animate-spin" /> Generating…</>
                  : <><Sparkles size={15} /> Generate Will</>}
              </Button>
            </Card>
          ) : (
            <Card hover={false}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} style={{ color: '#1a8f8f' }} />
                  <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Editable Digital Will
                  </h2>
                </div>
                <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={generateWill} disabled={generating}>
                  {generating
                    ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
                    : <><Sparkles size={13} /> Regenerate</>}
                </Button>
              </div>
              <textarea
                value={willText}
                onChange={e => { setWillText(e.target.value); setSaved(false) }}
                rows={18}
                className="input-field w-full px-4 py-3 rounded-xl text-sm border resize-y leading-relaxed font-mono"
                style={{ borderColor: '#e8ebf0', background: '#fafbfc', minHeight: 320 }}
              />
              {!saved && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle size={13} style={{ color: '#d97706' }} />
                  <p className="text-xs text-amber-700">Unsaved — save your will to proceed to the next step.</p>
                </div>
              )}
              <div className="mt-4">
                <Button onClick={saveWill}>
                  <Save size={15} /> Save Will
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── STEP 3: Health Certificate ── */}
      {currentStep === 3 && (
        <div className="space-y-6 fade-in-up">
          {/* Will saved — show as readonly summary */}
          <div className="px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)' }}>
            <CheckCircle2 size={16} style={{ color: '#16a34a' }} className="shrink-0" />
            <p className="text-sm text-slate-700">Digital will saved. Now upload your health certificate.</p>
          </div>

          <Card hover={false} className="space-y-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} style={{ color: '#1a8f8f' }} />
              <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Health Certificate
              </h2>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(225,29,72,0.08)', color: '#e11d48' }}>Required</span>
            </div>

            <div className="px-4 py-3 rounded-xl text-sm text-slate-600 leading-relaxed"
              style={{ background: 'rgba(26,143,143,0.04)', border: '1px solid rgba(26,143,143,0.08)' }}>
              <p className="font-semibold text-slate-700 mb-1">What is this?</p>
              <p>A health certificate is a document signed by a registered medical doctor confirming that you are
                of sound mind and capable of making legal decisions at the time of creating this will.
                This protects the validity of your will from future legal challenges.</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Upload Doctor&apos;s Certificate <span className="text-red-500">*</span>
              </p>
              <p className="text-xs text-slate-400 mb-3">PDF, JPG, PNG, or WEBP · Max 10 MB</p>

              {certFile ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <FileText size={18} style={{ color: '#16a34a' }} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{certFile.name}</p>
                    <p className="text-xs text-slate-400">{(certFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={removeCertFile} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2 py-10 rounded-xl border-2 border-dashed transition-colors hover:border-teal-400"
                  style={{ borderColor: 'rgba(26,143,143,0.25)', background: 'rgba(26,143,143,0.02)' }}
                >
                  <Upload size={22} style={{ color: '#1a8f8f' }} />
                  <p className="text-sm font-medium text-slate-600">Click to upload certificate</p>
                  <p className="text-xs text-slate-400">PDF, JPG, PNG or WEBP · Max 10 MB</p>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleCertFile}
              />
            </div>

            <Button
              className="w-full justify-center"
              style={{
                background: certFile ? 'linear-gradient(135deg,#1a8f8f,#2db5b5)' : 'rgba(26,143,143,0.25)',
                cursor: certFile ? 'pointer' : 'not-allowed',
              }}
              onClick={uploadCertificate}
              disabled={uploading || !certFile}
            >
              {uploading
                ? <><Loader2 size={15} className="animate-spin" /> Uploading…</>
                : <><ShieldCheck size={15} /> Submit Health Certificate</>}
            </Button>
          </Card>
        </div>
      )}

      {/* ── STEP 4: Share with Advocate ── */}
      {currentStep === 4 && (
        <div className="space-y-6 fade-in-up">
          {/* Summary pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: `${nominees.filter(n => !n.isExecutor).length} nominee${nominees.filter(n => !n.isExecutor).length !== 1 ? 's' : ''}`, color: '#1a8f8f' },
              { label: `${executors.length} executor${executors.length !== 1 ? 's' : ''}`, color: '#7c3aed' },
              { label: 'Will saved', color: '#16a34a' },
              { label: 'Certificate verified', color: '#d97706' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: `${p.color}14`, color: p.color }}>
                <CheckCircle2 size={11} /> {p.label}
              </div>
            ))}
          </div>

          {/* Will — view only */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} style={{ color: '#1a8f8f' }} />
                <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Digital Will
                </h2>
              </div>
              <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => setSaved(false)}>
                <Sparkles size={13} /> Edit Will
              </Button>
            </div>
            <pre className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-mono px-4 py-3 rounded-xl overflow-auto max-h-64"
              style={{ background: '#fafbfc', border: '1px solid #e8ebf0' }}>
              {willText}
            </pre>
          </Card>

          {/* Certificate badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)' }}>
            <ShieldCheck size={16} style={{ color: '#7c3aed' }} className="shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-700">Health Certificate Verified</p>
              {certName && <p className="text-xs text-slate-400 truncate">{certName}</p>}
            </div>
          </div>

          {/* Share with Advocate */}
          <Card hover={false} className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Share2 size={16} style={{ color: canShareWill ? '#1a8f8f' : '#94a3b8' }} />
              <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Share with Advocate
              </h2>
              {!canShareWill && (
                <span className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                  <Lock size={10} /> Premium
                </span>
              )}
            </div>

            {!canShareWill ? (
              <div className="text-center py-6">
                <Lock size={24} className="mx-auto mb-3" style={{ color: '#7c3aed' }} />
                <p className="text-sm text-slate-600 mb-1">Share Will with Advocate is a Premium feature.</p>
                <p className="text-xs text-slate-400 mb-4">Upgrade to send your will as a PDF to your advocate.</p>
                <Button onClick={() => navigate('/subscription')}
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#9f67fa)' }}>
                  Upgrade to Premium
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 max-w-sm">
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
                <Button variant="secondary" onClick={shareWill} disabled={sharing}>
                  {sharing
                    ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
                    : <><Share2 size={14} /> Share Will</>}
                </Button>
                {sharedWith.length > 0 && (
                  <p className="text-xs text-slate-500 mt-3">Sent to: {sharedWith.join(', ')}</p>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
