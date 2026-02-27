'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Timeline Container
const Timeline = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('relative space-y-0', className)} {...props} />)
Timeline.displayName = 'Timeline'

// Timeline Item
interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean
  isCompleted?: boolean
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(({ className, isActive, isCompleted, ...props }, ref) => <div ref={ref} data-active={isActive} data-completed={isCompleted} className={cn('relative flex gap-4 pb-8 last:pb-0', className)} {...props} />)
TimelineItem.displayName = 'TimelineItem'

// Timeline Indicator variants
const timelineIndicatorVariants = cva('relative z-10 flex items-center justify-center rounded-full shrink-0', {
  variants: {
    variant: {
      default: 'bg-slate-200 dark:bg-slate-700',
      primary: 'bg-primary',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      muted: 'bg-slate-300 dark:bg-slate-600',
    },
    size: {
      sm: 'size-2',
      md: 'size-3',
      lg: 'size-4',
      icon: 'size-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

interface TimelineIndicatorProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof timelineIndicatorVariants> {
  hasRing?: boolean
  ringClassName?: string
  isPulsing?: boolean
}

const TimelineIndicator = React.forwardRef<HTMLDivElement, TimelineIndicatorProps>(({ className, variant, size, hasRing, ringClassName, isPulsing, children, ...props }, ref) => (
  <div ref={ref} className={cn(timelineIndicatorVariants({ variant, size }), hasRing && 'ring-4', hasRing && (variant === 'primary' ? 'ring-primary/20' : 'ring-white dark:ring-neutral-dark'), isPulsing && 'animate-pulse', className)} {...props}>
    {children}
  </div>
))
TimelineIndicator.displayName = 'TimelineIndicator'

// Timeline Connector (the line between items)
interface TimelineConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  isCompleted?: boolean
}

const TimelineConnector = React.forwardRef<HTMLDivElement, TimelineConnectorProps>(({ className, isCompleted, ...props }, ref) => <div ref={ref} className={cn('absolute left-[5px] top-3 -bottom-5 w-0.5', isCompleted ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700', className)} {...props} />)
TimelineConnector.displayName = 'TimelineConnector'

// Timeline Content (right side content)
const TimelineContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('flex-1 pt-0', className)} {...props} />)
TimelineContent.displayName = 'TimelineContent'

// Timeline Title
interface TimelineTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  isActive?: boolean
  isMuted?: boolean
}

const TimelineTitle = React.forwardRef<HTMLParagraphElement, TimelineTitleProps>(({ className, isActive, isMuted, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm font-semibold', isActive ? 'text-primary' : isMuted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white', className)} {...props} />
))
TimelineTitle.displayName = 'TimelineTitle'

// Timeline Description
interface TimelineDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  isMuted?: boolean
}

const TimelineDescription = React.forwardRef<HTMLParagraphElement, TimelineDescriptionProps>(({ className, isMuted, ...props }, ref) => <p ref={ref} className={cn('text-xs', isMuted ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400', className)} {...props} />)
TimelineDescription.displayName = 'TimelineDescription'

export { Timeline, TimelineItem, TimelineIndicator, TimelineConnector, TimelineContent, TimelineTitle, TimelineDescription, timelineIndicatorVariants }
export type { TimelineItemProps, TimelineIndicatorProps, TimelineConnectorProps, TimelineTitleProps, TimelineDescriptionProps }
