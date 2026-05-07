import type { EventSettings } from '../types/settings'
import { useAuth } from '../context/AuthContext'
import { signInWithGoogle } from '../services/authService'

interface Props {
  settings: EventSettings
  participantCount: number
}

export function HeroSection({ settings, participantCount }: Props) {
  const { firebaseUser } = useAuth()

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-6">
          <span className="text-6xl sm:text-8xl">🎤</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4">
          {settings.eventTitle}
        </h1>

        <p className="text-xl sm:text-2xl text-brand-100 mb-8 max-w-2xl mx-auto">
          Mostrá tu talento, descubrí el de tus compañeros y votá por tus favoritos.
        </p>

        {/* Status chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <StatusChip
            label="Inscripción"
            active={settings.registrationOpen}
            activeLabel="Abierta"
            inactiveLabel="Cerrada"
          />
          <StatusChip
            label="Votación"
            active={settings.votingOpen}
            activeLabel="Abierta"
            inactiveLabel="Cerrada"
          />
          {participantCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {participantCount} participante{participantCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {firebaseUser ? (
            <>
              {settings.registrationOpen && (
                <a href="#inscripcion" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 text-base px-8 py-4">
                  Inscribirme
                </a>
              )}
              <a href="#talentos" className="btn-secondary bg-white/10 text-white border border-white/30 hover:bg-white/20 text-base px-8 py-4">
                Ver talentos
              </a>
            </>
          ) : (
            <button
              onClick={() => void signInWithGoogle()}
              className="btn-primary bg-white text-brand-700 hover:bg-brand-50 text-base px-8 py-4 gap-3"
            >
              <GoogleIcon />
              Ingresar con Google para participar
            </button>
          )}
        </div>

        {!firebaseUser && (
          <p className="mt-6 text-brand-200 text-sm">
            Ingresá con tu cuenta corporativa para inscribirte o votar.
          </p>
        )}
      </div>
    </section>
  )
}

function StatusChip({
  label,
  active,
  activeLabel,
  inactiveLabel,
}: {
  label: string
  active: boolean
  activeLabel: string
  inactiveLabel: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${
        active ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/10 text-white/60'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`} />
      {label}: {active ? activeLabel : inactiveLabel}
    </span>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
