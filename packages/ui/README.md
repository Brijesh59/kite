# @kite/ui

Shared UI component library built with Tailwind CSS v4, CVA (class-variance-authority), and Radix UI primitives. Provides a complete set of accessible, customizable components for both admin-panel and web-app.

## Overview

This package provides:
- **22+ UI Components** - Complete component library with variants
- **Tailwind CSS v4** - Modern CSS-first approach with shared theme
- **CVA Variants** - Type-safe component variants
- **Radix UI Primitives** - Accessible, unstyled components
- **Shared Theme** - OKLCH colors with light/dark mode support
- **Utility Functions** - cn() for class merging, hooks for responsive behavior

## Installation

This package is automatically linked via PNPM workspaces:

```json
{
  "dependencies": {
    "@kite/ui": "workspace:*"
  }
}
```

## Usage

### Importing Styles

In your app's `src/index.css`:

```css
/* Import shared UI styles */
@import "@kite/ui/styles";

/* Import animation library */
@import "tw-animate-css";

/* Optional: Override theme variables */
:root {
  --primary: oklch(0.5 0.2 250); /* Custom primary color */
}
```

### Importing Components

```typescript
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardContent,
  Label,
  cn,
} from "@kite/ui";
```

## Components

### Form Components
- **Button** - 6 variants (default, destructive, outline, secondary, ghost, link), 4 sizes
- **Input** - Text input with focus/error states
- **Textarea** - Multi-line text input
- **Label** - Form labels
- **Select** - Dropdown select with search
- **Checkbox** - Checkbox with label
- **Switch** - Toggle switch
- **Form** - Form context from React Hook Form

### Layout Components
- **Card** - Card container with header, content, footer
- **Separator** - Horizontal/vertical divider
- **Tabs** - Tab navigation
- **Sheet** - Slide-over panel
- **Sidebar** - App sidebar with collapsible sections
- **Table** - Data table with header, body, rows

### Feedback Components
- **Dialog** - Modal dialogs
- **AlertDialog** - Confirmation dialogs
- **Tooltip** - Hover tooltips
- **Skeleton** - Loading placeholders
- **Badge** - Status badges
- **Avatar** - User avatars

### Navigation Components
- **Breadcrumb** - Breadcrumb navigation
- **DropdownMenu** - Context menus

### Utilities
- **Loading** - Loading spinner component
- **EmptyState** - Empty state placeholders
- **ErrorDisplay** - Error message display

## Component Examples

### Button with CVA Variants

```typescript
import { Button } from "@kite/ui";

// Different variants
<Button variant="default">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="link">Link Style</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// Custom styling with className
<Button className="rounded-full">Custom</Button>

// Using asChild for Link
<Button asChild>
  <Link to="/posts">View Posts</Link>
</Button>
```

### Form Components

```typescript
import { Input, Label, Textarea, Select } from "@kite/ui";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter email"
    aria-invalid={!!errors.email}
  />
</div>

<div className="space-y-2">
  <Label htmlFor="bio">Bio</Label>
  <Textarea
    id="bio"
    placeholder="Tell us about yourself"
    rows={4}
  />
</div>
```

### Card Component

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@kite/ui";

<Card>
  <CardHeader>
    <CardTitle>Post Title</CardTitle>
    <CardDescription>Posted on {date}</CardDescription>
  </CardHeader>
  <CardContent>
    <p>{content}</p>
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Edit</Button>
    <Button variant="destructive">Delete</Button>
  </CardFooter>
</Card>
```

### Dialog Component

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "@kite/ui";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this item?
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

## Utilities

### cn() Function

Merge Tailwind CSS classes with proper precedence:

```typescript
import { cn } from "@kite/ui";

// Conditional classes
<div className={cn(
  "text-lg font-medium",
  isActive && "text-blue-600",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  Content
</div>

// Override component variants
<Button className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
  Custom Button
</Button>
```

### useIsMobile Hook

Detect mobile viewports:

```typescript
import { useIsMobile } from "@kite/ui";

export function ResponsiveComponent() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## Theme Customization

### CSS Variables

The theme uses OKLCH color format for better color manipulation:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.978 0 0);
  /* ... more colors */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.978 0 0);
  /* ... dark mode colors */
}
```

### Extending in Apps

Apps can override theme variables:

```css
/* apps/admin-panel/src/index.css */
@import "@kite/ui/styles";

:root {
  /* Custom primary color for admin panel */
  --primary: oklch(0.5 0.2 250);
}
```

## Adding New Components

1. **Create component** in `src/components/`:

```typescript
// src/components/alert.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "rounded-md border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "bg-destructive/10 text-destructive border-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div className={cn(alertVariants({ variant }), className)} {...props} />;
}
```

2. **Export from index**:

```typescript
// src/index.ts
export * from "./components/alert";
```

3. **Use in apps**:

```typescript
import { Alert } from "@kite/ui";

<Alert variant="destructive">Error message</Alert>
```

## File Structure

```
packages/ui/
├── src/
│   ├── index.ts                 # Main exports
│   ├── styles.css               # Tailwind v4 config & theme
│   ├── components/              # All UI components (22+)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts             # cn() utility
│   └── hooks/
│       └── use-mobile.ts        # Responsive hook
├── package.json
└── tsconfig.json
```

## Best Practices

### Component Development
- ✅ Use CVA for variants
- ✅ Use React.forwardRef for DOM components
- ✅ Export prop interfaces and VariantProps
- ✅ Use Radix UI primitives for complex components
- ✅ Use cn() for class merging
- ✅ Use relative imports (../lib/utils)

### Styling
- ✅ Use Tailwind utility classes
- ✅ Define variants with CVA
- ✅ Use CSS custom properties for theme colors
- ✅ Support className prop for extension

### Accessibility
- ✅ Include ARIA labels
- ✅ Support keyboard navigation
- ✅ Use Radix UI for built-in a11y
- ✅ Test with screen readers

## Dependencies

### Required
- `class-variance-authority` - Type-safe variants
- `clsx` - Class concatenation
- `tailwind-merge` - Tailwind class merging
- `lucide-react` - Icons
- `@radix-ui/*` - UI primitives (22 packages)

### Peer Dependencies
- `react` ^18.3.1
- `react-dom` ^18.3.1

## TypeScript Support

Full TypeScript support with:
- Exported prop interfaces
- VariantProps from CVA
- Proper ref typing with forwardRef
- Auto-completion for variants

## Related Documentation

- [Shared Packages](../../docs/03-shared-packages.md#3-kiteui) - Complete @kite/ui documentation
- [Frontend Development](../../docs/06-frontend-development.md#ui-components) - Using components in apps
- [Development Workflow](../../docs/07-development-workflow.md) - Adding new components

---

**Package Version**: 1.0.0  
**License**: MIT
