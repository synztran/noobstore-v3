# Dialog Component

A comprehensive dialog component built with Base UI and styled with Tailwind CSS, following REUI design patterns.

## Features

- ✅ **Accessible** - Built on Base UI with proper ARIA attributes
- ✅ **Customizable** - Multiple size and styling variants
- ✅ **Controlled & Uncontrolled** - Supports both usage patterns
- ✅ **Animations** - Smooth enter/exit animations
- ✅ **Backdrop Options** - Configurable blur effects
- ✅ **TypeScript** - Full type safety
- ✅ **Composable** - Flexible component composition

## Installation

Make sure you have the required dependencies:

```bash
npm install @base-ui/react class-variance-authority lucide-react
```

## Basic Usage

```tsx
import {
  Dialog,
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
} from "@/ReUIComponent/Dialog";
import { Button } from "@/ReUIComponent/Button";

function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a description of what the dialog does.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}
```

## Controlled Usage

```tsx
import { useState } from "react";

function ControlledDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      </DialogTrigger>
      {/* ... rest of dialog content */}
    </Dialog>
  );
}
```

## Component API

### Dialog (Root)

The main container component that manages dialog state.

| Prop           | Type                      | Default     | Description                               |
| -------------- | ------------------------- | ----------- | ----------------------------------------- |
| `open`         | `boolean`                 | `undefined` | Controlled open state                     |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes          |
| `defaultOpen`  | `boolean`                 | `false`     | Default open state for uncontrolled usage |

### DialogContent

The main content container with styling variants.

| Prop        | Type                                                                                           | Default | Description                |
| ----------- | ---------------------------------------------------------------------------------------------- | ------- | -------------------------- |
| `size`      | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl" \| "6xl" \| "7xl" \| "full"` | `"md"`  | Dialog size                |
| `rounded`   | `"none" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "full"`                           | `"lg"`  | Border radius              |
| `showClose` | `boolean`                                                                                      | `true`  | Show/hide the close button |

### DialogBackdrop

The backdrop overlay with blur options.

| Prop   | Type                             | Default | Description             |
| ------ | -------------------------------- | ------- | ----------------------- |
| `blur` | `"none" \| "sm" \| "md" \| "lg"` | `"sm"`  | Backdrop blur intensity |

## Examples

### Custom Styled Dialog

```tsx
<DialogContent
  size="xl"
  rounded="2xl"
  className="bg-gradient-to-br from-blue-50 to-indigo-100"
  showClose={false}
>
  {/* content */}
</DialogContent>
```

### Form Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Form</Button>
  </DialogTrigger>
  <DialogPortal>
    <DialogBackdrop />
    <DialogViewport>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Contact Form</DialogTitle>
          <DialogDescription>
            Fill out the form below to get in touch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* form fields */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogViewport>
  </DialogPortal>
</Dialog>
```

### Heavy Backdrop Blur

```tsx
<DialogBackdrop blur="lg" />
```

## Accessibility

The Dialog component includes:

- Proper focus management
- Keyboard navigation (Escape to close)
- ARIA attributes for screen readers
- Focus trapping within the dialog
- Backdrop click to close

## Animation Classes

The component uses these Tailwind animation classes:

- `data-[state=open]:animate-in` - Enter animation
- `data-[state=closed]:animate-out` - Exit animation
- `data-[state=open]:fade-in-0` - Fade in
- `data-[state=closed]:fade-out-0` - Fade out
- `data-[state=open]:zoom-in-95` - Scale in
- `data-[state=closed]:zoom-out-95` - Scale out

## CSS Variables

The component uses these CSS variables for theming:

- `--background` - Dialog background color
- `--foreground` - Text color
- `--muted-foreground` - Muted text color
- `--ring` - Focus ring color
- `--border` - Border color

## Migration from MUI Dialog

If you're migrating from MUI Dialog:

```tsx
// Before (MUI)
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </DialogActions>
</Dialog>

// After (REUI)
<Dialog open={open} onOpenChange={setOpen}>
  <DialogPortal>
    <DialogBackdrop />
    <DialogViewport>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        <div>Content</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </DialogViewport>
  </DialogPortal>
</Dialog>
```
