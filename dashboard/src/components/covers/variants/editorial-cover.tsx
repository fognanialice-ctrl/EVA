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

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.3) 0%,
            rgba(0,0,0,0.15) 30%,
            rgba(0,0,0,0.15) 50%,
            rgba(0,0,0,0.6) 80%,
            rgba(0,0,0,0.8) 100%
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
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: theme.accent,
          }}
        >
          EVA
        </div>

        {/* Center: Title */}
        <div style={{ textAlign: 'center' }}>
          {titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: i === 0 ? 104 : 96,
                fontWeight: 300,
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
              height: 1,
              background: theme.accent,
              margin: '32px auto 0',
            }}
          />
        </div>

        {/* Bottom: Date + Footer */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: theme.accent,
              marginBottom: 8,
            }}
          >
            {event.date}
          </div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
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
