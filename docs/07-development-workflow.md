# Development Workflow

This document covers the development workflow, best practices, and deployment guidelines for Kite.

## Development Setup

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd kite
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Environment Variables**
   ```bash
   # Backend
   cp apps/backend/.env.example apps/backend/.env
   # Edit with your values

   # Admin Panel
   cp apps/admin-panel/.env.example apps/admin-panel/.env

   # Web App
   cp apps/web-app/.env.example apps/web-app/.env
   ```

4. **Setup Database**
   ```bash
   # Start PostgreSQL (if using Docker)
   docker run -d \
     --name kite-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=kite \
     -p 5440:5432 \
     postgres:15

   # Run migrations
   pnpm db:migrate
   ```

5. **Start Development**
   ```bash
   # All apps in parallel
   pnpm dev

   # Or individually
   pnpm dev:backend
   pnpm dev:admin
   pnpm dev:web
   ```

---

## Daily Development Workflow

### 1. Before Starting Work

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
pnpm install

# Run migrations if schema changed
pnpm db:migrate
```

### 2. Creating a New Feature

```bash
# Create feature branch
git checkout -b feature/post-comments

# Make changes
# ... edit files ...

# Test changes
pnpm build  # Ensure everything compiles

# Commit changes
git add .
git commit -m "feat: add comment system to posts"

# Push to remote
git push origin feature/post-comments
```

### 3. Making Changes Across Packages

**Example 1: Adding a new type**

1. **Update @kite/types**
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

3. **Update Backend**
   ```typescript
   // apps/backend/src/modules/comments/comment.service.ts
   import type { Comment } from "@kite/types";
   ```

4. **Update Frontend**
   ```typescript
   // apps/admin-panel/src/api/comments/index.ts
   import type { Comment } from "@kite/types";
   ```

5. **Test All Apps**
   ```bash
   pnpm build  # Builds all apps
   ```

**Example 2: Adding a new UI component**

1. **Create component in @kite/ui**
   ```typescript
   // packages/ui/src/components/alert.tsx
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
           success: "bg-green-50 text-green-900 border-green-200",
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

2. **Export from index**
   ```typescript
   // packages/ui/src/index.ts
   export * from "./components/alert";
   ```

3. **Use in Frontend Apps**
   ```typescript
   // apps/admin-panel/src/pages/dashboard.tsx
   import { Alert } from "@kite/ui";

   export function Dashboard() {
     return (
       <Alert variant="success">
         Welcome to the dashboard!
       </Alert>
     );
   }
   ```

4. **Test in Both Apps**
   ```bash
   # Start dev servers and verify component works
   pnpm dev

   # Build to ensure no TypeScript errors
   pnpm build
   ```

---

## Git Workflow

### Branch Naming Conventions

- `feature/<feature-name>` - New features
- `fix/<bug-name>` - Bug fixes
- `refactor/<description>` - Code refactoring
- `docs/<description>` - Documentation updates
- `chore/<description>` - Maintenance tasks

**Examples:**
```bash
feature/user-authentication
fix/post-deletion-bug
refactor/api-error-handling
docs/api-documentation
chore/update-dependencies
```

### Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
feat(auth): add password reset functionality
fix(posts): resolve pagination bug in post list
docs(readme): update installation instructions
refactor(api): extract common error handling middleware
chore(deps): update react to 18.3.0
```

### Pull Request Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Keep Branch Updated**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Push to Remote**
   ```bash
   git push origin feature/new-feature
   ```

5. **Create Pull Request**
   - Go to GitHub/GitLab
   - Create PR from `feature/new-feature` to `main`
   - Fill in PR template with:
     - Description of changes
     - Related issues
     - Testing done
     - Screenshots (if UI changes)

6. **Code Review**
   - Address reviewer comments
   - Push additional commits
   - Get approval

7. **Merge**
   - Squash and merge or merge commit (team preference)
   - Delete feature branch

---

## Database Migrations

### Creating a Migration

1. **Update Prisma Schema**
   ```prisma
   // apps/backend/prisma/schema.prisma
   model Comment {
     id        String   @id @default(uuid())
     content   String
     postId    String
     authorId  String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt

     post   Post @relation(fields: [postId], references: [id])
     author User @relation(fields: [authorId], references: [id])

     @@map("comments")
   }
   ```

2. **Generate Migration**
   ```bash
   pnpm --filter kite-backend prisma migrate dev --name add_comments
   ```

   This will:
   - Create SQL migration file
   - Apply migration to database
   - Regenerate Prisma client

3. **Review Migration**
   ```bash
   # Check generated SQL
   cat apps/backend/prisma/migrations/<timestamp>_add_comments/migration.sql
   ```

4. **Commit Migration**
   ```bash
   git add apps/backend/prisma/
   git commit -m "feat(db): add comments table"
   ```

### Migration Best Practices

✅ **Do:**
- Create descriptive migration names
- Review generated SQL before applying
- Test migrations on staging before production
- Never edit existing migration files
- Always use `migrate dev` in development

❌ **Don't:**
- Delete migration files
- Modify applied migrations
- Skip migrations in git
- Use `prisma db push` in production

### Resetting Database (Development Only)

```bash
# WARNING: This deletes all data
pnpm --filter kite-backend prisma migrate reset

