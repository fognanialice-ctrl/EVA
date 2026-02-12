import type { CoverProps } from '@/lib/covers/cover-types'
import { defaultTextStyle } from '@/lib/covers/cover-types'

export function TypeOnlyCover({ event, theme, format, textStyle }: CoverProps) {
  const isStory = format === 'story'
  const style = { ...defaultTextStyle, ...textStyle }
  const titleLines = event.title.split('\n')
  const footer = style.footerText || `${event.venue} — ${event.city}`

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: theme.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isStory ? '160px 80px' : '80px',
        position: 'relative',
        fontFamily: "'Cormorant Garamond', serif",
        overflow: 'hidden',
      }}
    >
      {/* Top: EVA wordmark */}
      <div
        style={{
          position: 'absolute',
          top: isStory ? 100 : 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: theme.textMuted,
        }}
      >
        EVA
      </div>

      {/* Gold accent line above title */}
      <div
        style={{
          width: 60,
          height: 1,
          background: theme.accent,
          marginBottom: 48,
        }}
      />

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        {titleLines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: i === 0 ? 96 : 88,
              fontWeight: 400,
              color: theme.text,
              lineHeight: 1.05,
              letterSpacing: '0.06em',
              fontStyle: style.titleItalic ? 'italic' : 'normal',
              textTransform: style.titleUppercase ? 'uppercase' : 'none',
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Gold accent line below title */}
      <div
        style={{
          width: 60,
          height: 1,
          background: theme.accent,
          marginBottom: 48,
        }}
      />

      {/* Tagline */}
      {event.tagline && (
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: theme.accent,
            marginBottom: 16,
          }}
        >
          {event.tagline}
        </div>
      )}

      {/* Subtitle */}
      {event.subtitle && (
        <div style={{ marginBottom: 16 }}>
          {event.subtitle.split('\n').map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 42,
                fontWeight: 600,
                fontStyle: 'italic',
                color: theme.textMuted,
                lineHeight: 1.2,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Bottom info */}
      <div
        style={{
          position: 'absolute',
          bottom: isStory ? 100 : 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 24,
            fontWeight: 300,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: theme.accent,
            marginBottom: 10,
          }}
        >
          {event.date}
        </div>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 20,
            fontWeight: 300,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: theme.textMuted,
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  )
}
