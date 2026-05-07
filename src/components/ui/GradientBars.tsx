import { motion } from 'motion/react'

interface GradientBarsProps {
  bars?: number
  colors?: string[]
}

export function GradientBars({
  bars = 24,
  colors = ['#bd00ff', '#e7006e', 'transparent'],
}: GradientBarsProps) {
  const gradientStyle = `linear-gradient(to top, ${colors.join(', ')})`

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="flex h-full w-full">
        {Array.from({ length: bars }).map((_, index) => {
          const position  = index / (bars - 1)
          const center    = 0.5
          const distance  = Math.abs(position - center)
          const scale     = 0.3 + 0.7 * Math.pow(distance * 2, 1.2)

          return (
            <motion.div
              key={`bg-bar-${index}`}
              className="flex-1 origin-bottom"
              style={{ background: gradientStyle }}
              animate={{
                scaleY:  [scale, scale + 0.12, scale],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration:   3.5,
                ease:       'easeInOut',
                repeat:     Infinity,
                repeatType: 'mirror',
                delay:      index * 0.18,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
