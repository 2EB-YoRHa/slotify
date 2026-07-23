import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import type { OrganizationInvitation } from "../../types/organization";

type SignUpProps = {
  invitation?: OrganizationInvitation | null;
  invitation_token?: string | null;
  errors?: Partial<Record<string, string | string[]>>;
};

type SignUpFormData = {
  user: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    invitation_token: string;
  };
};

export default function SignUp({
  invitation = null,
  invitation_token = null,
  errors = {},
}: SignUpProps) {
  const { data, setData, post, processing } = useForm<SignUpFormData>({
    user: {
      name: "",
      email: invitation?.email || "",
      password: "",
      password_confirmation: "",
      invitation_token: invitation_token || invitation?.token || "",
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    post("/users");
  }

  function updateField(
    field: keyof SignUpFormData["user"],
    value: string
  ) {
    setData("user", {
      ...data.user,
      [field]: value,
    });
  }

  if (!invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Logo />

          <h1 className="mt-8 text-3xl font-extrabold text-slate-950">
            Invitation required
          </h1>

          <p className="mt-4 leading-7 text-slate-500">
            To create a Slotify account, you need a valid organization
            invitation.
          </p>

          <a
            href="/users/sign_in"
            className="mt-8 inline-flex rounded-lg bg-cyan-400 px-7 py-3 text-sm font-bold text-white hover:bg-cyan-500"
          >
            Back to Sign In
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <Logo />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="text-center">
              <span className="rounded-full bg-cyan-50 px-4 py-1 text-xs font-extrabold uppercase tracking-wide text-cyan-500">
                Invitation Signup
              </span>

              <h1 className="mt-5 text-3xl font-extrabold text-slate-950">
                Create your account
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                You have been invited to join{" "}
                <span className="font-bold text-slate-950">
                  {invitation.organization?.name}
                </span>{" "}
                as{" "}
                <span className="font-bold text-slate-950">
                  {formatRole(invitation.role?.name)}
                </span>
                .
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FormError errors={errors} field="invitation_token" />

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Full Name
                </span>

                <input
                  type="text"
                  value={data.user.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="input"
                  placeholder="John Doe"
                  required
                />

                <FormError errors={errors} field="name" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Email Address
                </span>

                <input
                  type="email"
                  value={data.user.email}
                  className="input bg-slate-50 text-slate-500"
                  readOnly
                />

                <FormError errors={errors} field="email" />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Password
                  </span>

                  <input
                    type="password"
                    value={data.user.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    className="input"
                    placeholder="••••••••"
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
                      updateField(
                        "password_confirmation",
                        event.target.value
                      )
                    }
                    className="input"
                    placeholder="••••••••"
                    required
                  />

                  <FormError errors={errors} field="password_confirmation" />
                </label>
              </div>

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
                {processing ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <a
                href="/users/sign_in"
                className="font-bold text-cyan-500 hover:text-cyan-600"
              >
                Sign in
              </a>
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

      <span className="text-3xl font-extrabold text-cyan-400">
        Slotify
      </span>
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

function formatRole(role?: string | null): string {
  if (!role) return "-";

  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}