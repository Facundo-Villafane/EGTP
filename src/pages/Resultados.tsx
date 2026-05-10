import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeApprovedTalents } from '../services/talentService'
import { subscribeSettings } from '../services/settingsService'
import { ResultsSection } from '../components/ResultsSection'
import { TrophySingle } from '../components/TrophySingle'
import type { Talent } from '../types/talent'
import type { EventSettings } from '../types/settings'

const DEFAULT: EventSettings = {
  registrationOpen: true, votingOpen: false, showResults: false,
  eventTitle: 'EGTP Got Talent', registrationDeadline: null, votingDeadline: null,
}

export function Resultados() {
  const { appUser } = useAuth()
  const [talents,  setTalents]  = useState<Talent[]>([])
  const [settings, setSettings] = useState<EventSettings>(DEFAULT)

  useEffect(() => {
    const unsubT = subscribeApprovedTalents(setTalents)
    const unsubS = subscribeSettings(setSettings)
    return () => { unsubT(); unsubS() }
  }, [])

  const isAdmin = appUser?.role === 'admin'

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Trofeo grande — mitad derecha, fijo */}
      <div className="fixed top-0 right-0 w-1/2 h-full z-[1] pointer-events-none">
        <TrophySingle className="w-full h-full" />
      </div>

      {/* Contenido — mitad izquierda con z-[2] para estar sobre el trofeo */}
      <div className="relative z-[2] max-w-2xl px-4 sm:px-6 py-16 ml-0 lg:ml-16">
        <div className="mb-10">
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase">Resultados</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Ranking final de votos del concurso.</p>
          {!settings.showResults && isAdmin && (
            <span className="mt-3 inline-block glass-panel px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant">
              Solo visible para admins
            </span>
          )}
        </div>

        <ResultsSection
          talents={talents}
          showResults={settings.showResults}
          isAdmin={isAdmin}
          compact
        />
      </div>
    </div>
  )
}
