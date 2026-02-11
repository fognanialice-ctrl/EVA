import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'border border-terracotta text-terracotta',
    'hover:bg-terracotta hover:text-white',
    'disabled:border-stone disabled:text-warm-muted disabled:hover:bg-transparent',
  ].join(' '),
  secondary: [
    'border border-stone text-warm-text',
    'hover:bg-stone/10',
    'disabled:border-stone/50 disabled:text-warm-muted disabled:hover:bg-transparent',
  ].join(' '),
  danger: [
    'border border-dusty-rose text-dusty-rose',
    'hover:bg-dusty-rose hover:text-white',
    'disabled:border-stone disabled:text-warm-muted disabled:hover:bg-transparent',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm font-body',
  md: 'px-4 py-2 text-sm font-sans',
  lg: 'px-6 py-3 text-base font-sans',
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-4 w-4', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-none transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        loading && 'cursor-wait opacity-80',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
