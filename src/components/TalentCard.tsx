import type { Talent } from '../types/talent'
import { DemoBadge } from './StatusBadge'
import { VoteButton } from './VoteButton'
import { VideoEmbed } from './VideoEmbed'
import { Avatar } from './ui/Avatar'

interface Props {
  talent: Talent
  userVotedFor: string | null
  votingOpen: boolean
  currentUserId: string | null
  onVote: (talentId: string) => Promise<void>
  showVoteCount?: boolean
  isVideoActive?: boolean
  onVideoActivate?: () => void
}

export function TalentCard({
  talent,
  userVotedFor,
  votingOpen,
  currentUserId,
  onVote,
  showVoteCount = false,
  isVideoActive = false,
  onVideoActivate,
}: Props) {
  const isOwnTalent = currentUserId === talent.userId
  const hasVoted    = userVotedFor !== null
  const votedThis   = userVotedFor === talent.id

  const hasVideo = talent.demoType === 'video' && !!talent.videoUrl

  return (
    <article
      className={`glass-panel rounded-3xl overflow-hidden flex flex-col transition-shadow duration-300 ${
        isVideoActive ? 'ring-2 ring-primary shadow-2xl shadow-primary/30' : ''
      }`}
    >
      {/* Video embed or gradient header */}
      {hasVideo ? (
        <div className="p-3 pb-0">
          <VideoEmbed
          url={talent.videoUrl!}
          title={talent.presentationTitle}
          isActive={isVideoActive}
          onPlay={onVideoActivate}
          expanded={isVideoActive}
        />
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-primary-container to-tertiary-container p-6 pb-10 text-center">
          <Avatar src={talent.photoURL} name={talent.name} size="lg" className="w-20 h-20 border-4 border-surface shadow-lg mx-auto" />
          <span className="mt-3 inline-block bg-primary/20 text-primary border border-primary/40 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
            {talent.talentType}
          </span>
        </div>
      )}

      {/* Content */}
      <div className={`p-5 flex flex-col flex-1 ${!hasVideo ? '-mt-6' : 'mt-3'}`}>
        <div className="bg-surface-container/60 rounded-2xl p-4 mb-4 border-t border-white/10">
          {/* Author row — shown inline for video cards since there's no header */}
          {hasVideo && (
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={talent.photoURL} name={talent.name} size="sm" />
              <div className="min-w-0">
                <p className="font-bold text-on-surface text-sm leading-tight truncate">{talent.name}</p>
                <p className="text-primary font-medium text-xs">{talent.talentType}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <DemoBadge demoType={talent.demoType} />
              </div>
            </div>
          )}

          {!hasVideo && (
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-on-surface text-lg leading-tight">{talent.name}</h3>
              <DemoBadge demoType={talent.demoType} />
            </div>
          )}

          <p className="font-headline-md text-headline-md text-white">"{talent.presentationTitle}"</p>
          {talent.description && (
            <p className="text-on-surface-variant text-sm mt-2 line-clamp-3">{talent.description}</p>
          )}
        </div>

        <div className="mt-auto space-y-2 pt-2 border-t border-white/10">
          {showVoteCount && (
            <p className="text-center font-headline-md text-headline-md text-primary">
              {talent.votesCount} <span className="text-sm font-body-md text-on-surface-variant">{talent.votesCount === 1 ? 'voto' : 'votos'}</span>
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
            <p className="text-center text-xs text-on-surface-variant/50 py-2">Tu inscripción</p>
          )}
        </div>
      </div>
    </article>
  )
}
