import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export function Card({ children, className, title, subtitle }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-4 shadow-sm', className)}>
      {title && (
        <div className="mb-3">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
