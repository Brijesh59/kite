# Kite Admin Panel

Admin dashboard for managing users, posts, and system settings. Built with React 18, TanStack Query, Zustand, React Router v7, and Tailwind CSS v4.

## Overview

The admin panel provides a comprehensive interface for administrators to manage the Kite platform, including user management, content moderation, and system analytics.

## Features

- **User Management** - View, search, filter, and manage user accounts
- **Post Management** - Moderate user posts and content
- **Dashboard Analytics** - View key metrics and statistics
- **Settings** - Configure system settings and preferences
- **JWT Authentication** - Secure admin login with httpOnly cookies
- **Real-time Updates** - Automatic data refresh with TanStack Query
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode** - Theme support via Tailwind CSS v4

## Tech Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **TanStack Query v5** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS v4** - Styling with CSS-first approach
- **@kite/ui** - Shared component library
- **@kite/types** - Shared TypeScript types
- **@kite/config** - Shared configuration

## Project Structure

```
apps/admin-panel/
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with providers
│   ├── index.css                 # Global styles (imports @kite/ui/styles)
│   │
│   ├── api/                      # API integration layer
│   │   ├── auth/
│   │   │   └── index.ts         # Auth API functions
│   │   ├── users/
│   │   │   └── index.ts         # User management APIs
│   │   ├── posts/
│   │   │   └── index.ts         # Post management APIs
│   │   └── dashboard/
│   │       └── index.ts         # Dashboard stats APIs
│   │
│   ├── components/              # Reusable components
│   │   └── layout/
│   │       ├── app-sidebar.tsx  # Main navigation sidebar
│   │       ├── header.tsx       # Page header component
│   │       └── nav-user.tsx     # User navigation menu
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useSteps.ts         # Multi-step form hook
│   │   └── use-auth.ts         # Authentication hook
│   │
│   ├── lib/                     # Utilities and configuration
│   │   ├── react-query.ts      # TanStack Query setup
│   │   └── store.ts            # Zustand store configuration
│   │
│   ├── pages/                   # Route components
│   │   ├── auth/
│   │   │   ├── login.tsx       # Admin login page
│   │   │   ├── forget-password.tsx
│   │   │   └── reset-password.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── index.tsx       # Main dashboard
│   │   │   └── components/     # Dashboard-specific components
│   │   │       ├── stats-card.tsx
│   │   │       └── recent-activity.tsx
│   │   │
│   │   ├── users/
│   │   │   ├── index.tsx       # Users list page
│   │   │   └── components/
│   │   │       ├── user-table.tsx
│   │   │       ├── user-filters.tsx
│   │   │       └── edit-user-dialog.tsx
│   │   │
│   │   ├── posts/
│   │   │   ├── index.tsx       # Posts management
│   │   │   └── components/
│   │   │       ├── post-table.tsx
│   │   │       └── post-filters.tsx
│   │   │
│   │   └── settings/
│   │       └── index.tsx       # System settings
│   │
│   ├── routes/                  # Route configuration
│   │   ├── index.tsx           # Route definitions
│   │   ├── public/
│   │   │   └── routes.tsx      # Public routes (login, etc.)
│   │   └── protected/
│   │       └── routes.tsx      # Protected admin routes
│   │
│   └── utils/                   # Utility functions
│       ├── api.ts              # Axios instance configuration
│       └── format-date.ts      # Date formatting utilities
│
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration (optional overrides)
└── .env                        # Environment variables
```

## File Naming Conventions

### Components
- **Pages**: `lowercase-with-dashes.tsx` (e.g., `forget-password.tsx`)
- **Components**: `kebab-case.tsx` (e.g., `user-table.tsx`, `stats-card.tsx`)
- **Layout Components**: `kebab-case.tsx` (e.g., `app-sidebar.tsx`)

