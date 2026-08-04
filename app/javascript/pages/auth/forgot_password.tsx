import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { Mail } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import FlashMessages from "../../components/ui/FlashMessages";
import LoadingButton from "../../components/ui/LoadingButton";

type ForgotPasswordProps = {
  errors?: Partial<Record<string, string | string[]>>;
  status?: string | null;
};

type ForgotPasswordFormData = {
  user: {
    email: string;
  };
};

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

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
      <FlashMessages />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-950">
                Forgot Password
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Enter your email address and we will send you a link to reset
                your password.
              </p>
            </div>

            {status && (
              <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                {status}
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Email
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
                      setData("user", {
                        ...data.user,
                        email: event.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="name@company.com"
                    autoComplete="email"
                    disabled={processing}
                    required
                  />
                </div>

                <FormError errors={errors} field="email" />
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
                className="text-sm font-bold text-cyan-500 transition hover:text-cyan-600"
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
