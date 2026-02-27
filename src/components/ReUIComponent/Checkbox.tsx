'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import * as React from 'react'

const checkboxVariants = cva(
  `
    peer shrink-0 border border-input shadow-xs shadow-black/5
    focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring
    disabled:cursor-not-allowed disabled:opacity-50
    data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary
    data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    transition-colors cursor-pointer
  `,
  {
    variants: {
      size: {
        sm: 'h-3.5 w-3.5 rounded-[3px]',
        md: 'h-4 w-4 rounded',
        lg: 'h-5 w-5 rounded-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, VariantProps<typeof checkboxVariants> {
  indicatorClassName?: string
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(({ className, size, indicatorClassName, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} data-slot="checkbox" className={cn(checkboxVariants({ size }), className)} {...props}>
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current', indicatorClassName)}>{props.checked === 'indeterminate' ? <MinusIcon className="h-3 w-3" /> : <CheckIcon className="h-3 w-3" />}</CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = 'Checkbox'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export { Checkbox, checkboxVariants }
