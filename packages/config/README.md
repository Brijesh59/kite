# @kite/config

Shared configuration and constants for the entire monorepo. Provides centralized settings for validation rules, pagination limits, roles, and application constants.

## Overview

This package provides:
- **Role Definitions** - USER, ADMIN role constants
- **Validation Rules** - Password, email, mobile validation
- **Pagination Config** - Default page sizes and limits
- **App Constants** - Application-wide constants

## Installation

Automatically linked via PNPM workspaces:

```json
{
  "dependencies": {
    "@kite/config": "workspace:*"
  }
}
```

## Usage

```typescript
import { USER_ROLES, PAGINATION, isValidEmail } from "@kite/config";

// Use role constants
const defaultRole = USER_ROLES.USER;

// Use pagination
const pageSize = PAGINATION.DEFAULT_LIMIT;

// Use validation
if (isValidEmail(email)) {
  // Process email
}
```

## Configuration Files

### constants.ts
Application-wide constants:
```typescript
export const APP_NAME = "Kite";

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const POST_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  BIO_MAX_LENGTH: 500,
  TITLE_MAX_LENGTH: 200,
} as const;
```

### validation.ts
Validation utilities and regex patterns:
```typescript
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_REGEX = /^[0-9]{10}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const isValidMobile = (mobile: string): boolean => {
  return MOBILE_REGEX.test(mobile);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8 && PASSWORD_REGEX.test(password);
};
```

## File Structure

```
packages/config/
├── src/
│   ├── index.ts              # Re-exports all config
│   ├── constants.ts          # App constants
│   └── validation.ts         # Validation helpers
├── package.json
└── tsconfig.json
```

## Usage Examples

### Role-Based Access Control
```typescript
import { USER_ROLES } from "@kite/config";

// Backend: Check user role
if (user.role === USER_ROLES.ADMIN) {
  // Admin-only operation
}

// Frontend: Conditional rendering
{user.role === USER_ROLES.ADMIN && <AdminPanel />}
```

### Pagination
```typescript
import { PAGINATION } from "@kite/config";

// Backend: Default pagination
const page = query.page || PAGINATION.DEFAULT_PAGE;
const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);

// Frontend: Query params
const { data } = usePosts({
  page: 1,
  limit: PAGINATION.DEFAULT_LIMIT
});
```

### Validation
```typescript
import { VALIDATION, isValidEmail, isStrongPassword } from "@kite/config";

// Form validation
if (!isValidEmail(email)) {
  errors.email = "Invalid email format";
}

if (!isStrongPassword(password)) {
  errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
}

// Length validation
if (bio.length > VALIDATION.BIO_MAX_LENGTH) {
  errors.bio = `Bio must be less than ${VALIDATION.BIO_MAX_LENGTH} characters`;
}
```

## Adding New Configuration

1. **Add to constants.ts**:
```typescript
export const NOTIFICATION_TYPES = {
  EMAIL: "EMAIL",
  SMS: "SMS",
  PUSH: "PUSH",
} as const;

export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  API_CALLS_PER_MINUTE: 60,
} as const;
```

2. **Export from index.ts**:
```typescript
export * from "./constants";
export * from "./validation";
```

3. **Use in apps**:
```typescript
import { NOTIFICATION_TYPES, RATE_LIMITS } from "@kite/config";

// Use the constants
sendNotification(NOTIFICATION_TYPES.EMAIL, message);
```

## Best Practices

### Constants
- ✅ Use `as const` for type inference
- ✅ Use UPPER_SNAKE_CASE for constants
- ✅ Group related constants in objects
- ✅ Export typed constants

### Configuration
- ❌ **Don't** include environment-specific values
- ❌ **Don't** include secrets or credentials
- ✅ **Do** use constants for business rules
- ✅ **Do** share validation rules

### Validation
- ✅ Export regex patterns as constants
- ✅ Provide helper functions for common validations
- ✅ Keep validation pure (no side effects)
- ✅ Make validation reusable

## Configuration Types

All constants are strongly typed:

```typescript
// Inferred types from `as const`
type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
// UserRole = "USER" | "ADMIN"

type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS];
// PostStatus = "DRAFT" | "PUBLISHED"
```

## Environment Variables

This package does **NOT** contain environment variables. Environment-specific configuration should be in each app's `.env` file:

```env
# apps/backend/.env
DATABASE_URL="..."
JWT_SECRET="..."

# apps/admin-panel/.env
VITE_API_URL="..."
```

## Validation Regex Reference

### Email
```typescript
EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```
- Matches: `user@example.com`
- Rejects: `invalid.email`, `@example.com`

### Mobile
```typescript
MOBILE_REGEX = /^[0-9]{10}$/
```
- Matches: `1234567890`
- Rejects: `123-456-7890`, `12345`

### Password
```typescript
PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
```
Requirements:
- At least one lowercase letter
- At least one uppercase letter
- At least one digit
- At least one special character (@$!%*?&)
- Minimum 8 characters (checked separately)

## Related Documentation

- [Shared Packages](../../docs/03-shared-packages.md#2-kiteconfig) - Complete config documentation
- [Backend Development](../../docs/04-backend-development.md) - Using config in backend
- [Frontend Development](../../docs/06-frontend-development.md) - Using config in frontend

---

**Package Version**: 1.0.0  
**License**: MIT
