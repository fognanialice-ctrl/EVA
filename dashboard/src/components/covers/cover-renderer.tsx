'use client'

import { COVER_FORMATS, type CoverFormat, type CoverVariant, type CoverEventData, type CoverTheme, type CoverTextStyle } from '@/lib/covers/cover-types'
import { TypeOnlyCover } from './variants/type-only-cover'
import { EditorialCover } from './variants/editorial-cover'
import { NoirCover } from './variants/noir-cover'

interface CoverRendererProps {
  variant: CoverVariant
  format: CoverFormat
  event: CoverEventData
  theme: CoverTheme
  textStyle?: CoverTextStyle
  scale?: number
}

const variantComponents: Record<CoverVariant, React.ComponentType<{ event: CoverEventData; theme: CoverTheme; format: CoverFormat; textStyle?: CoverTextStyle }>> = {
  'type-only': TypeOnlyCover,
  'editorial': EditorialCover,
  'noir': NoirCover,
}

export function CoverRenderer({ variant, format, event, theme, textStyle, scale = 0.4 }: CoverRendererProps) {
  const { width, height } = COVER_FORMATS[format]
  const Component = variantComponents[variant]

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        data-cover-export
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <Component event={event} theme={theme} format={format} textStyle={textStyle} />
      </div>
    </div>
  )
}
