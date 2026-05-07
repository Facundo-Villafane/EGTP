import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'
import type { AppUser } from '../types/user'

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(auth, googleProvider)
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function syncUserToFirestore(firebaseUser: User): Promise<AppUser> {
  const ref  = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    await setDoc(ref, { lastLoginAt: serverTimestamp() }, { merge: true })
    return snap.data() as AppUser
  }

  const newUser: Omit<AppUser, 'createdAt' | 'lastLoginAt'> & Record<string, unknown> = {
    uid:         firebaseUser.uid,
    displayName: firebaseUser.displayName ?? '',
    email:       firebaseUser.email ?? '',
    photoURL:    firebaseUser.photoURL ?? '',
    role:        'employee',
    createdAt:   serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  }

  await setDoc(ref, newUser)
  const created = await getDoc(ref)
  return created.data() as AppUser
}

export async function getAppUser(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as AppUser) : null
}
