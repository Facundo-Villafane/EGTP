import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { HeroSection } from '../components/HeroSection'
import { RegistrationForm } from '../components/RegistrationForm'
import { TalentGrid } from '../components/TalentGrid'
import { ResultsSection } from '../components/ResultsSection'
import { subscribeApprovedTalents } from '../services/talentService'
import { subscribeSettings } from '../services/settingsService'
import { getVote, castVote } from '../services/voteService'
import type { Talent } from '../types/talent'
import type { EventSettings } from '../types/settings'

const DEFAULT_SETTINGS: EventSettings = {
  registrationOpen:     true,
  votingOpen:           false,
  showResults:          false,
  eventTitle:           'EGTP Got Talent',
  registrationDeadline: null,
  votingDeadline:       null,
}

export function Home() {
  const { firebaseUser, appUser } = useAuth()

  const [talents,      setTalents]      = useState<Talent[]>([])
  const [settings,     setSettings]     = useState<EventSettings>(DEFAULT_SETTINGS)
  const [userVotedFor, setUserVotedFor] = useState<string | null>(null)
  const [voteError,    setVoteError]    = useState('')

  // Subscribe to approved talents and settings
  useEffect(() => {
    const unsubT = subscribeApprovedTalents(setTalents)
    const unsubS = subscribeSettings(setSettings)
    return () => { unsubT(); unsubS() }
  }, [])

  // Load user's existing vote
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
      <HeroSection settings={settings} participantCount={talents.length} />

      <RegistrationForm registrationOpen={settings.registrationOpen} />

      <div id="votacion">
        {voteError && (
          <div className="max-w-4xl mx-auto px-4 pt-4">
            <p className="text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">{voteError}</p>
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
      </div>

      <ResultsSection
        talents={talents}
        showResults={settings.showResults}
        isAdmin={isAdmin}
      />
    </>
  )
}
