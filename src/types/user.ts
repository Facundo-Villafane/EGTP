import { Timestamp } from 'firebase/firestore'

export type UserRole = 'employee' | 'admin'

export interface AppUser {
  uid: string
  displayName: string
  email: string
  photoURL: string
  role: UserRole
  createdAt: Timestamp
  lastLoginAt: Timestamp
}
