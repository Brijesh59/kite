# Kite Documentation

Complete documentation for the Kite full-stack TypeScript monorepo. This guide covers everything from initial setup to advanced development patterns.

## 📚 Documentation Index

### Getting Started
1. **[Monorepo Setup](./01-monorepo-setup.md)** - PNPM workspaces, package management, and project structure
2. **[Apps Overview](./02-apps-overview.md)** - Backend, Admin Panel, and Web App architecture
3. **[Shared Packages](./03-shared-packages.md)** - @kite/types, @kite/config, @kite/ui components

### Core Development
4. **[Backend Development](./04-backend-development.md)** - Express modules, services, controllers, and Prisma
5. **[Authentication System](./05-authentication-system.md)** - JWT flow, multi-client auth, and cookie management
6. **[Frontend Development](./06-frontend-development.md)** - React, TanStack Query, routing, and forms

### Workflow & Deployment
7. **[Development Workflow](./07-development-workflow.md)** - Git workflow, testing, migrations, and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PNPM 9.14+
- PostgreSQL 14+

### Installation

```bash
# Clone and install
git clone <your-repo>
cd kite
pnpm install

# Setup environment
cp apps/backend/.env.example apps/backend/.env
cp apps/admin-panel/.env.example apps/admin-panel/.env
cp apps/web-app/.env.example apps/web-app/.env

# Setup database
pnpm db:generate
pnpm db:migrate

# Start development
pnpm dev
```

### Access Applications
- **Backend API**: http://localhost:9000
- **Admin Panel**: http://localhost:5173
- **Web App**: http://localhost:5174

## 📖 Learning Path

### For New Developers
1. Start with [Monorepo Setup](./01-monorepo-setup.md) to understand the project structure
2. Read [Apps Overview](./02-apps-overview.md) to understand each application's purpose
3. Review [Shared Packages](./03-shared-packages.md) to learn about code sharing
4. Follow either [Backend Development](./04-backend-development.md) or [Frontend Development](./06-frontend-development.md) based on your focus

### For Backend Developers
1. [Backend Development](./04-backend-development.md) - Express patterns and best practices
2. [Authentication System](./05-authentication-system.md) - Understanding JWT and session management
3. [Development Workflow](./07-development-workflow.md) - Database migrations and deployment

### For Frontend Developers
1. [Frontend Development](./06-frontend-development.md) - React, TanStack Query, and state management
2. [Shared Packages](./03-shared-packages.md) - Using shared UI components
3. [Authentication System](./05-authentication-system.md) - Client-side auth flow

## 🛠 Tech Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with httpOnly cookies
- **Validation**: Joi
- **Email**: Postmark

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: TanStack Query + Zustand
- **UI Library**: Tailwind CSS v4 + Radix UI
- **Forms**: React Hook Form + Zod
- **Variants**: CVA (class-variance-authority)

### Shared
- **Monorepo**: PNPM Workspaces
- **Language**: TypeScript
- **Package Namespace**: @kite/*

## 📂 Key Directories

```
kite/
├── apps/
│   ├── backend/          → Express.js API server
│   ├── admin-panel/      → React admin dashboard
│   └── web-app/          → React web application
├── packages/
│   ├── types/            → Shared TypeScript types
│   ├── config/           → Shared configuration
│   └── ui/               → Shared UI components (22+ components)
└── docs/                 → This documentation
```

## 🔑 Key Concepts

### Monorepo Benefits
- **Single Source of Truth**: Shared types across backend and frontend
- **Atomic Changes**: Update types and consumers in one commit
- **Consistent Tooling**: Same TypeScript config across all apps
- **Code Reuse**: Shared UI components and utilities

### Shared UI Components
All UI components use:
- **Tailwind CSS v4** with CSS-first approach
- **CVA** for type-safe component variants
- **Radix UI** for accessible primitives
- **cn()** utility for class merging

### API Response Structure
```typescript
{
  success: boolean;
  message: string;
  data: T;
}
```

### Authentication Architecture
- JWT access tokens in httpOnly cookies
- Separate cookies for admin panel and web app
- Automatic token refresh on 401 responses
- Refresh tokens for session renewal

## 📋 Common Tasks

### Adding a New Type
See [Shared Packages - Types](./03-shared-packages.md#1-kiteptypes)

### Creating a New API Endpoint
See [Backend Development - Creating APIs](./04-backend-development.md)

### Adding a UI Component
See [Shared Packages - UI](./03-shared-packages.md#3-kiteui)

### Creating a New Page
See [Frontend Development - Routing](./06-frontend-development.md#routing-with-react-router-v7)

### Running Database Migrations
See [Development Workflow - Database Migrations](./07-development-workflow.md#database-migrations)

## 🆘 Getting Help

- 📚 Check the relevant documentation section
- 🔍 Search through code examples in each app
- 💬 Review comments in module files
- 🐛 Check existing issues in the repository

## 🤝 Contributing

Please refer to [Development Workflow](./07-development-workflow.md) for:
- Git workflow and branching strategy
- Commit message conventions
- Pull request process
- Code review guidelines

---

**Need more help?** Start with the [Monorepo Setup](./01-monorepo-setup.md) guide or jump to any section above based on your needs.
