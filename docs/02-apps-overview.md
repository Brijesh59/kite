# Apps Overview

This document provides an overview of the three main applications in the Kite monorepo.

## Applications

### 1. Backend API (`apps/backend`)

The Express.js API server that powers both frontend applications.

**Port**: 9000
**Framework**: Express.js
**Database**: PostgreSQL via Prisma
**Authentication**: JWT with HTTP-only cookies

#### Key Features

- RESTful API endpoints
- Role-based access control (RBAC)
- Multi-client authentication (admin vs web)
- Database migrations with Prisma
- Email notifications via Postmark
- Input validation with Joi
- Error handling middleware

#### Directory Structure

```
apps/backend/
├── src/
│   ├── modules/           # Feature modules (auth, posts, users, etc.)
│   ├── middleware/        # Express middleware
│   ├── services/          # Shared services
│   ├── common/            # Common utilities
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── .env                   # Environment variables
└── package.json
```

#### Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5440/kite
PORT=9000
ADMIN_PANEL_URL=http://localhost:5173
WEB_APP_URL=http://localhost:5174
BACKEND_URL=http://localhost:9000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d
POSTMARK_API_TOKEN=your_postmark_token
POSTMARK_FROM_EMAIL=noreply@kite.com
```

#### Running the Backend

```bash
# Development mode (with auto-reload)
pnpm dev:backend

# Build
pnpm build:backend

# Run migrations
pnpm db:migrate

# Generate Prisma client
pnpm db:generate
```

---

### 2. Admin Panel (`apps/admin-panel`)

The administrative dashboard for managing users, posts, and system settings.

**Port**: 5173
**Framework**: React + Vite
**UI**: Tailwind CSS + shadcn/ui
**State**: TanStack Query + Zustand

#### Key Features

- User management (CRUD operations)
- Post management with publish/draft status
- Role assignment (ADMIN, ORGANISER, USER, ARTIST)
- Dashboard with statistics
- Client-specific authentication (ADMIN only)

#### Directory Structure

```
apps/admin-panel/
├── src/
│   ├── pages/             # Page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── posts/
│   │   └── settings/
│   ├── components/        # Shared components
│   │   ├── layout/
│   │   └── ui/
│   ├── api/               # API integration layer
│   │   ├── auth/
│   │   ├── users/
│   │   └── posts/
│   ├── routes/            # Route guards
│   │   ├── protected/
│   │   └── public/
│   ├── utils/             # Utilities and stores
│   ├── App.tsx            # App entry point
│   └── main.tsx           # React entry point
├── .env                   # Environment variables
└── package.json
```

#### Environment Variables

```env
VITE_API_URL=http://localhost:9000
```

#### Access Control

- **Login**: Only users with `ADMIN` role can log in
- **Cookies**: Uses `admin_accessToken` and `admin_refreshToken`
- **Routes**: All routes protected by authentication

#### Running the Admin Panel

```bash
# Development mode
pnpm dev:admin

# Build
pnpm build:admin

# Preview production build
pnpm --filter admin-panel preview
```

---

### 3. Web App (`apps/web-app`)

The user-facing application for browsing events, creating posts, and managing profiles.

**Port**: 5174
**Framework**: React + Vite
**UI**: Tailwind CSS + shadcn/ui
**State**: TanStack Query + Zustand

#### Key Features

- User registration and authentication
- Multi-step onboarding flow
- Dashboard with user statistics
- Post creation and management
- Profile management
- Client-specific authentication (all roles)

#### Directory Structure

```
apps/web-app/
├── src/
│   ├── pages/             # Page components
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── reset-password.tsx
│   │   ├── onboarding/
│   │   │   ├── index.tsx
│   │   │   ├── step1-profile.tsx
│   │   │   ├── step2-role.tsx
│   │   │   ├── step3-preferences.tsx
│   │   │   └── step4-location.tsx
│   │   ├── dashboard/
│   │   └── posts/
│   ├── components/        # Shared components
│   │   ├── layout/
│   │   └── ui/
│   ├── api/               # API integration layer
│   │   ├── auth/
│   │   ├── posts/
│   │   └── onboarding/
│   ├── routes/            # Route guards
│   │   ├── protected/
│   │   ├── public/
│   │   └── onboarding/
│   ├── utils/             # Utilities and stores
│   ├── App.tsx            # App entry point
│   └── main.tsx           # React entry point
├── .env                   # Environment variables
└── package.json
```

#### Environment Variables

```env
VITE_API_URL=http://localhost:9000
```

#### Access Control

- **Login**: All users (USER, ORGANISER, ARTIST, ADMIN) can log in
- **Cookies**: Uses `accessToken` and `refreshToken`
- **Onboarding**: New users must complete onboarding before accessing dashboard
- **Routes**: Protected routes require authentication + completed onboarding

#### Running the Web App

```bash
# Development mode
pnpm dev:web

