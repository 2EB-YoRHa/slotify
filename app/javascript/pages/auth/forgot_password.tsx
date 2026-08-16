import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Mail } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import FlashMessages from "../../components/ui/FlashMessages";
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
  type ValidationErrors,
} from "../../utils/clientValidation";

type ForgotPasswordProps = {
  errors?: Partial<Record<string, string | string[]>>;
  status?: string | null;
};

type ForgotPasswordFormData = {
  user: {
    email: string;
  };
};

export default function ForgotPassword({
  errors: initialErrors = {},
  status = null,
}: ForgotPasswordProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const {
    data,
    setData,
    post,
    processing,
    errors: formErrors,
  } = useForm<ForgotPasswordFormData>({
    user: {
      email: "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const emailError = fieldError(errors, "email");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForgotPasswordForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    post("/users/password");
  }

  function updateEmail(email: string) {
    clearClientError("email");

    setData("user", {
      ...data.user,
      email,
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
    <main className="min-h-dvh bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-10">
      <FlashMessages />

      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl flex-col sm:min-h-[calc(100vh-5rem)]">
        <header className="mb-6 flex justify-center sm:mb-10">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-8 lg:p-10">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-slate-950 dark:text-slate-100 sm:text-3xl">
                Forgot Password
              </h1>

              <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
                Enter your email address and we will send you a link to reset
                your password.
              </p>
            </div>

            {status && (
              <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold leading-6 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                {status}
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-6">
              <label className="block">
                <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                  Email
                  <RequiredMark />
                </span>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />

                  <input
                    type="email"
                    value={data.user.email}
                    onChange={(event) => updateEmail(event.target.value)}
                    className={`h-12 ${formInputClassName(
                      hasFieldError(emailError),
                    )}`}
                    placeholder="Enter email address"
                    autoComplete="email"
                    disabled={processing}
                  />
                </div>

                <FieldHint>
                  Use the email associated with your Slotify account.
                </FieldHint>

                <FieldError error={emailError} label="Email" />
              </label>

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Sending..."
                className="w-full"
              >
                Send Reset Link
              </LoadingButton>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/users/sign_in"
                className="text-sm font-bold text-cyan-500 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}

function validateForgotPasswordForm(
  data: ForgotPasswordFormData,
): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.user.email, "Email", {
    required: true,
  });

  if (emailError) errors.email = emailError;

  return errors;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`user.${field}`];
}