import { cn } from '@/lib/utils'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('card overflow-hidden', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn('px-5 sm:px-6 py-4', className)}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 sm:px-6 py-5', className)}>{children}</div>
}
