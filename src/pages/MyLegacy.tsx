import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users, ShieldCheck, Lock } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../context/ToastContext'
import { usePlan } from '../hooks/usePlan'
import type { AppDispatch, RootState } from '../redux/store'
import {
  fetchNomineesRequest,
  createNomineeRequest,
  updateNomineeRequest,
  deleteNomineeRequest,
} from '../redux/actions/nomineeActions'
import type { Nominee } from '../data/mockData'

const emptyNomineeForm = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  assetName: '',
  assetPercentage: '',
}

const emptyExecutorForm = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
}

type FormMode = 'nominee' | 'executor' | null

export default function MyLegacy() {
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { maxNominees, maxExecutors, isPremium } = usePlan()
  const { items: all, loading, error } = useSelector((state: RootState) => state.nominees)

  const nominees = all.filter(n => !n.isExecutor)
  const executors = all.filter(n => n.isExecutor)

  const [formMode, setFormMode] = useState<FormMode>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nomineeForm, setNomineeForm] = useState(emptyNomineeForm)
  const [executorForm, setExecutorForm] = useState(emptyExecutorForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (all.length === 0 && !loading) {
      dispatch(fetchNomineesRequest())
    }
  }, [dispatch])

  useEffect(() => {
    if (error) toast(error, 'error')
  }, [error, toast])

  const validateNominee = () => {
    const next: Record<string, string> = {}
    if (!nomineeForm.firstName.trim()) next.firstName = 'First name is required'
    if (!nomineeForm.lastName.trim()) next.lastName = 'Last name is required'
    if (!nomineeForm.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nomineeForm.email.trim())) next.email = 'Enter a valid email'
    if (!nomineeForm.address.trim()) next.address = 'Residential address is required'
    if (!nomineeForm.assetName.trim()) next.assetName = 'Asset name is required'
    const pct = Number(nomineeForm.assetPercentage)
    if (nomineeForm.assetPercentage === '' || Number.isNaN(pct)) next.assetPercentage = 'Asset percentage is required'
    else if (pct < 0 || pct > 100) next.assetPercentage = 'Percentage must be between 0 and 100'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const validateExecutor = () => {
    const next: Record<string, string> = {}
    if (!executorForm.firstName.trim()) next.firstName = 'First name is required'
    if (!executorForm.lastName.trim()) next.lastName = 'Last name is required'
    if (!executorForm.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(executorForm.email.trim())) next.email = 'Enter a valid email'
    if (!executorForm.address.trim()) next.address = 'Residential address is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = () => {
    setFormMode(null)
    setEditingId(null)
    setNomineeForm(emptyNomineeForm)
    setExecutorForm(emptyExecutorForm)
    setErrors({})
  }

  const startAddNominee = () => {
    if (nominees.length >= maxNominees) {
      toast(`Free plan allows up to ${maxNominees} nominees. Upgrade to Premium for unlimited.`, 'error')
      navigate('/subscription')
      return
    }
    setNomineeForm(emptyNomineeForm)
    setEditingId(null)
    setErrors({})
    setFormMode('nominee')
  }

  const startAddExecutor = () => {
    if (executors.length >= maxExecutors) {
      toast(`Free plan allows up to ${maxExecutors} executor. Upgrade to Premium for unlimited.`, 'error')
      navigate('/subscription')
      return
    }
    setExecutorForm(emptyExecutorForm)
    setEditingId(null)
    setErrors({})
    setFormMode('executor')
  }

  const startEdit = (n: Nominee) => {
    if (n.isExecutor) {
      setExecutorForm({ firstName: n.firstName, lastName: n.lastName, email: n.email, address: n.address })
      setFormMode('executor')
    } else {
      setNomineeForm({
        firstName: n.firstName,
        lastName: n.lastName,
        email: n.email,
        address: n.address,
        assetName: n.assetName ?? '',
        assetPercentage: String(n.assetPercentage ?? ''),
      })
      setFormMode('nominee')
    }
    setEditingId(String(n.id))
    setErrors({})
  }

  const handleSaveNominee = () => {
    if (!validateNominee()) { toast('Please fix the highlighted fields', 'error'); return }
    const input = {
      firstName: nomineeForm.firstName.trim(),
      lastName: nomineeForm.lastName.trim(),
      email: nomineeForm.email.trim(),
      address: nomineeForm.address.trim(),
      assetName: nomineeForm.assetName.trim(),
      assetPercentage: Number(nomineeForm.assetPercentage),
      isExecutor: false,
    }
    if (editingId) {
      dispatch(updateNomineeRequest({ id: editingId, nominee: input }))
      toast('Nominee updated successfully', 'success')
    } else {
      dispatch(createNomineeRequest(input))
      toast('Nominee saved successfully', 'success')
    }
    reset()
  }

  const handleSaveExecutor = () => {
    if (!validateExecutor()) { toast('Please fix the highlighted fields', 'error'); return }
    const input = {
      firstName: executorForm.firstName.trim(),
      lastName: executorForm.lastName.trim(),
      email: executorForm.email.trim(),
      address: executorForm.address.trim(),
      isExecutor: true,
    }
    if (editingId) {
      dispatch(updateNomineeRequest({ id: editingId, nominee: input }))
      toast('Executor updated successfully', 'success')
    } else {
      dispatch(createNomineeRequest(input))
      toast('Executor saved successfully', 'success')
    }
    reset()
  }

  const handleDelete = (id: string) => {
    dispatch(deleteNomineeRequest(id))
    if (editingId === id) reset()
    toast('Record removed', 'info')
  }

  const nomineeField = (key: keyof typeof emptyNomineeForm, label: string, opts?: { type?: string; placeholder?: string }) => (
    <div>
      <label className="text-xs font-medium text-slate-600 mb-1.5 block">{label}</label>
      <input
        type={opts?.type || 'text'}
        value={nomineeForm[key]}
        onChange={e => setNomineeForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={opts?.placeholder}
        min={opts?.type === 'number' ? 0 : undefined}
        max={opts?.type === 'number' ? 100 : undefined}
        step={opts?.type === 'number' ? 1 : undefined}
        className="input-field w-full px-4 py-2.5 rounded-xl text-sm border"
        style={{ borderColor: errors[key] ? '#dc3545' : '#e8ebf0', background: '#fafbfc' }}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  const executorField = (key: keyof typeof emptyExecutorForm, label: string, opts?: { type?: string; placeholder?: string }) => (
    <div>
      <label className="text-xs font-medium text-slate-600 mb-1.5 block">{label}</label>
      <input
        type={opts?.type || 'text'}
        value={executorForm[key]}
        onChange={e => setExecutorForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={opts?.placeholder}
        className="input-field w-full px-4 py-2.5 rounded-xl text-sm border"
        style={{ borderColor: errors[key] ? '#dc3545' : '#e8ebf0', background: '#fafbfc' }}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Free plan usage banner */}
      {!isPremium && (
        <div className="mb-6 px-4 py-3 rounded-xl flex items-center justify-between gap-3"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <div className="flex items-center gap-2">
            <Lock size={14} style={{ color: '#7c3aed' }} />
            <p className="text-sm text-slate-700">
              Free plan: <strong>{nominees.length}/{maxNominees}</strong> nominees, <strong>{executors.length}/{maxExecutors}</strong> executor used.
            </p>
          </div>
          <button onClick={() => navigate('/subscription')}
            className="text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            Upgrade
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Legacy
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage nominees, executors, and their asset allocations.</p>
        </div>
        {!formMode && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={startAddNominee} disabled={loading}>
              <Plus size={15} /> Add Nominee
            </Button>
            <Button variant="secondary" onClick={startAddExecutor} disabled={loading}>
              <Plus size={15} /> Add Executor
            </Button>
          </div>
        )}
      </div>

      {/* Nominee Form */}
      {formMode === 'nominee' && (
        <Card hover={false} className="mb-8 fade-in-up">
          <h2 className="text-lg font-semibold text-slate-800 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
            {editingId ? 'Update Nominee' : 'Add Nominee'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {nomineeField('firstName', 'First Name *', { placeholder: 'Priya' })}
            {nomineeField('lastName', 'Last Name *', { placeholder: 'Sharma' })}
            {nomineeField('email', 'Email Address *', { type: 'email', placeholder: 'priya@example.com' })}
            <div className="md:col-span-2">
              {nomineeField('address', 'Residential Address *', { placeholder: 'Street, city, state' })}
            </div>
            {nomineeField('assetName', 'Asset Name *', { placeholder: 'HDFC Savings Account' })}
            {nomineeField('assetPercentage', 'Asset Percentage (%) *', { type: 'number', placeholder: '0–100' })}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleSaveNominee} disabled={loading}>
              {loading ? 'Saving…' : editingId ? 'Update' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={reset}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Executor Form */}
      {formMode === 'executor' && (
        <Card hover={false} className="mb-8 fade-in-up" style={{ borderLeft: '3px solid #1a8f8f' }}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} style={{ color: '#1a8f8f' }} />
            <h2 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {editingId ? 'Update Executor' : 'Add Executor'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            The executor is responsible for carrying out your will. They do not receive assets directly.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {executorField('firstName', 'First Name *', { placeholder: 'Rahul' })}
            {executorField('lastName', 'Last Name *', { placeholder: 'Mehta' })}
            {executorField('email', 'Email Address *', { type: 'email', placeholder: 'rahul@example.com' })}
            <div className="md:col-span-2">
              {executorField('address', 'Residential Address *', { placeholder: 'Street, city, state' })}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleSaveExecutor} disabled={loading}>
              {loading ? 'Saving…' : editingId ? 'Update' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={reset}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Executors List */}
      {executors.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} style={{ color: '#1a8f8f' }} />
            <h2 className="text-base font-semibold text-slate-700" style={{ fontFamily: "'Playfair Display', serif" }}>
              Executors
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
              {executors.length}
            </span>
          </div>
          <div className="grid gap-3">
            {executors.map(n => (
              <Card key={n.id} className="flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderLeft: '3px solid #1a8f8f' }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
                  {n.firstName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">{n.firstName} {n.lastName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
                      Executor
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{n.email}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{n.address}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => startEdit(n)}
                    className="p-2 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50/60 transition-colors" aria-label="Edit executor">
                    <Pencil size={15} />
                  </button>
                  <button type="button" onClick={() => handleDelete(String(n.id))}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete executor">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Nominees List */}
      <div>
        {nominees.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-slate-500" />
            <h2 className="text-base font-semibold text-slate-700" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nominees
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(212,167,44,0.12)', color: '#b8891a' }}>
              {nominees.length}
            </span>
          </div>
        )}
        {nominees.length === 0 && !loading ? (
          <Card hover={false} className="text-center py-14">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
              <Users size={24} />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">No nominees yet</p>
            <p className="text-xs text-slate-400 mb-5">Add your first nominee to start allocating assets.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {nominees.map(n => (
              <Card key={n.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1a8f8f, #2aacac)' }}>
                  {n.firstName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{n.firstName} {n.lastName}</p>
                  <p className="text-xs text-slate-400 truncate">{n.email}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{n.address}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(26,143,143,0.1)', color: '#1a8f8f' }}>
                      {n.assetName}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(212,167,44,0.12)', color: '#b8891a' }}>
                      {n.assetPercentage}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => startEdit(n)}
                    className="p-2 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50/60 transition-colors" aria-label="Edit nominee">
                    <Pencil size={15} />
                  </button>
                  <button type="button" onClick={() => handleDelete(String(n.id))}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete nominee">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
