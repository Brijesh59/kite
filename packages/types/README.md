# @kite/types

Shared Zod schemas and inferred TypeScript types for the entire monorepo. Ensures runtime validation and type consistency between backend and frontend applications.

## Overview

This package provides:
- **Shared Schemas** - Single source of truth for runtime validation
- **Inferred Types** - TypeScript types derived from Zod schemas
- **API Response Schemas** - Standard response structures
- **Request/Response DTOs** - Type-safe API communication
- **Domain Contracts** - User, Post, Auth, Profile schemas and types
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
import { createUserRequestSchema } from "@kite/types";

export class UserService {
  async createUser(data: CreateUserRequest): Promise<User> {
    const userData = createUserRequestSchema.parse(data);
    // Implementation
  }
}
```

### In Frontend
```typescript
import { loginRequestSchema, type User, type ApiResponse, type PaginatedResponse } from "@kite/types";
import { zodResolver } from "@hookform/resolvers/zod";

export const getUsersApi = () =>
  api.get<ApiResponse<PaginatedResponse<User>>>("/api/admin/users");

const loginResolver = zodResolver(loginRequestSchema);
```

## Type Files

### user.types.ts
User-related schemas and inferred types:
- `User` - User entity
- `userSchema` - User entity schema
- `UserRole` - USER | ADMIN
- `CreateUserRequest` - User creation DTO
- `createUserRequestSchema` - User creation schema
- `UpdateUserRequest` - User update DTO

### auth.types.ts
Authentication schemas and inferred types:
- `LoginRequest` - Login credentials
- `loginRequestSchema` - Login validation schema
- `RegisterRequest` - Registration data
- `LoginResponse` - Login result with tokens
- `AuthTokens` - Access and refresh tokens

### post.types.ts
Content management schemas and inferred types:
- `Post` - Post entity
- `PostStatus` - DRAFT | PUBLISHED
- `CreatePostRequest` - Post creation DTO
- `createPostRequestSchema` - Post creation schema
- `UpdatePostRequest` - Post update DTO
- `GetPostsQuery` - Post filtering query

### api.types.ts
API communication schemas and inferred types:
- `ApiResponse<T>` - Standard response wrapper
- `apiResponseSchema` - Standard response schema factory
- `PaginatedResponse<T>` - Paginated list response
- `ApiError` - Error response structure
- `PaginationParams` - Common pagination params

### profile.types.ts
User profile schemas and inferred types:
- `UserProfile` - Profile entity
- `UpdateProfileRequest` - Profile update DTO
- `updateProfileRequestSchema` - Profile update schema

## Schema Definitions

### User Contracts
```typescript
export const userRoleSchema = z.enum(["ADMIN", "ORGANISER", "ARTIST", "USER"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string().nullable().optional(),
  role: userRoleSchema,
  isActive: z.boolean(),
});
export type User = z.infer<typeof userSchema>;
```

### API Response Contracts
```typescript
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });

export type ApiResponse<T = unknown> = z.infer<
  ReturnType<typeof apiResponseSchema<z.ZodType<T>>>
>;
```

### Post Contracts
```typescript
export const postStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export type PostStatus = z.infer<typeof postStatusSchema>;

export const createPostRequestSchema = z.object({
  title: z.string().max(200),
  content: z.string(),
});
export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;

export const getPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ALL"]).optional(),
  search: z.string().optional(),
});
export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
```

## File Structure

```
packages/types/
├── src/
│   ├── index.ts              # Re-exports schemas and types
│   ├── schema-helpers.ts     # Shared schema helpers
│   ├── user.types.ts         # User schemas and types
│   ├── auth.types.ts         # Auth schemas and types
│   ├── post.types.ts         # Post schemas and types
│   ├── profile.types.ts      # Profile schemas and types
│   └── api.types.ts          # API schemas and types
├── package.json
└── tsconfig.json
```

## Adding New Contracts

1. **Create or update schema file**:
```typescript
// src/comment.types.ts
import { z } from "zod";

export const commentSchema = z.object({
  id: z.string(),
  content: z.string(),
  postId: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Comment = z.infer<typeof commentSchema>;

export const createCommentRequestSchema = z.object({
  content: z.string().max(1000),
  postId: z.string().uuid(),
});
export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;
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
import { createCommentRequestSchema } from "@kite/types";

// Frontend
import type { Comment } from "@kite/types";
import { createCommentRequestSchema } from "@kite/types";
```

## Best Practices

### Naming
- ✅ Use camelCase for schemas and PascalCase for inferred types
- ✅ Suffix DTOs with `Request` or `Response`
- ✅ Use descriptive names: `CreateUserRequest` not `UserCreate`
- ✅ Keep schemas focused and single-purpose

### Organization
- ✅ Group related schemas and inferred types in same file
- ✅ One entity per file (user.types.ts, post.types.ts)
- ✅ Re-export everything from index.ts
- ✅ Export schemas first, then infer types with `z.infer`

### Type Safety
- ✅ Avoid `any` type
- ✅ Use `z.enum` for enums
- ✅ Make optional fields explicit with `.optional()`
- ✅ Reuse shared schemas in frontend forms and backend route validation

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
