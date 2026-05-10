import { useState, useEffect } from 'react'
import { parseVideoUrl } from '../utils/videoEmbed'

const PROVIDER_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  vimeo:   'Vimeo',
  drive:   'Google Drive',
  unknown: 'Ver video',
}

const PROVIDER_COLORS: Record<string, string> = {
  youtube: 'bg-red-600',
  vimeo:   'bg-sky-500',
  drive:   'bg-emerald-500',
  unknown: 'bg-primary',
}

interface Props {
  url: string
  title: string
  isActive?: boolean      // controlado externamente
  onPlay?: () => void     // notifica al padre que se quiere reproducir
  expanded?: boolean      // si true, usa aspect ratio 16:9 más alto
}

export function VideoEmbed({ url, title, isActive = true, onPlay, expanded = false }: Props) {
  const [playing, setPlaying] = useState(false)
  const info = parseVideoUrl(url)

  // Al perder el foco activo, resetea al thumbnail (pausa)
  useEffect(() => {
    if (!isActive) setPlaying(false)
  }, [isActive])

  const aspectClass = expanded ? 'pt-[62%]' : 'pt-[56.25%]'

  const handlePlay = () => {
    onPlay?.()
    setPlaying(true)
  }

  const embedSrc = playing && isActive
    ? info.embedUrl + (info.provider === 'youtube' ? '&autoplay=1' : info.provider === 'vimeo' ? '&autoplay=1' : '')
    : null

  if (embedSrc) {
    return (
      <div className={`relative w-full rounded-xl overflow-hidden bg-black ${aspectClass}`}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      onClick={handlePlay}
      className="group relative w-full rounded-xl overflow-hidden bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ paddingTop: expanded ? '62%' : '56.25%' }}
      aria-label={`Reproducir: ${title}`}
    >
      {info.thumbnailUrl ? (
        <img
          src={info.thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-highest">
          <ProviderIcon provider={info.provider} />
        </div>
      )}

      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 ${PROVIDER_COLORS[info.provider]}`}>
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-white text-xs font-medium bg-black/50 px-2.5 py-0.5 rounded-full">
          {PROVIDER_LABELS[info.provider]}
        </span>
      </div>
    </button>
  )
}

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === 'youtube') {
    return (
      <svg className="w-12 h-12 text-red-500 opacity-60" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
        <polygon fill="white" points="9.545,15.568 15.818,12 9.545,8.432"/>
      </svg>
    )
  }
  if (provider === 'vimeo') {
    return (
      <svg className="w-10 h-10 text-sky-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 003.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.612-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.478 4.807z"/>
      </svg>
    )
  }
  return (
    <svg className="w-10 h-10 text-slate-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.82 11.295l-8.25 5.5a.75.75 0 01-1.07-.68V7.885a.75.75 0 011.07-.68l8.25 5.5a.75.75 0 010 1.59z"/>
    </svg>
  )
}
