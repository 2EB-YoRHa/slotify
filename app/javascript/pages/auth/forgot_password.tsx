import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

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
  errors = {},
  status = null,
}: ForgotPasswordProps) {
  const { data, setData, post, processing } = useForm<ForgotPasswordFormData>({
    user: {
      email: "",
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    post("/users/password");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <Logo />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-950">
              Forgot Password
            </h1>

            <p className="mt-3 leading-7 text-slate-500">
              No worries. Enter the email associated with your account and
              we&apos;ll help you get back in.
            </p>

            {status && (
              <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-left text-sm text-green-700">
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 text-left">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Email Address
                </span>

                <input
                  type="email"
                  value={data.user.email}
                  onChange={(event) =>
                    setData("user", {
                      ...data.user,
                      email: event.target.value,
                    })
                  }
                  className="input"
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                />

                <FormError errors={errors} field="email" />
              </label>

              <button
                type="submit"
                disabled={processing}
                className="mt-7 w-full rounded-lg bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-60"
              >
                {processing ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-bold text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
              href="/users/sign_in"
              className="text-sm font-bold text-slate-600 hover:text-cyan-500"
            >
              ← Back to Login
            </Link>
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