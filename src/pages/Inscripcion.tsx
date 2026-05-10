import { useEffect, useState } from 'react'
import { subscribeSettings } from '../services/settingsService'
import { RegistrationForm } from '../components/RegistrationForm'
import type { EventSettings } from '../types/settings'

const DEFAULT: EventSettings = {
  registrationOpen: true, votingOpen: false, showResults: false,
  eventTitle: 'EGTP Got Talent', registrationDeadline: null, votingDeadline: null,
}

export function Inscripcion() {
  const [settings, setSettings] = useState<EventSettings>(DEFAULT)

  useEffect(() => {
    return subscribeSettings(setSettings)
  }, [])

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase">Inscripción</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Registrá tu talento y sumarte al concurso.</p>
        </div>
        <RegistrationForm registrationOpen={settings.registrationOpen} />
      </div>
    </div>
  )
}
