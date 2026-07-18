import { useState } from 'react'
import { Shield, CreditCard, Cloud, Share2, Bitcoin, Plus, X, AlertTriangle, Clock, Lock } from 'lucide-react'
import { mockAssets, type Asset, type Category, type Sensitivity } from '../data/mockData'

const categoryIcons: Record<string, React.ReactNode> = {
  Banking: <CreditCard size={18} />,
  Insurance: <Shield size={18} />,
  'Cloud Storage': <Cloud size={18} />,
  'Social Media': <Share2 size={18} />,
  Crypto: <Bitcoin size={18} />,
  Other: <Lock size={18} />,
}

const sensitivityColors: Record<Sensitivity, { bg: string; text: string; label: string }> = {
  high: { bg: 'rgba(220,53,69,0.1)', text: '#dc3545', label: 'High' },
  medium: { bg: 'rgba(255,165,0,0.12)', text: '#d4870a', label: 'Medium' },
  low: { bg: 'rgba(40,167,69,0.1)', text: '#1a7a3f', label: 'Low' },
}

const categories: Category[] = ['Banking', 'Insurance', 'Cloud Storage', 'Social Media', 'Crypto', 'Other']

export default function VaultDashboard() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [showForm, setShowForm] = useState(false)
  const [filterCat, setFilterCat] = useState<string>('All')
  const [form, setForm] = useState({ name: '', category: 'Banking' as Category, sensitivity: 'medium' as Sensitivity, notes: '', username: '' })

  const filtered = filterCat === 'All' ? assets : assets.filter(a => a.category === filterCat)

  const addAsset = () => {
    if (!form.name.trim()) return
    const newAsset: Asset = {
      id: 'a' + Date.now(),
      ...form,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    setAssets(prev => [...prev, newAsset])
    setForm({ name: '', category: 'Banking', sensitivity: 'medium', notes: '', username: '' })
    setShowForm(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Your Vault</h1>
          <p className="text-slate-500 text-sm mt-1">{assets.length} assets stored &amp; encrypted</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}
        >
          <Plus size={15} /> Add Asset
        </button>
      </div>

      {/* Vault health banner */}
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl mb-6" style={{ background: 'rgba(212,167,44,0.1)', border: '1px solid rgba(212,167,44,0.3)' }}>
        <Clock size={16} style={{ color: '#d4a72c' }} />
        <p className="text-sm" style={{ color: '#926b13' }}>
          <strong>Vault health reminder:</strong> Last reviewed 3 months ago. Keep your records up to date.
        </p>
        <button className="ml-auto text-xs font-medium" style={{ color: '#d4a72c' }}>Review Now</button>
      </div>

      {/* Add asset form */}
      {showForm && (
        <div className="rounded-2xl p-6 mb-6 fade-in-up" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.2)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Add New Asset</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Asset name *</label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                placeholder="e.g. ICICI Savings Account"
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none"
                style={{ borderColor: '#dee2e6', background: '#fafbfc' }}
                onFocus={e => (e.target.style.borderColor = '#1a8f8f')}
                onBlur={e => (e.target.style.borderColor = '#dee2e6')} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Username / ID</label>
              <input value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value}))}
                placeholder="email or account ID"
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none"
                style={{ borderColor: '#dee2e6', background: '#fafbfc' }}
                onFocus={e => (e.target.style.borderColor = '#1a8f8f')}
                onBlur={e => (e.target.style.borderColor = '#dee2e6')} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as Category}))}
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none appearance-none"
                style={{ borderColor: '#dee2e6', background: '#fafbfc' }}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Sensitivity</label>
              <select value={form.sensitivity} onChange={e => setForm(f => ({...f, sensitivity: e.target.value as Sensitivity}))}
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none appearance-none"
                style={{ borderColor: '#dee2e6', background: '#fafbfc' }}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Notes for nominees</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                placeholder="Any instructions, context, or important details your nominees should know..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none resize-none"
                style={{ borderColor: '#dee2e6', background: '#fafbfc' }}
                onFocus={e => (e.target.style.borderColor = '#1a8f8f')}
                onBlur={e => (e.target.style.borderColor = '#dee2e6')} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addAsset} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
              Save to Vault
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: '#dee2e6', color: '#868e96' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...categories].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={filterCat === c
              ? { background: '#1a8f8f', color: 'white' }
              : { background: 'rgba(255,255,255,0.7)', color: '#495057', border: '1px solid #dee2e6' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Asset grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(asset => {
          const sens = sensitivityColors[asset.sensitivity]
          return (
            <div key={asset.id}
              className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-lg cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
                  {categoryIcons[asset.category]}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: sens.bg, color: sens.text }}>
                  {asset.sensitivity === 'high' && <AlertTriangle size={11} />}
                  {sens.label}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm mb-0.5">{asset.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(26,143,143,0.08)', color: '#1a8f8f' }}>{asset.category}</span>
              </div>
              {asset.username && <p className="text-xs text-slate-400 font-mono">{asset.username}</p>}
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{asset.notes}</p>
              <div className="flex items-center gap-1 mt-auto pt-2 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <Lock size={11} style={{ color: '#adb5bd' }} />
                <span className="text-xs text-slate-400">Updated {asset.lastUpdated}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
