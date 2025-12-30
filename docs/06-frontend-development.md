# Frontend Development

This document explains how to build frontend features with React, Axios, TanStack Query, and React Router.

## Overview

Both frontend applications (Admin Panel and Web App) share the same tech stack and patterns:

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: TanStack Query (React Query) + Zustand
- **Routing**: React Router v7
- **UI**: Tailwind CSS v4 + @kite/ui (shared component library)
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner (toast)

## Project Structure

```
apps/admin-panel/ (or web-app/)
├── src/
│   ├── api/                    # API integration layer
│   │   ├── auth/
│   │   │   ├── index.ts        # API functions
│   │   │   └── use-auth.ts     # React Query hooks
│   │   ├── users/
│   │   └── posts/
│   ├── pages/                  # Page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── posts/
│   ├── components/             # Reusable components
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── navbar.tsx
│   │   │   └── layout.tsx
│   │   └── steps.tsx           # App-specific components (if any)
│   ├── routes/                 # Route guards
│   │   ├── protected/
│   │   └── public/
│   ├── utils/                  # Utilities
│   │   ├── api.ts              # Axios instance
│   │   ├── auth-store.ts       # Auth state
│   │   └── helpers.ts
│   ├── types/                  # App-specific types
│   ├── hooks/                  # App-specific hooks
│   │   └── useSteps.ts
│   ├── lib/                    # App-specific utilities
│   │   └── utils.ts            # formatDate, etc.
│   ├── index.css               # Imports @kite/ui/styles
│   ├── App.tsx                 # Route configuration
│   └── main.tsx                # Entry point
└── package.json
```

**Note**: UI components are no longer in `src/components/ui/`. All UI components are imported from `@kite/ui`.

---

## Setting Up Shared UI Styles

### Importing Tailwind Theme

Each app's `src/index.css` imports the shared Tailwind configuration from `@kite/ui`:

```css
/* apps/admin-panel/src/index.css (or apps/web-app/src/index.css) */

/* Import shared UI styles from @kite/ui */
@import "@kite/ui/styles";

/* Import animation library */
@import "tw-animate-css";

/* App-specific theme overrides (optional) */
:root {
  /* Override CSS variables if needed */
  /* --primary: oklch(0.5 0.2 250); */
}
```

This provides:

- Complete Tailwind v4 configuration
- Theme variables (colors, radius, etc.)
- Light and dark mode support
- Base styles for all components

Apps can override theme variables by defining them after the import.

---

## API Integration with Axios

### 1. Axios Setup

**File**: `apps/admin-panel/src/utils/api.ts`

```typescript
import axios from "axios";
import { refreshTokenApi } from "@/api/auth";
import { useAuthStore } from "./auth-store";

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000",
  withCredentials: true,  // Important: sends cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await refreshTokenApi();

        // Retry original request
        return api.request(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

**Environment Variables:**

```env
# apps/admin-panel/.env
VITE_API_URL=http://localhost:9000
```

### 2. API Functions Layer

Create API functions in `apps/admin-panel/src/api/<module>/index.ts`:

**Example: Posts API**

```typescript
// apps/admin-panel/src/api/posts/index.ts
import { api } from "@/utils/api";
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  ApiResponse,
  PaginatedResponse,
} from "@kite/types";

export interface GetPostsQuery {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED" | "ALL";
  search?: string;
}

// Get all posts
export const getPostsApi = (query: GetPostsQuery = {}) =>
  api.get<ApiResponse<PaginatedResponse<Post>>>("/api/admin/posts", {
    params: query,
  });

// Get single post
export const getPostByIdApi = (id: string) =>
  api.get<ApiResponse<{ post: Post }>>(`/api/admin/posts/${id}`);

// Create post
export const createPostApi = (data: CreatePostRequest) =>
  api.post<ApiResponse<{ post: Post }>>("/api/admin/posts", data);

// Update post
export const updatePostApi = (id: string, data: UpdatePostRequest) =>
  api.put<ApiResponse<{ post: Post }>>(`/api/admin/posts/${id}`, data);

// Delete post
export const deletePostApi = (id: string) =>
  api.delete<ApiResponse<null>>(`/api/admin/posts/${id}`);

// Publish post
export const publishPostApi = (id: string) =>
  api.patch<ApiResponse<{ post: Post }>>(`/api/admin/posts/${id}/publish`);

// Unpublish post
export const unpublishPostApi = (id: string) =>
  api.patch<ApiResponse<{ post: Post }>>(`/api/admin/posts/${id}/unpublish`);

// Re-export types for use in hooks
export type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  GetPostsQuery,
};
```

---

## React Query Integration

### 1. Query Hooks

Create React Query hooks in `apps/admin-panel/src/api/<module>/use-<module>.ts`:

**Example: Posts Hooks**

```typescript
// apps/admin-panel/src/api/posts/use-posts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  getPostsApi,
  getPostByIdApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
  publishPostApi,
  unpublishPostApi,
  type GetPostsQuery,
  type CreatePostRequest,
  type UpdatePostRequest,
} from "./index";

