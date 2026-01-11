import React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

// Dialog Context
interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

// Dialog Root - Main container
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const DialogRoot = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: DialogProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

// Dialog Trigger - Button that opens the dialog
interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const DialogTrigger = ({
  asChild,
  children,
  className,
  onClick,
}: DialogTriggerProps) => {
  const { onOpenChange } = useDialog();

  const handleClick = () => {
    onOpenChange(true);
    onClick?.();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

// Dialog Portal - Moves dialog to document body
interface DialogPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

const DialogPortal = ({ children, container }: DialogPortalProps) => {
  const { open } = useDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !open) return null;

  if (typeof window !== "undefined") {
    const portalRoot = container || document.body;
    return createPortal(children, portalRoot);
  }

  return null;
};

// Dialog Backdrop variants
const backdropVariants = cva(
  "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  {
    variants: {
      blur: {
        none: "",
        sm: "backdrop-blur-sm",
        md: "backdrop-blur-md",
        lg: "backdrop-blur-lg",
      },
    },
    defaultVariants: {
      blur: "sm",
    },
  }
);

// Dialog Backdrop
interface DialogBackdropProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof backdropVariants> {}

const DialogBackdrop = React.forwardRef<HTMLDivElement, DialogBackdropProps>(
  ({ className, blur, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialog();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
      onClick?.(e);
    };

    return (
      <div
        ref={ref}
        className={cn(backdropVariants({ blur }), className)}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
DialogBackdrop.displayName = "DialogBackdrop";

// Dialog Viewport - Positioning container
const DialogViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      className
    )}
    {...props}
  />
));
DialogViewport.displayName = "DialogViewport";

// Dialog Content variants
const contentVariants = cva(
  "relative z-50 grid w-full gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      rounded: "lg",
    },
  }
);

// Dialog Content
interface DialogContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof contentVariants> {
  showClose?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, size, rounded, showClose = true, children, ...props }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          // Will be handled by DialogClose or parent
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus management
    useEffect(() => {
      if (contentRef.current) {
        contentRef.current.focus();
      }
    }, []);

    return (
      <div
        ref={ref}
        className={cn(contentVariants({ size, rounded }), className)}
        tabIndex={-1}
        {...props}
      >
        {children}
        {showClose && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </div>
    );
  }
);
DialogContent.displayName = "DialogContent";

// Dialog Header
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// Dialog Footer
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

// Dialog Title
const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// Dialog Description
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

// Dialog Close
interface DialogCloseProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const DialogClose = ({
  asChild,
  children,
  className,
  onClick,
}: DialogCloseProps) => {
  const { onOpenChange } = useDialog();

  const handleClick = () => {
    onOpenChange(false);
    onClick?.();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

// Export all components
export {
  DialogRoot as Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};

// Export types
export type { DialogContentProps };
