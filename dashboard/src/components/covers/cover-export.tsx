'use client'

import { useCallback } from 'react'

interface CoverExportProps {
  targetRef: React.RefObject<HTMLDivElement | null>
  filename: string
}

export function CoverExport({ targetRef, filename }: CoverExportProps) {
  const handleExport = useCallback(async () => {
    if (!targetRef.current) return

    const exportEl = targetRef.current.querySelector('[data-cover-export]') as HTMLElement
    if (!exportEl) return

    const { default: html2canvas } = await import('html2canvas')

    // Temporarily remove the preview scale transform so html2canvas captures at full resolution
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

    // Restore the preview transform
    exportEl.style.transform = savedTransform

    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [targetRef, filename])

  return (
    <button
      onClick={handleExport}
      className="border border-stone px-4 py-2 text-sm font-sans text-warm-text hover:bg-stone/10 transition-colors duration-150"
    >
      Export PNG
    </button>
  )
}
