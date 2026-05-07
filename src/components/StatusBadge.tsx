import type { TalentStatus } from '../types/talent'

const MAP: Record<TalentStatus, { label: string; className: string }> = {
  pending:  { label: 'Pendiente',  className: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Aprobado',   className: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rechazado',  className: 'bg-red-100 text-red-600' },
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
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        En vivo
      </span>
    )
  }
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
      Video
    </span>
  )
}
