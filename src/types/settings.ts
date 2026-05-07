import { Timestamp } from 'firebase/firestore'

export interface EventSettings {
  registrationOpen: boolean
  votingOpen: boolean
  showResults: boolean
  eventTitle: string
  registrationDeadline: Timestamp | null
  votingDeadline: Timestamp | null
}
