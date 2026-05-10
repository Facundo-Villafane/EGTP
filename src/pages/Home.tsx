import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HeroSection } from '../components/HeroSection'
import { TalentGrid } from '../components/TalentGrid'
import { TrophyScene } from '../components/TrophyScene'
import { subscribeApprovedTalents } from '../services/talentService'
import { subscribeSettings } from '../services/settingsService'
import { getVote, castVote } from '../services/voteService'
import type { Talent } from '../types/talent'
import type { EventSettings } from '../types/settings'

const DEFAULT_SETTINGS: EventSettings = {
  registrationOpen: true, votingOpen: false, showResults: false,
  eventTitle: 'EGTP Got Talent', registrationDeadline: null, votingDeadline: null,
}

export function Home() {
  const { firebaseUser, appUser } = useAuth()
  const [talents,      setTalents]      = useState<Talent[]>([])
  const [settings,     setSettings]     = useState<EventSettings>(DEFAULT_SETTINGS)
  const [userVotedFor, setUserVotedFor] = useState<string | null>(null)
  const [voteError,    setVoteError]    = useState('')

  // scroll ref compartido con Three.js (sin re-renders)
  const scrollRef      = useRef(0)
  const canvasWrapRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      scrollRef.current = progress
      if (canvasWrapRef.current) {
        // fade out al alejarse del hero
        canvasWrapRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.4))
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const unsubT = subscribeApprovedTalents(setTalents)
    const unsubS = subscribeSettings(setSettings)
    return () => { unsubT(); unsubS() }
  }, [])

  useEffect(() => {
    if (!firebaseUser) { setUserVotedFor(null); return }
    getVote(firebaseUser.uid).then((v) => setUserVotedFor(v ? v.talentId : null))
  }, [firebaseUser])

  async function handleVote(talentId: string) {
    if (!firebaseUser) return
    setVoteError('')
    try {
      await castVote(firebaseUser.uid, talentId)
      setUserVotedFor(talentId)
    } catch (err) {
      setVoteError(err instanceof Error ? err.message : 'Error al votar.')
      throw err
    }
  }

  const isAdmin = appUser?.role === 'admin'

  return (
    <>
      {/* Canvas 3D fijo — cubre toda la viewport, desaparece al scrollear */}
      <div
        ref={canvasWrapRef}
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ transition: 'opacity 0.1s linear' }}
      >
        <TrophyScene scrollRef={scrollRef} className="w-full h-full" />
      </div>

      <HeroSection settings={settings} participantCount={talents.length} />

      {/* Secciones de contenido: z-[2] y bg sólido tapan el canvas al scrollear */}
      <div className="relative z-[2] bg-background">
        {voteError && (
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <p className="glass-panel border border-error/40 text-error rounded-xl px-4 py-3 text-sm">{voteError}</p>
          </div>
        )}

        <TalentGrid
          talents={talents}
          userVotedFor={userVotedFor}
          votingOpen={settings.votingOpen}
          currentUserId={firebaseUser?.uid ?? null}
          onVote={handleVote}
          showVoteCount={isAdmin || settings.showResults}
        />

        {/* Banner de resultados — visible para todos cuando showResults=true, o solo admin como preview */}
        {(settings.showResults || isAdmin) && (
          <div className="py-16 bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <Link
                to="/resultados"
                className="glass-panel neon-glow-primary border border-primary/40 rounded-3xl p-8 flex items-center justify-between gap-6 hover:bg-primary/10 transition-all group"
              >
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    {settings.showResults ? '¡Ya disponibles!' : 'Solo admins · Preview'}
                  </p>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase">Ver resultados</h2>
                  <p className="text-on-surface-variant text-sm mt-1">Ranking final de votos del concurso.</p>
                </div>
                <div className="text-primary group-hover:translate-x-1 transition-transform text-4xl font-black">→</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
