# CLAUDE.md - AI Assistant Knowledge Base

This file contains essential information for AI assistants (like Claude) working on the Kite monorepo. It provides quick context, project structure, and pointers to detailed documentation.

---

## Project Overview

**Kite** is a production-ready full-stack TypeScript monorepo featuring:
- **Backend**: Express.js + TypeScript + Prisma + PostgreSQL
- **Frontend Apps**: React 18 + Vite + TanStack Query + Zustand
  - Admin Panel (port 5173)
  - Web App (port 5174)
- **Shared Packages**: @kite/types, @kite/config, @kite/ui (22+ components)
- **Monorepo**: PNPM Workspaces
- **Authentication**: JWT with httpOnly cookies (separate for admin/web)
- **UI**: Tailwind CSS v4 + Radix UI + CVA variants

---

## Quick Reference: Where to Find Information

### 📂 Documentation Structure

```
docs/
├── README.md                      # Documentation index with learning paths
├── 01-monorepo-setup.md          # PNPM workspaces, dependencies, setup
├── 02-apps-overview.md           # Overview of all 3 apps
├── 03-shared-packages.md         # @kite/types, @kite/config, @kite/ui
├── 04-backend-development.md     # Creating APIs, modules, services
├── 05-authentication-system.md   # JWT flow, cookies, multi-client auth
├── 06-frontend-development.md    # React, TanStack Query, routing
└── 07-development-workflow.md    # Git, testing, migrations, deployment
```

### 🎯 When to Use Which Documentation