# Or manually
pnpm --filter kite-backend prisma migrate reset --force
```

---

## Testing

### Manual Testing

1. **Backend API Testing with curl**
   ```bash
   # Test login
   curl -X POST http://localhost:9000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@example.com", "password": "password"}'

   # Test protected endpoint (copy token from login)
   curl -X GET http://localhost:9000/api/admin/users \
     -H "Cookie: admin_accessToken=<token>"
   ```

2. **Frontend Testing**
   - Open admin panel: http://localhost:5173
   - Open web app: http://localhost:5174
   - Test authentication flows
   - Test CRUD operations
   - Test error handling

### Testing Checklist

Before committing:

- [ ] Backend builds successfully: `pnpm build:backend`
- [ ] Admin panel builds successfully: `pnpm build:admin`
- [ ] Web app builds successfully: `pnpm build:web`
- [ ] No TypeScript errors
- [ ] Database migrations run successfully
- [ ] Manual testing of changed features
- [ ] Both apps can be used simultaneously
- [ ] Authentication works in both apps
- [ ] API responses match expected format

---

## Code Quality

### TypeScript

**Strict Mode:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Type Safety Rules:**
- Always define types for function parameters and return values
- Avoid `any` type unless absolutely necessary
- Use `unknown` instead of `any` when type is truly unknown
- Use type assertions sparingly and with caution

### ESLint

```bash
# Run linter
pnpm --filter admin-panel lint
pnpm --filter web-app lint

# Auto-fix issues
pnpm --filter admin-panel lint --fix
```

### Prettier

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check
```

---

## Environment Management

### Environment Files

```
apps/backend/.env           # Backend config (not in git)
apps/backend/.env.example   # Backend template (in git)
apps/admin-panel/.env       # Admin panel config (not in git)
apps/admin-panel/.env.example  # Template (in git)
apps/web-app/.env           # Web app config (not in git)
apps/web-app/.env.example   # Template (in git)
```

### Environment Variables by App

**Backend:**
```env
DATABASE_URL=postgresql://user:password@localhost:5440/db
PORT=9000
ADMIN_PANEL_URL=http://localhost:5173
WEB_APP_URL=http://localhost:5174
JWT_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>
POSTMARK_API_TOKEN=<postmark-token>
POSTMARK_FROM_EMAIL=noreply@kite.com
```

**Admin Panel & Web App:**
```env
VITE_API_URL=http://localhost:9000
```

### Multiple Environments

**Development:**
- Local database
- Local API
- Debug logging enabled

**Staging:**
- Staging database
- Staging API
- Production-like configuration
- Test data

**Production:**
- Production database
- Production API
- Error logging only
- Real data

---

## Deployment

### Backend Deployment

**Build:**
```bash
pnpm --filter kite-backend build
```

**Output:** `apps/backend/dist/`

**Run Production:**
```bash
cd apps/backend
NODE_ENV=production node dist/server.js
```

**Environment Variables (Production):**
```env
NODE_ENV=production
DATABASE_URL=<production-db-url>
PORT=9000
ADMIN_PANEL_URL=https://admin.kite.com
WEB_APP_URL=https://app.kite.com
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
POSTMARK_API_TOKEN=<production-token>
POSTMARK_FROM_EMAIL=noreply@kite.com
```

**Database Migrations (Production):**
```bash
pnpm --filter kite-backend prisma migrate deploy
```

### Frontend Deployment

