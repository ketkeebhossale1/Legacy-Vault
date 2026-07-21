import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  className?: string
  padding?: boolean
}

export default function Card({ children, hover = true, className = '', padding = true, ...rest }: CardProps) {
  return (
    <div
      className={`${hover ? 'premium-card' : 'premium-card-static'} ${padding ? 'p-5' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