| **Task** | **Documentation to Read** |
|----------|---------------------------|
| Understanding project structure | [README.md](README.md) → [docs/README.md](docs/README.md) |
| Setting up development environment | [docs/01-monorepo-setup.md](docs/01-monorepo-setup.md) |
| Adding a new backend endpoint | [docs/04-backend-development.md](docs/04-backend-development.md) |
| Understanding authentication flow | [docs/05-authentication-system.md](docs/05-authentication-system.md) |
| Creating a new frontend page | [docs/06-frontend-development.md](docs/06-frontend-development.md) |
| Adding a shared type | [docs/03-shared-packages.md](docs/03-shared-packages.md#1-kiteptypes) |
| Creating a UI component | [docs/03-shared-packages.md](docs/03-shared-packages.md#3-kiteui) |
| Running database migrations | [docs/07-development-workflow.md](docs/07-development-workflow.md) |
| Understanding backend structure | [apps/backend/README.md](apps/backend/README.md) |
| Understanding admin panel structure | [apps/admin-panel/README.md](apps/admin-panel/README.md) |
| Understanding web app structure | [apps/web-app/README.md](apps/web-app/README.md) |
| Using shared UI components | [packages/ui/README.md](packages/ui/README.md) |
| Using shared types | [packages/types/README.md](packages/types/README.md) |
| Using shared config | [packages/config/README.md](packages/config/README.md) |

---

## Critical Project Information

### 🏗️ Architecture Decisions

#### Backend (Express.js)
- **Framework**: Express.js with TypeScript
- **Validation**: Joi
- **Module Structure**: Each feature has `.types.ts`, `.validation.ts`, `.service.ts`, `.controller.ts`, `.routes.ts`
- **Database**: PostgreSQL via Prisma ORM
- **Port**: 9000 (configurable via PORT env var)

#### Frontend (React)
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Server State**: TanStack Query v5
- **Client State**: Zustand
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS v4 (CSS-first approach with `@import "tailwindcss"`)

#### Shared UI (@kite/ui)
- **22+ Components**: All using CVA for variants, Radix UI primitives
- **Theme**: OKLCH color format, shared via `@kite/ui/styles`
- **Import Pattern**: `import { Button, Input } from "@kite/ui"`
- **Styling**: Apps import `@import "@kite/ui/styles"` in their index.css
- **Extension**: Apps can override theme via className prop or CSS variables

### 🔐 Authentication Architecture

**CRITICAL**: Different cookies for different clients
- Admin Panel: `admin_access_token` and `admin_refresh_token`
- Web App: `access_token` and `refresh_token`
- Origin-based cookie selection in backend middleware
- Automatic token refresh on 401 responses
- React Query cache cleared on logout

See [docs/05-authentication-system.md](docs/05-authentication-system.md) for complete flow.

### 📦 Package Management

- **Manager**: PNPM
- **Workspace Protocol**: `workspace:*` for internal dependencies
- **Commands**:
  - `pnpm install` - Install all dependencies
  - `pnpm dev` - Start all apps in parallel
  - `pnpm dev:backend` - Start backend only
  - `pnpm dev:admin` - Start admin panel only
  - `pnpm dev:web` - Start web app only
  - `pnpm build` - Build all apps
  - `pnpm db:generate` - Generate Prisma client
  - `pnpm db:migrate` - Run database migrations

### 📁 Directory Structure

```
kite/
├── apps/
│   ├── backend/              # Express.js API (port 9000)
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules (auth, post, admin, profile)
│   │   │   ├── middleware/   # Express middleware
│   │   │   ├── common/       # Shared utilities
│   │   │   └── services/     # External services (email, etc.)
│   │   └── prisma/           # Database schema and migrations
│   │
│   ├── admin-panel/          # React admin dashboard (port 5173)
│   │   └── src/
│   │       ├── api/          # API integration (auth, users, posts, dashboard)
│   │       ├── components/   # Shared components (layout)
│   │       ├── pages/        # Route components (auth, dashboard, users, posts, settings)
│   │       ├── routes/       # Route configuration (public, protected)
│   │       ├── hooks/        # Custom hooks (useSteps, use-auth)
│   │       ├── lib/          # Config (react-query, store)
│   │       └── utils/        # Utilities (api, format-date)
│   │
│   └── web-app/              # React web app (port 5174)
│       └── src/
│           ├── api/          # API integration (auth, posts, profile)
│           ├── components/   # Shared components (layout, editor)
│           ├── pages/        # Route components (auth, dashboard, posts, profile, onboarding)
│           ├── routes/       # Route configuration (public, protected, onboarding)
│           ├── hooks/        # Custom hooks (useSteps, use-auth)
│           ├── lib/          # Config (react-query, store)
│           └── utils/        # Utilities (api, format-date)
│
└── packages/
    ├── types/                # Shared TypeScript types
    │   └── src/
    │       ├── user.types.ts
    │       ├── auth.types.ts
    │       ├── post.types.ts
    │       ├── api.types.ts
    │       └── profile.types.ts
    │
    ├── config/               # Shared configuration
    │   └── src/
    │       ├── constants.ts  # USER_ROLES, PAGINATION, etc.
    │       └── validation.ts # Regex patterns, validators
    │
    └── ui/                   # Shared UI component library
        └── src/
            ├── styles.css    # Tailwind v4 theme (apps import this)
            ├── components/   # 22+ UI components
            ├── lib/          # cn() utility
            └── hooks/        # useIsMobile
```

---

## File Naming Conventions

### Backend (Express.js)
- **Modules**: `<feature>/<feature>.types.ts`, `<feature>.validation.ts`, `<feature>.service.ts`, `<feature>.controller.ts`, `<feature>.routes.ts`
- **Example**: `modules/auth/auth.types.ts`, `modules/auth/auth.validation.ts`, etc.

### Frontend (React)
- **Pages**: `kebab-case.tsx` (e.g., `forget-password.tsx`)
- **Components**: `kebab-case.tsx` (e.g., `user-table.tsx`, `stats-card.tsx`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useSteps.ts`, `use-auth.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`)
- **API Files**: `index.ts` inside feature folders (e.g., `api/users/index.ts`)

### Shared Packages
- **Types**: `<feature>.types.ts` (e.g., `user.types.ts`, `post.types.ts`)
- **Components**: `kebab-case.tsx` (e.g., `button.tsx`, `input.tsx`)
- **Constants**: `constants.ts`, `validation.ts`

---

## Common Patterns & Examples

### Backend: Creating a New Module

See [docs/04-backend-development.md](docs/04-backend-development.md) for full example.

**Steps**:
1. Update Prisma schema (`apps/backend/prisma/schema.prisma`)
2. Run `pnpm db:generate` and `pnpm db:migrate`
3. Create module directory: `src/modules/<feature>/`
4. Create files: `<feature>.types.ts`, `<feature>.validation.ts`, `<feature>.service.ts`, `<feature>.controller.ts`, `<feature>.routes.ts`
5. Register routes in `src/app.ts`

### Frontend: Creating a New Page

See [docs/06-frontend-development.md](docs/06-frontend-development.md) for full example.

**Steps**:
1. Create page component in `src/pages/<feature>/index.tsx`
2. Create API integration in `src/api/<feature>/index.ts`
3. Define route in `src/routes/protected/routes.tsx` or `src/routes/public/routes.tsx`
4. Use TanStack Query for data fetching
5. Use Zustand for client state if needed

### Adding a Shared Type

See [packages/types/README.md](packages/types/README.md) for examples.

**Steps**:
1. Create or update type file in `packages/types/src/<feature>.types.ts`
2. Export from `packages/types/src/index.ts`
3. Use in apps: `import type { User, Post } from "@kite/types"`

### Creating a UI Component

See [packages/ui/README.md](packages/ui/README.md) for full guide.

**Steps**:
1. Create component in `packages/ui/src/components/<component>.tsx`
2. Use CVA for variants, Radix UI for primitives
3. Use `cn()` utility for class merging
4. Export from `packages/ui/src/index.ts`
5. Use in apps: `import { Button } from "@kite/ui"`

---

## Type Safety & API Response Structure

### Standard API Response

All backend endpoints return:

```typescript
{
  success: boolean;
  message: string;
  data: T;
}
```

### Paginated Response

```typescript
{
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

### Frontend API Integration

```typescript
// apps/admin-panel/src/api/users/index.ts
import { api } from "@/utils/api";
import type { User, ApiResponse, PaginatedResponse } from "@kite/types";

export const getUsersApi = (params: GetUsersQuery) =>
  api.get<ApiResponse<PaginatedResponse<User>>>("/api/admin/users", { params });
```

### TanStack Query Usage

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["users", page, limit],
  queryFn: () => getUsersApi({ page, limit }),
});

const users = data?.data.data.items || [];
const total = data?.data.data.total || 0;
```

---

## Environment Variables

### Backend (`apps/backend/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kite"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=9000
NODE_ENV="development"
ADMIN_PANEL_URL="http://localhost:5173"
WEB_APP_URL="http://localhost:5174"
```

### Admin Panel (`apps/admin-panel/.env`)
```env
VITE_API_URL=http://localhost:9000
VITE_APP_NAME=Kite Admin
```

### Web App (`apps/web-app/.env`)
```env
VITE_API_URL=http://localhost:9000
VITE_APP_NAME=Kite
```

---

## Important Notes for AI Assistants

### ⚠️ Things to Remember

1. **Express.js, NOT NestJS**: The backend uses Express.js with TypeScript, not NestJS. Don't suggest NestJS patterns.

2. **Joi, NOT class-validator**: Backend validation uses Joi schemas, not class-validator decorators.

3. **Tailwind CSS v4**: Uses CSS-first approach with `@import "tailwindcss"` and `@theme inline` directive.

4. **CVA for Variants**: All UI components use class-variance-authority for type-safe variants.

5. **PNPM, NOT npm**: Always use `pnpm` commands, not `npm` or `yarn`.

6. **Workspace Protocol**: Internal dependencies use `workspace:*` in package.json.

7. **Separate Cookies**: Admin panel and web app use different cookie names for auth tokens.

8. **Import Paths**: Frontend apps use `@/` alias for src directory. Shared packages use relative imports.

9. **TypeScript Strict Mode**: All packages use TypeScript strict mode.

10. **Hot Reload**: Backend uses `tsx` watch mode, frontend uses Vite HMR.

### 🚫 Common Mistakes to Avoid

1. ❌ **Don't use NestJS decorators** (use Express route handlers)
2. ❌ **Don't use class-validator** (use Joi schemas)
3. ❌ **Don't use Tailwind config.js** (use CSS `@theme inline` in v4)
4. ❌ **Don't mix cookie names** (admin vs web app)
5. ❌ **Don't forget workspace:* protocol** for internal deps
6. ❌ **Don't use npm or yarn** (only pnpm)
7. ❌ **Don't import @kite/ui styles in components** (apps import once in index.css)
8. ❌ **Don't create new UI components in apps** (extend @kite/ui)
9. ❌ **Don't skip prisma generate** after schema changes
10. ❌ **Don't hardcode API URLs** (use environment variables)

### ✅ Best Practices

1. ✅ **Read relevant docs first** before making changes
2. ✅ **Follow existing patterns** in similar files
3. ✅ **Use shared types** from @kite/types
4. ✅ **Import UI components** from @kite/ui
5. ✅ **Use TanStack Query** for server state
6. ✅ **Use Zustand** for client state
7. ✅ **Validate on both** frontend (Zod) and backend (Joi)
8. ✅ **Keep components small** and focused
9. ✅ **Write self-documenting code** with clear names
10. ✅ **Test manually** after changes

---

## Quick Command Reference

### Development
```bash
pnpm dev              # Start all apps
pnpm dev:backend      # Start backend only
pnpm dev:admin        # Start admin panel only
pnpm dev:web          # Start web app only
```

### Building
```bash
pnpm build            # Build all apps
pnpm build:backend    # Build backend only
pnpm build:admin      # Build admin panel only
pnpm build:web        # Build web app only
```

### Database
```bash
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm --filter kite-backend prisma studio    # Open Prisma Studio
```

### Dependencies
```bash
pnpm install                           # Install all
pnpm --filter kite-backend add express # Add to backend
pnpm --filter admin-panel add react    # Add to admin panel
pnpm --filter @kite/ui add lucide-react # Add to UI package
```

---

## Code Examples Index

For complete code examples, see:

1. **Backend Module**: [docs/04-backend-development.md](docs/04-backend-development.md) - Complete comments module example
2. **Frontend Page**: [docs/06-frontend-development.md](docs/06-frontend-development.md) - Posts page with TanStack Query
3. **UI Component**: [packages/ui/README.md](packages/ui/README.md) - Button component with CVA
4. **Shared Types**: [packages/types/README.md](packages/types/README.md) - User, Post, API response types
5. **Auth Flow**: [docs/05-authentication-system.md](docs/05-authentication-system.md) - Complete auth implementation

---

## Getting Help

If you need more information:

1. **Start with**: [docs/README.md](docs/README.md) - Complete documentation index
2. **Project overview**: [README.md](README.md) - Quick start and features
3. **Specific topics**: Use the "Where to Find Information" table above
4. **Code examples**: Check the app READMEs and package READMEs
5. **Patterns**: Look at existing similar files in the codebase

---

**Last Updated**: 2025-01-30
**Project Version**: 1.0.0

---

## For Future AI Assistants

This file is designed to help you quickly understand the Kite monorepo. Here's the recommended approach:

1. **Read this file first** to understand the overall structure
2. **Check the relevant documentation** from the table above based on the task
3. **Look at existing code** in similar features for patterns
4. **Follow the naming conventions** and file structure
5. **Test your changes** manually before considering them complete

The documentation is comprehensive and well-organized. Use it! 📚
