import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Archive, ArrowRight, LockKeyhole, Plus, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../redux/store'
import { fetchAssetsRequest } from '../redux/actions/assetsActions'
import Button from './ui/Button'
import Card from './ui/Card'

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
  const { items, loading, error } = useSelector((state: RootState) => state.assets)

  useEffect(() => { dispatch(fetchAssetsRequest()) }, [dispatch])

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-10 pt-3 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 bg-blue-500/10 text-blue-300 border border-blue-400/20">
            <ShieldCheck size={13} /> Your encrypted workspace
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Welcome, {user?.name || 'there'} 👋</h1>
          <p className="text-slate-500">Your digital legacy is protected. Manage assets and trusted access in one place.</p>
        </div>
        <Button onClick={() => navigate('/my-legacy')} disabled={loading}>
          <Plus size={15} /> {loading ? 'Syncing vault…' : 'Add nominee'}
        </Button>
      </section>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Digital Assets', value: items.length, icon: Archive, tone: 'text-blue-500 bg-blue-500/10' },
          { label: 'Trusted Contacts', value: '0', icon: ShieldCheck, tone: 'text-teal-600 bg-teal-500/10' },
          { label: 'Pending Requests', value: '0', icon: LockKeyhole, tone: 'text-amber-600 bg-amber-500/10' },
          { label: 'Security Score', value: '0%', icon: ShieldCheck, tone: 'text-violet-600 bg-violet-500/10' },
        ].map(stat => (
          <Card key={stat.label} className="p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.tone}`}><stat.icon size={19} /></div>
            <p className="text-2xl font-bold text-slate-800 mt-4">{stat.value}</p><p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid xl:grid-cols-5 gap-5">
        <Card className="xl:col-span-3 p-6" hover={false}>
          <div className="flex items-center justify-between gap-4 mb-5"><div><h2 className="text-lg font-bold text-slate-800">Protected assets</h2><p className="text-sm text-slate-500 mt-1">Live data, loaded through Redux Saga.</p></div><button className="text-sm font-semibold text-teal-700" onClick={() => navigate('/my-legacy')}>Open legacy <ArrowRight size={14} className="inline" /></button></div>
          {error && <p className="mb-4 text-sm text-red-600">Unable to load assets: {error}</p>}
          <div className="space-y-3">
            {items.length ? items.map(asset => <div key={asset.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"><div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><Archive size={16} /></div><div className="flex-1"><p className="text-sm font-semibold text-slate-700">{asset.name}</p><p className="text-xs text-slate-400">{asset.category} · {asset.nomineeName || 'No nominee assigned'}</p></div><span className="text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded-full">Protected</span></div>) : <p className="rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">No digital assets added yet.</p>}
          </div>
        </Card>
        <Card className="xl:col-span-2 p-6" hover={false} style={{ background: '#ffffff', color: '#111827' }}>
          <div className="flex items-center gap-2 text-slate-900 mb-5"><LockKeyhole size={17} /><span className="text-sm font-semibold">AI Legacy Advisor</span></div>
          <h2 className="text-xl font-semibold text-slate-900 mb-5">Two simple updates will strengthen your vault.</h2>
          {['Your Crypto Wallet has no nominee.', 'Enable biometric authentication.', 'Generate Digital Will.'].map(item => <div key={item} className="flex items-center justify-between gap-2 py-3 border-t border-slate-200"><span className="text-sm text-slate-900">{item}</span><button onClick={() => navigate('/ai-advisor')} className="text-xs font-bold text-teal-700 whitespace-nowrap">Fix now</button></div>)}
        </Card>
      </div>
    </div>
  )
}
