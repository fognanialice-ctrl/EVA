import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn('w-full border-collapse', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('border-b border-stone', className)}
      {...props}
    />
  )
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn('[&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-stone/50', className)}
      {...props}
    />
  )
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-cream-alt/50',
        className
      )}
      {...props}
    />
  )
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-sans font-medium uppercase tracking-wider text-warm-muted',
        className
      )}
      {...props}
    />
  )
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-sm font-body text-warm-text',
        className
      )}
      {...props}
    />
  )
}
