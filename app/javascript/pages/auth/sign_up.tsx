import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import {
  Building2,
  Hash,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import PasswordChecklist, {
  isStrongPassword,
} from "../../components/auth/PasswordChecklist";
import LoadingButton from "../../components/ui/LoadingButton";
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
    organization_name: string;
    organization_slug: string;
    organization_phone: string;
    organization_address: string;
  };
};

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export default function SignUp({
  invitation = null,
  invitation_token = null,
  errors = {},
}: SignUpProps) {
  const isInvitationSignup = Boolean(invitation);

  const { data, setData, post, processing } = useForm<SignUpFormData>({
    user: {
      name: "",
      email: invitation?.email || "",
      password: "",
      password_confirmation: "",
      invitation_token: invitation_token || invitation?.token || "",
      organization_name: "",
      organization_slug: "",
      organization_phone: "",
      organization_address: "",
    },
  });

  const passwordReady = isStrongPassword(
    data.user.password,
    data.user.password_confirmation,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!passwordReady) return;

    post("/users");
  }

  function updateField(field: keyof SignUpFormData["user"], value: string) {
    setData("user", {
      ...data.user,
      [field]: value,
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-950">
                {isInvitationSignup ? "Join Organization" : "Create Account"}
              </h1>

              {isInvitationSignup ? (
                <p className="mt-3 leading-7 text-slate-500">
                  Complete your account to join{" "}
                  <span className="font-bold text-slate-950">
                    {invitation?.organization?.name}
                  </span>{" "}
                  as{" "}
                  <span className="font-bold text-slate-950">
                    {formatRole(invitation?.role?.name)}
                  </span>
                  .
                </p>
              ) : (
                <p className="mt-3 leading-7 text-slate-500">
                  Create your manager account and register your organization in
                  Slotify.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FormError errors={errors} field="invitation_token" />

              {!isInvitationSignup && (
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="Organization"
                    icon={Building2}
                    value={data.user.organization_name}
                    placeholder="Enter organization name"
                    disabled={processing}
                    error={errors.organization_name}
                    onChange={(value) =>
                      updateField("organization_name", value)
                    }
                  />

                  <TextField
                    label="Slug"
                    icon={Hash}
                    value={data.user.organization_slug}
                    placeholder="Optional, generated from organization name"
                    disabled={processing}
                    required={false}
                    error={errors.organization_slug}
                    onChange={(value) =>
                      updateField("organization_slug", value)
                    }
                  />

                  <TextField
                    label="Phone"
                    icon={Phone}
                    value={data.user.organization_phone}
                    placeholder="Enter phone number"
                    disabled={processing}
                    error={errors.organization_phone}
                    onChange={(value) =>
                      updateField("organization_phone", value)
                    }
                  />

                  <TextField
                    label="Address"
                    icon={MapPin}
                    value={data.user.organization_address}
                    placeholder="Enter organization address"
                    disabled={processing}
                    error={errors.organization_address}
                    onChange={(value) =>
                      updateField("organization_address", value)
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Full Name"
                  icon={UserRound}
                  value={data.user.name}
                  placeholder="Your full name"
                  disabled={processing}
                  error={errors.name}
                  onChange={(value) => updateField("name", value)}
                />

                <TextField
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={data.user.email}
                  placeholder="Enter email address"
                  readOnly={isInvitationSignup}
                  disabled={processing}
                  error={errors.email}
                  onChange={(value) => updateField("email", value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Password"
                  icon={LockKeyhole}
                  type="password"
                  value={data.user.password}
                  placeholder="Create a strong password"
                  disabled={processing}
                  error={errors.password}
                  onChange={(value) => updateField("password", value)}
                />

                <TextField
                  label="Confirm Password"
                  icon={LockKeyhole}
                  type="password"
                  value={data.user.password_confirmation}
                  placeholder="Confirm your password"
                  disabled={processing}
                  error={errors.password_confirmation}
                  onChange={(value) =>
                    updateField("password_confirmation", value)
                  }
                />
              </div>

              <PasswordChecklist
                password={data.user.password}
                passwordConfirmation={data.user.password_confirmation}
              />

              <input
                type="hidden"
                value={data.user.invitation_token}
                readOnly
              />

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Creating account..."
                disabled={!passwordReady}
                className="w-full"
              >
                Create Account
              </LoadingButton>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already registered?{" "}
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

type TextFieldProps = {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string | string[];
  onChange: (value: string) => void;
};

function TextField({
  label,
  icon: Icon,
  type = "text",
  value,
  placeholder,
  disabled,
  readOnly = false,
  required = true,
  error,
  onChange,
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} ${
            readOnly ? "bg-slate-50 text-slate-500" : ""
          }`}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
        />
      </div>

      <FormError error={error} />
    </label>
  );
}

type FormErrorProps = {
  errors?: Partial<Record<string, string | string[]>>;
  field?: string;
  error?: string | string[];
};

function FormError({ errors, field, error }: FormErrorProps) {
  const fieldError = field && errors ? errors[field] : error;

  if (!fieldError) return null;

  const message = Array.isArray(fieldError)
    ? fieldError.join(", ")
    : fieldError;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function formatRole(role?: string | null): string {
  if (!role) return "-";

  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
