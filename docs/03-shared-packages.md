# Shared Packages

This document explains the shared packages in the monorepo and how to use them across applications.

## Overview

Shared packages allow code reuse across backend and frontend applications. They use the `@kite/` namespace and are linked via PNPM workspaces.

## Packages

### 1. @kite/types

Central TypeScript type definitions shared across all applications.

**Location**: `packages/types`

#### Purpose

- Single source of truth for data models
- Ensure type consistency between backend and frontend
- Enable type-safe API communication
- Share validation schemas

#### Structure

```
packages/types/
├── src/
│   ├── index.ts              # Main export file
│   ├── user.types.ts         # User-related types
│   ├── auth.types.ts         # Authentication types
│   ├── post.types.ts         # Post-related types
│   ├── api.types.ts          # API response types
│   └── common.types.ts       # Common utility types
├── package.json
└── tsconfig.json
```

#### Key Type Files

**user.types.ts**
```typescript
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  mobile?: string;
  role?: UserRole;
  isActive?: boolean;
}
```

**auth.types.ts**
```typescript
export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
  otp?: string;
  clientType?: 'web' | 'admin';
}

export interface RegisterRequest {
  name: string;
  email: string;
  mobile?: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}
```

**post.types.ts**
```typescript
export type PostStatus = "DRAFT" | "PUBLISHED";

export interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  authorId: string;
  author?: User;
  isActive: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  status?: PostStatus;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: PostStatus;
}
```

**api.types.ts**
```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

#### Usage

**In Backend:**
```typescript
import type { User, CreateUserRequest } from "@kite/types";

export class UserService {
  async createUser(data: CreateUserRequest): Promise<User> {
    // Implementation
  }
}
```

**In Frontend:**
```typescript
import type { User, ApiResponse } from "@kite/types";

export const getUsersApi = () =>
  api.get<ApiResponse<User[]>>("/api/admin/users");
```

#### Adding New Types

1. Create or update a type file in `packages/types/src/`
2. Export the type from the file
3. Re-export from `packages/types/src/index.ts`
4. Use in backend and frontend

**Example:**
```typescript
// packages/types/src/event.types.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  organizerId: string;
}

// packages/types/src/index.ts
export * from "./event.types";
```

---

### 2. @kite/config

Shared configuration and constants.

**Location**: `packages/config`

#### Purpose

- Share configuration across apps
- Centralize constants and enums
- Environment-agnostic settings

#### Structure

```
packages/config/
├── src/
│   ├── index.ts              # Main export
│   ├── constants.ts          # App constants
│   └── validation.ts         # Shared validation rules
├── package.json
└── tsconfig.json
```

#### Key Files

**constants.ts**
```typescript
export const APP_NAME = "Kite";

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const POST_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  BIO_MAX_LENGTH: 500,
  TITLE_MAX_LENGTH: 200,
} as const;
```

**validation.ts**
```typescript
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_REGEX = /^[0-9]{10}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const isValidMobile = (mobile: string): boolean => {
  return MOBILE_REGEX.test(mobile);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8 && PASSWORD_REGEX.test(password);
};
```

#### Usage

```typescript
import { USER_ROLES, PAGINATION, isValidEmail } from "@kite/config";

// Use constants
const defaultRole = USER_ROLES.USER;
const pageSize = PAGINATION.DEFAULT_LIMIT;

// Use validation
if (isValidEmail(email)) {
  // Process email
}
```

---

### 3. @kite/ui

Shared React UI component library with Tailwind CSS v4 and CVA (class-variance-authority).

**Location**: `packages/ui`

#### Purpose

- Single source of truth for all UI components
- Consistent design system across all apps
- Type-safe component variants with CVA
- Tailwind CSS v4 with shared theme
- Zero duplication between apps

#### Structure

```
packages/ui/
├── src/
│   ├── index.ts                    # Main export file
│   ├── styles.css                  # Tailwind v4 config & theme
│   ├── components/
│   │   ├── alert-dialog.tsx       # Radix UI components
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx             # Button with CVA variants
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── tooltip.tsx
│   │   ├── empty-state.tsx        # Custom components
│   │   ├── loading.tsx
│   │   └── error-display.tsx
│   ├── lib/
│   │   └── utils.ts               # cn() utility
│   └── hooks/
│       └── use-mobile.ts          # Shared hooks
├── package.json
└── tsconfig.json
```

#### Key Components

**Button Component with CVA**
```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Input Component**
```typescript
import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

**utils.ts**
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Usage in Frontend Apps

```typescript
import { Button, Card, Input, cn } from "@kite/ui";

export function LoginPage() {
  return (
    <Card>
      <Input
        type="email"
        placeholder="Enter your email"
        className="mb-4"
      />
      <Input
        type="password"
        placeholder="Enter your password"
      />
      <Button variant="default" className="w-full mt-4">
        Sign In
      </Button>
      <Button variant="outline" className="w-full mt-2">
        Create Account
      </Button>
    </Card>
  );
}

