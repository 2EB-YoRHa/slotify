import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import PasswordChecklist, {
  isStrongPassword,
} from "../../components/auth/PasswordChecklist";
import FlashMessages from "../../components/ui/FlashMessages";
import LoadingButton from "../../components/ui/LoadingButton";

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

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

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

  const passwordReady = isStrongPassword(
    data.user.password,
    data.user.password_confirmation,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!passwordReady) return;

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

              <FormError errors={errors} field="reset_password_token" />

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  New Password
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
                    className={inputClass}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={processing}
                    required
                  />
                </div>

                <FormError errors={errors} field="password" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Confirm Password
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
                    className={inputClass}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={processing}
                    required
                  />
                </div>

                <FormError errors={errors} field="password_confirmation" />
              </label>

              <PasswordChecklist
                password={data.user.password}
                passwordConfirmation={data.user.password_confirmation}
              />

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Updating..."
                disabled={!passwordReady}
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