**Build:**
```bash
# Admin Panel
pnpm --filter admin-panel build

# Web App
pnpm --filter web-app build
```

**Output:**
- `apps/admin-panel/dist/`
- `apps/web-app/dist/`

**Deployment Options:**

1. **Static Hosting (Vercel, Netlify)**
   - Deploy `dist` folder
   - Set environment variable: `VITE_API_URL=https://api.kite.com`
   - Configure redirects for SPA routing

2. **S3 + CloudFront**
   - Upload `dist` to S3 bucket
   - Configure CloudFront distribution
   - Set up custom domain

3. **Nginx**
   ```nginx
   server {
     listen 80;
     server_name admin.kite.com;
     root /var/www/admin-panel;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

### Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm --filter kite-backend build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/node_modules ./node_modules
EXPOSE 9000
CMD ["node", "dist/server.js"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: kite
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5440:5432"

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "9000:9000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/kite
      PORT: 9000
    depends_on:
      - db

volumes:
  postgres_data:
```

---

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find process using port
lsof -ti:9000

# Kill process
kill -9 <PID>

# Or use different port
PORT=9001 pnpm dev:backend
```

**2. Database Connection Failed**
```bash
# Check if PostgreSQL is running
docker ps

# Check DATABASE_URL is correct
cat apps/backend/.env | grep DATABASE_URL

# Test connection
psql postgresql://postgres:postgres@localhost:5440/kite
```

**3. Prisma Client Not Generated**
```bash
# Regenerate Prisma client
pnpm db:generate

# Restart TypeScript server in VS Code
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

**4. CORS Errors**
```bash
# Check frontend URLs in backend .env
# Must match frontend origins exactly

# Backend .env
ADMIN_PANEL_URL=http://localhost:5173
WEB_APP_URL=http://localhost:5174

# Check axios withCredentials
// apps/admin-panel/src/utils/api.ts
withCredentials: true
```

**5. Authentication Not Working**
```bash
# Check cookies in browser DevTools
# Application > Cookies

# Verify JWT_SECRET is same for sign and verify
# Check .env file

# Clear cookies and try again
```

**6. Build Errors**
```bash
# Clear all builds and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf apps/*/dist packages/*/dist
pnpm install
pnpm build
```

---

## Performance Optimization

### Backend

1. **Database Indexing**
   ```prisma
   model Post {
     @@index([authorId])
     @@index([status])
     @@index([createdAt])
   }
   ```

2. **Query Optimization**
   - Use `select` to fetch only needed fields
   - Use `include` sparingly
   - Implement pagination
   - Add database indices

3. **Caching**
   - Redis for session storage
   - Cache frequent queries
   - Use ETags for static resources

### Frontend

1. **Code Splitting**
   ```typescript
   // Lazy load routes
   const PostsPage = lazy(() => import("./pages/posts"));
   ```

2. **React Query Optimization**
   ```typescript
   // Set appropriate staleTime
   staleTime: 5 * 60 * 1000,  // 5 minutes

   // Enable background refetch
   refetchOnWindowFocus: false,
   ```

3. **Bundle Size**
   ```bash
   # Analyze bundle
   pnpm --filter admin-panel build
   pnpm --filter admin-panel preview --open

   # Use Vite bundle analyzer
   vite-bundle-visualizer
   ```

---

## Security Checklist

### Backend
- [ ] Use environment variables for secrets
- [ ] Validate all user inputs
- [ ] Sanitize database queries
- [ ] Implement rate limiting
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement CORS properly
- [ ] Hash passwords with bcrypt
- [ ] Use JWT with expiration
- [ ] Log security events

### Frontend
- [ ] Validate form inputs
- [ ] Sanitize user-generated content
- [ ] Use HTTP-only cookies
- [ ] Implement CSP headers
- [ ] Avoid inline scripts
- [ ] Use HTTPS
- [ ] Implement proper error handling
- [ ] Don't expose sensitive data in console

---

## Monitoring and Logging

### Backend Logging

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### Error Tracking

**Options:**
- Sentry
- LogRocket
- Bugsnag
- Rollbar

---

## Next Steps

- Review [Monorepo Setup](./01-monorepo-setup.md)
- Explore [Backend Development](./04-backend-development.md)
- Learn [Frontend Development](./06-frontend-development.md)
- Understand [Authentication System](./05-authentication-system.md)
