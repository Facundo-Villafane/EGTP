import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Vote } from '../types/vote'

const COL = 'votes'

export async function getVote(userId: string): Promise<Vote | null> {
  const snap = await getDoc(doc(db, COL, userId))
  return snap.exists() ? (snap.data() as Vote) : null
}

export async function castVote(userId: string, talentId: string): Promise<void> {
  const voteRef   = doc(db, COL, userId)
  const talentRef = doc(db, 'talents', talentId)

  await runTransaction(db, async (tx) => {
    const voteSnap = await tx.get(voteRef)
    if (voteSnap.exists()) throw new Error('Ya votaste anteriormente.')

    const talentSnap = await tx.get(talentRef)
    if (!talentSnap.exists()) throw new Error('El talento no existe.')

    const currentCount = (talentSnap.data().votesCount as number) ?? 0

    tx.set(voteRef, {
      userId,
      talentId,
      createdAt: serverTimestamp(),
    })

    tx.update(talentRef, { votesCount: currentCount + 1 })
  })
}

export async function hasVoted(userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, COL, userId))
  return snap.exists()
}
