import {
  validatePasswordConfirmation,
  validatePasswordStrength,
  validateRequired,
  type ValidationErrors,
} from "./clientValidation";
import type { PasswordFormData, TwoFactorFormData } from "../types/security";

export function validatePasswordForm(data: PasswordFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const currentPasswordError = validateRequired(
    data.user.current_password,
    "Current Password",
  );

  if (currentPasswordError) errors.current_password = currentPasswordError;

  const passwordError = validatePasswordStrength(
    data.user.password,
    "New Password",
  );

  if (passwordError) errors.password = passwordError;

  const confirmationError = validatePasswordConfirmation(
    data.user.password,
    data.user.password_confirmation,
    "Confirm Password",
  );

  if (confirmationError) errors.password_confirmation = confirmationError;

  return errors;
}

export function validateTwoFactorForm(data: TwoFactorFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const code = data.two_factor.code.trim();

  if (validateRequired(code, "Code")) {
    errors.code = "Code is required.";
  } else if (!/^\d{6}$/.test(code)) {
    errors.code = "Enter a valid 6-digit code.";
  }

  const currentPasswordError = validateRequired(
    data.two_factor.current_password,
    "Current Password",
  );

  if (currentPasswordError) errors.current_password = currentPasswordError;

  return errors;
}

export function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
  namespace: "user" | "two_factor",
): string | string[] | undefined {
  return errors[field] || errors[`${namespace}.${field}`];
}

export function formatSetupKey(value?: string | null): string {
  if (!value) return "Setup key unavailable";

  return value.match(/.{1,4}/g)?.join(" ") || value;
}