# Backend API - Authentication & Post Management

A simplified, production-ready Node.js Express backend with TypeScript, featuring comprehensive authentication and post management functionality.

## 🚀 Features

### Authentication System
- **JWT-based Authentication** with HTTP-only cookies
- **Multi-factor Registration** (Email + Password, optional mobile)
- **Flexible Login** (Email/Password or Email/Mobile + OTP)
- **OTP Verification** for email and mobile
- **Password Management** (Forgot/Reset functionality)
- **Session Management** with refresh tokens
- **Role-based Access Control** (ADMIN, ORGANISER, ARTIST, USER)

### Post Management
- **CRUD Operations** for user posts
- **User-specific Posts** with ownership validation
- **Search & Filtering** with pagination
- **Public/Private Post** visibility control
- **Tag-based Organization** for posts

### Security & Production Features
- **Route-level Validation** using Joi schemas
- **Comprehensive Error Handling** with structured responses
- **HTTP Request Logging** with performance monitoring
- **Rate Limiting** protection
- **CORS Configuration** for cross-origin requests
- **Swagger Documentation** for API exploration

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point with error handling
│   │
│   ├── common/                   # Shared utilities
│   │   ├── app-error.ts         # Custom error classes
│   │   ├── catch-async.ts       # Async error handling decorator
│   │   ├── logger.ts            # Winston logger configuration
│   │   ├── rate-limit.ts        # Rate limiting configuration
│   │   └── types.ts             # Common TypeScript types
│   │
│   ├── middleware/              # Express middlewares
│   │   ├── auth.middleware.ts   # JWT authentication & authorization
│   │   ├── httpLogger.ts        # HTTP request/response logging
│   │   └── validation.ts        # Joi validation middleware
│   │
│   ├── modules/
│   │   ├── auth/                # Authentication module
│   │   │   ├── auth.controller.ts  # Auth request handlers
│   │   │   ├── auth.service.ts     # Auth business logic
│   │   │   ├── auth.routes.ts      # Auth route definitions
│   │   │   ├── auth.types.ts       # Auth TypeScript interfaces
│   │   │   └── validation.ts       # Auth validation schemas
│   │   │
│   │   └── post/                # Post management module
│   │       ├── post.controller.ts  # Post request handlers
│   │       ├── post.service.ts     # Post business logic
│   │       ├── post.routes.ts      # Post route definitions
│   │       ├── post.types.ts       # Post TypeScript interfaces
│   │       └── validation.ts       # Post validation schemas
│   │
│   ├── services/                # External services
│   │   └── notification.service.ts # Email/SMS notifications
│   │
│   └── utils/                   # Utility functions
│       └── swagger.ts           # Swagger configuration
│
├── prisma/                      # Database schema & migrations
│   ├── schema.prisma           # Prisma database schema
│   └── migrations/             # Database migration files
│
├── docs/                       # Documentation files
├── logs/                       # Application logs
├── testing/                    # Test files
│
├── package.json                # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── docker-compose.yml         # PostgreSQL Docker setup
└── .env                       # Environment variables
```

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt hashing
- **Validation**: Joi schemas at route level
- **Logging**: Winston with daily rotation
- **Development**: tsx for hot reloading

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager
- Docker (optional, for database setup)

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd backend
pnpm install
```

### 2. Database Setup

**Option A: Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Local PostgreSQL**
- Install PostgreSQL locally
- Create a database named `kite`

### 3. Environment Configuration
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kite"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
NODE_ENV="development"
PORT=5000

# Email Configuration (for OTP/notifications)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"

# SMS Configuration (optional)
SMS_API_KEY="your-sms-api-key"
```

### 4. Database Migration
```bash
pnpm run db:generate
pnpm run db:migrate
```

### 5. Start Development Server
```bash
pnpm run dev
```

The server will start at `http://localhost:5000`

## 🔐 Authentication Endpoints

### User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",  // optional
  "password": "SecurePass123!"
}
```

### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "john@example.com"  // or "mobile": "+1234567890"
}
```

### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

## 📝 Post Management Endpoints

### Create Post
```http
POST /api/posts
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my post...",
  "tags": ["technology", "programming"],  // optional
  "isPublic": true  // optional, defaults to true
}
```

### Get All Posts
```http
GET /api/posts?page=1&limit=10&search=technology&sortBy=createdAt&sortOrder=desc
```

### Get Post by ID
```http
GET /api/posts/{postId}
```

### Update Post
```http
PUT /api/posts/{postId}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Post Title",
  "content": "Updated content..."
}
```

### Delete Post
```http
DELETE /api/posts/{postId}
Authorization: Bearer <jwt-token>
```

### Get User's Posts
```http
GET /api/posts/user/my-posts?page=1&limit=10
Authorization: Bearer <jwt-token>
```

## 🔑 User Roles & Permissions

- **ADMIN**: Full system access, can manage all posts
- **ORGANISER**: Can manage events and moderate content
- **ARTIST**: Can create and manage artistic content
- **USER**: Basic user with post creation abilities

## 🛡️ Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### JWT Configuration
- **Access Token**: 15 minutes (HTTP-only cookie)
- **Refresh Token**: 7 days (HTTP-only cookie)
- Automatic token refresh on API calls

### Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP

## 📊 Logging & Monitoring

### Log Levels
- **Error**: Application errors and exceptions
- **Warn**: Validation failures and suspicious activities
- **Info**: General application flow
- **Debug**: Detailed debugging information

### Log Files
- `logs/combined-YYYY-MM-DD.log`: All log levels
- `logs/error-YYYY-MM-DD.log`: Error level only
- Console output in development mode

## 🧪 Available Scripts

```bash
# Development
pnpm run dev              # Start with hot reload
pnpm run type-check       # TypeScript type checking

# Production
pnpm run build           # Compile TypeScript
pnpm run start           # Start production server

# Database
pnpm run db:generate     # Generate Prisma client
pnpm run db:migrate      # Run database migrations
pnpm run db:deploy       # Deploy migrations (production)

# Code Quality
pnpm run lint            # Run ESLint
pnpm run lint:fix        # Fix ESLint issues
pnpm run format          # Format with Prettier
pnpm run format:check    # Check formatting

# Testing
pnpm run test            # Run unit tests
pnpm run test:watch      # Run tests in watch mode
pnpm run test:coverage   # Generate coverage report
pnpm run test:e2e        # Run end-to-end tests
```

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `5000` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret | - | Yes |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` | No |
| `EMAIL_HOST` | SMTP server host | - | For OTP |
| `EMAIL_PORT` | SMTP server port | `587` | For OTP |
| `EMAIL_USER` | SMTP username | - | For OTP |
| `EMAIL_PASS` | SMTP password | - | For OTP |

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created successfully
- `400`: Bad request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Resource not found
- `429`: Too many requests (rate limited)
- `500`: Internal server error

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Configure secure JWT secrets
3. Set up SSL/TLS certificates
4. Configure production database
5. Set up log rotation
6. Configure reverse proxy (nginx)
7. Set up monitoring and alerts

### Docker Deployment
```bash
# Build image
docker build -t backend-api .

# Run container
docker run -p 5000:5000 --env-file .env backend-api
```

## 📈 Performance Considerations

- **Database Indexing**: Proper indexes on frequently queried fields
- **Connection Pooling**: Prisma handles connection pooling automatically
- **Caching**: Consider implementing Redis for session storage
- **Log Rotation**: Winston automatically rotates logs daily
- **Monitoring**: Implement health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Review the logs in the `logs/` directory
- Ensure all environment variables are properly configured
- Verify database connectivity and migrations