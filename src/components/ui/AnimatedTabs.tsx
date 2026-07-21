import { useRef, useState, useEffect, type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
}

interface AnimatedTabsProps {
  tabs: Tab[]
  value: string
  onChange: (id: string) => void
  className?: string
}

export default function AnimatedTabs({ tabs, value, onChange, className = '' }: AnimatedTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const active = container.querySelector<HTMLButtonElement>(`[data-tab="${value}"]`)
    if (!active) return
    setIndicator({ left: active.offsetLeft, width: active.offsetWidth })
  }, [value, tabs])

  return (
    <div
      ref={containerRef}
      className={`relative flex gap-1 p-1 rounded-xl ${className}`}
      style={{ background: 'rgba(245,247,250,0.9)' }}
    >
      <div
        className="tab-indicator absolute top-1 bottom-1 rounded-lg pointer-events-none"
        style={{
          left: indicator.left,
          width: indicator.width,
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      />
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          data-tab={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
          style={{ color: value === tab.id ? '#1a8f8f' : '#868e96' }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`fade-in ${className}`}>{children}</div>
}
