# Kite - Full-Stack TypeScript Monorepo

> Production-ready full-stack monorepo with Express.js backend, React frontends (admin + web app), and shared UI component library. Features JWT auth, Prisma ORM, PostgreSQL, TanStack Query, Tailwind CSS v4, and PNPM workspaces.

## Quick Start

```bash
# Clone repository
git clone <your-repo-url>
cd kite

# Install dependencies
pnpm install

# Setup environment variables (see .env.example files in each app)
cp apps/backend/.env.example apps/backend/.env
cp apps/admin-panel/.env.example apps/admin-panel/.env
cp apps/web-app/.env.example apps/web-app/.env

# Setup database
pnpm db:generate
pnpm db:migrate

# Start all apps
pnpm dev
```

**Access the applications:**
- Backend API: http://localhost:9000
- Admin Panel: http://localhost:5173
- Web App: http://localhost:5174

## Seed data into the database

If you use the backend Docker Compose file, demo data is seeded automatically the first time the Postgres volume is created:

```bash
cd apps/backend
docker compose up -d postgres
```

Postgres only runs Docker init scripts on the first volume mount. If the `postgres_data_kite` volume already exists, Docker will keep the existing database and skip the automatic seed.

You can also seed an existing database manually:

```bash
# From the repo root
pnpm db:seed

# Or from apps/backend
pnpm db:seed
```

The seed creates:
- Demo admin user: `admin@kite.test` / `DemoPass123!`
- Demo normal user: `user@kite.test` / `DemoPass123!`
- Completed profiles for both demo users
- Demo workspaces/orgs: `Demo Admin Ops`, `Acme Creative`, and `Acme Events`
- Workspace memberships for the seeded users
- Demo posts across draft and published states

The admin and web login pages are prefilled with the matching demo credentials for smoother local testing.

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT with refresh tokens
- **Email**: Postmark
- **Validation**: Zod shared schemas

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State**: TanStack Query + Zustand
- **UI**: Tailwind CSS v4 + Radix UI
- **Forms**: React Hook Form + Zod
- **Components**: CVA (class-variance-authority)

### Shared Packages
- **@kite/types**: Shared Zod schemas and inferred TypeScript types
- **@kite/config**: Configuration and constants
- **@kite/ui**: Complete UI component library (22+ components)

### Tools
- **Package Manager**: PNPM 9.14+
- **Language**: TypeScript 5.6
- **Monorepo**: PNPM Workspaces

## Project Structure

```
kite/
├── apps/
│   ├── backend/          # Express.js API server
│   ├── admin-panel/      # React admin dashboard
│   └── web-app/          # React web application
│
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── config/           # Shared configuration
│   └── ui/               # Shared UI components (Tailwind v4 + CVA)
│
└── docs/                 # Complete documentation
```

## Features

- ✅ **Complete Authentication System** - Email/password, JWT, refresh tokens, password reset
- ✅ **Role-Based Access Control** - USER and ADMIN roles with protected routes
- ✅ **User Management** - Admin dashboard for managing users
- ✅ **Content Management** - Full CRUD for posts with draft/publish workflow
- ✅ **Shared UI Library** - 22+ components with Tailwind v4 and CVA variants
- ✅ **Type-Safe APIs** - End-to-end type safety with shared types
- ✅ **Hot Reload** - Fast development with Vite and tsx watch mode
- ✅ **Production Ready** - Built with best practices and scalability in mind

## Documentation

### Getting Started
- 📚 **[Documentation Index](docs/README.md)** - Complete documentation overview
- 🚀 **[Monorepo Setup](docs/01-monorepo-setup.md)** - PNPM workspaces and package management
- 📱 **[Apps Overview](docs/02-apps-overview.md)** - Backend, admin panel, and web app overview

### Development Guides
- ⚙️ **[Backend Development](docs/04-backend-development.md)** - Creating APIs with Express.js
- 🎨 **[Frontend Development](docs/06-frontend-development.md)** - React, TanStack Query, and routing
- 📦 **[Shared Packages](docs/03-shared-packages.md)** - Using @kite/types, @kite/config, @kite/ui
- 🔐 **[Authentication System](docs/05-authentication-system.md)** - JWT auth flow and implementation
- 🔄 **[Development Workflow](docs/07-development-workflow.md)** - Git workflow, testing, and deployment

### Application READMEs
- **[Backend](apps/backend/README.md)** - Express.js API structure and conventions
- **[Admin Panel](apps/admin-panel/README.md)** - Admin dashboard structure and features
- **[Web App](apps/web-app/README.md)** - Web application structure and features

### Package READMEs
- **[Types Package](packages/types/README.md)** - Shared type definitions
- **[Config Package](packages/config/README.md)** - Configuration and constants
- **[UI Package](packages/ui/README.md)** - Component library with Tailwind v4

## Available Scripts

### Development
```bash
pnpm dev              # Start all apps in parallel
pnpm dev:backend      # Start backend only (port 9000)
pnpm dev:admin        # Start admin panel only (port 5173)
pnpm dev:web          # Start web app only (port 5174)
```

### Build
```bash
pnpm build            # Build all apps
pnpm build:backend    # Build backend only
pnpm build:admin      # Build admin panel only
pnpm build:web        # Build web app only
```

### Database
```bash
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Prisma Studio
```

### Code Quality
```bash
pnpm lint             # Lint all apps
pnpm format           # Format code with Prettier
pnpm clean            # Remove all node_modules
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5440/kite"
PORT=9000
ADMIN_PANEL_URL="http://localhost:5173"
WEB_APP_URL="http://localhost:5174"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
POSTMARK_API_TOKEN="your-postmark-token"
POSTMARK_FROM_EMAIL="noreply@example.com"
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:9000"
```

## Key Concepts

### Monorepo Benefits
- **Code Sharing**: Shared types, config, and UI components across all apps
- **Consistent Tooling**: Same TypeScript, ESLint, and Prettier configs
- **Atomic Changes**: Update types and all consumers in a single commit
- **Type Safety**: End-to-end type safety from backend to frontend

### Shared UI Components
All UI components live in `@kite/ui` and use:
- **Tailwind CSS v4** for styling with CSS-first approach
- **CVA** (class-variance-authority) for type-safe component variants
- **Radix UI** primitives for accessibility
- **cn()** utility for class merging

Example:
```typescript
import { Button, Input, Card } from "@kite/ui";

<Button variant="default" size="lg">Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

### API Response Pattern
All backend API responses follow this structure:
```typescript
{
  success: boolean;
  message: string;
  data: T;
}
```

### Authentication Flow
- JWT access tokens stored in httpOnly cookies
- Refresh tokens for token renewal
- Automatic token refresh on 401 responses
- Separate cookies for admin panel and web app

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `pnpm build` to ensure everything compiles
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT License - feel free to use this template for your projects!

## Support

- 📚 [Complete Documentation](docs/README.md)
- 💬 [Create an Issue](../../issues)
- 📧 Contact: support@example.com

---

Made with ❤️ using TypeScript, React, Express.js, and Tailwind CSS
