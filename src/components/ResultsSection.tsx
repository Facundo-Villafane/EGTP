import type { Talent } from '../types/talent'
import { Avatar } from './ui/Avatar'
import { FaLock, FaMicrophone } from 'react-icons/fa'

interface Props {
  talents: Talent[]
  showResults: boolean
  isAdmin: boolean
  compact?: boolean
}

const RANK_STYLE: Record<number, string> = {
  1: 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30',
  2: 'text-slate-300  bg-slate-300/10  border border-slate-300/30',
  3: 'text-amber-600  bg-amber-600/10  border border-amber-600/30',
}

function RankRow({ talent, rank }: { talent: Talent; rank: number }) {
  const rankStyle = RANK_STYLE[rank] ?? 'text-on-surface-variant bg-surface-container border border-outline-variant/30'
  return (
    <div className={`glass-panel flex items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all ${rank === 1 ? 'ring-2 ring-primary neon-glow-primary' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${rankStyle}`}>
        {rank}
      </div>
      <Avatar src={talent.photoURL} name={talent.name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-on-surface truncate">{talent.name}</p>
        <p className="text-sm text-primary font-medium">{talent.talentType}</p>
        <p className="text-sm text-on-surface-variant truncate">"{talent.presentationTitle}"</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-headline-md text-headline-md text-primary">{talent.votesCount}</p>
        <p className="text-xs text-on-surface-variant">{talent.votesCount === 1 ? 'voto' : 'votos'}</p>
      </div>
    </div>
  )
}

function ResultsList({ sorted, visible, showResults }: {
  sorted: Talent[]
  visible: boolean
  showResults: boolean
  talents: Talent[]
}) {
  if (!visible) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center">
        <FaLock size={44} className="text-primary/40 mx-auto mb-4" />
        <p className="text-on-surface font-medium">Los resultados se revelarán al final del evento.</p>
        <p className="text-on-surface-variant text-sm mt-2">¡Seguí votando por tu talento favorito!</p>
      </div>
    )
  }
  if (sorted.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center">
        <FaMicrophone size={44} className="text-primary/40 mx-auto mb-4" />
        <p className="text-on-surface-variant">Todavía no hay votos registrados.</p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {sorted.map((talent, idx) => <RankRow key={talent.id} talent={talent} rank={idx + 1} />)}
    </div>
  )
}

export function ResultsSection({ talents, showResults, isAdmin, compact = false }: Props) {
  const sorted  = [...talents].sort((a, b) => b.votesCount - a.votesCount)
  const visible = showResults || isAdmin

  if (compact) {
    return <ResultsList sorted={sorted} visible={visible} showResults={showResults} talents={talents} />
  }

  return (
    <section id="resultados" className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-primary uppercase mb-3">Resultados</h2>
          {!showResults && isAdmin && (
            <span className="glass-panel inline-block px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant">
              Solo visible para admins
            </span>
          )}
        </div>
        <ResultsList sorted={sorted} visible={visible} showResults={showResults} talents={talents} />
      </div>
    </section>
  )
}
