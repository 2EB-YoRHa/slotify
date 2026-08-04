import { Link, useForm } from "@inertiajs/react";
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

type SignInProps = {
  invitation_token?: string | null;
  errors?: Partial<Record<string, string | string[]>>;
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
}: SignInProps) {
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
  };

  const emailError = fieldError(errors, "email");
  const passwordError = fieldError(errors, "password");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    post("/users/sign_in");
  }

  function updateField(field: keyof SignInFormData["user"], value: string) {
    setData("user", {
      ...data.user,
      [field]: value,
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
                Sign In
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Access your reservations, workspaces, members, and organization
                settings.
              </p>
            </div>

            {invitation_token && (
              <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-semibold leading-6 text-cyan-700">
                Sign in to continue accepting your organization invitation.
              </div>
            )}

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

                <FieldHint>Use the email registered for your account.</FieldHint>
                <FieldError error={emailError} label="Email" />
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                    Password
                    <RequiredMark />
                  </span>

                  <Link
                    href="/users/password/new"
                    className="text-xs font-bold text-cyan-500 hover:text-cyan-600"
                  >
                    Forgot password?
                  </Link>
                </div>

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
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              New to Slotify?{" "}
              <Link
                href={
                  invitation_token
                    ? `/users/sign_up?invitation_token=${invitation_token}`
                    : "/users/sign_up"
                }
                className="font-bold text-cyan-500 hover:text-cyan-600"
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

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`user.${field}`];
}