// Using CVA variants
export function ActionButtons() {
  return (
    <div className="flex gap-2">
      <Button variant="default" size="lg">Primary Action</Button>
      <Button variant="secondary" size="lg">Secondary</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="ghost" size="icon">
        <Icon />
      </Button>
    </div>
  );
}

// Extending styles with className
export function CustomButton() {
  return (
    <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
      Custom Styled Button
    </Button>
  );
}
```

#### Adding New Components

1. Create component in `packages/ui/src/components/`
2. Use CVA for variants if applicable
3. Use `cn()` utility for class merging
4. Export from `packages/ui/src/index.ts`
5. Use in any frontend app

**Example:**
```typescript
// packages/ui/src/components/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// packages/ui/src/index.ts
export * from "./components/badge";
```

---

## Package Dependencies

### Installing in Apps

Each app's `package.json` includes shared packages:

```json
{
  "dependencies": {
    "@kite/types": "workspace:*",
    "@kite/config": "workspace:*",
    "@kite/ui": "workspace:*"
  }
}
```

The `workspace:*` protocol links to the local package.

### Importing Shared UI Styles

In each app's `src/index.css`, import the shared UI styles:

```css
/* Import shared UI styles from @kite/ui */
@import "@kite/ui/styles";

/* Import animation library */
@import "tw-animate-css";

/* App-specific theme overrides can be added here */
:root {
  /* Override CSS variables if needed */
  /* --primary: oklch(0.5 0.2 250); */
}
```

This imports the complete Tailwind v4 configuration and theme from `@kite/ui`.

### Version Management

All shared packages use version `1.0.0` and are versioned together. When updating:

```bash
# After making changes to a shared package
pnpm install  # Updates symlinks
pnpm build    # Rebuilds all apps
```

---

## Development Workflow

### Making Changes to Shared Packages

#### Adding a New Type

1. **Update the package** (e.g., add a new type)
   ```typescript
   // packages/types/src/comment.types.ts
   export interface Comment {
     id: string;
     content: string;
     postId: string;
     authorId: string;
   }
   ```

2. **Export from index**
   ```typescript
   // packages/types/src/index.ts
   export * from "./comment.types";
   ```

3. **Use in apps** - changes are immediately available
   ```typescript
   // apps/backend/src/modules/comments/comment.service.ts
   import type { Comment } from "@kite/types";
   ```

#### Adding a New UI Component

1. **Create component in packages/ui**
   ```typescript
   // packages/ui/src/components/tooltip.tsx
   import * as React from "react";
   import { cn } from "../lib/utils";

   export function Tooltip({ children, content }: TooltipProps) {
     // Implementation
   }
   ```

2. **Export from index**
   ```typescript
   // packages/ui/src/index.ts
   export * from "./components/tooltip";
   ```

3. **Use in apps** - import and use immediately
   ```typescript
   // apps/admin-panel/src/pages/dashboard.tsx
   import { Tooltip } from "@kite/ui";

   export function Dashboard() {
     return <Tooltip content="Help text">Hover me</Tooltip>;
   }
   ```

### Testing Changes

1. Update shared package
2. Apps in watch mode automatically pick up changes
3. TypeScript will show errors if breaking changes are made
4. Fix all errors before committing

---

## Best Practices

### 1. Types Package

- **Keep types pure**: No runtime code, only type definitions
- **Mirror backend models**: Types should match Prisma schema
- **Document complex types**: Add JSDoc comments
- **Use discriminated unions**: For type-safe polymorphism

### 2. Config Package

- **No environment-specific values**: Use constants, not env vars
- **Export typed constants**: Use `as const` for type inference
- **Group related constants**: Use objects to namespace

### 3. UI Package

- **Use CVA for variants**: Create type-safe component variants with class-variance-authority
- **Component composition**: Build complex components from simple ones (use Radix UI primitives)
- **Prop interfaces**: Always export prop types and VariantProps
- **Accessibility**: Include ARIA labels and keyboard navigation (Radix UI provides this)
- **Styling**: Use Tailwind classes with `cn()` utility for class merging
- **Forward refs**: Always use React.forwardRef for DOM components
- **Relative imports**: Use relative paths (../lib/utils) not @/ paths

### 4. General

- **Breaking changes**: Coordinate updates across all apps
- **Semantic versioning**: Follow semver for major changes
- **Documentation**: Update docs when adding new exports
- **Testing**: Test in both admin panel and web app

---

## Troubleshooting

### Types Not Updating

```bash
# Restart TypeScript server in VS Code
# Or reinstall dependencies
pnpm install
```

### Module Not Found

```bash
# Ensure package is in dependencies
# Check package.json has workspace:* reference
# Run pnpm install to update symlinks
```

### Build Errors

```bash
# Ensure all packages build successfully
pnpm --filter @kite/types build
pnpm --filter @kite/config build
pnpm --filter @kite/ui build
```

---

## Next Steps

- Learn how to [Create Backend APIs](./04-backend-development.md)
- Understand [Authentication System](./05-authentication-system.md)
- Explore [Frontend Development](./06-frontend-development.md)
