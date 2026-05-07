import { Timestamp } from 'firebase/firestore'

export type DemoType    = 'video' | 'live'
export type TalentStatus = 'pending' | 'approved' | 'rejected'

export const TALENT_TYPES = [
  'Música',
  'Canto',
  'Baile',
  'Humor / Stand-up',
  'Magia',
  'Arte visual',
  'Actuación',
  'Gaming / Streaming',
  'Otros',
] as const

export type TalentType = (typeof TALENT_TYPES)[number]

export interface Talent {
  id: string
  userId: string
  name: string
  email: string
  photoURL: string
  talentType: string
  presentationTitle: string
  description: string
  demoType: DemoType
  videoUrl?: string
  status: TalentStatus
  votesCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type TalentInput = Omit<Talent, 'id' | 'status' | 'votesCount' | 'createdAt' | 'updatedAt'>
