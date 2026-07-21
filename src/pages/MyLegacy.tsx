import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users, Eye, EyeOff } from 'lucide-react'
import { mockNominees, NOMINEES_STORAGE_KEY, type Nominee } from '../data/mockData'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../context/ToastContext'

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  address: '',
  assetName: '',
  assetPercentage: '',
}

function loadNominees(): Nominee[] {
  try {
    const raw = localStorage.getItem(NOMINEES_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Nominee[]
  } catch { /* ignore */ }
  return mockNominees
}

export default function MyLegacy() {
  const { toast } = useToast()
  const [nominees, setNominees] = useState<Nominee[]>(loadNominees)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    localStorage.setItem(NOMINEES_STORAGE_KEY, JSON.stringify(nominees))
  }, [nominees])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email'
    if (!form.password.trim()) next.password = 'Password is required'
    else if (form.password.length < 6 && form.password !== '••••••••') next.password = 'Password must be at least 6 characters'
    if (!form.address.trim()) next.address = 'Residential address is required'
    if (!form.assetName.trim()) next.assetName = 'Asset name is required'
    const pct = Number(form.assetPercentage)
    if (form.assetPercentage === '' || Number.isNaN(pct)) next.assetPercentage = 'Asset percentage is required'
    else if (pct < 0 || pct > 100) next.assetPercentage = 'Percentage must be between 0 and 100'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setErrors({})
    setShowPass(false)
    setShowForm(false)
  }

  const startAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setErrors({})
    setShowForm(true)
  }

  const startEdit = (n: Nominee) => {
    setForm({
      firstName: n.firstName,
      lastName: n.lastName,
      email: n.email,
      password: n.password,
      address: n.address,
      assetName: n.assetName,
      assetPercentage: String(n.assetPercentage),
    })
    setEditingId(n.id)
    setErrors({})
    setShowForm(true)
  }

  const handleSave = () => {
    if (!validate()) {
      toast('Please fix the highlighted fields', 'error')
      return
    }
    const payload: Nominee = {
      id: editingId || `n-${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      address: form.address.trim(),
      assetName: form.assetName.trim(),
      assetPercentage: Number(form.assetPercentage),
    }

    if (editingId) {
      setNominees(prev => prev.map(n => (n.id === editingId ? payload : n)))
      toast('Nominee updated successfully', 'success')
    } else {
      setNominees(prev => [...prev, payload])
      toast('Nominee saved successfully', 'success')
    }
    resetForm()
  }

  const handleDelete = (id: string) => {
    setNominees(prev => prev.filter(n => n.id !== id))
    if (editingId === id) resetForm()
    toast('Nominee removed', 'info')
  }

  const field = (
    key: keyof typeof emptyForm,
    label: string,
    opts?: { type?: string; placeholder?: string }
  ) => (
    <div>
      <label className="text-xs font-medium text-slate-600 mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={opts?.type === 'password' ? (showPass ? 'text' : 'password') : opts?.type || 'text'}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          min={opts?.type === 'number' ? 0 : undefined}
          max={opts?.type === 'number' ? 100 : undefined}
          step={opts?.type === 'number' ? 1 : undefined}
          className="input-field w-full px-4 py-2.5 rounded-xl text-sm border"
          style={{
            borderColor: errors[key] ? '#dc3545' : '#e8ebf0',
            background: '#fafbfc',
            paddingRight: opts?.type === 'password' ? 44 : undefined,
          }}
        />
        {opts?.type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPass(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Toggle password"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Legacy
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage nominees and their asset allocation percentages.</p>
        </div>
        {!showForm && (
          <Button onClick={startAdd}>
            <Plus size={15} /> Add Nominee
          </Button>
        )}
      </div>

      {showForm && (
        <Card hover={false} className="mb-8 fade-in-up">
          <h2 className="text-lg font-semibold text-slate-800 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
            {editingId ? 'Update Nominee' : 'Add Nominee'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {field('firstName', 'First Name *', { placeholder: 'Priya' })}
            {field('lastName', 'Last Name *', { placeholder: 'Sharma' })}
            {field('email', 'Email Address *', { type: 'email', placeholder: 'priya@example.com' })}
            {field('password', 'Password *', { type: 'password', placeholder: '••••••••' })}
            <div className="md:col-span-2">
              {field('address', 'Residential Address *', { placeholder: 'Street, city, state' })}
            </div>
            {field('assetName', 'Asset Name *', { placeholder: 'HDFC Savings Account' })}
            {field('assetPercentage', 'Asset Percentage (%) *', { type: 'number', placeholder: '0–100' })}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            {!editingId ? (
              <Button onClick={handleSave}>Save</Button>
            ) : (
              <Button onClick={handleSave}>Update</Button>
            )}
            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
          </div>
        </Card>
      )}

      {nominees.length === 0 ? (
        <Card hover={false} className="text-center py-14">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}
          >
            <Users size={24} />
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">No nominees yet</p>
          <p className="text-xs text-slate-400 mb-5">Add your first nominee to start allocating assets.</p>
          <Button onClick={startAdd}>Add Nominee</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {nominees.map(n => (
            <Card key={n.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}
              >
                {n.firstName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {n.firstName} {n.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate">{n.email}</p>
                <p className="text-xs text-slate-500 mt-1 truncate">{n.address}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}
                  >
                    {n.assetName}
                  </span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(212,167,44,0.12)', color: '#b8891a' }}
                  >
                    {n.assetPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(n)}
                  className="p-2 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50/60 transition-colors"
                  aria-label="Edit nominee"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(n.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Delete nominee"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
