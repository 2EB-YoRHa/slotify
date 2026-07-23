import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

type SignInProps = {
  invitation_token?: string | null;
  errors?: Partial<Record<string, string | string[]>>;
};

type SignInFormData = {
  user: {
    email: string;
    password: string;
    remember_me: string;
    invitation_token: string;
  };
};

export default function SignIn({
  invitation_token = null,
  errors = {},
}: SignInProps) {
  const { data, setData, post, processing } = useForm<SignInFormData>({
    user: {
      email: "",
      password: "",
      remember_me: "0",
      invitation_token: invitation_token || "",
    },
  });

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
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col">
        <header className="mb-10 flex justify-center">
          <Logo />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-10">
              <div className="text-center">
                <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-cyan-500">
                  Smart Coworking Reservations
                </p>

                <h1 className="text-3xl font-extrabold text-slate-950">
                  Sign in to Slotify
                </h1>

                <p className="mt-3 text-slate-500">
                  Enter your credentials to manage your spaces.
                </p>
              </div>

              {invitation_token && (
                <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-700">
                  Sign in to continue accepting your organization invitation.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Email Address
                  </span>

                  <input
                    type="email"
                    value={data.user.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className="input"
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                  />

                  <FormError errors={errors} field="email" />
                </label>

                <label className="block">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="block text-sm font-bold text-slate-700">
                      Password
                    </span>

                    <Link
                      href="/users/password/new"
                      className="text-xs font-bold text-cyan-500 hover:text-cyan-600"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <input
                    type="password"
                    value={data.user.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    className="input"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />

                  <FormError errors={errors} field="password" />
                </label>

                <label className="flex items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={data.user.remember_me === "1"}
                    onChange={(event) =>
                      updateField(
                        "remember_me",
                        event.target.checked ? "1" : "0"
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 text-cyan-400"
                  />

                  Remember me for 30 days
                </label>

                <input
                  type="hidden"
                  value={data.user.invitation_token}
                  readOnly
                />

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full rounded-lg bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-60"
                >
                  {processing ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
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

            <div className="border-t border-slate-200 bg-slate-50 px-10 py-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Secure enterprise authentication
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-10 flex justify-between text-xs text-slate-400">
          <span>© 2024 Slotify Inc. All rights reserved.</span>

          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Logo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-xl font-bold text-white">
        ◇
      </div>

      <span className="text-3xl font-extrabold text-cyan-400">Slotify</span>
    </div>
  );
}

type FormErrorProps = {
  errors: Partial<Record<string, string | string[]>>;
  field: string;
};

function FormError({ errors, field }: FormErrorProps) {
  const error = errors[field];

  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}