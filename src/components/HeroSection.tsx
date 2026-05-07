import type { EventSettings } from '../types/settings'
import { useAuth } from '../context/AuthContext'
import { signInWithGoogle } from '../services/authService'
import { GradientBars } from './ui/GradientBars'

interface Props {
  settings: EventSettings
  participantCount: number
}

export function HeroSection({ settings, participantCount }: Props) {
  const { firebaseUser, domainError } = useAuth()

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background"
    >
      <GradientBars />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Now Casting pill */}
        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1 glass-panel rounded-full border border-primary/40 text-primary uppercase font-label-bold text-label-bold tracking-widest text-xs">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Now Casting
          </span>
        </div>

        <h1 className="font-display-xl text-[64px] sm:text-display-xl text-white uppercase leading-none mb-6">
          {settings.eventTitle}
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
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
            <span className="glass-panel inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-on-surface-variant">
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
                <a
                  href="#inscripcion"
                  className="golden-buzzer font-headline-md text-headline-md px-10 py-4 rounded-xl text-surface font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center"
                >
                  Inscribirme
                </a>
              )}
              <a
                href="#talentos"
                className="glass-panel font-headline-md text-headline-md px-10 py-4 rounded-xl text-white font-bold uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-all inline-flex items-center justify-center"
              >
                Ver talentos
              </a>
            </>
          ) : (
            <button
              onClick={() => void signInWithGoogle()}
              className="glass-panel border border-primary/40 text-primary font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-3 hover:bg-primary/10 transition-all"
            >
              <GoogleIcon />
              Ingresar con Google para participar
            </button>
          )}
        </div>

        {domainError && (
          <div className="mt-6 mx-auto max-w-md glass-panel border border-error/40 text-error rounded-xl px-5 py-4">
            <p className="font-semibold mb-0.5">Cuenta no autorizada</p>
            <p className="text-sm opacity-80">{domainError}</p>
          </div>
        )}

        {!firebaseUser && !domainError && (
          <p className="mt-6 text-on-surface-variant/60 text-sm">
            Ingresá con Google para inscribirte o votar.
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
      className={`glass-panel inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold ${
        active ? 'text-on-surface' : 'text-on-surface-variant/50'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-green-400 animate-pulse' : 'bg-outline-variant'}`} />
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
