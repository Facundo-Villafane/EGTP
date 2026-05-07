export type VideoProvider = 'youtube' | 'vimeo' | 'drive' | 'unknown'

export interface VideoEmbedInfo {
  provider: VideoProvider
  embedUrl: string
  thumbnailUrl: string | null
}

export function parseVideoUrl(url: string): VideoEmbedInfo {
  try {
    const u = new URL(url)

    // YouTube: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/shorts/ID
    const ytMatch =
      u.hostname.includes('youtube.com') && (u.searchParams.get('v') ?? u.pathname.split('/').pop()) ||
      u.hostname === 'youtu.be' && u.pathname.slice(1)

    if (ytMatch && u.hostname !== 'drive.google.com') {
      const id = typeof ytMatch === 'string' ? ytMatch : ''
      if (id) {
        return {
          provider:     'youtube',
          embedUrl:     `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
          thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        }
      }
    }

    // Vimeo: vimeo.com/ID
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop() ?? ''
      if (id && /^\d+$/.test(id)) {
        return {
          provider:     'vimeo',
          embedUrl:     `https://player.vimeo.com/video/${id}?badge=0&autopause=0`,
          thumbnailUrl: null, // Vimeo thumbnail requires API call — skip for MVP
        }
      }
    }

    // Google Drive: drive.google.com/file/d/FILE_ID/view
    const driveMatch = u.pathname.match(/\/file\/d\/([^/]+)/)
    if (u.hostname.includes('drive.google.com') && driveMatch) {
      const id = driveMatch[1]
      return {
        provider:     'drive',
        embedUrl:     `https://drive.google.com/file/d/${id}/preview`,
        thumbnailUrl: null,
      }
    }

    return { provider: 'unknown', embedUrl: url, thumbnailUrl: null }
  } catch {
    return { provider: 'unknown', embedUrl: url, thumbnailUrl: null }
  }
}
