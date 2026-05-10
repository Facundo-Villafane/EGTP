import { useState } from 'react'
import type { Talent } from '../types/talent'
import { FaCheck, FaThumbsUp } from 'react-icons/fa'

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
      <p className="text-on-surface-variant/50 text-xs text-center py-2">
        La votación no está abierta todavía.
      </p>
    )
  }

  if (votedThis) {
    return (
      <div className="glass-panel neon-glow-primary w-full py-3 rounded-xl text-primary font-bold text-sm flex items-center justify-center gap-2">
        <FaCheck size={14} />
        ¡Votaste por este talento!
      </div>
    )
  }

  if (hasVoted) {
    return (
      <p className="text-on-surface-variant/50 text-xs text-center py-2">
        Ya emitiste tu voto.
      </p>
    )
  }

  if (confirming) {
    return (
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <p className="text-center text-on-surface-variant text-sm px-2">
          ¿Confirmás tu voto para <span className="text-primary font-bold">{talent.name}</span>?
          <br />
          <span className="text-xs text-on-surface-variant/60">Esta acción no se puede cambiar.</span>
        </p>
        {error && <p className="text-error text-xs text-center">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={() => { setConfirming(false); setError('') }}
            className="glass-panel flex-1 py-2 rounded-xl text-sm text-on-surface-variant hover:text-on-surface transition-colors"
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
            className="buzzer-btn flex-1 py-2 rounded-xl text-sm font-bold text-white uppercase"
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
      className="buzzer-btn w-full py-4 rounded-xl font-headline-md text-headline-md text-white uppercase tracking-widest flex items-center justify-center gap-3"
    >
      <FaThumbsUp size={18} />
      Votar
    </button>
  )
}
