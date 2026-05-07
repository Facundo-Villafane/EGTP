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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Panel de administración</h1>
          <p className="text-slate-500 mt-1">Gestioná el concurso de talentos.</p>
        </div>

        {/* Settings toggles */}
        {settings && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Estado del concurso</h2>
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
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-slate-900 flex-1">Participantes</h2>
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  filter === f ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : 'Rechazados'}
                {f !== 'all' && ` (${counts[f]})`}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No hay participantes en esta categoría.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((talent) => (
                <li key={talent.id} className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={talent.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=5563f6&color=fff`}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-slate-900">{talent.name}</span>
                        <StatusBadge status={talent.status} />
                        <DemoBadge demoType={talent.demoType} />
                      </div>
                      <p className="text-sm text-brand-600 font-medium">{talent.talentType}</p>
                      <p className="text-sm text-slate-700">"{talent.presentationTitle}"</p>
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{talent.description}</p>
                      {talent.videoUrl && (
                        <a
                          href={talent.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-500 hover:underline mt-1 inline-block truncate max-w-xs"
                        >
                          {talent.videoUrl}
                        </a>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
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
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
          enabled ? 'bg-brand-600' : 'bg-slate-300'
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
    amber:   'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    red:     'bg-red-50 text-red-600',
  }
  return (
    <div className={`card p-4 text-center ${colorMap[color]}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs font-medium mt-0.5">{label}</p>
    </div>
  )
}
