import { useState } from 'react'
import { Check, X, Trash2, Key, UserCheck } from 'lucide-react'
import { mockAssets, mockNominees, initialPermissions } from '../data/mockData'

export default function Nominees() {
  const [nominees] = useState(mockNominees)
  const [permissions, setPermissions] = useState(initialPermissions)
  const [deleteMode, setDeleteMode] = useState<Record<string, boolean>>({})

  const toggle = (assetId: string, nomineeId: string) => {
    setPermissions(prev => ({
      ...prev,
      [assetId]: {
        ...(prev[assetId] || {}),
        [nomineeId]: !(prev[assetId]?.[nomineeId] ?? false),
      },
    }))
  }

  const toggleDelete = (assetId: string) => {
    setDeleteMode(prev => ({ ...prev, [assetId]: !prev[assetId] }))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Nominees & Permissions</h1>
        <p className="text-slate-500 text-sm mt-1">Control exactly who can access each asset — and who holds each decryption key share.</p>
      </div>

      {/* Key share cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {nominees.map(n => (
          <div key={n.id} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(26,143,143,0.12)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
                {n.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{n.name}</p>
                <p className="text-xs text-slate-400">{n.relation}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-2">{n.email}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(212,167,44,0.12)', color: '#b8891a', border: '1px solid rgba(212,167,44,0.3)' }}>
                <Key size={11} /> {n.keyShare}
              </div>
              {n.confirmed && (
                <div className="flex items-center gap-1 text-xs" style={{ color: '#1a7a3f' }}>
                  <UserCheck size={12} /> Confirmed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info: 2-of-3 */}
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl mb-6" style={{ background: 'rgba(26,143,143,0.08)', border: '1px solid rgba(26,143,143,0.2)' }}>
        <Key size={15} style={{ color: '#1a8f8f', flexShrink: 0 }} />
        <p className="text-xs" style={{ color: '#157272' }}>
          <strong>2-of-3 split key:</strong> Each nominee holds one share. Any two nominees submitting their shares together can reconstruct the decryption key — no single person can do it alone.
        </p>
      </div>

      {/* Permission matrix */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(26,143,143,0.1)', backdropFilter: 'blur(12px)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(26,143,143,0.1)' }}>
          <h2 className="font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Access Matrix</h2>
          <p className="text-xs text-slate-400 mt-0.5">Toggle to grant or revoke access. "Delete" marks that asset for deletion instead of sharing.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(26,143,143,0.08)' }}>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500" style={{ minWidth: 200 }}>Asset</th>
                {nominees.map(n => (
                  <th key={n.id} className="px-4 py-3 text-center text-xs font-semibold text-slate-500" style={{ minWidth: 110 }}>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white" style={{ background: '#1a8f8f' }}>{n.name.charAt(0)}</div>
                      <span>{n.name.split(' ')[0]}</span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500" style={{ minWidth: 90 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockAssets.map((asset, i) => (
                <tr key={asset.id} style={{ borderBottom: i < mockAssets.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                  className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{asset.name}</p>
                        <span className="text-xs text-slate-400">{asset.category}</span>
                      </div>
                    </div>
                  </td>
                  {nominees.map(n => {
                    const granted = !deleteMode[asset.id] && (permissions[asset.id]?.[n.id] ?? false)
                    const isDeleted = deleteMode[asset.id]
                    return (
                      <td key={n.id} className="px-4 py-4 text-center">
                        <button
                          onClick={() => !isDeleted && toggle(asset.id, n.id)}
                          disabled={isDeleted}
                          className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all duration-150"
                          style={isDeleted
                            ? { background: 'rgba(0,0,0,0.06)', cursor: 'not-allowed', opacity: 0.4 }
                            : granted
                              ? { background: 'rgba(26,143,143,0.15)', border: '1.5px solid rgba(26,143,143,0.4)' }
                              : { background: 'rgba(0,0,0,0.04)', border: '1.5px solid rgba(0,0,0,0.1)' }
                          }
                        >
                          {granted && !isDeleted ? <Check size={14} style={{ color: '#1a8f8f' }} /> : <X size={14} style={{ color: '#ced4da' }} />}
                        </button>
                      </td>
                    )
                  })}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleDelete(asset.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium mx-auto transition-all"
                      style={deleteMode[asset.id]
                        ? { background: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)' }
                        : { background: 'rgba(0,0,0,0.04)', color: '#868e96', border: '1px solid #dee2e6' }}
                    >
                      <Trash2 size={11} />
                      {deleteMode[asset.id] ? 'Delete' : 'Delete?'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 px-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: 'rgba(26,143,143,0.15)', border: '1.5px solid rgba(26,143,143,0.4)' }}><Check size={10} style={{ color: '#1a8f8f' }} /></div>
          Access granted
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.04)', border: '1.5px solid rgba(0,0,0,0.1)' }}><X size={10} style={{ color: '#ced4da' }} /></div>
          No access
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Trash2 size={12} style={{ color: '#dc3545' }} />
          Marked for deletion instead
        </div>
      </div>
    </div>
  )
}
