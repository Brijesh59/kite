# Backend Development

This document explains how to create APIs, modules, and extend the backend with new features.

## Overview

The backend is built with Express.js, Prisma ORM, and follows a modular architecture. Each feature (auth, users, posts) is organized into self-contained modules.

## Module Structure

Each module follows this structure:

```
src/modules/<module-name>/
├── <module>.types.ts       # TypeScript interfaces
├── <module>.validation.ts  # Joi validation schemas
├── <module>.service.ts     # Business logic
├── <module>.controller.ts  # Request handlers
└── <module>.routes.ts      # Route definitions
```

---

## Creating a New Module

Let's create a `comments` module as an example.

### Step 1: Update Prisma Schema

Add the Comment model to `prisma/schema.prisma`:

```prisma
model Comment {
  id        String   @id @default(uuid())
  content   String   @db.Text
  postId    String
  authorId  String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("comments")
}

// Update Post model to include comments relation
model Post {
  // ... existing fields
  comments Comment[]
}

// Update User model to include comments relation
model User {
  // ... existing fields
  comments Comment[]
}
```

Run migration:

```bash
pnpm --filter kite-backend prisma migrate dev --name add_comments
```

### Step 2: Create Types in @kite/types

Create `packages/types/src/comment.types.ts`:

```typescript
import type { User } from "./user.types";

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
}

export interface UpdateCommentRequest {
  content?: string;
}

export interface GetCommentsQuery {
  postId?: string;
  authorId?: string;
  limit?: number;
  page?: number;
}
```

Export from `packages/types/src/index.ts`:

```typescript
export * from "./comment.types";
```

### Step 3: Create Module Directory

```bash
mkdir -p apps/backend/src/modules/comments
```

### Step 4: Create Types File

Create `apps/backend/src/modules/comments/comment.types.ts`:

```typescript
// Re-export from @kite/types for backend use
export type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  GetCommentsQuery,
} from "@kite/types";
```

### Step 5: Create Validation File

Create `apps/backend/src/modules/comments/comment.validation.ts`:

```typescript
import Joi from "joi";

const commentIdParam = Joi.object({
  id: Joi.string().uuid().required(),
});

const createCommentBody = Joi.object({
  content: Joi.string().required().max(1000),
  postId: Joi.string().uuid().required(),
});

const updateCommentBody = Joi.object({
  content: Joi.string().max(1000).optional(),
});

const getCommentsQuery = Joi.object({
  postId: Joi.string().uuid().optional(),
  authorId: Joi.string().uuid().optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1),
});

export const commentValidation = {
  create: {
    body: createCommentBody,
  },
  update: {
    params: commentIdParam,
    body: updateCommentBody,
  },
  delete: {
    params: commentIdParam,
  },
  getById: {
    params: commentIdParam,
  },
  getAll: {
    query: getCommentsQuery,
  },
};
```

### Step 6: Create Service File

Create `apps/backend/src/modules/comments/comment.service.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  GetCommentsQuery,
} from "./comment.types";

export class CommentService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createComment(
    data: CreateCommentRequest,
    authorId: string
  ): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data: {
        content: data.content,
        postId: data.postId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return comment as Comment;
  }

  async updateComment(
    id: string,
    data: UpdateCommentRequest,
    userId: string
  ): Promise<Comment> {
    // Verify ownership
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.authorId !== userId) {
      throw new Error("Not authorized to update this comment");
    }

    const updated = await this.prisma.comment.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return updated as Comment;
  }

  async deleteComment(id: string, userId: string, userRole: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Allow deletion if user is author or admin
    if (comment.authorId !== userId && userRole !== "ADMIN") {
      throw new Error("Not authorized to delete this comment");
    }

    await this.prisma.comment.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id, isActive: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return comment as Comment | null;
  }

  async getComments(query: GetCommentsQuery): Promise<{
    items: Comment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { postId, authorId, limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (postId) where.postId = postId;
    if (authorId) where.authorId = authorId;

    const [items, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where }),
    ]);

    return {
      items: items as Comment[],
      total,
      page,
      limit,
    };
  }
}
```

### Step 7: Create Controller File

Create `apps/backend/src/modules/comments/comment.controller.ts`:

