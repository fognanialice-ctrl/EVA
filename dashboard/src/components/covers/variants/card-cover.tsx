import type { CoverProps } from '@/lib/covers/cover-types'
import { CARD_COLOR_CONFIGS, type CardColorStyleId } from '@/lib/covers/card-presets'

export function CardCover({ event, format }: CoverProps) {
  const isStory = format === 'story'
  const colorId = (event.cardColorStyle || 'cream') as CardColorStyleId
  const color = CARD_COLOR_CONFIGS[colorId]
  const text = event.cardText || ''
  const isLong = text.length > 120
  const isItalic = event.cardItalic ?? false
  const interactive = event.cardInteractive
  const photoUrl = event.cardPhotoUrl
  const overlayOpacity = event.cardOverlayOpacity ?? 0.4

  const feedTextSize = isLong ? 44 : 52
  const storyTextSize = isLong ? 48 : 56
  const textSize = isStory ? storyTextSize : feedTextSize

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: color.bg,
      }}
    >
      {/* Photo background */}
      {photoUrl && (
        <>
          <img
            src={photoUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: color.bg,
              opacity: overlayOpacity,
            }}
          />
        </>
      )}

      {/* Content layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          padding: '12%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Series label */}
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 22,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 48,
            fontWeight: 500,
            color: color.labelColor,
          }}
        >
          {event.cardSeriesLabel || ''}
        </div>

        {/* Accent line */}
        <div
          style={{
            width: 80,
            height: 4,
            marginBottom: 64,
            background: color.accent,
          }}
        />

        {/* Main text */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: textSize,
            fontWeight: 400,
            lineHeight: 1.45,
            whiteSpace: 'pre-line',
            fontStyle: isItalic ? 'italic' : 'normal',
            color: color.text,
          }}
        >
          {text}
        </div>

        {/* Interactive elements */}
        {interactive === 'poll' && (
          <div style={{ marginTop: 64, display: 'flex', gap: 24 }}>
            <div
              style={{
                flex: 1,
                padding: 24,
                borderRadius: 16,
                textAlign: 'center',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 28,
                fontWeight: 500,
                background: color.interactiveBg,
                color: color.interactiveText,
              }}
            >
              {event.cardOptionA || 'Sì'}
            </div>
            <div
              style={{
                flex: 1,
                padding: 24,
                borderRadius: 16,
                textAlign: 'center',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 28,
                fontWeight: 500,
                background: color.interactiveBg,
                color: color.interactiveText,
              }}
            >
              {event.cardOptionB || 'No'}
            </div>
          </div>
        )}

        {interactive === 'slider' && (
          <div style={{ marginTop: 64, width: '100%' }}>
            <div
              style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                position: 'relative',
                background: color.interactiveBg,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  right: '30%',
                  top: '50%',
                  transform: 'translate(50%, -50%)',
                  fontSize: 48,
                }}
              >
                {event.cardSliderEmoji || '❤️'}
              </span>
            </div>
          </div>
        )}

        {interactive === 'tot' && (
          <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                padding: 32,
                borderRadius: 24,
                textAlign: 'center',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 40,
                fontWeight: 400,
                background: color.interactiveBg,
                color: color.interactiveText,
              }}
            >
              {event.cardOptionA || 'A'}
            </div>
            <div
              style={{
                padding: 32,
                borderRadius: 24,
                textAlign: 'center',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 40,
                fontWeight: 400,
                background: color.interactiveBg,
                color: color.interactiveText,
              }}
            >
              {event.cardOptionB || 'B'}
            </div>
          </div>
        )}

        {interactive === 'qbox' && (
          <div
            style={{
              marginTop: 64,
              padding: 40,
              borderRadius: 24,
              textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 26,
              letterSpacing: '0.05em',
              background: color.interactiveBg,
              color: color.interactiveText,
              opacity: 0.6,
            }}
          >
            Tocca per rispondere...
          </div>
        )}

        {/* EVA watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            right: '10%',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26,
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: color.watermarkColor,
          }}
        >
          EVA
        </div>
      </div>
    </div>
  )
}