### Utilities and Hooks
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useSteps.ts`, `use-auth.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`)
- **API Files**: `index.ts` inside feature folders (e.g., `api/users/index.ts`)

### Types
- Import from `@kite/types` package
- Local types in `*.types.ts` files if needed

## Folder Organization

### `/pages`
Each page corresponds to a route and may contain:
- `index.tsx` - Main page component
- `components/` - Page-specific components (not shared elsewhere)

**Example**: Users page
```
pages/users/
├── index.tsx              # Users list page
└── components/
    ├── user-table.tsx     # User table component
    ├── user-filters.tsx   # Filter controls
    └── edit-user-dialog.tsx # Edit user modal
```

### `/components`
Shared components used across multiple pages:
- `/layout` - Layout components (sidebar, header)
- Other shared components go directly in `/components`

### `/api`
API integration organized by feature:
```
api/
├── auth/
│   └── index.ts          # login, logout, refresh
├── users/
│   └── index.ts          # getUsers, updateUser, deleteUser
└── posts/
    └── index.ts          # getPosts, moderatePost
```

Each API file exports:
- API functions (e.g., `getUsers`, `updateUser`)
- Re-exported types from `@kite/types`

### `/hooks`
Custom React hooks:
- App-specific hooks (e.g., `useSteps`)
- Feature hooks (e.g., `use-auth`)
- Shared hooks come from `@kite/ui` (e.g., `useIsMobile`)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Backend API running (see [backend README](../backend/README.md))

### Installation

From monorepo root:
```bash
pnpm install
```

### Environment Setup

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Kite Admin
```

### Development

```bash
# From monorepo root
pnpm dev:admin

# Or from this directory
pnpm dev
```

Admin panel runs at: http://localhost:5173

### Build

```bash
# From monorepo root
pnpm build:admin

# Or from this directory
pnpm build
```

## Key Features

### Authentication

Login page with JWT authentication:
- Email/password login
- Forgot password flow
- Password reset
- Session persistence with httpOnly cookies
- Automatic token refresh

**File**: [src/pages/auth/login.tsx](src/pages/auth/login.tsx)

### User Management

Admin interface for managing users:
- User list with pagination
- Search and filter capabilities
- User role management (USER, ADMIN)
- Activate/deactivate users
- View user details

**Files**:
- [src/pages/users/index.tsx](src/pages/users/index.tsx)
- [src/pages/users/components/user-table.tsx](src/pages/users/components/user-table.tsx)

### Post Management

Content moderation tools:
- View all user posts
- Filter by status (DRAFT, PUBLISHED)
- Search posts
- Moderate content

**Files**:
- [src/pages/posts/index.tsx](src/pages/posts/index.tsx)
- [src/pages/posts/components/post-table.tsx](src/pages/posts/components/post-table.tsx)

### Dashboard

Analytics and overview:
- User statistics
- Post metrics
- Recent activity
- System health

**File**: [src/pages/dashboard/index.tsx](src/pages/dashboard/index.tsx)

## State Management

### Server State (TanStack Query)

Used for API data:
```typescript
import { useQuery } from "@tanstack/react-query";
import { getUsersApi } from "@/api/users";

const { data, isLoading } = useQuery({
  queryKey: ["users", page, limit],
  queryFn: () => getUsersApi({ page, limit }),
});
```

**Configuration**: [src/lib/react-query.ts](src/lib/react-query.ts)

### Client State (Zustand)

Used for UI state and auth:
```typescript
import { useAuthStore } from "@/lib/store";

const { user, setUser } = useAuthStore();
```

**Configuration**: [src/lib/store.ts](src/lib/store.ts)

## Routing

React Router v7 with protected routes:

```typescript
// Public routes (no auth required)
/login
/forgot-password
/reset-password

// Protected routes (admin auth required)
/dashboard
/users
/posts
/settings
```

**Configuration**: [src/routes/index.tsx](src/routes/index.tsx)

## Styling

### Tailwind CSS v4

Imports shared theme from `@kite/ui`:
```css
/* src/index.css */
@import "@kite/ui/styles";
```

### Using UI Components

Import from `@kite/ui` package:
```typescript
import { Button, Input, Card, Table } from "@kite/ui";

<Button variant="default">Save</Button>
<Input placeholder="Search users..." />
```

