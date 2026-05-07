import type { Talent } from '../types/talent'
import { DemoBadge } from './StatusBadge'
import { VoteButton } from './VoteButton'
import { VideoEmbed } from './VideoEmbed'

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

  const hasVideo = talent.demoType === 'video' && !!talent.videoUrl

  return (
    <article className="card overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Video embed or gradient header */}
      {hasVideo ? (
        <div className="p-3 pb-0">
          <VideoEmbed url={talent.videoUrl!} title={talent.presentationTitle} />
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-brand-600 to-accent-500 p-6 pb-10 text-center">
          <img
            src={talent.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=5563f6&color=fff`}
            alt={talent.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
          />
        </div>
      )}

      {/* Content */}
      <div className={`p-5 flex flex-col flex-1 ${!hasVideo ? '-mt-6' : 'mt-3'}`}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4">
          {/* Author row — shown inline for video cards since there's no header */}
          {hasVideo && (
            <div className="flex items-center gap-3 mb-3">
              <img
                src={talent.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=5563f6&color=fff`}
                alt={talent.name}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-sm leading-tight truncate">{talent.name}</p>
                <p className="text-brand-600 font-medium text-xs">{talent.talentType}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <DemoBadge demoType={talent.demoType} />
              </div>
            </div>
          )}

          {!hasVideo && (
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-lg leading-tight">{talent.name}</h3>
              <DemoBadge demoType={talent.demoType} />
            </div>
          )}
          {!hasVideo && (
            <p className="text-brand-600 font-medium text-sm mb-2">{talent.talentType}</p>
          )}

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
