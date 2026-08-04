export type ValidationErrors = Record<string, string | string[] | undefined>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s+\-().]+$/;

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function isBlank(value: unknown): boolean {
  return String(value ?? "").trim().length === 0;
}

export function validateRequired(
  value: unknown,
  label: string,
): string | undefined {
  if (isBlank(value)) {
    return `${label} is required.`;
  }

  return undefined;
}

export function validateTextLength(
  value: unknown,
  label: string,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
  },
): string | undefined {
  const text = String(value ?? "").trim();

  if (options.required !== false && text.length === 0) {
    return `${label} is required.`;
  }

  if (text.length === 0) return undefined;

  if (options.min && text.length < options.min) {
    return `${label} must be at least ${options.min} characters.`;
  }

  if (options.max && text.length > options.max) {
    return `${label} must be ${options.max} characters or less.`;
  }

  return undefined;
}

export function validateEmail(
  value: unknown,
  label = "Email",
  options: {
    required?: boolean;
  } = {},
): string | undefined {
  const text = String(value ?? "").trim();

  if (options.required && text.length === 0) {
    return `${label} is required.`;
  }

  if (text.length === 0) return undefined;

  if (!EMAIL_REGEX.test(text)) {
    return `Enter a valid ${label.toLowerCase()}.`;
  }

  return undefined;
}

export function validatePhone(
  value: unknown,
  label = "Phone",
): string | undefined {
  const text = String(value ?? "").trim();

  if (text.length === 0) return undefined;

  if (text.length > 30) {
    return `${label} must be 30 characters or less.`;
  }

  if (!PHONE_REGEX.test(text)) {
    return `${label} can only include numbers, spaces, +, -, parentheses, and dots.`;
  }

  return undefined;
}

export function validateIntegerRange(
  value: unknown,
  label: string,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
  },
): string | undefined {
  if (options.required !== false && isBlank(value)) {
    return `${label} is required.`;
  }

  if (isBlank(value)) return undefined;

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return `${label} must be a valid number.`;
  }

  if (!Number.isInteger(numberValue)) {
    return `${label} must be a whole number.`;
  }

  if (options.min !== undefined && numberValue < options.min) {
    if (options.min === 0) return `${label} cannot be negative.`;

    return `${label} must be greater than or equal to ${options.min}.`;
  }

  if (options.max !== undefined && numberValue > options.max) {
    return `${label} must be less than or equal to ${options.max}.`;
  }

  return undefined;
}

export function validateNumberRange(
  value: unknown,
  label: string,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
  },
): string | undefined {
  if (options.required !== false && isBlank(value)) {
    return `${label} is required.`;
  }

  if (isBlank(value)) return undefined;

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return `${label} must be a valid number.`;
  }

  if (options.min !== undefined && numberValue < options.min) {
    if (options.min === 0) return `${label} cannot be negative.`;

    return `${label} must be greater than or equal to ${options.min}.`;
  }

  if (options.max !== undefined && numberValue > options.max) {
    return `${label} must be less than or equal to ${options.max}.`;
  }

  return undefined;
}

export function validatePasswordStrength(
  value: unknown,
  label = "Password",
): string | undefined {
  const password = String(value ?? "");

  if (password.length === 0) {
    return `${label} is required.`;
  }

  if (password.length < 8) {
    return `${label} must be at least 8 characters.`;
  }

  if (!/[A-Z]/.test(password)) {
    return `${label} must include at least one uppercase letter.`;
  }

  if (!/[a-z]/.test(password)) {
    return `${label} must include at least one lowercase letter.`;
  }

  if (!/\d/.test(password)) {
    return `${label} must include at least one number.`;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return `${label} must include at least one symbol.`;
  }

  return undefined;
}

export function validatePasswordConfirmation(
  password: unknown,
  passwordConfirmation: unknown,
  label = "Confirm Password",
): string | undefined {
  const passwordValue = String(password ?? "");
  const confirmationValue = String(passwordConfirmation ?? "");

  if (confirmationValue.length === 0) {
    return `${label} is required.`;
  }

  if (passwordValue !== confirmationValue) {
    return "Passwords must match.";
  }

  return undefined;
}