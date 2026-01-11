# REUI Components

This folder contains REUI (React UI) components that follow modern design system principles.

## Button Component

A versatile button component built with class-variance-authority for consistent styling and behavior.

### Features

- **Multiple Variants**: default, destructive, outline, secondary, ghost, link
- **Multiple Sizes**: sm, default, lg, icon
- **Accessibility**: Proper focus states and keyboard navigation
- **TypeScript**: Full TypeScript support with proper types
- **Tailwind CSS**: Uses Tailwind CSS for styling with CSS variables for theming

### Usage

```tsx
import { Button } from '@/ReUIComponent';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🚀</Button>

// Disabled state
<Button disabled>Disabled</Button>

// With custom className
<Button className="w-full">Full Width</Button>

// With onClick handler
<Button onClick={() => console.log('Clicked!')}>
  Click me
</Button>
```

### Props

| Prop        | Type                                                                          | Default     | Description                               |
| ----------- | ----------------------------------------------------------------------------- | ----------- | ----------------------------------------- |
| `variant`   | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button style variant                      |
| `size`      | `'default' \| 'sm' \| 'lg' \| 'icon'`                                         | `'default'` | Button size                               |
| `asChild`   | `boolean`                                                                     | `false`     | Render as child element (for composition) |
| `className` | `string`                                                                      | -           | Additional CSS classes                    |
| `disabled`  | `boolean`                                                                     | `false`     | Disable the button                        |
| `onClick`   | `(event: MouseEvent) => void`                                                 | -           | Click handler                             |

### Styling

The button uses CSS variables for theming. You can customize the appearance by modifying the CSS variables in your global CSS:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}
```

### Dependencies

- `class-variance-authority` - For variant-based styling
- `clsx` - For conditional class names
- `tailwind-merge` - For merging Tailwind classes
- `@tailwindcss/postcss` - Tailwind CSS v4

### Example Component

See `ButtonExample.tsx` for a comprehensive example showing all variants and sizes.
