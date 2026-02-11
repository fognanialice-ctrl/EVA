import type { CoverProps } from '@/lib/covers/cover-types'
import { defaultTextStyle } from '@/lib/covers/cover-types'

export function NoirCover({ event, theme, format, textStyle }: CoverProps) {
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
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {/* B&W venue photo — positioned in upper portion */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: isStory ? '55%' : '60%',
          overflow: 'hidden',
        }}
      >
        <img
          src={event.photos.interior}
          alt=""
          className="cover-img-noir"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
          }}
        />
        {/* Gradient fade to background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(
              to bottom,
              ${theme.background}00 0%,
              ${theme.background}10 35%,
              ${theme.background}60 65%,
              ${theme.background}CC 85%,
              ${theme.background} 100%
            )`,
          }}
        />
        {/* Subtle burgundy tint */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(107, 45, 62, 0.15)',
            mixBlendMode: 'color',
          }}
        />
      </div>

      {/* Content layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: isStory ? '100px 72px' : '60px 72px',
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          {titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: i === 0 ? 88 : 80,
                fontWeight: 300,
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

        {/* Gold accent line */}
        <div
          style={{
            width: 50,
            height: 1,
            background: theme.accent,
            marginBottom: 32,
          }}
        />

        {/* Date + footer block */}
        <div style={{ marginBottom: isStory ? 40 : 0 }}>
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

        {/* EVA watermark */}
        <div
          style={{
            position: 'absolute',
            top: isStory ? 100 : 60,
            right: 72,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: theme.accent,
            opacity: 0.6,
          }}
        >
          EVA
        </div>
      </div>
    </div>
  )
}
