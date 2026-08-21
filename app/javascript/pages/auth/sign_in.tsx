import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { LockKeyhole, Mail } from "lucide-react";
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
  validateRequired,
  type ValidationErrors,
} from "../../utils/clientValidation";

type SignInProps = {
  invitation_token?: string | null;
  errors?: Partial<Record<string, string | string[]>>;
  development_manual_links?: {
    confirmation_url?: string;
    reset_password_url?: string;
  };
};

type SignInFormData = {
  user: {
    email: string;
    password: string;
    invitation_token: string;
  };
};

export default function SignIn({
  invitation_token = null,
  errors: initialErrors = {},
  development_manual_links = {},
}: SignInProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const {
    data,
    setData,
    post,
    processing,
    errors: formErrors,
  } = useForm<SignInFormData>({
    user: {
      email: "",
      password: "",
      invitation_token: invitation_token || "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const emailError = fieldError(errors, "email");
  const passwordError = fieldError(errors, "password");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateSignInForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    post("/users/sign_in");
  }

  function updateField(field: keyof SignInFormData["user"], value: string) {
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
                Sign In
              </h1>

              <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
                Access your reservations, workspaces, members, and organization
                settings.
              </p>
            </div>

            {invitation_token && (
              <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-semibold leading-6 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300">
                Sign in to continue accepting your organization invitation.
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className={`h-12 ${formInputClassName(
                      hasFieldError(emailError),
                    )}`}
                    placeholder="Enter email address"
                    autoComplete="email"
                    disabled={processing}
                  />
                </div>

                <FieldHint>
                  Use the email registered for your account.
                </FieldHint>
                <FieldError error={emailError} label="Email" />
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                    Password
                    <RequiredMark />
                  </span>

                  <Link
                    href="/users/password/new"
                    className="shrink-0 text-xs font-bold text-cyan-500 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={processing}
                  />
                </div>

                <FieldError error={passwordError} label="Password" />
              </label>

              <input
                type="hidden"
                value={data.user.invitation_token}
                readOnly
              />

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Signing in..."
                className="w-full"
              >
                Sign In
              </LoadingButton>
              <DevelopmentManualLinks links={development_manual_links} />
            </form>

            <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              Need to confirm your email?{" "}
              <Link
                href="/users/confirmation/new"
                className="font-bold text-cyan-500 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                Resend confirmation
              </Link>
            </div>

            <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              New to Slotify?{" "}
              <Link
                href={
                  invitation_token
                    ? `/users/sign_up?invitation_token=${invitation_token}`
                    : "/users/sign_up"
                }
                className="font-bold text-cyan-500 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}

function validateSignInForm(data: SignInFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.user.email, "Email", {
    required: true,
  });

  if (emailError) errors.email = emailError;

  const passwordError = validateRequired(data.user.password, "Password");

  if (passwordError) errors.password = passwordError;

  return errors;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`user.${field}`];
}

type DevelopmentManualLinksProps = {
  links?: {
    confirmation_url?: string;
    reset_password_url?: string;
  };
};

function DevelopmentManualLinks({ links = {} }: DevelopmentManualLinksProps) {
  const hasLinks = Boolean(links.confirmation_url || links.reset_password_url);

  if (!hasLinks) return null;

  return (
    <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
      <p className="text-xs font-extrabold uppercase tracking-wide text-amber-600 dark:text-amber-300">
        Development Email Shortcut
      </p>

      <p className="mt-2 text-sm leading-6 text-amber-700 dark:text-amber-200/90">
        SendGrid already attempted to send the email. If Gmail delays it, use
        this temporary development link to continue testing.
      </p>

      <div className="mt-4 space-y-2">
        {links.confirmation_url && (
          <a
            href={links.confirmation_url}
            className="block break-all rounded-xl bg-white px-4 py-3 text-sm font-bold text-cyan-600 transition hover:bg-cyan-50 dark:bg-slate-900 dark:text-cyan-300 dark:hover:bg-slate-800"
          >
            Confirm account now
          </a>
        )}

        {links.reset_password_url && (
          <a
            href={links.reset_password_url}
            className="block break-all rounded-xl bg-white px-4 py-3 text-sm font-bold text-cyan-600 transition hover:bg-cyan-50 dark:bg-slate-900 dark:text-cyan-300 dark:hover:bg-slate-800"
          >
            Reset password now
          </a>
        )}
      </div>
    </div>
  );
}