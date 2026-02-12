/**
 * Capture functions for calendar save — follows the same pattern as cover-export.tsx
 * (temporarily remove scale transform, capture, restore)
 */

async function getExportElement(ref: HTMLDivElement): Promise<HTMLElement | null> {
  return ref.querySelector('[data-cover-export]') as HTMLElement | null
}

/** Small JPEG thumbnail for calendar display */
export async function captureThumbnail(ref: HTMLDivElement, maxWidth = 200): Promise<string> {
  const exportEl = await getExportElement(ref)
  if (!exportEl) throw new Error('Export element not found')

  const { default: html2canvas } = await import('html2canvas')

  const savedTransform = exportEl.style.transform
  exportEl.style.transform = 'none'

  const canvas = await html2canvas(exportEl, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    width: exportEl.offsetWidth,
    height: exportEl.offsetHeight,
  })

  exportEl.style.transform = savedTransform

  // Resize to thumbnail
  const ratio = maxWidth / canvas.width
  const thumbCanvas = document.createElement('canvas')
  thumbCanvas.width = maxWidth
  thumbCanvas.height = Math.round(canvas.height * ratio)
  const ctx = thumbCanvas.getContext('2d')!
  ctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height)

  return thumbCanvas.toDataURL('image/jpeg', 0.7)
}

/** Full-res PNG blob for export/download */
export async function captureFullImage(ref: HTMLDivElement): Promise<Blob> {
  const exportEl = await getExportElement(ref)
  if (!exportEl) throw new Error('Export element not found')

  const { default: html2canvas } = await import('html2canvas')

  const savedTransform = exportEl.style.transform
  exportEl.style.transform = 'none'

  const canvas = await html2canvas(exportEl, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    width: exportEl.offsetWidth,
    height: exportEl.offsetHeight,
  })

  exportEl.style.transform = savedTransform

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Failed to create blob'))),
      'image/png'
    )
  })
}
