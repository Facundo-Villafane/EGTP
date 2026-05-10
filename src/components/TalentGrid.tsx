import { useState } from 'react'
import { motion } from 'motion/react'
import type { Talent } from '../types/talent'
import { TalentCard } from './TalentCard'
import { signInWithGoogle } from '../services/authService'
import { FaGoogle } from 'react-icons/fa'
import { FaTheaterMasks, FaGuitar, FaMicrophone, FaRunning, FaLaughBeam, FaPaintBrush, FaGamepad, FaEllipsisH } from 'react-icons/fa'
import { GiMagicHat, GiDramaMasks } from 'react-icons/gi'
import type { IconType } from 'react-icons'

const TYPE_ICONS: Record<string, IconType> = {
  'Música':             FaGuitar,
  'Canto':              FaMicrophone,
  'Baile':              FaRunning,
  'Humor / Stand-up':   FaLaughBeam,
  'Magia':              GiMagicHat,
  'Arte visual':        FaPaintBrush,
  'Actuación':          GiDramaMasks,
  'Gaming / Streaming': FaGamepad,
  'Otros':              FaEllipsisH,
}

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
  const [filter,        setFilter]        = useState<string>('all')
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  const usedTypes = [...new Set(talents.map((t) => t.talentType))]

  // Agrupados por categoría o lista filtrada plana
  const groups: { type: string; items: Talent[] }[] =
    filter === 'all'
      ? usedTypes.map((type) => ({ type, items: talents.filter((t) => t.talentType === type) }))
      : [{ type: filter, items: talents.filter((t) => t.talentType === filter) }]

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
              <FilterChip key={type} label={type} active={filter === type} onClick={() => setFilter(type)} />
            ))}
          </div>
        )}

        {/* Gate para no logueados */}
        {!currentUserId ? (
          <div className="glass-panel rounded-3xl p-16 text-center">
            <FaGoogle size={36} className="text-primary/40 mx-auto mb-4" />
            <p className="text-on-surface font-semibold mb-2">Iniciá sesión para ver los participantes</p>
            <p className="text-on-surface-variant text-sm mb-6">Solo usuarios registrados pueden ver y votar.</p>
            <button
              onClick={() => void signInWithGoogle()}
              className="btn-primary gap-2 mx-auto"
            >
              <FaGoogle size={14} />
              Ingresar con Google
            </button>
          </div>
        ) : talents.length === 0 ? (
          <div className="glass-panel rounded-3xl p-20 text-center">
            <FaTheaterMasks size={52} className="text-primary/40 mx-auto mb-4" />
            <p className="text-on-surface-variant text-lg">Todavía no hay talentos inscritos. ¡Sé el primero!</p>
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map(({ type, items }) => {
              const Icon = TYPE_ICONS[type]
              return (
                <div key={type}>
                  {/* Encabezado de categoría */}
                  <div className="flex items-center gap-3 mb-6">
                    {Icon && (
                      <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-primary" />
                      </div>
                    )}
                    <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">
                      {type}
                    </h3>
                    <span className="text-xs text-on-surface-variant font-medium bg-surface-container-low px-2 py-0.5 rounded-full">
                      {items.length} {items.length === 1 ? 'participante' : 'participantes'}
                    </span>
                    <div className="flex-1 h-px bg-outline-variant/30 ml-2" />
                  </div>

                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {items.map((talent) => {
                      const isActive = activeVideoId === talent.id
                      const hasVideo = talent.demoType === 'video' && !!talent.videoUrl
                      return (
                        <motion.div
                          key={talent.id}
                          layout
                          className={hasVideo && isActive ? 'sm:col-span-2' : ''}
                          transition={{ duration: 0.4, ease: 'easeInOut' }}
                        >
                          <TalentCard
                            talent={talent}
                            userVotedFor={userVotedFor}
                            votingOpen={votingOpen}
                            currentUserId={currentUserId}
                            onVote={onVote}
                            showVoteCount={showVoteCount}
                            isVideoActive={isActive}
                            onVideoActivate={() => setActiveVideoId(talent.id)}
                          />
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const Icon = TYPE_ICONS[label]
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'neon-border-pink bg-primary/10 text-primary'
          : 'border border-outline-variant text-on-surface-variant hover:bg-surface-bright/50'
      }`}
    >
      {Icon && <Icon size={13} />}
      {label}
    </button>
  )
}