```typescript
import { Request, Response } from "express";
import { CommentService } from "./comment.service";
import { CatchAsyncClass } from "../../common/catch-async";
import type { AuthRequest } from "../../common/types";

@CatchAsyncClass()
export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  async createComment(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const comment = await this.commentService.createComment(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: { comment },
    });
  }

  async updateComment(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const comment = await this.commentService.updateComment(id, req.body, userId);

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: { comment },
    });
  }

  async deleteComment(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    await this.commentService.deleteComment(id, userId, userRole);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: null,
    });
  }

  async getCommentById(req: Request, res: Response) {
    const { id } = req.params;
    const comment = await this.commentService.getCommentById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment retrieved successfully",
      data: { comment },
    });
  }

  async getComments(req: Request, res: Response) {
    const result = await this.commentService.getComments(req.query);

    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      data: result,
    });
  }
}
```

### Step 8: Create Routes File

Create `apps/backend/src/modules/comments/comment.routes.ts`:

```typescript
import { Router, Express } from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation";
import { commentValidation } from "./comment.validation";

const router = Router();
const controller = new CommentController();

// Public routes
router.get(
  "/",
  validate(commentValidation.getAll),
  controller.getComments.bind(controller)
);

router.get(
  "/:id",
  validate(commentValidation.getById),
  controller.getCommentById.bind(controller)
);

// Protected routes
router.post(
  "/",
  authMiddleware,
  validate(commentValidation.create),
  controller.createComment.bind(controller)
);

router.put(
  "/:id",
  authMiddleware,
  validate(commentValidation.update),
  controller.updateComment.bind(controller)
);

router.delete(
  "/:id",
  authMiddleware,
  validate(commentValidation.delete),
  controller.deleteComment.bind(controller)
);

export function setCommentRoutes(app: Express) {
  app.use("/api/comments", router);
}
```

### Step 9: Register Routes in App

Update `apps/backend/src/app.ts`:

```typescript
import { setCommentRoutes } from "./modules/comments/comment.routes";

// Register routes
setAuthRoutes(app);
setUserRoutes(app);
setPostRoutes(app);
setCommentRoutes(app); // Add this line
```

### Step 10: Test the API

```bash
# Create a comment (requires authentication)
curl -X POST http://localhost:9000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"content": "Great post!", "postId": "post-uuid"}'

# Get all comments for a post
curl http://localhost:9000/api/comments?postId=post-uuid

# Update a comment
curl -X PUT http://localhost:9000/api/comments/comment-uuid \
  -H "Content-Type: application/json" \
  -d '{"content": "Updated comment"}'

# Delete a comment
curl -X DELETE http://localhost:9000/api/comments/comment-uuid
```

---

## Available Middleware

### 1. Authentication Middleware

**File**: `apps/backend/src/middleware/auth.middleware.ts`

```typescript
import { authMiddleware } from "../../middleware/auth.middleware";

// Apply to routes that require authentication
router.get("/profile", authMiddleware, controller.getProfile);
```

Adds `req.user` with authenticated user information:
```typescript
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}
```

### 2. Role-Based Middleware

```typescript
import { requireAdmin } from "../../middleware/auth.middleware";

// Only ADMIN can access
router.delete("/users/:id", authMiddleware, requireAdmin, controller.deleteUser);

**Available role middleware:**
- `requireAdmin` - Only ADMIN role

**Creating custom role middleware:**
```typescript
import { requireRole } from "../../middleware/auth.middleware";

// Custom role check
const requireArtist = requireRole(["ARTIST", "ADMIN"]);
router.post("/performances", authMiddleware, requireArtist, controller.createPerformance);
```

### 3. Validation Middleware

```typescript
import { validate } from "../../middleware/validation";

router.post(
  "/comments",
  validate(commentValidation.create),
  controller.createComment
);
```

Validates request body, params, and query against Joi schemas.

### 4. Error Handling

Use `@CatchAsyncClass()` decorator or `catchAsync` wrapper:

**Class-based (recommended):**
```typescript
import { CatchAsyncClass } from "../../common/catch-async";

@CatchAsyncClass()
export class CommentController {
  async createComment(req: AuthRequest, res: Response) {
    // Errors automatically caught and handled
    const comment = await this.commentService.createComment(req.body);
    res.json({ data: comment });
  }
}
```

**Function-based:**
```typescript
import { catchAsync } from "../../common/catch-async";

