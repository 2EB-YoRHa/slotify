import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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
  type ValidationErrors,
} from "../../utils/clientValidation";

type TwoFactorChallengeProps = {
  email?: string | null;
  errors?: Partial<Record<string, string | string[]>>;
};

type TwoFactorChallengeFormData = {
  two_factor: {
    code: string;
  };
};

export default function TwoFactorChallenge({
  email = null,
  errors: initialErrors = {},
}: TwoFactorChallengeProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const {
    data,
    setData,
    post,
    processing,
    errors: formErrors,
  } = useForm<TwoFactorChallengeFormData>({
    two_factor: {
      code: "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const codeError = fieldError(errors, "code");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateChallengeForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    post("/auth/two_factor", {
      preserveScroll: true,
    });
  }

  function updateCode(value: string) {
    setClientErrors({});

    setData("two_factor", {
      code: value.replace(/\D/g, "").slice(0, 6),
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <FlashMessages />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-sm">
            <div className="bg-linear-to-b from-cyan-50 to-white px-8 pt-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-cyan-500 shadow-sm">
                <ShieldCheck size={38} strokeWidth={2.4} />
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                Two-factor verification
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                Enter the 6-digit code from your authenticator app to finish
                signing in.
              </p>
            </div>

            <div className="px-8 pb-8 pt-7">
              {email && (
                <div className="mb-7 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-left">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                    Signing in as
                  </p>

                  <p className="mt-1 break-all text-sm font-black text-slate-950">
                    {email}
                  </p>
                </div>
              )}

              <form noValidate onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 flex items-center justify-center gap-1 text-sm font-bold text-slate-700">
                    Authentication Code
                    <RequiredMark />
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={data.two_factor.code}
                    onChange={(event) => updateCode(event.target.value)}
                    className={`h-14 text-center font-mono text-2xl font-black tracking-[0.45em] ${formInputClassName(
                      hasFieldError(codeError),
                      false,
                    )}`}
                    placeholder="000000"
                    disabled={processing}
                    autoFocus
                  />

                  <FieldHint>
                    The code changes every 30 seconds in your authenticator app.
                  </FieldHint>
                  <FieldError error={codeError} label="Code" />
                </label>

                <LoadingButton
                  type="submit"
                  loading={processing}
                  loadingText="Verifying..."
                  className="mt-6 w-full rounded-2xl py-4"
                >
                  Verify and Sign In
                </LoadingButton>
              </form>

              <div className="mt-5 flex justify-center">
                <Link
                  href="/users/sign_in"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-cyan-600"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}

function validateChallengeForm(
  data: TwoFactorChallengeFormData,
): ValidationErrors {
  const code = data.two_factor.code.trim();

  if (!code) {
    return { code: "Code is required." };
  }

  if (!/^\d{6}$/.test(code)) {
    return { code: "Enter a valid 6-digit code." };
  }

  return {};
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`two_factor.${field}`];
}