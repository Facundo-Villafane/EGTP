import { useState } from 'react'
import type { Talent } from '../types/talent'
import { TalentCard } from './TalentCard'

interface Props {
  talents: Talent[]
  userVotedFor: string | null
  votingOpen: boolean
  currentUserId: string | null
  onVote: (talentId: string) => Promise<void>
  showVoteCount?: boolean
}

export function TalentGrid({
  talents,
  userVotedFor,
  votingOpen,
  currentUserId,
  onVote,
  showVoteCount = false,
}: Props) {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? talents
    : talents.filter((t) => t.talentType === filter)

  const usedTypes = [...new Set(talents.map((t) => t.talentType))]

  return (
    <section id="talentos" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-primary uppercase mb-3">Galería de talentos</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Conocé a todos los participantes del concurso.</p>
        </div>

        {/* Filters */}
        {usedTypes.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <FilterChip label="Todos" active={filter === 'all'} onClick={() => setFilter('all')} />
            {usedTypes.map((type) => (
              <FilterChip
                key={type}
                label={type}
                active={filter === type}
                onClick={() => setFilter(type)}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="glass-panel rounded-3xl p-20 text-center">
            <span className="text-5xl block mb-4">🎭</span>
            <p className="text-on-surface-variant text-lg">
              {talents.length === 0
                ? 'Todavía no hay talentos inscritos. ¡Sé el primero!'
                : 'No hay participantes en esta categoría.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filtered.map((talent) => (
              <TalentCard
                key={talent.id}
                talent={talent}
                userVotedFor={userVotedFor}
                votingOpen={votingOpen}
                currentUserId={currentUserId}
                onVote={onVote}
                showVoteCount={showVoteCount}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'neon-border-pink bg-primary/10 text-primary'
          : 'border border-outline-variant text-on-surface-variant hover:bg-surface-bright/50'
      }`}
    >
      {label}
    </button>
  )
}
