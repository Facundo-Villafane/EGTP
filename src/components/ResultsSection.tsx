import type { Talent } from '../types/talent'

interface Props {
  talents: Talent[]
  showResults: boolean
  isAdmin: boolean
}

const MEDALS = ['🥇', '🥈', '🥉']

export function ResultsSection({ talents, showResults, isAdmin }: Props) {
  const sorted = [...talents].sort((a, b) => b.votesCount - a.votesCount)
  const visible = showResults || isAdmin

  return (
    <section id="resultados" className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-primary uppercase text-center mb-3">Resultados</h2>
          {!showResults && isAdmin && (
            <span className="glass-panel inline-block px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant">
              Solo visible para admins
            </span>
          )}
        </div>

        {!visible ? (
          <div className="glass-panel p-10 rounded-3xl text-center">
            <span className="text-5xl block mb-4">🔒</span>
            <p className="text-on-surface font-medium">Los resultados se revelarán al final del evento.</p>
            <p className="text-on-surface-variant text-sm mt-2">¡Seguí votando por tu talento favorito!</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center">
            <span className="text-5xl block mb-4">🎤</span>
            <p className="text-on-surface-variant">Todavía no hay votos registrados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((talent, idx) => (
              <div
                key={talent.id}
                className={`glass-panel flex items-center gap-4 p-4 sm:p-5 rounded-2xl ${idx === 0 ? 'ring-2 ring-primary neon-glow-primary' : ''}`}
              >
                <span className="text-3xl w-10 text-center flex-shrink-0">
                  {MEDALS[idx] ?? `${idx + 1}`}
                </span>
                <img
                  src={talent.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=bd00ff&color=fff`}
                  alt={talent.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
