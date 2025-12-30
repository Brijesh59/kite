# Kite Web App

User-facing web application for creating and managing posts. Built with React 18, TanStack Query, Zustand, React Router v7, and Tailwind CSS v4.

## Overview

The web app provides a platform for users to create, edit, and publish content, manage their profiles, and interact with posts from other users.

## Features

- **User Dashboard** - Personal dashboard with post overview
- **Post Management** - Create, edit, publish, and delete posts
- **Rich Text Editor** - Advanced content editing capabilities
- **User Profile** - Profile management and customization
- **Onboarding Flow** - Multi-step user onboarding
- **JWT Authentication** - Secure user login with httpOnly cookies
- **Real-time Updates** - Automatic data refresh with TanStack Query
- **Responsive Design** - Optimized for mobile and desktop
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
apps/web-app/
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with providers
│   ├── index.css                 # Global styles (imports @kite/ui/styles)
│   │
│   ├── api/                      # API integration layer
│   │   ├── auth/
│   │   │   └── index.ts         # Auth API functions
│   │   ├── posts/
│   │   │   └── index.ts         # Post management APIs
│   │   └── profile/
│   │       └── index.ts         # Profile APIs
│   │
│   ├── components/              # Reusable components
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx  # Main navigation sidebar
│   │   │   ├── header.tsx       # Page header component
│   │   │   └── nav-user.tsx     # User navigation menu
│   │   └── editor/
│   │       └── rich-text-editor.tsx # Content editor
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
│   │   │   ├── login.tsx       # User login page
│   │   │   ├── forget-password.tsx
│   │   │   └── reset-password.tsx
│   │   │
│   │   ├── onboarding/
│   │   │   └── index.tsx       # Multi-step onboarding
│   │   │
│   │   ├── dashboard/
│   │   │   └── index.tsx       # User dashboard
│   │   │
│   │   ├── posts/
│   │   │   ├── index.tsx       # Posts list
│   │   │   ├── create.tsx      # Create new post
│   │   │   └── edit.tsx        # Edit existing post
│   │   │
│   │   └── profile/
│   │       └── index.tsx       # User profile page
│   │
│   ├── routes/                  # Route configuration
│   │   ├── index.tsx           # Route definitions
│   │   ├── public/
│   │   │   └── routes.tsx      # Public routes (login, etc.)
│   │   ├── protected/
│   │   │   └── routes.tsx      # Protected user routes
│   │   └── onboarding/
│   │       └── routes.tsx      # Onboarding flow routes
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
- **Components**: `kebab-case.tsx` (e.g., `rich-text-editor.tsx`)
- **Layout Components**: `kebab-case.tsx` (e.g., `app-sidebar.tsx`)

### Utilities and Hooks

- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useSteps.ts`, `use-auth.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`)
- **API Files**: `index.ts` inside feature folders (e.g., `api/posts/index.ts`)

### Types

- Import from `@kite/types` package
- Local types in `*.types.ts` files if needed

## Folder Organization

### `/pages`

Each page corresponds to a route and may contain:

- `index.tsx` - Main page component
- `create.tsx`, `edit.tsx` - Action-specific pages
- Components specific to that page can be co-located

**Example**: Posts pages

```text
pages/posts/
├── index.tsx              # Posts list page
├── create.tsx             # Create post page
└── edit.tsx               # Edit post page
```

### `/components`

Shared components used across multiple pages:

- `/layout` - Layout components (sidebar, header)
- `/editor` - Rich text editor components
- Other shared components go directly in `/components`

### `/api`

API integration organized by feature:

```text
api/
├── auth/
│   └── index.ts          # login, register, logout
├── posts/
│   └── index.ts          # getPosts, createPost, updatePost, deletePost
└── profile/
    └── index.ts          # getProfile, updateProfile
```

Each API file exports:

- API functions (e.g., `getPosts`, `createPost`)
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
VITE_APP_NAME=Kite
```

### Development

```bash
# From monorepo root
pnpm dev:web

# Or from this directory
pnpm dev
```

Web app runs at: <http://localhost:5174>

### Build

```bash
# From monorepo root
pnpm build:web

# Or from this directory
pnpm build
```

## Key Features

### Authentication

User authentication with JWT:

- Email/password registration and login
- Forgot password flow
- Password reset
- Session persistence with httpOnly cookies
- Automatic token refresh

**File**: [src/pages/auth/login.tsx](src/pages/auth/login.tsx)

### User Onboarding

Multi-step onboarding flow for new users:

- Welcome screen
- Profile setup
- Preferences configuration
- Getting started guide

**File**: [src/pages/onboarding/index.tsx](src/pages/onboarding/index.tsx)

### Post Management

Full post creation and management:

- Create new posts with rich text editor
- Edit existing posts
- Publish/unpublish posts
- Delete posts
- View post list with filters

**Files**:

- [src/pages/posts/create.tsx](src/pages/posts/create.tsx)
- [src/pages/posts/edit.tsx](src/pages/posts/edit.tsx)
- [src/pages/posts/index.tsx](src/pages/posts/index.tsx)

### User Dashboard

Personal dashboard with:

- Post statistics
- Recent posts
- Quick actions
- Activity overview

**File**: [src/pages/dashboard/index.tsx](src/pages/dashboard/index.tsx)

### Profile Management

User profile customization:

- Update profile information
- Change password
- Profile picture upload
- Bio and preferences

**File**: [src/pages/profile/index.tsx](src/pages/profile/index.tsx)

## State Management

### Server State (TanStack Query)

Used for API data:

