import type { CoverProps } from '@/lib/covers/cover-types'
import { defaultTextStyle } from '@/lib/covers/cover-types'

export function EditorialCover({ event, theme, format, textStyle }: CoverProps) {
  const isStory = format === 'story'
  const style = { ...defaultTextStyle, ...textStyle }
  const titleLines = event.title.split('\n')
  const footer = style.footerText || `${event.venue} — ${event.city}`

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {/* Full-bleed photo */}
      <img
        src={event.photos.hero}
        alt=""
        className="cover-img-editorial"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Color overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: style.overlayColor,
          opacity: style.overlayOpacity / 100,
        }}
      />
      {/* Bottom gradient for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent 50%,
            ${style.overlayColor}66 80%,
            ${style.overlayColor}AA 100%
          )`,
        }}
      />

      {/* Content layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isStory ? '100px 72px' : '60px 72px',
        }}
      >
        {/* Top: EVA wordmark */}
        <div
          style={{
            textAlign: 'center',
            fontFamily: "'Outfit', sans-serif",
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: theme.accent,
          }}
        >
          EVA
        </div>

        {/* Center: Title + tagline + subtitle */}
        <div style={{ textAlign: 'center' }}>
          {titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: i === 0 ? 104 : 96,
                fontWeight: 400,
                color: theme.text,
                lineHeight: 1.05,
                letterSpacing: '0.04em',
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                fontStyle: style.titleItalic ? 'italic' : 'normal',
                textTransform: style.titleUppercase ? 'uppercase' : 'none',
              }}
            >
              {line}
            </div>
          ))}
          {/* Gold accent line */}
          <div
            style={{
              width: 50,
              height: 2,
              background: theme.accent,
              margin: '32px auto 0',
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
                marginTop: 28,
                textShadow: '0 1px 8px rgba(0,0,0,0.3)',
              }}
            >
              {event.tagline}
            </div>
          )}
          {/* Subtitle */}
          {event.subtitle && event.subtitle.split('\n').map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 42,
                fontWeight: 600,
                fontStyle: 'italic',
                color: theme.text,
                marginTop: i === 0 ? 20 : 4,
                lineHeight: 1.2,
                textShadow: '0 2px 16px rgba(0,0,0,0.6)',
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Bottom: Date + Footer */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 24,
              fontWeight: 300,
              letterSpacing: '0.35em',
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
    </div>
  )
}
