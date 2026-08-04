import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Building2,
  Hash,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import PasswordChecklist from "../../components/auth/PasswordChecklist";
import LoadingButton from "../../components/ui/LoadingButton";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../../components/ui/FormFeedback";
import {
  hasValidationErrors,
  validateEmail,
  validatePasswordConfirmation,
  validatePasswordStrength,
  validatePhone,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";
import type { OrganizationInvitation } from "../../types/organization";

type SignUpProps = {
  invitation?: OrganizationInvitation | null;
  invitation_token?: string | null;
  errors?: Partial<Record<string, string | string[]>>;
};

type SignUpFormData = {
  user: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    invitation_token: string;
    organization_name: string;
    organization_slug: string;
    organization_phone: string;
    organization_address: string;
  };
};

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function SignUp({
  invitation = null,
  invitation_token = null,
  errors: initialErrors = {},
}: SignUpProps) {
  const isInvitationSignup = Boolean(invitation);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const {
    data,
    setData,
    post,
    processing,
    errors: formErrors,
  } = useForm<SignUpFormData>({
    user: {
      name: "",
      email: invitation?.email || "",
      password: "",
      password_confirmation: "",
      invitation_token: invitation_token || invitation?.token || "",
      organization_name: "",
      organization_slug: "",
      organization_phone: "",
      organization_address: "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateSignUpForm(data, isInvitationSignup);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    post("/users");
  }

  function updateField(field: keyof SignUpFormData["user"], value: string) {
    clearClientError(field);

    setData("user", {
      ...data.user,
      [field]: value,
    });
  }

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`user.${field}`];

      return nextErrors;
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-950">
                {isInvitationSignup ? "Join Organization" : "Create Account"}
              </h1>

              {isInvitationSignup ? (
                <p className="mt-3 leading-7 text-slate-500">
                  Complete your account to join{" "}
                  <span className="font-bold text-slate-950">
                    {invitation?.organization?.name}
                  </span>{" "}
                  as{" "}
                  <span className="font-bold text-slate-950">
                    {formatRole(invitation?.role?.name)}
                  </span>
                  .
                </p>
              ) : (
                <p className="mt-3 leading-7 text-slate-500">
                  Create your manager account and register your organization in
                  Slotify.
                </p>
              )}
            </div>

            <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FieldError
                error={fieldError(errors, "invitation_token")}
                label="Invitation"
              />

              {!isInvitationSignup && (
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="Organization"
                    icon={Building2}
                    value={data.user.organization_name}
                    placeholder="Enter organization name"
                    disabled={processing}
                    error={fieldError(errors, "organization_name")}
                    helper="Use the public name of the coworking organization."
                    onChange={(value) =>
                      updateField("organization_name", value)
                    }
                  />

                  <TextField
                    label="Slug"
                    icon={Hash}
                    value={data.user.organization_slug}
                    placeholder="Optional, generated from organization name"
                    disabled={processing}
                    required={false}
                    error={fieldError(errors, "organization_slug")}
                    helper="Optional. Use lowercase letters, numbers, and hyphens only."
                    onChange={(value) =>
                      updateField("organization_slug", value)
                    }
                  />

                  <TextField
                    label="Phone"
                    icon={Phone}
                    value={data.user.organization_phone}
                    placeholder="Enter phone number"
                    disabled={processing}
                    required={false}
                    error={fieldError(errors, "organization_phone")}
                    helper="Optional contact phone for the organization."
                    onChange={(value) =>
                      updateField("organization_phone", value)
                    }
                  />

                  <TextField
                    label="Address"
                    icon={MapPin}
                    value={data.user.organization_address}
                    placeholder="Enter organization address"
                    disabled={processing}
                    required={false}
                    error={fieldError(errors, "organization_address")}
                    helper="Optional main physical location or business address."
                    onChange={(value) =>
                      updateField("organization_address", value)
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Full Name"
                  icon={UserRound}
                  value={data.user.name}
                  placeholder="Enter your full name"
                  disabled={processing}
                  error={fieldError(errors, "name")}
                  helper="Use the name that should appear in the platform."
                  onChange={(value) => updateField("name", value)}
                />

                <TextField
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={data.user.email}
                  placeholder="Enter email address"
                  readOnly={isInvitationSignup}
                  disabled={processing}
                  error={fieldError(errors, "email")}
                  helper={
                    isInvitationSignup
                      ? "This email comes from the invitation and cannot be changed."
                      : "Use a valid email address for sign in."
                  }
                  onChange={(value) => updateField("email", value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Password"
                  icon={LockKeyhole}
                  type="password"
                  value={data.user.password}
                  placeholder="Create a strong password"
                  disabled={processing}
                  error={fieldError(errors, "password")}
                  onChange={(value) => updateField("password", value)}
                />

                <TextField
                  label="Confirm Password"
                  icon={LockKeyhole}
                  type="password"
                  value={data.user.password_confirmation}
                  placeholder="Confirm your password"
                  disabled={processing}
                  error={fieldError(errors, "password_confirmation")}
                  onChange={(value) =>
                    updateField("password_confirmation", value)
                  }
                />
              </div>

              <PasswordChecklist
                password={data.user.password}
                passwordConfirmation={data.user.password_confirmation}
              />

              <input
                type="hidden"
                value={data.user.invitation_token}
                readOnly
              />

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Creating account..."
                className="w-full"
              >
                Create Account
              </LoadingButton>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already registered?{" "}
              <Link
                href="/users/sign_in"
                className="font-bold text-cyan-500 hover:text-cyan-600"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}

type TextFieldProps = {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  readOnly?: boolean;
  required?: boolean;
  helper?: string;
  error?: string | string[];
  onChange: (value: string) => void;
};

function TextField({
  label,
  icon: Icon,
  type = "text",
  value,
  placeholder,
  disabled,
  readOnly = false,
  required = true,
  helper,
  error,
  onChange,
}: TextFieldProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
        {label}
        <RequiredMark show={required} />
      </span>

      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 ${formInputClassName(hasError)} ${
            readOnly ? "bg-slate-50 text-slate-500" : ""
          }`}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>

      <FieldHint>{helper}</FieldHint>
      <FieldError error={error} label={label} />
    </label>
  );
}

function validateSignUpForm(
  data: SignUpFormData,
  isInvitationSignup: boolean,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!isInvitationSignup) {
    const organizationError = validateTextLength(
      data.user.organization_name,
      "Organization",
      {
        min: 3,
        max: 100,
      },
    );

    if (organizationError) errors.organization_name = organizationError;

    const slug = data.user.organization_slug.trim();

    if (slug.length > 0 && !SLUG_REGEX.test(slug)) {
      errors.organization_slug =
        "Slug can only include lowercase letters, numbers, and hyphens.";
    }

    if (slug.length > 120) {
      errors.organization_slug = "Slug must be 120 characters or less.";
    }

    const phoneError = validatePhone(data.user.organization_phone, "Phone");

    if (phoneError) errors.organization_phone = phoneError;

    const addressError = validateTextLength(
      data.user.organization_address,
      "Address",
      {
        max: 200,
        required: false,
      },
    );

    if (addressError) errors.organization_address = addressError;
  }

  const nameError = validateTextLength(data.user.name, "Full Name", {
    min: 2,
    max: 100,
  });

  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.user.email, "Email", {
    required: true,
  });

  if (emailError) errors.email = emailError;

  const passwordError = validatePasswordStrength(
    data.user.password,
    "Password",
  );

  if (passwordError) errors.password = passwordError;

  const confirmationError = validatePasswordConfirmation(
    data.user.password,
    data.user.password_confirmation,
    "Confirm Password",
  );

  if (confirmationError) {
    errors.password_confirmation = confirmationError;
  }

  return errors;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`user.${field}`];
}

function formatRole(role?: string | null): string {
  if (!role) return "-";

  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}