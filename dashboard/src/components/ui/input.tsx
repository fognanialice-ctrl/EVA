import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-sans text-warm-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-none border border-stone bg-white px-3 py-2',
            'text-sm font-body text-warm-text placeholder:text-warm-muted',
            'focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta',
            'disabled:bg-cream-alt disabled:text-warm-muted disabled:cursor-not-allowed',
            error && 'border-dusty-rose focus:ring-dusty-rose/40 focus:border-dusty-rose',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-body text-dusty-rose mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-sans text-warm-text"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-none border border-stone bg-white px-3 py-2',
            'text-sm font-body text-warm-text placeholder:text-warm-muted',
            'focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta',
            'disabled:bg-cream-alt disabled:text-warm-muted disabled:cursor-not-allowed',
            'resize-y min-h-[80px]',
            error && 'border-dusty-rose focus:ring-dusty-rose/40 focus:border-dusty-rose',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-body text-dusty-rose mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