// Query keys
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (query: GetPostsQuery) => [...postKeys.lists(), query] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

// Get all posts
export const usePosts = (query: GetPostsQuery = {}) => {
  return useQuery({
    queryKey: postKeys.list(query),
    queryFn: () => getPostsApi(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostByIdApi(id),
    enabled: !!id,
  });
};

// Create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createPostApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.success("Post created successfully");
      navigate("/posts");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create post");
    },
  });
};

// Update post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostRequest }) =>
      updatePostApi(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      toast.success("Post updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update post");
    },
  });
};

// Delete post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.success("Post deleted successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete post");
    },
  });
};

// Publish post
export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishPostApi,
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      toast.success("Post published successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to publish post");
    },
  });
};

// Unpublish post
export const useUnpublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpublishPostApi,
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      toast.success("Post unpublished successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to unpublish post");
    },
  });
};
```

### 2. Using Hooks in Components

```typescript
// apps/admin-panel/src/pages/posts/index.tsx
import { useState } from "react";
import { usePosts, useDeletePost, usePublishPost } from "@/api/posts/use-posts";
import { LoadingSpinner, EmptyState } from "@kite/ui";
import type { Post } from "@kite/types";

export default function PostsPage() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");

  // Query
  const { data, isLoading, error } = usePosts({
    status: statusFilter,
    limit: 20
  });

  // Mutations
  const deleteMutation = useDeletePost();
  const publishMutation = usePublishPost();

  const posts = data?.data?.data?.items || [];

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <div>Error loading posts</div>;
  }

  return (
    <div>
      {posts.map((post: Post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <button onClick={() => publishMutation.mutate(post.id)}>
            Publish
          </button>
          <button onClick={() => deleteMutation.mutate(post.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 3. Query Client Setup

**File**: `apps/admin-panel/src/main.tsx`

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## Forms with React Hook Form + Zod

### 1. Form Validation Schema

```typescript
// apps/admin-panel/src/pages/posts/schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string()
    .min(1, "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
```

### 2. Form Component

```typescript
// apps/admin-panel/src/pages/posts/create.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePost } from "@/api/posts/use-posts";
import { Button, Input, Textarea } from "@kite/ui";
import { createPostSchema, type CreatePostFormData } from "./schema";

export default function CreatePostPage() {
  const createMutation = useCreatePost();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "DRAFT",
    },
  });

  const onSubmit = (data: CreatePostFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title">Title</label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Enter post title"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="Write your content..."
          rows={10}
        />
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label>Status</label>
        <select {...register("status")}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <Button
        type="submit"
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
}
```

---

## Routing with React Router v7

### 1. Route Configuration

**File**: `apps/admin-panel/src/App.tsx`

```typescript
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute } from "./routes/public/public-routes";
import { ProtectedRoute } from "./routes/protected/protected-routes";

// Auth pages
import LoginPage from "./pages/auth/login";
import ForgotPasswordPage from "./pages/auth/forgot-password";

// Protected pages
import DashboardPage from "./pages/dashboard";
import UsersPage from "./pages/users";
import PostsPage from "./pages/posts";
import CreatePostPage from "./pages/posts/create";
import EditPostPage from "./pages/posts/edit";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/new" element={<CreatePostPage />} />
        <Route path="/posts/edit/:id" element={<EditPostPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

### 2. Protected Route Guard

**File**: `apps/admin-panel/src/routes/protected/protected-routes.tsx`

```typescript
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/utils/auth-store";
import { Layout } from "@/components/layout/layout";

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
```

### 3. Public Route Guard

**File**: `apps/admin-panel/src/routes/public/public-routes.tsx`

```typescript
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/utils/auth-store";

export function PublicRoute() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
```

### 4. Navigation

**Programmatic Navigation:**
```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to route
navigate("/posts");

// Navigate with state
navigate("/posts/edit/123", { state: { from: "dashboard" } });

// Go back
navigate(-1);
```

**Link Component:**
```typescript
import { Link } from "react-router-dom";

<Link to="/posts" className="text-blue-600">
  View Posts
</Link>
```

**URL Parameters:**
```typescript
import { useParams } from "react-router-dom";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();

  const { data } = usePost(id!);
  // ...
}
```

---

## State Management

### 1. Zustand Auth Store

**File**: `apps/admin-panel/src/utils/auth-store.ts`

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@kite/types";

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
```

**Usage:**
```typescript
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
const logout = useAuthStore((state) => state.logout);

// Login
login({ id: "123", name: "John", email: "john@example.com", role: "ADMIN" });

// Logout
logout();
```

### 2. React Query for Server State

React Query manages all server state (posts, users, etc.). Don't duplicate server state in Zustand.

✅ **Do:**
```typescript
const { data: posts } = usePosts();  // React Query
const user = useAuthStore((state) => state.user);  // Zustand
```

❌ **Don't:**
```typescript
const [posts, setPosts] = useState([]);  // Don't manage server state in local state
```

---

## UI Components

### 1. Importing from @kite/ui

All UI components are now imported from the shared `@kite/ui` package:

```typescript
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  Input,
  Textarea,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Skeleton,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  cn,
  useIsMobile,
} from "@kite/ui";
```

### 2. Using Button Variants with CVA

The Button component uses CVA for type-safe variants:

```typescript
import { Button } from "@kite/ui";

// Default variant
<Button>Click Me</Button>

// Different variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// Extending styles with className
<Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
  Custom Styled
</Button>

// Using asChild for Link components
<Button asChild>
  <Link to="/posts">View Posts</Link>
</Button>
```

### 3. Using Input and Form Components

```typescript
import { Input, Label, Textarea } from "@kite/ui";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    className="w-full"
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

### 4. Using Card Components

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@kite/ui";

<Card>
  <CardHeader>
    <CardTitle>Post Title</CardTitle>
    <CardDescription>Posted on {formatDate(post.createdAt)}</CardDescription>
  </CardHeader>
  <CardContent>
    <p>{post.content}</p>
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Edit</Button>
    <Button variant="destructive">Delete</Button>
  </CardFooter>
</Card>
```

### 5. Using Loading States

```typescript
import { Skeleton } from "@kite/ui";

// Loading skeleton
{isLoading && (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
)}

// Or use custom loading component
{isLoading && <div className="flex justify-center p-8">Loading...</div>}
```

### 6. Using Utility Functions

```typescript
import { cn } from "@kite/ui";

// Conditional classes
<div className={cn(
  "text-lg",
  isActive && "font-bold text-blue-600",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  Content
</div>

// Merge with component variants
<Button className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
  Custom Button
</Button>
```

### 7. Using Hooks

```typescript
import { useIsMobile } from "@kite/ui";

export function ResponsiveComponent() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

### 8. App-Specific Utilities

For app-specific utilities like `formatDate`, create them in your app:

```typescript
// apps/admin-panel/src/lib/utils.ts
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Usage
import { formatDate } from "@/lib/utils";

<span>{formatDate(post.createdAt)}</span>
```

---

## Data Access Patterns

### API Response Structure

Backend wraps responses in this format:

```typescript
{
  success: boolean;
  message: string;
  data: T;
}
```

Axios adds another layer:

```typescript
response.data  // The entire backend response
response.data.data  // The actual data
```

### Accessing Data in Components

**Single Item:**
```typescript
const { data } = usePost(id);
const post = data?.data?.data?.post;  // response → backend → data → post
```

**Paginated List:**
```typescript
const { data } = usePosts();
const posts = data?.data?.data?.items || [];
const total = data?.data?.data?.total || 0;
```

**Always use optional chaining (`?.`) to safely access nested data.**

---

## Best Practices

### 1. Type Safety

✅ **Do:**
```typescript
import type { Post, CreatePostRequest } from "@kite/types";

const posts: Post[] = data?.data?.data?.items || [];
```

❌ **Don't:**
```typescript
const posts: any = data?.data?.data?.items || [];  // Avoid 'any'
```

### 2. Error Handling

✅ **Do:**
```typescript
const { data, isLoading, error } = usePosts();

if (error) {
  return <div>Error: {error.message}</div>;
}
```

### 3. Loading States

✅ **Do:**
```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

// Render data
```

### 4. Mutation Loading States

✅ **Do:**
```typescript
<Button disabled={createMutation.isPending}>
  {createMutation.isPending ? "Creating..." : "Create"}
</Button>
```

### 5. Query Invalidation

✅ **Do:**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: postKeys.lists() });
  queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
}
```

### 6. Toast Notifications

✅ **Do:**
```typescript
import { toast } from "sonner";

onSuccess: () => {
  toast.success("Post created successfully");
}

onError: (error) => {
  toast.error(error.response?.data?.message || "Operation failed");
}
```

---

## Common Patterns

### 1. List + Create + Edit + Delete

See [apps/admin-panel/src/pages/posts](apps/admin-panel/src/pages/posts) for complete example.

### 2. Search and Filters

```typescript
const [search, setSearch] = useState("");
const [status, setStatus] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");

const { data } = usePosts({ search, status, limit: 20 });
```

### 3. Infinite Scroll

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      getPostsApi({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      const current = lastPage.data.data.page;
      const total = lastPage.data.data.totalPages;
      return current < total ? current + 1 : undefined;
    },
  });
};
```

### 4. Optimistic Updates

```typescript
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostRequest }) =>
      updatePostApi(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: postKeys.detail(id) });

      // Snapshot previous value
      const previous = queryClient.getQueryData(postKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(postKeys.detail(id), (old: any) => ({
        ...old,
        data: {
          ...old.data,
          data: {
            ...old.data.data,
            post: { ...old.data.data.post, ...data },
          },
        },
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(postKeys.detail(variables.id), context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
    },
  });
};
```

---

## Next Steps

- Review [Backend Development](./04-backend-development.md)
- Understand [Authentication System](./05-authentication-system.md)
- Learn about [Development Workflow](./07-development-workflow.md)
