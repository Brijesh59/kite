# @kite/types

Shared TypeScript type definitions for the entire monorepo. Ensures type consistency between backend and frontend applications.

## Overview

This package provides:
- **Shared Types** - Single source of truth for data models
- **API Response Types** - Standard response structures
- **Request/Response DTOs** - Type-safe API communication
- **Domain Types** - User, Post, Auth, Profile types
- **Utility Types** - Pagination, filtering, common patterns

## Installation

Automatically linked via PNPM workspaces:

```json
{
  "dependencies": {
    "@kite/types": "workspace:*"
  }
}
```

## Usage

### In Backend
```typescript
import type { User, CreateUserRequest } from "@kite/types";

export class UserService {
  async createUser(data: CreateUserRequest): Promise<User> {
    // Implementation
  }
}
```

### In Frontend
```typescript
import type { User, ApiResponse, PaginatedResponse } from "@kite/types";

export const getUsersApi = () =>
  api.get<ApiResponse<PaginatedResponse<User>>>("/api/admin/users");
```

## Type Files

### user.types.ts
User-related types and enums:
- `User` - User entity
- `UserRole` - USER | ADMIN
- `CreateUserRequest` - User creation DTO
- `UpdateUserRequest` - User update DTO

### auth.types.ts
Authentication types:
- `LoginRequest` - Login credentials
- `RegisterRequest` - Registration data
- `LoginResponse` - Login result with tokens
- `AuthTokens` - Access and refresh tokens

### post.types.ts
Content management types:
- `Post` - Post entity
- `PostStatus` - DRAFT | PUBLISHED
- `CreatePostRequest` - Post creation DTO
- `UpdatePostRequest` - Post update DTO
- `GetPostsQuery` - Post filtering query

### api.types.ts
API communication types:
- `ApiResponse<T>` - Standard response wrapper
- `PaginatedResponse<T>` - Paginated list response
- `ApiError` - Error response structure
- `PaginationQuery` - Common pagination params

### profile.types.ts
User profile types:
- `UserProfile` - Profile entity
- `UpdateProfileRequest` - Profile update DTO

## Type Definitions

### User Types
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

### API Response Types
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
```

### Post Types
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

export interface GetPostsQuery {
  page?: number;
  limit?: number;
  status?: PostStatus | "ALL";
  search?: string;
}
```

## File Structure

```
packages/types/
├── src/
│   ├── index.ts              # Re-exports all types
│   ├── user.types.ts         # User types
│   ├── auth.types.ts         # Auth types
│   ├── post.types.ts         # Post types
│   ├── profile.types.ts      # Profile types
│   ├── api.types.ts          # API types
│   └── common.types.ts       # Utility types
├── package.json
└── tsconfig.json
```

## Adding New Types

1. **Create or update type file**:
```typescript
// src/comment.types.ts
export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
}
```

2. **Export from index**:
```typescript
// src/index.ts
export * from "./comment.types";
```

3. **Use in apps**:
```typescript
// Backend
import type { Comment, CreateCommentRequest } from "@kite/types";

// Frontend
import type { Comment } from "@kite/types";
```

## Best Practices

### Type Naming
- ✅ Use PascalCase for types and interfaces
- ✅ Suffix DTOs with `Request` or `Response`
- ✅ Use descriptive names: `CreateUserRequest` not `UserCreate`
- ✅ Keep types focused and single-purpose

### Type Organization
- ✅ Group related types in same file
- ✅ One entity per file (user.types.ts, post.types.ts)
- ✅ Re-export everything from index.ts
- ✅ Keep types pure (no runtime code)

### Type Safety
- ✅ Avoid `any` type
- ✅ Use union types for enums: `"USER" | "ADMIN"`
- ✅ Make optional fields explicit with `?`
- ✅ Use `Readonly` for immutable types

### Documentation
- ✅ Add JSDoc comments for complex types
- ✅ Document business rules
- ✅ Include examples in comments

## Type Mirroring

Types should mirror Prisma schema:

```prisma
// apps/backend/prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```typescript
// packages/types/src/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;  // Note: Dates as strings for JSON serialization
  updatedAt: string;
}
```

## Common Patterns

### Request/Response Pattern
```typescript
// Request DTO
export interface CreatePostRequest {
  title: string;
  content: string;
}

// Response includes full entity
export interface Post extends CreatePostRequest {
  id: string;
  authorId: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}
```

### Pagination Pattern
```typescript
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Filter Pattern
```typescript
export interface GetPostsQuery extends PaginationQuery {
  status?: PostStatus | "ALL";
  search?: string;
  authorId?: string;
}
```

## Related Documentation

- [Shared Packages](../../docs/03-shared-packages.md#1-kiteptypes) - Complete types documentation
- [Backend Development](../../docs/04-backend-development.md) - Using types in backend
- [Frontend Development](../../docs/06-frontend-development.md) - Using types in frontend

---

**Package Version**: 1.0.0  
**License**: MIT
