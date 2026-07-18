import { useState, useEffect } from 'react'
import { Upload, Users, Clock, Key, Unlock, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react'
import { mockNominees, mockAssets, initialPermissions } from '../data/mockData'

const steps = [
  { id: 1, label: 'Submit Proof', icon: <Upload size={16} /> },
  { id: 2, label: 'Corroboration', icon: <Users size={16} /> },
  { id: 3, label: 'Cooling Window', icon: <Clock size={16} /> },
  { id: 4, label: 'Key Contribution', icon: <Key size={16} /> },
  { id: 5, label: 'Access Granted', icon: <Unlock size={16} /> },
]

const COOLING_DEMO = 60

export default function VerificationWizard() {
  const [step, setStep] = useState(1)
  const [selectedNominee, setSelectedNominee] = useState(mockNominees[0].id)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [obituaryLink, setObitLink] = useState('')
  const [corroborations, setCorroborations] = useState<Set<string>>(new Set())
  const [coolingSecondsLeft, setCoolingSecondsLeft] = useState(COOLING_DEMO)
  const [coolingActive, setCoolingActive] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [keyShare1, setKeyShare1] = useState('')
  const [keyShare2, setKeyShare2] = useState('')

  useEffect(() => {
    if (step === 3 && coolingActive && !cancelled) {
      const t = setInterval(() => {
        setCoolingSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(t)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(t)
    }
  }, [step, coolingActive, cancelled])

  const nominee = mockNominees.find(n => n.id === selectedNominee)!
  const grantedAssets = mockAssets.filter(a => initialPermissions[a.id]?.[selectedNominee])
  const progress = (step - 1) / (steps.length - 1) * 100
  const ringCircumference = 220
  const ringOffset = ringCircumference * (1 - coolingSecondsLeft / COOLING_DEMO)

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}h ${m}m remaining`
    if (m > 0) return `${m}m ${sec}s remaining`
    return `${sec}s remaining`
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Nominee Verification</h1>
        <p className="text-slate-500 text-sm mt-1">A 5-step fraud-resistant process that ensures only verified nominees can access the vault.</p>
      </div>

      {/* Progress stepper */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between mb-4 relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 mx-8" style={{ background: '#e9ecef', zIndex: 0 }}>
            <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #1a8f8f, #2aacac)' }} />
          </div>
          {steps.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-1.5 relative z-10" style={{ flex: 1 }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300"
                style={s.id < step
                  ? { background: '#1a8f8f', color: 'white' }
                  : s.id === step
                    ? { background: 'linear-gradient(135deg, #1a8f8f, #2aacac)', color: 'white', boxShadow: '0 0 0 3px rgba(26,143,143,0.2)' }
                    : { background: 'white', color: '#adb5bd', border: '2px solid #dee2e6' }
                }
              >
                {s.id < step ? <CheckCircle size={14} /> : s.id === step ? s.icon : <span className="text-xs font-bold">{s.id}</span>}
              </div>
              <span className="text-xs font-medium hidden md:block" style={{ color: s.id <= step ? '#1a8f8f' : '#adb5bd' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl p-8 fade-in-up" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(26,143,143,0.12)', backdropFilter: 'blur(16px)', minHeight: 360 }}>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Step 1: Submit Proof</h2>
            <p className="text-slate-500 text-sm mb-6">Select who you are and upload evidence of passing.</p>

            <div className="mb-5">
              <label className="text-xs font-medium text-slate-600 mb-2 block">I am...</label>
              <div className="flex flex-col gap-2">
                {mockNominees.map(n => (
                  <label key={n.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={selectedNominee === n.id ? { background: 'rgba(26,143,143,0.1)', border: '1.5px solid rgba(26,143,143,0.4)' } : { background: 'rgba(0,0,0,0.03)', border: '1.5px solid transparent' }}>
                    <input type="radio" name="nominee" value={n.id} checked={selectedNominee === n.id} onChange={() => setSelectedNominee(n.id)} className="accent-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{n.name} <span className="text-xs text-slate-400">({n.relation})</span></p>
                      <p className="text-xs text-slate-400">{n.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-xs font-medium text-slate-600 mb-2 block">Upload Death Certificate / Obituary</label>
              <label className="flex flex-col items-center gap-3 p-6 rounded-xl cursor-pointer transition-all" style={{ background: uploadedFile ? 'rgba(26,143,143,0.08)' : 'rgba(0,0,0,0.03)', border: `2px dashed ${uploadedFile ? 'rgba(26,143,143,0.5)' : '#dee2e6'}` }}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => setUploadedFile(e.target.files?.[0]?.name || null)} />
                {uploadedFile ? (
                  <div className="flex items-center gap-2" style={{ color: '#1a8f8f' }}>
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">{uploadedFile}</span>
                  </div>
                ) : (
                  <>
                    <Upload size={24} style={{ color: '#adb5bd' }} />
                    <p className="text-sm text-slate-400 text-center">Click to upload PDF, JPG, or PNG<br /><span className="text-xs">Death certificate, hospital document, or obituary</span></p>
                  </>
                )}
              </label>
            </div>

            <div className="mb-6">
              <label className="text-xs font-medium text-slate-600 mb-2 block">Or link to obituary / news article</label>
              <input value={obituaryLink} onChange={e => setObitLink(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none" style={{ borderColor: '#dee2e6', background: '#fafbfc' }} onFocus={e => (e.target.style.borderColor = '#1a8f8f')} onBlur={e => (e.target.style.borderColor = '#dee2e6')} />
            </div>

            <button onClick={() => setStep(2)} disabled={!uploadedFile && !obituaryLink.trim()} className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
              Submit &amp; Proceed <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Step 2: Independent Corroboration</h2>
            <p className="text-slate-500 text-sm mb-6">At least 2 of 3 nominees must independently confirm before we proceed.</p>

            <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(26,143,143,0.06)', border: '1px solid rgba(26,143,143,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-sm font-medium text-slate-700">Corroboration progress</div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: corroborations.size >= 2 ? 'rgba(40,167,69,0.12)' : 'rgba(255,165,0,0.12)', color: corroborations.size >= 2 ? '#1a7a3f' : '#d4870a' }}>
                  {corroborations.size}/2 required
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e9ecef' }}>
                <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${(corroborations.size / 2) * 100}%`, background: corroborations.size >= 2 ? '#1a8f8f' : '#d4a72c' }} />
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {mockNominees.map(n => {
                const isSelected = n.id === selectedNominee
                const confirmed = corroborations.has(n.id)
                return (
                  <div key={n.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: `1.5px solid ${confirmed ? 'rgba(26,143,143,0.4)' : '#dee2e6'}` }}>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{n.name} <span className="text-xs text-slate-400">({n.relation})</span></p>
                      {isSelected && <p className="text-xs" style={{ color: '#1a8f8f' }}>Requesting access</p>}
                    </div>
                    {isSelected ? (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>Requestor</span>
                    ) : confirmed ? (
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#1a7a3f' }}><CheckCircle size={14} /> Confirmed</span>
                    ) : (
                      <button onClick={() => setCorroborations(prev => new Set([...prev, n.id]))} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f', border: '1px solid rgba(26,143,143,0.25)' }}>
                        Confirm (simulate)
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <button onClick={() => { setStep(3); setCoolingActive(true) }} disabled={corroborations.size < 2} className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
              Open Cooling Window <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Step 3: Cooling-Off Window</h2>
            <p className="text-slate-500 text-sm mb-8 max-w-md">This window gives the account owner a chance to cancel if they're still alive. In production this is 72 hours — demo runs for 60 seconds.</p>

            {cancelled ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="p-5 rounded-full" style={{ background: 'rgba(220,53,69,0.1)' }}>
                  <AlertTriangle size={36} style={{ color: '#dc3545' }} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Request Cancelled</h3>
                <p className="text-sm text-slate-500 max-w-xs">The vault owner confirmed they are alive. This request has been logged and terminated.</p>
                <button onClick={() => { setStep(1); setCancelled(false); setCoolingSecondsLeft(COOLING_DEMO); setCorroborations(new Set()) }} className="mt-2 px-5 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: '#dee2e6', color: '#495057' }}>
                  Start Over
                </button>
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <svg width={90} height={90} className="-rotate-90">
                    <circle cx={45} cy={45} r={35} fill="none" stroke="#e9ecef" strokeWidth={6} />
                    <circle cx={45} cy={45} r={35} fill="none" stroke="#1a8f8f" strokeWidth={6} strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Clock size={18} style={{ color: '#1a8f8f' }} />
                  </div>
                </div>

                <p className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {coolingSecondsLeft > 0 ? formatTime(coolingSecondsLeft) : 'Window expired'}
                </p>
                <p className="text-xs text-slate-400 mb-8">{coolingSecondsLeft > 0 ? 'Waiting for cooling-off window to close...' : 'The cooling window has passed. Proceeding to key contribution.'}</p>

                {coolingSecondsLeft > 0 && (
                  <button onClick={() => setCancelled(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold mb-4 transition-all" style={{ background: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1.5px solid rgba(220,53,69,0.3)' }}>
                    <AlertTriangle size={15} /> Cancel Request — I'm Alive
                  </button>
                )}

                {coolingSecondsLeft === 0 && (
                  <button onClick={() => setStep(4)} className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
                    Proceed to Key Contribution <ChevronRight size={15} />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Step 4: Key Contribution</h2>
            <p className="text-slate-500 text-sm mb-6">Two of the three nominees must enter their key shares to reconstruct the decryption key.</p>

            <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(212,167,44,0.08)', border: '1px solid rgba(212,167,44,0.25)' }}>
              <p className="text-xs text-slate-600">Each nominee received their key share when they were registered. Enter any 2 of 3 shares below. In production, each share is a 128-character hex string — demo accepts any non-empty input.</p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              {[
                { label: 'Share A (Priya — Mother)', placeholder: 'Enter Share A...', value: keyShare1, setter: setKeyShare1 },
                { label: 'Share B (Arjun — Father)', placeholder: 'Enter Share B...', value: keyShare2, setter: setKeyShare2 },
              ].map((s, i) => (
                <div key={i}>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">{s.label}</label>
                  <input value={s.value} onChange={e => s.setter(e.target.value)} placeholder={s.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none font-mono"
                    style={{ borderColor: s.value ? 'rgba(26,143,143,0.5)' : '#dee2e6', background: '#fafbfc' }}
                    onFocus={e => (e.target.style.borderColor = '#1a8f8f')}
                    onBlur={e => (e.target.style.borderColor = s.value ? 'rgba(26,143,143,0.5)' : '#dee2e6')}
                  />
                </div>
              ))}
            </div>

            <button onClick={() => setStep(5)} disabled={!keyShare1.trim() || !keyShare2.trim()} className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
              Reconstruct Key &amp; Grant Access <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="p-4 rounded-full mb-4" style={{ background: 'rgba(26,143,143,0.1)' }}>
                <Unlock size={32} style={{ color: '#1a8f8f' }} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Access Granted</h2>
              <p className="text-slate-500 text-sm">Showing only assets approved for <strong>{nominee.name}</strong>. Nothing else is visible.</p>
            </div>

            {grantedAssets.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No assets were granted to this nominee.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {grantedAssets.map(asset => (
                  <div key={asset.id} className="p-4 rounded-xl flex items-start gap-4" style={{ background: 'rgba(26,143,143,0.06)', border: '1px solid rgba(26,143,143,0.18)' }}>
                    <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(26,143,143,0.15)', color: '#1a8f8f' }}>
                      <Unlock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{asset.name}</p>
                      <p className="text-xs text-slate-400 mb-1">{asset.category}</p>
                      {asset.username && <p className="text-xs font-mono text-slate-500">{asset.username}</p>}
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{asset.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-3 rounded-xl text-xs text-slate-400" style={{ background: 'rgba(0,0,0,0.03)' }}>
              This access session is timestamped and logged. All asset views are part of the permanent audit trail.
            </div>

            <button onClick={() => { setStep(1); setCoolingSecondsLeft(COOLING_DEMO); setCoolingActive(false); setCorroborations(new Set()); setUploadedFile(null); setObitLink(''); setKeyShare1(''); setKeyShare2('') }} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: '#dee2e6', color: '#495057' }}>
              Reset Demo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
