import { GiMagicHat, GiDramaMasks } from 'react-icons/gi'
import { FaMicrophone, FaGamepad, FaPaintBrush, FaLaughBeam, FaGuitar, FaEllipsisH, FaTheaterMasks, FaRunning } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { TALENT_TYPES } from '../../types/talent'

const ICONS: Record<string, IconType> = {
  'Música':             FaGuitar,
  'Canto':              FaMicrophone,
  'Baile':              FaRunning,
  'Humor / Stand-up':   FaLaughBeam,
  'Magia':              GiMagicHat,
  'Arte visual':        FaPaintBrush,
  'Actuación':          FaTheaterMasks,
  'Gaming / Streaming': FaGamepad,
  'Otros':              FaEllipsisH,
}

interface Props {
  value: string
  onChange: (v: string) => void
}

export function TalentTypePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {TALENT_TYPES.map((type) => {
        const Icon = ICONS[type]
        const selected = value === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 group ${
              selected
                ? 'border-primary bg-primary/20 shadow-lg shadow-primary/20'
                : 'border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-primary/10'
            }`}
          >
            <Icon
              size={28}
              className={`transition-colors ${selected ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}
            />
            <span
              className={`text-[11px] font-semibold text-center leading-tight transition-colors ${
                selected ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
              }`}
            >
              {type}
            </span>
          </button>
        )
      })}
    </div>
  )
}
