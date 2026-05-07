import type { Talent } from '../types/talent'
import { DemoBadge } from './StatusBadge'
import { VoteButton } from './VoteButton'

interface Props {
  talent: Talent
  userVotedFor: string | null
  votingOpen: boolean
  currentUserId: string | null
  onVote: (talentId: string) => Promise<void>
  showVoteCount?: boolean
}

export function TalentCard({
  talent,
  userVotedFor,
  votingOpen,
  currentUserId,
  onVote,
  showVoteCount = false,
}: Props) {
  const isOwnTalent = currentUserId === talent.userId
  const hasVoted    = userVotedFor !== null
  const votedThis   = userVotedFor === talent.id

  return (
    <article className="card overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Header with photo */}
      <div className="relative bg-gradient-to-br from-brand-600 to-accent-500 p-6 pb-10 text-center">
        <img
          src={talent.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=5563f6&color=fff`}
          alt={talent.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 -mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-lg leading-tight">{talent.name}</h3>
            <DemoBadge demoType={talent.demoType} />
          </div>
          <p className="text-brand-600 font-medium text-sm mb-2">{talent.talentType}</p>
          <p className="text-slate-700 font-semibold text-base">"{talent.presentationTitle}"</p>
          {talent.description && (
            <p className="text-slate-500 text-sm mt-2 line-clamp-3">{talent.description}</p>
          )}
        </div>

        <div className="mt-auto space-y-2">
          {showVoteCount && (
            <p className="text-center text-sm font-medium text-slate-500">
              {talent.votesCount} {talent.votesCount === 1 ? 'voto' : 'votos'}
            </p>
          )}

          {talent.demoType === 'video' && talent.videoUrl && (
            <a
              href={talent.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full text-sm py-2.5 gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Ver video
            </a>
          )}

          {currentUserId && !isOwnTalent && (
            <VoteButton
              talent={talent}
              votingOpen={votingOpen}
              hasVoted={hasVoted}
              votedThis={votedThis}
              onVote={() => onVote(talent.id)}
            />
          )}

          {isOwnTalent && (
            <p className="text-center text-xs text-slate-400 py-2">Tu inscripción</p>
          )}
        </div>
      </div>
    </article>
  )
}
