import type { TalentStatus } from '../types/talent'

const MAP: Record<TalentStatus, { label: string; className: string }> = {
  pending:  { label: 'Pendiente',  className: 'bg-surface-container-high text-on-surface-variant border border-outline-variant/40' },
  approved: { label: 'Aprobado',   className: 'bg-primary/20 text-primary border border-primary/40' },
  rejected: { label: 'Rechazado',  className: 'bg-red-900/30 text-error border border-error/40' },
}

export function StatusBadge({ status }: { status: TalentStatus }) {
  const { label, className } = MAP[status]
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

export function DemoBadge({ demoType }: { demoType: 'video' | 'live' }) {
  if (demoType === 'live') {
    return (
      <span className="glass-panel inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-error border border-error/40">
        <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
        En vivo
      </span>
    )
  }
  return (
    <span className="glass-panel inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-secondary border border-secondary/40">
      Video
    </span>
  )
}
