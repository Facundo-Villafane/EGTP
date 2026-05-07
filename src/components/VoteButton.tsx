import { useState } from 'react'
import type { Talent } from '../types/talent'

interface Props {
  talent: Talent
  votingOpen: boolean
  hasVoted: boolean
  votedThis: boolean
  onVote: () => Promise<void>
}

export function VoteButton({ talent, votingOpen, hasVoted, votedThis, onVote }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [voting,     setVoting]     = useState(false)
  const [error,      setError]      = useState('')

  if (!votingOpen) {
    return (
      <p className="text-center text-xs text-slate-400 py-2">
        La votación no está abierta todavía.
      </p>
    )
  }

  if (votedThis) {
    return (
      <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-semibold">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        ¡Votaste por este talento!
      </div>
    )
  }

  if (hasVoted) {
    return (
      <p className="text-center text-xs text-slate-400 py-2">
        Ya emitiste tu voto.
      </p>
    )
  }

  if (confirming) {
    return (
      <div className="space-y-2">
        <p className="text-center text-sm text-slate-700 font-medium px-2">
          ¿Confirmás tu voto para <span className="text-brand-700">{talent.name}</span>?
          <br />
          <span className="text-xs text-slate-400">Esta acción no se puede cambiar.</span>
        </p>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={() => { setConfirming(false); setError('') }}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            disabled={voting}
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              setVoting(true)
              setError('')
              try {
                await onVote()
                setConfirming(false)
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al votar.')
              } finally {
                setVoting(false)
              }
            }}
            disabled={voting}
            className="flex-1 btn-primary text-sm py-2"
          >
            {voting ? (
              <span className="flex items-center justify-center gap-1">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Votando...
              </span>
            ) : 'Confirmar voto'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="btn-primary w-full text-sm py-2.5 gap-2"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
      </svg>
      Votar
    </button>
  )
}
