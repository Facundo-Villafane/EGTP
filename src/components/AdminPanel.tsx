import { useEffect, useState } from 'react'
import type { Talent } from '../types/talent'
import type { EventSettings } from '../types/settings'
import { subscribeAllTalents, updateTalentStatus } from '../services/talentService'
import { subscribeSettings, updateSettings } from '../services/settingsService'
import { StatusBadge, DemoBadge } from './StatusBadge'

export function AdminPanel() {
  const [talents,  setTalents]  = useState<Talent[]>([])
  const [settings, setSettings] = useState<EventSettings | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    const unsubT = subscribeAllTalents(setTalents)
    const unsubS = subscribeSettings(setSettings)
    return () => { unsubT(); unsubS() }
  }, [])

  async function toggle(key: keyof Pick<EventSettings, 'registrationOpen' | 'votingOpen' | 'showResults'>) {
    if (!settings) return
    setSaving(true)
    try {
      await updateSettings({ [key]: !settings[key] })
    } finally {
      setSaving(false)
    }
  }

  async function setStatus(talentId: string, status: 'approved' | 'rejected') {
    await updateTalentStatus(talentId, status)
  }

  const filtered = filter === 'all' ? talents : talents.filter((t) => t.status === filter)

  const counts = {
    pending:  talents.filter((t) => t.status === 'pending').length,
    approved: talents.filter((t) => t.status === 'approved').length,
    rejected: talents.filter((t) => t.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase">Panel de administración</h1>
          <p className="text-on-surface-variant mt-1">Gestioná el concurso de talentos.</p>
        </div>

        {/* Settings toggles */}
        {settings && (
          <div className="glass-panel p-6 rounded-3xl mb-8">
            <h2 className="text-lg font-bold text-on-surface mb-4">Estado del concurso</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Toggle
                label="Inscripción"
                enabled={settings.registrationOpen}
                onToggle={() => void toggle('registrationOpen')}
                disabled={saving}
              />
              <Toggle
                label="Votación"
                enabled={settings.votingOpen}
                onToggle={() => void toggle('votingOpen')}
                disabled={saving}
              />
              <Toggle
                label="Mostrar resultados"
                enabled={settings.showResults}
                onToggle={() => void toggle('showResults')}
                disabled={saving}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Pendientes" value={counts.pending} color="amber" />
          <StatCard label="Aprobados"  value={counts.approved} color="emerald" />
          <StatCard label="Rechazados" value={counts.rejected} color="red" />
        </div>

        {/* Talent list */}
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-outline-variant/20 flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-on-surface flex-1">Participantes</h2>
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  filter === f
                    ? 'neon-border-pink bg-primary/10 text-primary'
                    : 'border border-outline-variant text-on-surface-variant hover:bg-surface-bright/50'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : 'Rechazados'}
                {f !== 'all' && ` (${counts[f]})`}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-on-surface-variant">No hay participantes en esta categoría.</div>
          ) : (
            <ul>
              {filtered.map((talent) => (
                <li key={talent.id} className="border-b border-outline-variant/20 p-4 sm:p-5 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <img
                      src={talent.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=bd00ff&color=fff`}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-primary/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-on-surface">{talent.name}</span>
                        <StatusBadge status={talent.status} />
                        <DemoBadge demoType={talent.demoType} />
                      </div>
                      <p className="text-sm text-primary font-medium">{talent.talentType}</p>
                      <p className="text-sm text-on-surface">"{talent.presentationTitle}"</p>
                      <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-2">{talent.description}</p>
                      {talent.videoUrl && (
                        <a
                          href={talent.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-1 inline-block truncate max-w-xs"
                        >
                          {talent.videoUrl}
                        </a>
                      )}
                      <p className="text-xs text-on-surface-variant/60 mt-1">
                        {talent.email} · {talent.votesCount} votos
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {talent.status !== 'approved' && (
                        <button
                          onClick={() => void setStatus(talent.id, 'approved')}
                          className="btn-success text-xs py-1.5 px-3"
                        >
                          Aprobar
                        </button>
                      )}
                      {talent.status !== 'rejected' && (
                        <button
                          onClick={() => void setStatus(talent.id, 'rejected')}
                          className="btn-danger text-xs py-1.5 px-3"
                        >
                          Rechazar
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function Toggle({
  label, enabled, onToggle, disabled,
}: {
  label: string
  enabled: boolean
  onToggle: () => void
  disabled: boolean
}) {
  return (
    <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between">
      <span className="text-sm font-medium text-on-surface-variant">{label}</span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
          enabled ? 'bg-primary' : 'bg-outline-variant'
        } disabled:opacity-50`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function StatCard({
  label, value, color,
}: {
  label: string
  value: number
  color: 'amber' | 'emerald' | 'red'
}) {
  const colorMap = {
    amber:   'text-amber-400',
    emerald: 'text-primary',
    red:     'text-error',
  }
  return (
    <div className="glass-panel rounded-2xl p-4 text-center">
      <p className={`text-3xl font-black ${colorMap[color]}`}>{value}</p>
      <p className="text-xs font-medium mt-0.5 text-on-surface-variant">{label}</p>
    </div>
  )
}