# Build
pnpm build:web

# Preview production build
pnpm --filter web-app preview
```

---

## Application Comparison

| Feature | Backend | Admin Panel | Web App |
|---------|---------|-------------|---------|
| **Port** | 9000 | 5173 | 5174 |
| **Type** | API Server | Admin Dashboard | User App |
| **Framework** | Express | React + Vite | React + Vite |
| **Authentication** | JWT Provider | ADMIN only | All roles |
| **Cookie Names** | N/A | `admin_*` | Standard |
| **Primary Users** | N/A | Administrators | End users |
| **Database Access** | Direct (Prisma) | Via API | Via API |

## Multi-Client Authentication

Both frontend apps connect to the same backend but use different authentication cookies:

### Admin Panel
- **Cookies**: `admin_accessToken`, `admin_refreshToken`
- **Client Type**: `admin`
- **Validation**: Only ADMIN role allowed
- **Origin**: `http://localhost:5173` (dev)

### Web App
- **Cookies**: `accessToken`, `refreshToken`
- **Client Type**: `web`
- **Validation**: All roles allowed
- **Origin**: `http://localhost:5174` (dev)

The backend middleware detects the request origin and prioritizes the correct cookies, allowing both apps to work simultaneously in the same browser.

## Development Workflow

### Running All Apps

```bash
# Terminal 1: Start backend
pnpm dev:backend

# Terminal 2: Start admin panel
pnpm dev:admin

# Terminal 3: Start web app
pnpm dev:web

# Or run all in parallel (single terminal)
pnpm dev
```

### Testing Cross-App Changes

1. Update shared types in `packages/types`
2. Backend automatically picks up type changes (watch mode)
3. Frontend apps hot-reload with new types
4. Test both admin panel and web app to ensure compatibility

### Database Changes

```bash
# 1. Update prisma/schema.prisma
# 2. Generate migration
pnpm --filter kite-backend prisma migrate dev --name your_migration_name

# 3. Migration runs automatically and generates Prisma client
# 4. Update @kite/types if needed
# 5. Update backend modules
# 6. Update frontend API integrations
```

## API Communication

All apps communicate with the backend via REST API:

```
┌─────────────┐         ┌─────────────┐
│             │   HTTP  │             │
│ Admin Panel ├────────►│             │
│  (5173)     │         │   Backend   │
└─────────────┘         │   (9000)    │
                        │             │
┌─────────────┐         │             │
│             │   HTTP  │             │
│  Web App    ├────────►│             │
│  (5174)     │         │             │
└─────────────┘         └──────┬──────┘
                               │
                               │ Prisma
                               │
                        ┌──────▼──────┐
                        │             │
                        │ PostgreSQL  │
                        │  (5440)     │
                        └─────────────┘
```

## Port Reference

- **Backend API**: 9000
- **Admin Panel**: 5173
- **Web App**: 5174
- **PostgreSQL**: 5440 (local dev)

## Next Steps

- Learn about [Shared Packages](./03-shared-packages.md)
- Understand [Backend Development](./04-backend-development.md)
- Explore [Frontend Development](./06-frontend-development.md)
