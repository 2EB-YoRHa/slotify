import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

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
  errors = {},
}: ResetPasswordProps) {
  const { data, setData, patch, processing } = useForm<ResetPasswordFormData>({
    user: {
      reset_password_token: reset_password_token || "",
      password: "",
      password_confirmation: "",
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    patch("/users/password");
  }

  function updateField(
    field: keyof ResetPasswordFormData["user"],
    value: string
  ) {
    setData("user", {
      ...data.user,
      [field]: value,
    });
  }

  const passwordsMatch =
    data.user.password.length > 0 &&
    data.user.password === data.user.password_confirmation;

  const passwordLengthOk = data.user.password.length >= 6;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <Logo />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-950">
                Reset Password
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Enter your new password below to regain access to your
                workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input
                type="hidden"
                value={data.user.reset_password_token}
                readOnly
              />

              <FormError errors={errors} field="reset_password_token" />

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  New Password
                </span>

                <input
                  type="password"
                  value={data.user.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  className="input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />

                <FormError errors={errors} field="password" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Confirm Password
                </span>

                <input
                  type="password"
                  value={data.user.password_confirmation}
                  onChange={(event) =>
                    updateField("password_confirmation", event.target.value)
                  }
                  className="input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />

                <FormError errors={errors} field="password_confirmation" />
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Strength</span>
                  <span className="font-bold text-slate-500">
                    {passwordLengthOk ? "Medium" : "Weak"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                  <CheckItem checked={passwordLengthOk} label="6+ characters" />
                  <CheckItem
                    checked={passwordsMatch}
                    label="Passwords match"
                  />
                </div>
              </div>

              {passwordsMatch && passwordLengthOk && (
                <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700">
                  Passwords match and meet the minimum criteria.
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-lg bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-60"
              >
                {processing ? "Updating..." : "Update Password"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/users/sign_in"
                className="text-sm font-bold text-slate-600 hover:text-cyan-500"
              >
                ← Back to Login
              </Link>
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

type CheckItemProps = {
  checked: boolean;
  label: string;
};

function CheckItem({ checked, label }: CheckItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
          checked
            ? "bg-green-100 text-green-600"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {checked ? "✓" : "×"}
      </span>

      <span>{label}</span>
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