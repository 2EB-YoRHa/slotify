import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import PasswordChecklist from "../../components/auth/PasswordChecklist";
import FlashMessages from "../../components/ui/FlashMessages";
import LoadingButton from "../../components/ui/LoadingButton";
import {
  FieldError,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../../components/ui/FormFeedback";
import {
  hasValidationErrors,
  validatePasswordConfirmation,
  validatePasswordStrength,
  type ValidationErrors,
} from "../../utils/clientValidation";

type ResetPasswordProps = {
  reset_password_token?: string | null;
  errors?: Partial<Record<string, string | string[]>>;
};

type ResetPasswordFormData = {
  user: {
    reset_password_token: string;
    password: string;
    password_confirmation: string;
  };
};

export default function ResetPassword({
  reset_password_token = null,
  errors: initialErrors = {},
}: ResetPasswordProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
  } = useForm<ResetPasswordFormData>({
    user: {
      reset_password_token: reset_password_token || "",
      password: "",
      password_confirmation: "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const passwordError = fieldError(errors, "password");
  const passwordConfirmationError = fieldError(
    errors,
    "password_confirmation",
  );
  const tokenError = fieldError(errors, "reset_password_token");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateResetPasswordForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    patch("/users/password");
  }

  function updateField(
    field: keyof ResetPasswordFormData["user"],
    value: string,
  ) {
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
    <main className="min-h-dvh bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <FlashMessages />

      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl flex-col sm:min-h-[calc(100vh-5rem)]">
        <header className="mb-6 flex justify-center sm:mb-10">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Reset Password
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Create a new password to restore access to your Slotify account.
              </p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input
                type="hidden"
                value={data.user.reset_password_token}
                readOnly
              />

              <FieldError error={tokenError} label="Reset Token" />

              <label className="block min-w-0">
                <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
                  New Password
                  <RequiredMark />
                </span>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    value={data.user.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    className={`h-12 ${formInputClassName(
                      hasFieldError(passwordError),
                    )}`}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={processing}
                  />
                </div>

                <FieldError error={passwordError} label="New Password" />
              </label>

              <label className="block min-w-0">
                <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
                  Confirm Password
                  <RequiredMark />
                </span>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    value={data.user.password_confirmation}
                    onChange={(event) =>
                      updateField("password_confirmation", event.target.value)
                    }
                    className={`h-12 ${formInputClassName(
                      hasFieldError(passwordConfirmationError),
                    )}`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={processing}
                  />
                </div>

                <FieldError
                  error={passwordConfirmationError}
                  label="Confirm Password"
                />
              </label>

              <PasswordChecklist
                password={data.user.password}
                passwordConfirmation={data.user.password_confirmation}
              />

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Updating..."
                className="w-full"
              >
                Update Password
              </LoadingButton>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/users/sign_in"
                className="text-sm font-bold text-cyan-500 hover:text-cyan-600"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}

function validateResetPasswordForm(
  data: ResetPasswordFormData,
): ValidationErrors {
  const errors: ValidationErrors = {};

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