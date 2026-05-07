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
    <section id="resultados" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Resultados</h2>
          {!showResults && isAdmin && (
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
              Solo visible para admins
            </span>
          )}
        </div>

        {!visible ? (
          <div className="card p-10 text-center">
            <span className="text-5xl block mb-4">🔒</span>
            <p className="text-slate-600 font-medium">Los resultados se revelarán al final del evento.</p>
            <p className="text-slate-400 text-sm mt-2">¡Seguí votando por tu talento favorito!</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="card p-10 text-center">
            <span className="text-5xl block mb-4">🎤</span>
            <p className="text-slate-500">Todavía no hay votos registrados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((talent, idx) => (
              <div
                key={talent.id}
                className={`card flex items-center gap-4 p-4 sm:p-5 ${idx === 0 ? 'ring-2 ring-brand-400 shadow-md' : ''}`}
              >
                <span className="text-3xl w-10 text-center flex-shrink-0">
                  {MEDALS[idx] ?? `${idx + 1}`}
                </span>
                <img
                  src={talent.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=5563f6&color=fff`}
                  alt={talent.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{talent.name}</p>
                  <p className="text-sm text-brand-600 font-medium">{talent.talentType}</p>
                  <p className="text-sm text-slate-500 truncate">"{talent.presentationTitle}"</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-brand-700">{talent.votesCount}</p>
                  <p className="text-xs text-slate-400">{talent.votesCount === 1 ? 'voto' : 'votos'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
