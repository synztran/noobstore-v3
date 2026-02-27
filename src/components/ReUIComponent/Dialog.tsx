'use client'

import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import * as React from 'react'

const dialogContentVariants = cva(
  'flex flex-col fixed outline-0 z-50 border border-border bg-background shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
  {
    variants: {
      variant: {
        default: 'w-full',
        fullscreen: 'inset-5',
      },
      size: {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full',
      },
      height: {
        auto: 'h-auto',
        xs: 'h-[20vh]',
        sm: 'h-[40vh]',
        md: 'h-[60vh]',
        lg: 'h-[80vh]',
        xl: 'h-[90vh]',
        full: 'h-[95vh]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
      height: 'auto',
    },
  }
)

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn('fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)} {...props} />
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  overlay = true,
  variant,
  size,
  height,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    showCloseButton?: boolean
    overlay?: boolean
  }) {
  return (
    <DialogPortal>
      {overlay && <DialogOverlay />}
      <DialogPrimitive.Content data-slot="dialog-content" className={cn(dialogContentVariants({ variant, size, height }), className)} {...props}>
        {children}
        {showCloseButton && (
          <DialogClose className="cursor-pointer outline-0 absolute end-5 top-5 rounded-sm opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

export default DialogContent

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div data-slot="dialog-header" className={cn('flex flex-col space-y-1 text-center sm:text-start pb-4 bg-background border-b border-border px-6 pt-6 flex-shrink-0', className)} {...props} />

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div data-slot="dialog-footer" className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-3 bg-background border-t border-border px-6 pb-6 pt-4 flex-shrink-0', className)} {...props} />

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div data-slot="dialog-body" className={cn('flex-1 overflow-y-auto px-6 py-4 min-h-0', className)} {...props} />

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger }
