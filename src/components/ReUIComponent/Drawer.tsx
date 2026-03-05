'use client'

import { DrawerClose, DrawerContent as DrawerContentPrimitive, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import * as React from 'react'
import { Drawer as VaulDrawer } from 'vaul'

// === Types ===
type DrawerDirection = 'right' | 'left' | 'top' | 'bottom'
type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

type DrawerProps = React.ComponentProps<typeof VaulDrawer.Root> & {
  direction?: DrawerDirection
}

interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DrawerContentPrimitive> {
  side?: DrawerDirection // alias for direction (for backward compatibility)
  size?: DrawerSize
  showCloseButton?: boolean
}

interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

// === Size variants (with data attribute for proper specificity) ===
const sizeVariants: Record<DrawerSize, string> = {
  sm: 'data-[vaul-drawer-direction=right]:sm:max-w-sm data-[vaul-drawer-direction=left]:sm:max-w-sm sm:max-w-sm',
  md: 'data-[vaul-drawer-direction=right]:sm:max-w-md data-[vaul-drawer-direction=left]:sm:max-w-md sm:max-w-md',
  lg: 'data-[vaul-drawer-direction=right]:sm:max-w-lg data-[vaul-drawer-direction=left]:sm:max-w-lg sm:max-w-lg',
  xl: 'data-[vaul-drawer-direction=right]:sm:max-w-xl data-[vaul-drawer-direction=left]:sm:max-w-xl sm:max-w-xl',
  full: 'data-[vaul-drawer-direction=right]:sm:max-w-full data-[vaul-drawer-direction=left]:sm:max-w-full sm:max-w-full',
}

// === Enhanced Drawer Component ===
const Drawer = ({ direction = 'right', ...props }: DrawerProps) => {
  return <VaulDrawer.Root direction={direction} {...props} />
}

// === Enhanced DrawerContent with size & close button ===
const DrawerContent = React.forwardRef<React.ComponentRef<typeof DrawerContentPrimitive>, DrawerContentProps>(({ className, children, side, size = 'md', showCloseButton = false, ...props }, ref) => {
  const sizeClass = sizeVariants[size]

  return (
    <DrawerContentPrimitive ref={ref} className={cn(sizeClass, className)} {...props}>
      {showCloseButton && (
        <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
          <X className="h-5 w-5" />
          <span className="sr-only">Đóng</span>
        </DrawerClose>
      )}
      {children}
    </DrawerContentPrimitive>
  )
})
DrawerContent.displayName = 'DrawerContent'

// === DrawerBody component (not in ui/drawer) ===
const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(({ className, ...props }, ref) => <div ref={ref} data-slot="drawer-body" className={cn('flex-1 overflow-y-auto px-4', className)} {...props} />)
DrawerBody.displayName = 'DrawerBody'

// === Exports ===
export { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger }

export type { DrawerBodyProps, DrawerContentProps, DrawerDirection, DrawerProps, DrawerSize }
