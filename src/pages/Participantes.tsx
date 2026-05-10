import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeApprovedTalents } from '../services/talentService'
import { subscribeSettings } from '../services/settingsService'
import { getVote, castVote } from '../services/voteService'
import { TalentGrid } from '../components/TalentGrid'
import { ResultsSection } from '../components/ResultsSection'
import type { Talent } from '../types/talent'
import type { EventSettings } from '../types/settings'

const DEFAULT: EventSettings = {
  registrationOpen: true, votingOpen: false, showResults: false,
  eventTitle: 'EGTP Got Talent', registrationDeadline: null, votingDeadline: null,
}

export function Participantes() {
  const { firebaseUser, appUser } = useAuth()
  const [talents,      setTalents]      = useState<Talent[]>([])
  const [settings,     setSettings]     = useState<EventSettings>(DEFAULT)
  const [userVotedFor, setUserVotedFor] = useState<string | null>(null)
  const [voteError,    setVoteError]    = useState('')

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
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase">Participantes</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            {settings.votingOpen ? 'Votá por tu talento favorito.' : 'Conocé a los participantes del concurso.'}
          </p>
        </div>

        {voteError && (
          <div className="mb-4 glass-panel border border-error/40 text-error rounded-xl px-4 py-3 text-sm">
            {voteError}
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

        <ResultsSection
          talents={talents}
          showResults={settings.showResults}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  )
}