```typescript
import { useQuery } from "@tanstack/react-query";
import { getPostsApi } from "@/api/posts";

const { data, isLoading } = useQuery({
  queryKey: ["posts", { page, limit, status }],
  queryFn: () => getPostsApi({ page, limit, status }),
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

React Router v7 with multiple route groups:

```typescript
// Public routes (no auth required)
/login
/register
/forgot-password
/reset-password

// Onboarding routes (authenticated but not onboarded)
/onboarding

// Protected routes (authenticated and onboarded)
/dashboard
/posts
/posts/create
/posts/:id/edit
/profile
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
import { Button, Input, Card, Textarea } from "@kite/ui";

<Button variant="default">Create Post</Button>
<Textarea placeholder="Write your post..." />
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
// src/api/posts/index.ts
import { api } from "@/utils/api";
import type { Post, CreatePostRequest, ApiResponse, PaginatedResponse } from "@kite/types";

export const getPostsApi = (params: GetPostsQuery) =>
  api.get<ApiResponse<PaginatedResponse<Post>>>("/posts", { params });

export const createPostApi = (data: CreatePostRequest) =>
  api.post<ApiResponse<{ post: Post }>>("/posts", data);

export const updatePostApi = (id: string, data: UpdatePostRequest) =>
  api.put<ApiResponse<{ post: Post }>>(`/posts/${id}`, data);
```

## Common Patterns

### Data Fetching with Pagination

```typescript
const [page, setPage] = useState(1);
const limit = 10;

const { data, isLoading } = useQuery({
  queryKey: ["posts", page, limit],
  queryFn: () => getPostsApi({ page, limit }),
});

const posts = data?.data.data.items || [];
const total = data?.data.data.total || 0;
```

### Mutations with Success Handling

```typescript
const navigate = useNavigate();

const { mutate: createPost } = useMutation({
  mutationFn: createPostApi,
  onSuccess: (response) => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    toast.success("Post created successfully");
    navigate(`/posts/${response.data.data.post.id}`);
  },
  onError: (error) => {
    toast.error("Failed to create post");
  },
});
```

### Form Handling with Multi-Step

```typescript
import { useSteps } from "@/hooks/useSteps";
import { Button } from "@kite/ui";

const { currentStep, nextStep, prevStep, isFirstStep, isLastStep } = useSteps(3);

<form onSubmit={handleSubmit}>
  {currentStep === 0 && <Step1 />}
  {currentStep === 1 && <Step2 />}
  {currentStep === 2 && <Step3 />}

  <div>
    {!isFirstStep && <Button onClick={prevStep}>Back</Button>}
    <Button type="submit">{isLastStep ? "Finish" : "Next"}</Button>
  </div>
</form>
```

## Adding New Features

### 1. Add New Page

Create page component:

```bash
touch src/pages/bookmarks/index.tsx
```

Define route in [src/routes/protected/routes.tsx](src/routes/protected/routes.tsx):

```typescript
{
  path: "/bookmarks",
  element: <BookmarksPage />,
}
```

### 2. Add API Integration

Create API file:

```typescript
// src/api/bookmarks/index.ts
import { api } from "@/utils/api";
import type { ApiResponse, PaginatedResponse } from "@kite/types";

export const getBookmarksApi = (params: PaginationQuery) =>
  api.get<ApiResponse<PaginatedResponse<Bookmark>>>("/bookmarks", { params });
```

### 3. Create Page Component

```typescript
// src/pages/bookmarks/index.tsx
import { useQuery } from "@tanstack/react-query";
import { getBookmarksApi } from "@/api/bookmarks";
import { Card } from "@kite/ui";

export default function BookmarksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarksApi({ page: 1, limit: 20 }),
  });

  return (
    <div>
      <h1>My Bookmarks</h1>
      {/* Render bookmarks */}
    </div>
  );
}
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | - |
| `VITE_APP_NAME` | Application name | No | `Kite` |

## Scripts

```bash
pnpm dev          # Start development server (port 5174)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

## Best Practices

### Component Organization

- Keep page-specific components co-located with pages
- Share components across pages via `/components`
- Use `@kite/ui` for base UI components

### Type Safety

- Import types from `@kite/types`
- Define API response types explicitly
- Use TypeScript strict mode

### State Management

- Use TanStack Query for server data
- Use Zustand for client/UI state
- Invalidate queries after mutations

### Performance

- Use React.memo for expensive components
- Implement pagination for large lists
- Lazy load routes with React.lazy()
- Use TanStack Query's built-in caching

### Code Quality

- Follow naming conventions
- Keep components focused and small
- Write reusable utility functions
- Add comments for complex logic

## User Flow

### Registration and Onboarding

1. User registers at `/register`
2. User logs in and is redirected to `/onboarding`
3. User completes onboarding steps
4. User is redirected to `/dashboard`

### Post Creation

1. User navigates to `/posts/create`
2. User writes content in rich text editor
3. User saves as draft or publishes
4. User is redirected to posts list

### Profile Update

1. User navigates to `/profile`
2. User updates profile information
3. User saves changes
4. Profile is updated and cache invalidated

## Related Documentation

- [Monorepo Setup](../../docs/01-monorepo-setup.md) - Workspace configuration
- [Frontend Development](../../docs/06-frontend-development.md) - Frontend patterns
- [Shared UI Package](../../packages/ui/README.md) - Component library
- [Backend API](../backend/README.md) - API endpoints
- [Authentication](../../docs/05-authentication-system.md) - Auth flow

---

**Version**: 1.0.0
**Port**: 5174
**License**: MIT
