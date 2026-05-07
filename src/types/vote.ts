import { Timestamp } from 'firebase/firestore'

export interface Vote {
  userId: string
  talentId: string
  createdAt: Timestamp
}