export const createComment = catchAsync(async (req: AuthRequest, res: Response) => {
  const comment = await commentService.createComment(req.body);
  res.json({ data: comment });
});
```

---

## User Roles System

### Default Roles

```typescript
type UserRole = "ADMIN" | "ORGANISER" | "USER" | "ARTIST";
```

- **ADMIN**: Full system access, can manage users and settings
- **ORGANISER**: Can create and manage events
- **USER**: Standard user, can create posts and comments
- **ARTIST**: Can showcase performances and create portfolio

### Extending Roles

**1. Add to Prisma Schema:**

```prisma
enum UserRole {
  ADMIN
  ORGANISER
  USER
  ARTIST
  VENDOR      // New role
}
```

**2. Update @kite/types:**

```typescript
// packages/types/src/user.types.ts
export type UserRole = "ADMIN" | "ORGANISER" | "USER" | "ARTIST" | "VENDOR";
```

**3. Run Migration:**

```bash
pnpm --filter kite-backend prisma migrate dev --name add_vendor_role
```

**4. Create Role Middleware:**

```typescript
// apps/backend/src/middleware/auth.middleware.ts
export const requireVendor = requireRole(["VENDOR", "ADMIN"]);
```

**5. Use in Routes:**

```typescript
router.post("/products", authMiddleware, requireVendor, controller.createProduct);
```

### Role Hierarchy

Implement role hierarchy in middleware:

```typescript
const ROLE_HIERARCHY = {
  ADMIN: 4,
  ORGANISER: 3,
  ARTIST: 2,
  USER: 1,
};

export const requireMinimumRole = (minimumRole: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role];
    const requiredLevel = ROLE_HIERARCHY[minimumRole];

    if (userLevel < requiredLevel) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

// Usage
router.get("/analytics", authMiddleware, requireMinimumRole("ORGANISER"), controller.getAnalytics);
```

---

## Database Best Practices

### 1. Soft Deletes

Always use `isActive` flag instead of hard deletes:

```typescript
// Don't do this
await prisma.comment.delete({ where: { id } });

// Do this
await prisma.comment.update({
  where: { id },
  data: { isActive: false },
});
```

### 2. Timestamps

Include `createdAt` and `updatedAt` in all models:

```prisma
model Comment {
  // ... fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3. Relations

Always define both sides of relations:

```prisma
model Post {
  id       String    @id
  comments Comment[]
}

model Comment {
  id     String @id
  postId String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```

### 4. Cascading Deletes

Use `onDelete: Cascade` for dependent data:

```prisma
model Comment {
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```

---

## API Response Format

### Success Response

```typescript
res.status(200).json({
  success: true,
  message: "Operation successful",
  data: {
    // Your data here
  },
});
```

### Error Response

```typescript
res.status(400).json({
  success: false,
  message: "Error message",
  data: null,
});
```

### Paginated Response

```typescript
res.status(200).json({
  success: true,
  message: "Items retrieved",
  data: {
    items: [...],
    total: 100,
    page: 1,
    limit: 10,
    totalPages: 10,
  },
});
```

---

## Environment Variables

Add new environment variables to `apps/backend/.env`:

```env
# Example: External API integration
EXTERNAL_API_URL=https://api.example.com
EXTERNAL_API_KEY=your_api_key
```

Access in code:

```typescript
const apiUrl = process.env.EXTERNAL_API_URL;
const apiKey = process.env.EXTERNAL_API_KEY;

if (!apiUrl || !apiKey) {
  throw new Error("External API credentials not configured");
}
```

---

## Testing

### Manual Testing with curl

```bash
# Create
curl -X POST http://localhost:9000/api/comments \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your-token" \
  -d '{"content": "Test comment", "postId": "uuid"}'

# Read
curl http://localhost:9000/api/comments/uuid

# Update
curl -X PUT http://localhost:9000/api/comments/uuid \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your-token" \
  -d '{"content": "Updated"}'

# Delete
curl -X DELETE http://localhost:9000/api/comments/uuid \
  -H "Cookie: accessToken=your-token"
```

---

## Next Steps

- Learn about [Authentication System](./05-authentication-system.md)
- Explore [Frontend Development](./06-frontend-development.md)
- Understand [Development Workflow](./07-development-workflow.md)
