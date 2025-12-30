export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
  name: {
    minLength: 2,
    maxLength: 100,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  mobile: {
    pattern: /^[0-9]{10,15}$/,
  },
} as const;

export const PASSWORD_ERROR_MESSAGES = {
  minLength: "Password must be at least 8 characters",
  requireUppercase: "Password must contain at least one uppercase letter",
  requireLowercase: "Password must contain at least one lowercase letter",
  requireNumber: "Password must contain at least one number",
  requireSpecialChar: "Password must contain at least one special character (@$!%*?&)",
  invalid: "Password does not meet requirements",
} as const;
