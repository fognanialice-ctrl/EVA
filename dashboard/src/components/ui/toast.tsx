'use client'

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const typeClasses: Record<ToastType, string> = {
  success: 'border-sage bg-sage/10 text-sage',
  error: 'border-dusty-rose bg-dusty-rose/10 text-dusty-rose',
  info: 'border-soft-blue bg-soft-blue/10 text-soft-blue',
}

const typeIcons: Record<ToastType, ReactNode> = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onDismiss(toast.id), 200)
    }, 4000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast.id, onDismiss])

  return (
    <div
      className={cn(
        'flex items-center gap-3 border rounded-none px-4 py-3 shadow-sm',
        'transition-all duration-200',
        isExiting
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100 animate-slide-in-right',
        typeClasses[toast.type]
      )}
    >
      <span className="flex-shrink-0">{typeIcons[toast.type]}</span>
      <p className="text-sm font-body flex-1">{toast.message}</p>
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onDismiss(toast.id), 200)
        }}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Chiudi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast deve essere usato dentro un ToastProvider')
  }
  return context
}
