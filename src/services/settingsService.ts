import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { EventSettings } from '../types/settings'

const REF = () => doc(db, 'settings', 'event')

const DEFAULTS: EventSettings = {
  registrationOpen:     true,
  votingOpen:           false,
  showResults:          false,
  eventTitle:           'EGTP Got Talent',
  registrationDeadline: null,
  votingDeadline:       null,
}

export async function getSettings(): Promise<EventSettings> {
  const snap = await getDoc(REF())
  if (!snap.exists()) return DEFAULTS
  return snap.data() as EventSettings
}

export function subscribeSettings(callback: (s: EventSettings) => void): Unsubscribe {
  return onSnapshot(REF(), (snap) => {
    callback(snap.exists() ? (snap.data() as EventSettings) : DEFAULTS)
  })
}

export async function updateSettings(patch: Partial<EventSettings>): Promise<void> {
  await setDoc(REF(), patch, { merge: true })
}
