# Authentication System

This document explains the multi-client authentication system with JWT tokens and HTTP-only cookies.

## Overview

Kite uses a JWT-based authentication system that supports multiple client applications (admin panel and web app) with separate cookie namespaces. This allows users to be logged into both applications simultaneously in the same browser.

## Architecture

```
┌─────────────┐                    ┌─────────────┐
│ Admin Panel │                    │   Web App   │
│  (5173)     │                    │   (5174)    │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ Cookie: admin_accessToken        │ Cookie: accessToken
       │ Cookie: admin_refreshToken       │ Cookie: refreshToken
       │ clientType: 'admin'              │ clientType: 'web'
       │                                  │
       └────────────┬─────────────────────┘
                    │
             ┌──────▼──────┐
             │   Backend   │
             │   (9000)    │
             └──────┬──────┘
                    │
             Origin Detection
             Cookie Selection
             JWT Verification
                    │
             ┌──────▼──────┐
             │  PostgreSQL │
             └─────────────┘
```

## Authentication Flow

### 1. Registration (Web App Only)

Users can register through the web app:

```typescript
// Frontend: apps/web-app/src/api/auth/index.ts
export const registerApi = (data: RegisterRequest) =>
  api.post<ApiResponse<LoginResponse>>("/auth/register", data);

// Request body
{
  name: "John Doe",
  email: "john@example.com",
  mobile: "1234567890",  // Optional
  password: "SecurePass123!"
}

// Response
{
  success: true,
  message: "Registration successful",
  data: {
    user: { id, name, email, role },
    tokens: { accessToken, refreshToken }
  }
}
```

**Backend Flow** ([apps/backend/src/modules/auth/auth.controller.ts](apps/backend/src/modules/auth/auth.controller.ts)):

1. Validate request with Joi
2. Hash password with bcrypt
3. Create user in database (default role: USER)
4. Generate JWT tokens
5. Set HTTP-only cookies
6. Send welcome email
7. Return user and tokens

### 2. Login

Both apps use the same login endpoint but with different `clientType`:

**Admin Panel:**
```typescript
// apps/admin-panel/src/api/auth/index.ts
export const loginApi = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>("/auth/login", {
    ...data,
    clientType: 'admin'
  });
```

**Web App:**
```typescript
// apps/web-app/src/api/auth/index.ts
export const loginApi = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>("/auth/login", {
    ...data,
    clientType: 'web'
  });
```

