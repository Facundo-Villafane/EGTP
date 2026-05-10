import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Talent, TalentInput, TalentStatus } from '../types/talent'

const COL = 'talents'

export async function createTalent(input: TalentInput): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    status:     'pending',
    votesCount: 0,
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
  })
  return ref.id
}

export async function getUserTalent(userId: string): Promise<Talent | null> {
  const q    = query(collection(db, COL), where('userId', '==', userId))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Talent
}

export async function getTalent(id: string): Promise<Talent | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Talent
}

export function subscribeApprovedTalents(callback: (talents: Talent[]) => void): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('status', '==', 'approved'),
  )
  return onSnapshot(q, (snap) => {
    const talents = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as Talent)
      .sort((a, b) => b.votesCount - a.votesCount)
    callback(talents)
  })
}

export function subscribeAllTalents(callback: (talents: Talent[]) => void): Unsubscribe {
  const q = query(collection(db, COL), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Talent))
  })
}

export async function updateTalentStatus(id: string, status: TalentStatus): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() })
}

export async function updateTalent(id: string, data: Partial<TalentInput>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, status: 'pending', updatedAt: serverTimestamp() })
}

export async function patchTalent(id: string, data: Record<string, unknown>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteTalent(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}

export async function incrementVoteCount(talentId: string): Promise<void> {
  const ref  = doc(db, COL, talentId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const current = (snap.data().votesCount as number) ?? 0
  await updateDoc(ref, { votesCount: current + 1 })
}
