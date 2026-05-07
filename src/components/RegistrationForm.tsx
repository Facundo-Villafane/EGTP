import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { signInWithGoogle } from '../services/authService'
import { createTalent, getUserTalent, updateTalent } from '../services/talentService'
import { TALENT_TYPES } from '../types/talent'
import type { Talent } from '../types/talent'
import { StatusBadge } from './StatusBadge'
import { VideoEmbed } from './VideoEmbed'
import { parseVideoUrl } from '../utils/videoEmbed'

interface Props {
  registrationOpen: boolean
}

export function RegistrationForm({ registrationOpen }: Props) {
  const { firebaseUser } = useAuth()

  const [existing, setExisting] = useState<Talent | null>(null)
  const [editing,  setEditing]  = useState(false)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  const [form, setForm] = useState({
    talentType:        '',
    presentationTitle: '',
    description:       '',
    demoType:          'live' as 'video' | 'live',
    videoUrl:          '',
  })

  useEffect(() => {
    if (!firebaseUser) { setLoading(false); return }
    getUserTalent(firebaseUser.uid).then((t) => {
      setExisting(t)
      if (t) {
        setForm({
          talentType:        t.talentType,
          presentationTitle: t.presentationTitle,
          description:       t.description,
          demoType:          t.demoType,
          videoUrl:          t.videoUrl ?? '',
        })
      }
      setLoading(false)
    })
  }, [firebaseUser])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firebaseUser) return
    setError('')
    setSaving(true)

    try {
      const payload = {
        userId:            firebaseUser.uid,
        name:              firebaseUser.displayName ?? '',
        email:             firebaseUser.email ?? '',
        photoURL:          firebaseUser.photoURL ?? '',
        talentType:        form.talentType,
        presentationTitle: form.presentationTitle,
        description:       form.description,
        demoType:          form.demoType,
        videoUrl:          form.demoType === 'video' ? form.videoUrl : undefined,
      }

      if (existing) {
        await updateTalent(existing.id, payload)
      } else {
        await createTalent(payload)
      }

      const updated = await getUserTalent(firebaseUser.uid)
      setExisting(updated)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  if (!firebaseUser) {
    return (
      <section id="inscripcion" className="py-24 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Inscripción</h2>
          <p className="text-slate-600 mb-8">Ingresá con Google para inscribirte al concurso.</p>
          <button onClick={() => void signInWithGoogle()} className="btn-primary gap-3 text-base px-8 py-4">
            Ingresar con Google
          </button>
        </div>
      </section>
    )
  }

  if (!registrationOpen && !existing) {
    return (
      <section id="inscripcion" className="py-24 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Inscripción</h2>
          <div className="card p-8">
            <span className="text-4xl mb-4 block">⏰</span>
            <p className="text-slate-700 font-medium">La inscripción está cerrada por el momento.</p>
            <p className="text-slate-500 text-sm mt-2">Podés seguir viendo los talentos inscriptos.</p>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section id="inscripcion" className="py-24 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    )
  }

  // Show existing registration (not editing)
  if (existing && !editing) {
    return (
      <section id="inscripcion" className="py-24 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Tu inscripción</h2>
          <p className="text-slate-500 text-center mb-8">Tu talento fue registrado correctamente.</p>

          {success && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium text-center">
              ¡Inscripción actualizada correctamente!
            </div>
          )}

          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={existing.photoURL} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-900">{existing.name}</p>
                  <p className="text-sm text-slate-500">{existing.email}</p>
                </div>
              </div>
              <StatusBadge status={existing.status} />
            </div>

            <hr className="border-slate-100" />

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Field label="Talento"           value={existing.talentType} />
              <Field label="Modalidad"          value={existing.demoType === 'live' ? 'Presentación en vivo' : 'Video'} />
              <Field label="Título"             value={existing.presentationTitle} className="sm:col-span-2" />
              <Field label="Descripción"        value={existing.description} className="sm:col-span-2" />
              {existing.videoUrl && (
                <div className="sm:col-span-2">
                  <dt className="text-slate-500 font-medium">Video</dt>
                  <dd>
                    <a href={existing.videoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline break-all">
                      {existing.videoUrl}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            {existing.status === 'pending' && (
              <p className="text-amber-700 bg-amber-50 rounded-lg px-4 py-3 text-sm">
                Tu talento está pendiente de aprobación por el equipo organizador.
              </p>
            )}

            {registrationOpen && (
              <button onClick={() => setEditing(true)} className="btn-secondary w-full mt-2">
                Editar mi inscripción
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Form (create or edit)
  return (
    <section id="inscripcion" className="py-24 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          {existing ? 'Editar inscripción' : 'Inscribirme'}
        </h2>
        <p className="text-slate-500 text-center mb-8">
          Completá el formulario y mostrá tu talento.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="card p-6 sm:p-8 space-y-5">
          {/* Auto-filled user info */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <img src={firebaseUser.photoURL ?? undefined} alt="" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-medium text-slate-800">{firebaseUser.displayName}</p>
              <p className="text-sm text-slate-500">{firebaseUser.email}</p>
            </div>
          </div>

          <div>
            <label className="label">Tipo de talento *</label>
            <select
              value={form.talentType}
              onChange={(e) => set('talentType', e.target.value)}
              className="input"
              required
            >
              <option value="">Seleccioná tu talento...</option>
              {TALENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Título de la presentación *</label>
            <input
              type="text"
              value={form.presentationTitle}
              onChange={(e) => set('presentationTitle', e.target.value)}
              placeholder='Ej: "Acoustic cover de Coldplay"'
              className="input"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="label">Descripción breve *</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Contanos qué vas a presentar o demostrar..."
              className="input resize-none"
              rows={3}
              required
              maxLength={500}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{form.description.length}/500</p>
          </div>

          <div>
            <label className="label">¿Cómo vas a demostrar tu talento? *</label>
            <div className="flex gap-4">
              {(['live', 'video'] as const).map((type) => (
                <label
                  key={type}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    form.demoType === type
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="demoType"
                    value={type}
                    checked={form.demoType === type}
                    onChange={() => set('demoType', type)}
                    className="accent-brand-600"
                  />
                  <span className="text-sm font-medium">
                    {type === 'live' ? '🎭 Presentación en vivo' : '🎬 Compartir video'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {form.demoType === 'video' && (
            <div>
              <label className="label">Link al video *</label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => set('videoUrl', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="input"
                required={form.demoType === 'video'}
              />
              <p className="text-xs text-slate-400 mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                <span>Plataformas soportadas:</span>
                <span className="font-medium text-red-500">YouTube</span>
                <span className="font-medium text-sky-500">Vimeo</span>
                <span className="font-medium text-emerald-500">Google Drive</span>
              </p>
              {form.videoUrl && <VideoPreview url={form.videoUrl} />}
            </div>
          )}

          {error && (
            <p className="text-red-600 bg-red-50 rounded-lg px-4 py-3 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            {existing && (
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">
                Cancelar
              </button>
            )}
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </span>
              ) : existing ? 'Guardar cambios' : 'Enviar inscripción'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-slate-500 font-medium mb-0.5">{label}</dt>
      <dd className="text-slate-900">{value}</dd>
    </div>
  )
}

function VideoPreview({ url }: { url: string }) {
  const { provider } = parseVideoUrl(url)
  if (provider === 'unknown') return null
  return (
    <div className="mt-3">
      <p className="text-xs text-slate-400 mb-1.5">Vista previa:</p>
      <VideoEmbed url={url} title="Vista previa" />
    </div>
  )
}
