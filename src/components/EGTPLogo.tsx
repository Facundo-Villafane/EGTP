import epamLogo from './EPAM_LOGO_Black.svg'

interface EGTPLogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export function EGTPLogo({ size = 'md' }: EGTPLogoProps) {
  const heights = { sm: 22, md: 30, lg: 44 }
  const h = heights[size]
  const w = Math.round(h * (2459 / 867))

  const gap = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' }[size]
  const divider = { sm: 'h-5', md: 'h-7', lg: 'h-10' }[size]
  const gotTalent = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }[size]
  const badge = { sm: 'text-[10px] px-2 py-0.5', md: 'text-xs px-2.5 py-0.5', lg: 'text-sm px-3 py-1' }[size]

  return (
    <div className={`flex items-center ${gap} select-none`}>
      {/* EPAM SVG — black paths inverted to white on dark bg */}
      <img
        src={epamLogo}
        width={w}
        height={h}
        alt="EPAM"
        style={{ filter: 'brightness(0) invert(1)', display: 'block' }}
      />

      {/* divider */}
      <div className={`w-px ${divider} bg-outline`} />

      {/* Got Talent */}
      <span
        className={`${gotTalent} font-semibold text-on-surface tracking-wide`}
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Got Talent
      </span>

      {/* PALERMO badge */}
      <span
        className={`${badge} font-bold rounded-full bg-[#00eefc] text-[#003a3d] uppercase tracking-widest`}
      >
        Palermo
      </span>
    </div>
  )
}
