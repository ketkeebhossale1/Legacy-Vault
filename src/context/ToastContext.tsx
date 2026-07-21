import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  exiting?: boolean
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={16} style={{ color: '#1a8f8f' }} />,
  error: <AlertCircle size={16} style={{ color: '#dc3545' }} />,
  info: <Info size={16} style={{ color: '#d4a72c' }} />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, exiting: true } : t)))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 250)
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts(prev => [...prev.slice(-3), { id, message, type }])
    setTimeout(() => dismiss(id), 3200)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl min-w-[260px] max-w-sm ${t.exiting ? 'toast-exit' : 'toast-enter'}`}
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(31,41,51,0.12), 0 2px 8px rgba(26,143,143,0.08)',
              border: '1px solid rgba(26,143,143,0.1)',
            }}
          >
            {icons[t.type]}
            <p className="text-sm text-slate-700 flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
