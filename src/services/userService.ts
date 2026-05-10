import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { AppUser, UserRole } from '../types/user'

const COL = () => collection(db, 'users')

export function subscribeAllUsers(callback: (users: AppUser[]) => void): Unsubscribe {
  return onSnapshot(COL(), (snap) => {
    callback(snap.docs.map((d) => d.data() as AppUser))
  })
}

export async function getAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(COL())
  return snap.docs.map((d) => d.data() as AppUser)
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { role })
}
