import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
  className?: string
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  onClick,
  ...rest
}: ButtonProps) {
  const base = 'btn-ripple inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'btn-primary border-0',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent border-0 text-slate-600 hover:text-teal-500 hover:bg-teal-50/60 transition-colors',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`)
    onClick?.(e)
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={handleClick} {...rest}>
      {children}
    </button>
  )
}
