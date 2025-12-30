# Monorepo Setup

This document explains the monorepo architecture and setup for Kite.

## Overview

Kite uses a monorepo architecture managed by **PNPM Workspaces**. This allows multiple applications and packages to share code, dependencies, and tooling while maintaining independent deployment capabilities.

## Why Monorepo?

### Benefits

1. **Code Sharing**: Shared types, utilities, and components across apps
2. **Consistent Tooling**: Same TypeScript, ESLint, and Prettier configs
3. **Atomic Changes**: Update types and all consumers in a single commit
4. **Simplified Dependencies**: Shared node_modules, faster installs
5. **Better Developer Experience**: Run all apps with a single command

### Trade-offs

- Larger repository size
- Requires discipline in managing dependencies
- Need clear boundaries between packages

## Directory Structure

```
kite/
├── package.json              # Root package.json with workspace config
├── pnpm-workspace.yaml       # PNPM workspace configuration
├── .npmrc                    # NPM configuration
├── tsconfig.json             # Base TypeScript configuration
├── apps/                     # Application packages
│   ├── backend/
│   ├── admin-panel/
│   └── web-app/
└── packages/                 # Shared packages
    ├── types/
    ├── config/
    └── ui/
```

## PNPM Workspace Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This tells PNPM to treat all folders in `apps/` and `packages/` as workspace packages.

### Root package.json

```json
{
  "name": "kite",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter \"./apps/*\" dev",
    "dev:backend": "pnpm --filter kite-backend dev",
    "dev:admin": "pnpm --filter admin-panel dev",
    "dev:web": "pnpm --filter web-app dev",
    "build": "pnpm --filter \"./apps/*\" build",
    "build:backend": "pnpm --filter kite-backend build",
    "build:admin": "pnpm --filter admin-panel build",
    "build:web": "pnpm --filter web-app build",
    "db:generate": "pnpm --filter kite-backend db:generate",
    "db:migrate": "pnpm --filter kite-backend db:migrate"
  }
}
```

## Package Naming Convention

Each workspace package has a unique name:

- **Backend**: `kite-backend`
- **Admin Panel**: `kite-admin`
- **Web App**: `kite-web-app`
- **Shared Types**: `@kite/types`
- **Shared Config**: `@kite/config`
- **Shared UI**: `@kite/ui` (complete component library with Tailwind v4)

The `@kite/` scope is used for shared packages to avoid naming conflicts.

## Installing Dependencies

### Global Dependencies (Root Level)

```bash
# Install a dev dependency at root (e.g., prettier, typescript)
pnpm add -D -w prettier
```

The `-w` flag installs at the workspace root.

### App-Specific Dependencies

```bash
# Install in a specific app
pnpm --filter backend add express
pnpm --filter admin-panel add react-router-dom
pnpm --filter web-app add axios
```

### Shared Package Dependencies

```bash
# Install in a shared package
pnpm --filter @kite/types add zod
pnpm --filter @kite/ui add class-variance-authority clsx tailwind-merge
pnpm --filter @kite/ui add @radix-ui/react-dialog
```

**Note**: `@kite/ui` includes all Radix UI primitives and styling dependencies.

## Using Shared Packages

Shared packages are referenced in app `package.json` files:

```json
{
  "dependencies": {
    "@kite/types": "workspace:*",
    "@kite/config": "workspace:*",
    "@kite/ui": "workspace:*"
  }
}
```

The `workspace:*` protocol tells PNPM to link to the local workspace package.

## TypeScript Configuration

### Root tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### App-Specific tsconfig.json

Each app extends the root config:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Running Commands

### Parallel Execution

```bash
# Run dev in all apps simultaneously
pnpm dev

# Build all apps
pnpm build
```

### Sequential Execution

```bash
# Run commands in order
pnpm --filter kite-backend build && pnpm --filter admin-panel build
```

### Filtered Execution

```bash
# Run only in backend
pnpm --filter kite-backend dev

# Run in multiple specific packages
pnpm --filter admin-panel --filter web-app build
```

## Environment Variables

Each app has its own `.env` file:

```
apps/
├── backend/.env          # Backend environment variables
├── admin-panel/.env      # Admin panel environment variables
└── web-app/.env          # Web app environment variables
```

**Important**: Never commit `.env` files. Use `.env.example` as a template.

## Git Configuration

### .gitignore

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/

# Environment
.env
.env.local

# Logs
*.log
```

## Initial Setup

### 1. Install PNPM

```bash
npm install -g pnpm
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs all dependencies for all workspace packages.

### 3. Setup Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate
```

### 4. Start Development

```bash
# Start all apps
pnpm dev

# Or start individually
pnpm dev:backend
pnpm dev:admin
pnpm dev:web
```

## Troubleshooting

### Cache Issues

```bash
# Clear PNPM cache
pnpm store prune

# Remove all node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Prisma Issues

```bash
# Regenerate Prisma client
pnpm db:generate

# Reset database (caution: deletes data)
pnpm --filter kite-backend prisma migrate reset
```

### TypeScript Module Resolution

If TypeScript can't find workspace packages:

1. Ensure the package is listed in dependencies
2. Run `pnpm install` to update symlinks
3. Restart your TypeScript server in VS Code

## Best Practices

1. **Keep packages focused**: Each package should have a single responsibility
2. **Use workspace protocol**: Always use `workspace:*` for internal dependencies
3. **Document changes**: Update docs when adding new packages or changing structure
4. **Version together**: All packages share the same version number
5. **Test before commit**: Run `pnpm build` to ensure all apps compile

## Next Steps

- Learn about the [Apps Overview](./02-apps-overview.md)
- Understand [Shared Packages](./03-shared-packages.md)
- Explore [Backend Development](./04-backend-development.md)
