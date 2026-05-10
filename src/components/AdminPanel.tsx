import { useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import type { Talent } from '../types/talent'
import type { EventSettings } from '../types/settings'
import type { AppUser, UserRole } from '../types/user'
import { subscribeAllTalents, updateTalentStatus, deleteTalent, patchTalent } from '../services/talentService'
import { TALENT_TYPES } from '../types/talent'
import { subscribeSettings, updateSettings } from '../services/settingsService'
import { subscribeAllUsers, updateUserRole } from '../services/userService'
import { StatusBadge, DemoBadge } from './StatusBadge'
import { useAuth } from '../context/AuthContext'
import { Avatar } from './ui/Avatar'

export function AdminPanel() {
  const { appUser: currentUser } = useAuth()
  const [talents,  setTalents]  = useState<Talent[]>([])
  const [settings, setSettings] = useState<EventSettings | null>(null)
  const [users,    setUsers]    = useState<AppUser[]>([])
  const [saving,   setSaving]   = useState(false)
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [tab,      setTab]      = useState<'phases' | 'talents' | 'users'>('phases')

  useEffect(() => {
    const unsubT = subscribeAllTalents(setTalents)
    const unsubS = subscribeSettings(setSettings)
    const unsubU = subscribeAllUsers(setUsers)
    return () => { unsubT(); unsubS(); unsubU() }
  }, [])

  async function toggle(key: keyof Pick<EventSettings, 'registrationOpen' | 'votingOpen' | 'showResults'>) {
    if (!settings) return
    setSaving(true)
    try { await updateSettings({ [key]: !settings[key] }) }
    finally { setSaving(false) }
  }

  async function saveDeadline(key: 'registrationDeadline' | 'votingDeadline', value: string) {
    if (!value) {
      await updateSettings({ [key]: null })
      return
    }
    await updateSettings({ [key]: Timestamp.fromDate(new Date(value)) })
  }

  async function setStatus(talentId: string, status: 'approved' | 'rejected') {
    await updateTalentStatus(talentId, status)
  }

  async function handleDelete(talentId: string, name: string) {
    if (!window.confirm(`¿Eliminar la inscripción de ${name}? Esta acción no se puede deshacer.`)) return
    await deleteTalent(talentId)
  }

  const filtered = filter === 'all' ? talents : talents.filter((t) => t.status === filter)
  const counts = {
    pending:  talents.filter((t) => t.status === 'pending').length,
    approved: talents.filter((t) => t.status === 'approved').length,
    rejected: talents.filter((t) => t.status === 'rejected').length,
  }

  const activePhase = settings
    ? settings.votingOpen ? 'voting'
    : settings.registrationOpen ? 'registration'
    : settings.showResults ? 'results'
    : 'closed'
    : 'closed'

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary uppercase">Administración</h1>
            <p className="text-on-surface-variant mt-1 text-sm">EPAM Got Talent · Palermo</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium">Fase activa:</span>
            <PhasePill phase={activePhase} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface-container-low rounded-xl p-1 w-fit flex-wrap">
          {([
            { key: 'phases',  label: 'Fases' },
            { key: 'talents', label: `Participantes (${talents.length})` },
            { key: 'users',   label: `Usuarios (${users.length})` },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === key
                  ? 'bg-primary text-on-primary shadow'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── PHASES TAB ── */}
        {tab === 'phases' && settings && (
          <div className="space-y-4">

            {/* Phase pipeline visual */}
            <div className="glass-panel rounded-3xl p-6 mb-6">
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-5">Pipeline</h2>
              <div className="flex items-center gap-0">
                <PhaseStep
                  number={1}
                  label="Inscripción"
                  active={settings.registrationOpen}
                  isCurrent={activePhase === 'registration'}
                />
                <Connector active={settings.registrationOpen && (settings.votingOpen || settings.showResults)} />
                <PhaseStep
                  number={2}
                  label="Votación"
                  active={settings.votingOpen}
                  isCurrent={activePhase === 'voting'}
                />
                <Connector active={settings.votingOpen && settings.showResults} />
                <PhaseStep
                  number={3}
                  label="Resultados"
                  active={settings.showResults}
                  isCurrent={activePhase === 'results'}
                />
              </div>
            </div>

            {/* Phase cards */}
            <PhaseCard
              number={1}
              label="Inscripción"
              description="Los participantes pueden registrarse y subir su propuesta."
              enabled={settings.registrationOpen}
              onToggle={() => void toggle('registrationOpen')}
              disabled={saving}
              deadline={settings.registrationDeadline}
              onDeadlineChange={(v) => void saveDeadline('registrationDeadline', v)}
            />

            <PhaseCard
              number={2}
              label="Votación"
              description="Los usuarios pueden votar por sus participantes favoritos."
              enabled={settings.votingOpen}
              onToggle={() => void toggle('votingOpen')}
              disabled={saving}
              deadline={settings.votingDeadline}
              onDeadlineChange={(v) => void saveDeadline('votingDeadline', v)}
            />

            <div className="glass-panel rounded-3xl p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-sm font-black text-on-surface-variant flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-on-surface">Resultados</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">Muestra el ranking público de votos.</p>
                </div>
              </div>
              <Toggle
                label={settings.showResults ? 'Visible' : 'Oculto'}
                enabled={settings.showResults}
                onToggle={() => void toggle('showResults')}
                disabled={saving}
              />
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <StatCard label="Pendientes" value={counts.pending}  color="amber" />
              <StatCard label="Aprobados"  value={counts.approved} color="emerald" />
              <StatCard label="Rechazados" value={counts.rejected} color="red" />
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant/20">
              <h2 className="text-base font-bold text-on-surface">Gestión de roles</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Cambiá el rol de cada usuario. Los cambios se aplican al instante.</p>
            </div>
            {users.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant text-sm">No hay usuarios registrados.</div>
            ) : (
              <ul>
                {users
                  .slice()
                  .sort((a, b) => a.displayName.localeCompare(b.displayName))
                  .map((user) => (
                    <li key={user.uid} className="border-b border-outline-variant/20 p-4 sm:p-5 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <Avatar src={user.photoURL} name={user.displayName} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-on-surface truncate">{user.displayName}</span>
                            {user.uid === currentUser?.uid && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">vos</span>
                            )}
                          </div>
                          <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                        </div>
                        <RoleSelector
                          currentRole={user.role}
                          disabled={user.uid === currentUser?.uid}
                          onChange={(role) => void updateUserRole(user.uid, role)}
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        {/* ── TALENTS TAB ── */}
        {tab === 'talents' && (
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant/20 flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-on-surface flex-1">Participantes</h2>
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
              <div className="p-12 text-center text-on-surface-variant text-sm">
                No hay participantes en esta categoría.
              </div>
            ) : (
              <ul>
                {filtered.map((talent) => (
                  <li key={talent.id} className="border-b border-outline-variant/20 p-4 sm:p-5 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <Avatar src={talent.photoURL} name={talent.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-on-surface">{talent.name}</span>
                          <StatusBadge status={talent.status} />
                          <DemoBadge demoType={talent.demoType} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 mb-1">
                          <select
                            value={talent.talentType}
                            onChange={(e) => void patchTalent(talent.id, { talentType: e.target.value })}
                            className="text-xs bg-surface-container border border-outline-variant/40 text-primary rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {TALENT_TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
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
                          <button onClick={() => void setStatus(talent.id, 'approved')} className="btn-success text-xs py-1.5 px-3">
                            Aprobar
                          </button>
                        )}
                        {talent.status !== 'rejected' && (
                          <button onClick={() => void setStatus(talent.id, 'rejected')} className="btn-danger text-xs py-1.5 px-3">
                            Rechazar
                          </button>
                        )}
                        <button
                          onClick={() => void handleDelete(talent.id, talent.name)}
                          className="text-xs py-1.5 px-3 rounded-lg border border-outline-variant/40 text-on-surface-variant hover:border-error/60 hover:text-error transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function PhaseCard({
  number, label, description, enabled, onToggle, disabled, deadline, onDeadlineChange,
}: {
  number: number
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
  disabled: boolean
  deadline: import('firebase/firestore').Timestamp | null
  onDeadlineChange: (v: string) => void
}) {
  const deadlineStr = deadline
    ? new Date(deadline.seconds * 1000).toISOString().slice(0, 16)
    : ''

  return (
    <div className={`glass-panel rounded-3xl p-6 transition-all ${enabled ? 'border border-primary/30' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-colors ${
            enabled ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
          }`}>
            {number}
          </div>
          <div>
            <p className="font-bold text-on-surface">{label}</p>
            <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>
          </div>
        </div>
        <Toggle
          label={enabled ? 'Abierta' : 'Cerrada'}
          enabled={enabled}
          onToggle={onToggle}
          disabled={disabled}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-outline-variant/20">
        <label className="label">Fecha límite (opcional)</label>
        <input
          type="datetime-local"
          defaultValue={deadlineStr}
          onBlur={(e) => onDeadlineChange(e.target.value)}
          className="input max-w-xs"
        />
      </div>
    </div>
  )
}

function PhaseStep({ number, label, active, isCurrent }: {
  number: number; label: string; active: boolean; isCurrent: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
        isCurrent
          ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/40'
          : active
          ? 'bg-primary/20 border-primary/40 text-primary'
          : 'bg-surface-container border-outline-variant text-on-surface-variant'
      }`}>
        {active && !isCurrent ? '✓' : number}
      </div>
      <span className={`text-xs font-semibold text-center ${isCurrent ? 'text-primary' : 'text-on-surface-variant'}`}>
        {label}
      </span>
    </div>
  )
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className={`h-0.5 flex-1 mb-5 transition-colors ${active ? 'bg-primary/40' : 'bg-outline-variant/40'}`} />
  )
}

function PhasePill({ phase }: { phase: string }) {
  const map: Record<string, { label: string; color: string }> = {
    registration: { label: 'Inscripción',  color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    voting:       { label: 'Votación',     color: 'bg-primary/20 text-primary border-primary/30' },
    results:      { label: 'Resultados',   color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    closed:       { label: 'Cerrado',      color: 'bg-surface-container text-on-surface-variant border-outline-variant' },
  }
  const { label, color } = map[phase] ?? map.closed
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {label}
    </span>
  )
}

function Toggle({ label, enabled, onToggle, disabled }: {
  label: string; enabled: boolean; onToggle: () => void; disabled: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
          enabled ? 'bg-primary' : 'bg-outline-variant'
        } disabled:opacity-50`}
        role="switch"
        aria-checked={enabled}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`} />
      </button>
      <span className="text-xs text-on-surface-variant">{label}</span>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'amber' | 'emerald' | 'red' }) {
  const colorMap = { amber: 'text-amber-400', emerald: 'text-primary', red: 'text-error' }
  return (
    <div className="glass-panel rounded-2xl p-4 text-center">
      <p className={`text-3xl font-black ${colorMap[color]}`}>{value}</p>
      <p className="text-xs font-medium mt-0.5 text-on-surface-variant">{label}</p>
    </div>
  )
}

function RoleSelector({ currentRole, disabled, onChange }: {
  currentRole: UserRole
  disabled: boolean
  onChange: (role: UserRole) => void
}) {
  const roles: { value: UserRole; label: string; color: string }[] = [
    { value: 'employee', label: 'Empleado', color: 'border-outline-variant text-on-surface-variant' },
    { value: 'admin',    label: 'Admin',    color: 'border-primary text-primary bg-primary/10' },
  ]

  return (
    <div className="flex gap-2 flex-shrink-0">
      {roles.map((r) => (
        <button
          key={r.value}
          disabled={disabled}
          onClick={() => onChange(r.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            currentRole === r.value
              ? r.color
              : 'border-outline-variant/30 text-on-surface-variant/40 hover:border-outline-variant hover:text-on-surface-variant'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
