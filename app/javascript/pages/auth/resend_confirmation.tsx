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

type ResendConfirmationProps = {
  errors?: Partial<Record<string, string | string[]>>;
};

type ResendConfirmationFormData = {
  user: {
    email: string;
  };
};

export default function ResendConfirmation({
  errors: initialErrors = {},
}: ResendConfirmationProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const {
    data,
    setData,
    post,
    processing,
    errors: formErrors,
  } = useForm<ResendConfirmationFormData>({
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

    const validationErrors: ValidationErrors = {};
    const error = validateEmail(data.user.email, "Email", { required: true });

    if (error) validationErrors.email = error;

    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    post("/users/confirmation");
  }

  function updateEmail(value: string) {
    setClientErrors({});
    setData("user", {
      email: value,
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-950">
                Confirm Your Email
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Enter your email and we will send a new confirmation link.
              </p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
                  Email
                  <RequiredMark />
                </span>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                  Use the same email you used to create your account.
                </FieldHint>

                <FieldError error={emailError} label="Email" />
              </label>

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Sending..."
                className="w-full"
              >
                Send Confirmation Email
              </LoadingButton>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already confirmed?{" "}
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

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`user.${field}`];
}