**Backend Validation** ([apps/backend/src/modules/auth/auth.controller.ts](apps/backend/src/modules/auth/auth.controller.ts#L25-L35)):

```typescript
public async login(req: Request, res: Response) {
  const { email, mobile, password, otp, clientType } = req.body;

  const result = await this.authService.login({
    email,
    mobile,
    password,
    otp,
  });

  // Admin panel requires ADMIN role
  if (clientType === 'admin' && result.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    });
  }

  // Set cookies with appropriate prefix
  this.setAuthCookies(res, result.tokens, clientType);

  res.status(200).json({
    message: "Login successful",
    data: {
      user: omit(result.user, ["password"]),
      tokens: result.tokens,
    },
  });
}
```

### 3. Cookie Management

**Setting Cookies** ([apps/backend/src/modules/auth/auth.controller.ts](apps/backend/src/modules/auth/auth.controller.ts#L125-L144)):

```typescript
private setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken?: string },
  clientType?: 'web' | 'admin'
) {
  const isProduction = process.env.NODE_ENV === "production";
  const prefix = clientType === 'admin' ? 'admin_' : '';

  res.cookie(`${prefix}accessToken`, tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 3600000, // 1 hour
  });

  if (tokens.refreshToken) {
    res.cookie(`${prefix}refreshToken`, tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 2592000000, // 30 days
    });
  }
}
```

**Cookie Names:**
- **Admin Panel**: `admin_accessToken`, `admin_refreshToken`
- **Web App**: `accessToken`, `refreshToken`

**Cookie Properties:**
- `httpOnly`: Prevents JavaScript access (XSS protection)
- `secure`: HTTPS only in production
- `sameSite: "strict"`: CSRF protection
- `maxAge`: Expiration time in milliseconds

### 4. Authentication Middleware

**Origin-Based Cookie Selection** ([apps/backend/src/middleware/auth.middleware.ts](apps/backend/src/middleware/auth.middleware.ts#L19-L46)):

```typescript
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Determine which cookie to use based on request origin
  const origin = req.headers.origin || req.headers.referer || '';
  const adminPanelUrl = process.env.ADMIN_PANEL_URL || 'http://localhost:5173';
  const webAppUrl = process.env.WEB_APP_URL || 'http://localhost:5174';

  const isAdminRequest = origin.startsWith(adminPanelUrl);
  const isWebRequest = origin.startsWith(webAppUrl);

  // Prioritize the correct cookie based on origin
  if (isAdminRequest && req.cookies?.admin_accessToken) {
    token = req.cookies.admin_accessToken;
  } else if (isWebRequest && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.cookies?.admin_accessToken) {
    token = req.cookies.admin_accessToken;
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  // Fall back to Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "No token provided, authorization denied",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    } as User;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Access Token is invalid or expired",
    });
  }
};
```

**How It Works:**

1. Extract origin from request headers
2. Compare origin with `ADMIN_PANEL_URL` and `WEB_APP_URL`
3. Prioritize correct cookies based on origin
4. Fall back to alternative cookies if primary not found
5. Fall back to Authorization header
6. Verify JWT token
7. Attach user to `req.user`

### 5. Token Refresh

**Endpoint:** `POST /api/auth/refresh-token`

**Client Detection** ([apps/backend/src/modules/auth/auth.controller.ts](apps/backend/src/modules/auth/auth.controller.ts#L80-L95)):

```typescript
public async refreshToken(req: Request, res: Response) {
  // Detect client type from existing cookies
  const clientType = req.cookies?.admin_refreshToken ? 'admin' : 'web';
  const refreshToken = req.cookies?.[`${clientType === 'admin' ? 'admin_' : ''}refreshToken`];

  if (!refreshToken) {
    return res.status(401).json({
      message: "No refresh token provided",
    });
  }

  const result = await this.authService.refreshToken(refreshToken);

  // Set new cookies with same client type
  this.setAuthCookies(res, result, clientType);

  res.status(200).json({
    message: "Token refreshed successfully",
    data: result,
  });
}
```

**Frontend Auto-Refresh:**

```typescript
// apps/admin-panel/src/utils/api.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshTokenApi();
        // Retry original request
        return api.request(error.config);
      } catch {
        // Logout user
        useAuthStore.getState().logout();
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
```

### 6. Logout

**Backend** ([apps/backend/src/modules/auth/auth.controller.ts](apps/backend/src/modules/auth/auth.controller.ts#L97-L106)):

```typescript
public async logout(req: Request, res: Response) {
  // Detect client type
  const clientType = req.cookies?.admin_accessToken ? 'admin' : 'web';

  // Clear cookies
  this.clearAuthCookies(res, clientType);

  res.status(200).json({
    message: "Logout successful",
    data: null,
  });
}
```

**Frontend:**

```typescript
// apps/admin-panel/src/api/auth/use-auth.ts
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      navigate("/auth/login");
    },
  });
};
```

---

## JWT Tokens

### Token Structure

**Payload:**
```typescript
{
  id: "user-uuid",
  email: "user@example.com",
  role: "USER",
  iat: 1234567890,  // Issued at
  exp: 1234571490   // Expiration
}
```

**Token Generation** ([apps/backend/src/modules/auth/auth.service.ts](apps/backend/src/modules/auth/auth.service.ts)):

```typescript
private generateTokens(user: User): AuthTokens {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });

  return { accessToken, refreshToken };
}
```

### Environment Variables

```env
JWT_SECRET=your_secret_key_here_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_characters
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d
```

**Security Note:** Use strong, random secrets in production. Generate with:
```bash
openssl rand -base64 32
```

---

## Role-Based Access Control

### Available Roles

```typescript
type UserRole = "ADMIN" | "USER";
```

### Role Middleware

**Require Specific Roles** ([apps/backend/src/middleware/auth.middleware.ts](apps/backend/src/middleware/auth.middleware.ts#L71-L87)):

```typescript
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
      });
    }

    next();
  };
};
```

**Predefined Role Middleware:**

```typescript
// Only ADMIN
export const requireAdmin = requireRole(["ADMIN"]);
```

**Usage in Routes:**

```typescript
import { authMiddleware, requireAdmin } from "../../middleware/auth.middleware";

// Admin only
router.delete("/users/:id", authMiddleware, requireAdmin, controller.deleteUser);

// All authenticated users
router.get("/profile", authMiddleware, controller.getProfile);
```

---

## Password Management

### Password Hashing

**Registration/Update:**
```typescript
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash(password, 10);
```

**Verification:**
```typescript
const isValid = await bcrypt.compare(password, user.password);
```

### Password Reset Flow

**1. Request Reset:**
```typescript
POST /api/auth/forgot-password
{
  email: "user@example.com"
}
```

**Backend:**
- Generate random reset token
- Store token with expiration (15 minutes)
- Send reset email with link

**2. Reset Password:**
```typescript
POST /api/auth/reset-password
{
  token: "reset-token",
  password: "NewSecurePass123!"
}
```

**Backend:**
- Verify token exists and not expired
- Hash new password
- Update user password
- Clear reset token
- Return success

---

## Frontend Authentication State

### Auth Store (Zustand)

**Admin Panel & Web App** (same structure):

```typescript
// apps/admin-panel/src/utils/auth-store.ts
interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

**Usage:**
```typescript
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
const logout = useAuthStore((state) => state.logout);
```

### Route Protection

**Protected Route Component:**

```typescript
// apps/admin-panel/src/routes/protected/protected-routes.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/utils/auth-store";

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
```

**Public Route Component:**

```typescript
// apps/admin-panel/src/routes/public/public-routes.tsx
export function PublicRoute() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
```

**App Routes:**

```typescript
// apps/admin-panel/src/App.tsx
<Routes>
  <Route element={<PublicRoute />}>
    <Route path="/auth/login" element={<LoginPage />} />
  </Route>

  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/users" element={<UsersPage />} />
  </Route>
</Routes>
```

---

## Security Best Practices

### 1. HTTP-Only Cookies

✅ **Do:**
```typescript
res.cookie("accessToken", token, {
  httpOnly: true,  // Prevents XSS attacks
  secure: true,    // HTTPS only
  sameSite: "strict"  // CSRF protection
});
```

❌ **Don't:**
```typescript
// Storing tokens in localStorage is vulnerable to XSS
localStorage.setItem("token", accessToken);
```

### 2. Environment Variables

✅ **Do:**
```env
JWT_SECRET=strong_random_secret_at_least_32_characters
```

❌ **Don't:**
```typescript
const JWT_SECRET = "secret123";  // Hardcoded secret
```

### 3. Password Validation

✅ **Do:**
```typescript
const passwordSchema = Joi.string()
  .min(8)
  .pattern(/[A-Z]/)  // Uppercase
  .pattern(/[a-z]/)  // Lowercase
  .pattern(/[0-9]/)  // Number
  .pattern(/[@$!%*?&]/)  // Special char
  .required();
```

❌ **Don't:**
```typescript
const passwordSchema = Joi.string().min(6);  // Too weak
```

### 4. Token Expiration

✅ **Do:**
- Access token: 1 hour
- Refresh token: 30 days
- Implement token refresh

❌ **Don't:**
- Never-expiring tokens
- Very long-lived access tokens

### 5. Origin Validation

✅ **Do:**
```typescript
const allowedOrigins = [
  process.env.ADMIN_PANEL_URL,
  process.env.WEB_APP_URL
];

if (!allowedOrigins.includes(origin)) {
  return res.status(403).json({ message: "Invalid origin" });
}
```

---

## Troubleshooting

### Issue: Cookies Not Being Set

**Check:**
1. CORS configuration allows credentials
2. Frontend sends `withCredentials: true`
3. Origin matches allowed origins

**Fix:**
```typescript
// Backend: apps/backend/src/app.ts
app.use(cors({
  origin: [
    process.env.ADMIN_PANEL_URL,
    process.env.WEB_APP_URL
  ],
  credentials: true
}));

// Frontend: apps/admin-panel/src/utils/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true  // Important!
});
```

### Issue: 401 Unauthorized

**Check:**
1. Token exists in cookies
2. Token not expired
3. JWT_SECRET matches between sign and verify

**Debug:**
```typescript
// Check cookies in browser DevTools > Application > Cookies
console.log(document.cookie);

// Check token in backend
console.log(req.cookies);
```

### Issue: Wrong App Cookies Used

**Check:**
1. Environment variables set correctly
2. Origin detection working

**Debug:**
```typescript
// In auth.middleware.ts
console.log("Origin:", req.headers.origin);
console.log("Admin URL:", process.env.ADMIN_PANEL_URL);
console.log("Web URL:", process.env.WEB_APP_URL);
console.log("Is Admin Request:", isAdminRequest);
console.log("Cookies:", req.cookies);
```

---

## Next Steps

- Learn about [Frontend Development](./06-frontend-development.md)
- Understand [Development Workflow](./07-development-workflow.md)
- Review [Backend Development](./04-backend-development.md)
