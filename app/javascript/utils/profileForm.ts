import type { ProfileFormData } from "../types/profile";
import {
  validateEmail,
  validateTextLength,
  type ValidationErrors,
} from "./clientValidation";
import { normalizeString } from "./dirtyForm";

export function buildInitialProfileData(profile: {
  name?: string | null;
  email?: string | null;
}): ProfileFormData {
  return {
    user: {
      name: profile.name || "",
      email: profile.email || "",
      avatar: null,
      remove_avatar: false,
      current_password: "",
    },
  };
}

export function validateProfileForm(
  data: ProfileFormData,
  emailChanged: boolean,
): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateTextLength(data.user.name, "Full Name", {
    min: 2,
    max: 80,
  });

  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.user.email, "Email", {
    required: true,
  });

  if (emailError) errors.email = emailError;

  if (emailChanged && data.user.current_password.trim().length === 0) {
    errors.current_password = "Current Password is required.";
  }

  if (data.user.avatar) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(data.user.avatar.type)) {
      errors.avatar = "Profile Photo must be a PNG, JPG, JPEG, or WEBP image.";
    }

    if (data.user.avatar.size > 5 * 1024 * 1024) {
      errors.avatar = "Profile Photo must be less than 5MB.";
    }
  }

  return errors;
}

export function profileFormChanged(
  data: ProfileFormData,
  initialData: ProfileFormData,
): boolean {
  return (
    normalizeString(data.user.name) !== normalizeString(initialData.user.name) ||
    normalizeString(data.user.email).toLowerCase() !==
      normalizeString(initialData.user.email).toLowerCase() ||
    data.user.avatar instanceof File ||
    Boolean(data.user.remove_avatar) !== Boolean(initialData.user.remove_avatar)
  );
}

export function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`user.${field}`];
}

export function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function autoCompleteFor(label: string, type: string): string {
  if (label === "Email") return "email";
  if (label === "Full Name") return "name";
  if (label === "Current Password") return "current-password";
  if (type === "password") return "new-password";

  return "off";
}