### Custom Styles

Extend with className prop:
```typescript
<Button className="w-full rounded-full">
  Custom Button
</Button>
```

## API Integration

### Axios Instance

Configured in [src/utils/api.ts](src/utils/api.ts):
- Base URL from environment variable
- Automatic token refresh
- Request/response interceptors
- Error handling

### API Functions

Example API function:
```typescript
// src/api/users/index.ts
import { api } from "@/utils/api";
import type { User, ApiResponse, PaginatedResponse } from "@kite/types";

export const getUsersApi = (params: GetUsersQuery) =>
  api.get<ApiResponse<PaginatedResponse<User>>>("/api/admin/users", { params });

export const updateUserApi = (id: string, data: UpdateUserRequest) =>
  api.put<ApiResponse<{ user: User }>>(`/api/admin/users/${id}`, data);
```

## Common Patterns

### Data Fetching with Pagination

```typescript
const [page, setPage] = useState(1);
const limit = 10;

const { data, isLoading } = useQuery({
  queryKey: ["users", page, limit],
  queryFn: () => getUsersApi({ page, limit }),
});

const users = data?.data.data.items || [];
const total = data?.data.data.total || 0;
```

### Mutations with Optimistic Updates

```typescript
const queryClient = useQueryClient();

const { mutate: updateUser } = useMutation({
  mutationFn: (data) => updateUserApi(userId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    toast.success("User updated successfully");
  },
});
```

### Form Handling

```typescript
import { useState } from "react";
import { Button, Input, Label } from "@kite/ui";

const [formData, setFormData] = useState({ email: "", password: "" });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form submission
};

<form onSubmit={handleSubmit}>
  <Label>Email</Label>
  <Input
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  />
  <Button type="submit">Login</Button>
</form>
```

## Adding New Features

### 1. Add New Page

Create page component:
```bash
touch src/pages/analytics/index.tsx
mkdir src/pages/analytics/components
```

Define route in [src/routes/protected/routes.tsx](src/routes/protected/routes.tsx):
```typescript
{
  path: "/analytics",
  element: <AnalyticsPage />,
}
```

### 2. Add API Integration

Create API file:
```typescript
// src/api/analytics/index.ts
import { api } from "@/utils/api";
import type { ApiResponse } from "@kite/types";

export const getAnalyticsApi = () =>
  api.get<ApiResponse<Analytics>>("/api/admin/analytics");
```

### 3. Create Page Component

```typescript
// src/pages/analytics/index.tsx
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsApi } from "@/api/analytics";
import { Card } from "@kite/ui";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsApi,
  });

  return (
    <div>
      <h1>Analytics</h1>
      {/* Render analytics data */}
    </div>
  );
}
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | - |
| `VITE_APP_NAME` | Application name | No | `Kite Admin` |

## Scripts

```bash
pnpm dev          # Start development server (port 5173)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

## Best Practices

### Component Organization
- Keep page-specific components in `pages/*/components/`
- Share components across pages via `/components`
- Use `@kite/ui` for base UI components

### Type Safety
- Import types from `@kite/types`
- Define API response types explicitly
- Use TypeScript strict mode

### State Management
- Use TanStack Query for server data
- Use Zustand for client/UI state
- Avoid prop drilling with context when needed

### Performance
- Use React.memo for expensive components
- Implement pagination for large lists
- Use TanStack Query's built-in caching

### Code Quality
- Follow naming conventions
- Keep components focused and small
- Write reusable utility functions
- Add comments for complex logic

## Related Documentation

- [Monorepo Setup](../../docs/01-monorepo-setup.md) - Workspace configuration
- [Frontend Development](../../docs/06-frontend-development.md) - Frontend patterns
- [Shared UI Package](../../packages/ui/README.md) - Component library
- [Backend API](../backend/README.md) - API endpoints
- [Authentication](../../docs/05-authentication-system.md) - Auth flow

---

**Version**: 1.0.0
**Port**: 5173
**License**: MIT
