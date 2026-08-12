import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import AccountSettingsNav from "../../components/account/AccountSettingsNav";
import {
  CheckCircle2,
  Copy,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import AppLayout from "../../components/AppLayout";
import PasswordChecklist from "../../components/auth/PasswordChecklist";
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
  validatePasswordConfirmation,
  validatePasswordStrength,
  validateRequired,
  type ValidationErrors,
} from "../../utils/clientValidation";

type TwoFactorSettings = {
  enabled: boolean;
  setup_key?: string | null;
  provisioning_uri?: string | null;
  account_label: string;
  issuer: string;
};

type SecurityShowProps = {
  two_factor: TwoFactorSettings;
  two_factor_errors?: Partial<Record<string, string | string[]>>;
  password_errors?: Partial<Record<string, string | string[]>>;
  errors?: Partial<Record<string, string | string[]>>;
};

type PasswordFormData = {
  user: {
    current_password: string;
    password: string;
    password_confirmation: string;
  };
};

type TwoFactorFormData = {
  two_factor: {
    code: string;
    current_password: string;
  };
};

export default function SecurityShow({
  two_factor,
  two_factor_errors = {},
  password_errors = {},
  errors = {},
}: SecurityShowProps) {
  const [passwordClientErrors, setPasswordClientErrors] =
    useState<ValidationErrors>({});
  const [twoFactorClientErrors, setTwoFactorClientErrors] =
    useState<ValidationErrors>({});
  const [copied, setCopied] = useState(false);

  const passwordForm = useForm<PasswordFormData>({
    user: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const twoFactorForm = useForm<TwoFactorFormData>({
    two_factor: {
      code: "",
      current_password: "",
    },
  });

  const passwordErrors: Record<string, string | string[] | undefined> = {
    ...password_errors,
    ...passwordForm.errors,
    ...passwordClientErrors,
  };

  const twoFactorErrors: Record<string, string | string[] | undefined> = {
    ...errors,
    ...two_factor_errors,
    ...twoFactorForm.errors,
    ...twoFactorClientErrors,
  };

  async function copySetupKey() {
    if (!two_factor.setup_key) return;

    await navigator.clipboard.writeText(two_factor.setup_key);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validatePasswordForm(passwordForm.data);
    setPasswordClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    passwordForm.patch("/password_settings", {
      preserveScroll: true,
      onSuccess: () => passwordForm.reset(),
    });
  }

  function handleTwoFactorSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateTwoFactorForm(twoFactorForm.data);
    setTwoFactorClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    if (two_factor.enabled) {
      twoFactorForm.delete("/two_factor", {
        preserveScroll: true,
        onSuccess: () => twoFactorForm.reset(),
      });
    } else {
      twoFactorForm.patch("/two_factor/enable", {
        preserveScroll: true,
        onSuccess: () => twoFactorForm.reset(),
      });
    }
  }

  function updatePasswordField(
    field: keyof PasswordFormData["user"],
    value: string,
  ) {
    setPasswordClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`user.${field}`];

      return nextErrors;
    });

    passwordForm.setData("user", {
      ...passwordForm.data.user,
      [field]: value,
    });
  }

  function updateTwoFactorField(
    field: keyof TwoFactorFormData["two_factor"],
    value: string,
  ) {
    setTwoFactorClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`two_factor.${field}`];

      return nextErrors;
    });

    twoFactorForm.setData("two_factor", {
      ...twoFactorForm.data.two_factor,
      [field]: value,
    });
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader enabled={two_factor.enabled} />

        <AccountSettingsNav active="security" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-8">
            <PasswordSection
              data={passwordForm.data}
              errors={passwordErrors}
              processing={passwordForm.processing}
              onSubmit={handlePasswordSubmit}
              onFieldChange={updatePasswordField}
            />

            <TwoFactorSection
              twoFactor={two_factor}
              data={twoFactorForm.data}
              errors={twoFactorErrors}
              processing={twoFactorForm.processing}
              copied={copied}
              onCopySetupKey={copySetupKey}
              onSubmit={handleTwoFactorSubmit}
              onFieldChange={updateTwoFactorField}
            />
          </main>

          <SecuritySidePanel enabled={two_factor.enabled} />
        </div>
      </div>
    </AppLayout>
  );
}

function PageHeader({ enabled }: { enabled: boolean }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-linear-to-r from-cyan-50 via-white to-white p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-white shadow-sm shadow-cyan-100">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-500">
              Account Security
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Security
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Manage your password and protect your Slotify account with an
              authenticator app.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <StatusPill
              active
              label="Password protected"
              tone="cyan"
            />

            <StatusPill
              active={enabled}
              label={enabled ? "2FA enabled" : "2FA not enabled"}
              tone={enabled ? "green" : "amber"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({
  active,
  label,
  tone,
}: {
  active: boolean;
  label: string;
  tone: "cyan" | "green" | "amber";
}) {
  const classes = {
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ${classes[tone]}`}
    >
      {active ? <CheckCircle2 size={17} /> : <TriangleAlert size={17} />}
      {label}
    </div>
  );
}

function PasswordSection({
  data,
  errors,
  processing,
  onSubmit,
  onFieldChange,
}: {
  data: PasswordFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (field: keyof PasswordFormData["user"], value: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <SectionHeading
        icon={LockKeyhole}
        eyebrow="Password"
        title="Change password"
        description="Use a strong password with uppercase, lowercase, number, and symbol."
      />

      <form noValidate onSubmit={onSubmit} className="mt-7 space-y-6">
        <div className="grid gap-5 md:grid-cols-3">
          <PasswordField
            label="Current Password"
            value={data.user.current_password}
            placeholder="Current password"
            error={fieldError(errors, "current_password", "user")}
            disabled={processing}
            autoComplete="current-password"
            onChange={(value) => onFieldChange("current_password", value)}
          />

          <PasswordField
            label="New Password"
            value={data.user.password}
            placeholder="New password"
            error={fieldError(errors, "password", "user")}
            disabled={processing}
            autoComplete="new-password"
            onChange={(value) => onFieldChange("password", value)}
          />

          <PasswordField
            label="Confirm Password"
            value={data.user.password_confirmation}
            placeholder="Confirm password"
            error={fieldError(errors, "password_confirmation", "user")}
            disabled={processing}
            autoComplete="new-password"
            onChange={(value) =>
              onFieldChange("password_confirmation", value)
            }
          />
        </div>

        <PasswordChecklist
          password={data.user.password}
          passwordConfirmation={data.user.password_confirmation}
        />

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
          <LoadingButton
            type="submit"
            loading={processing}
            loadingText="Updating..."
            className="min-w-44"
          >
            <LockKeyhole size={17} />
            Update Password
          </LoadingButton>

          <p className="text-xs font-semibold leading-5 text-slate-400">
            You will stay signed in after the password is updated.
          </p>
        </div>
      </form>
    </section>
  );
}

function TwoFactorSection({
  twoFactor,
  data,
  errors,
  processing,
  copied,
  onCopySetupKey,
  onSubmit,
  onFieldChange,
}: {
  twoFactor: TwoFactorSettings;
  data: TwoFactorFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  copied: boolean;
  onCopySetupKey: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (
    field: keyof TwoFactorFormData["two_factor"],
    value: string,
  ) => void;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-8">
        <SectionHeading
          icon={ShieldCheck}
          eyebrow="Two-Factor Authentication"
          title={
            twoFactor.enabled
              ? "Your account is protected"
              : "Add authenticator protection"
          }
          description={
            twoFactor.enabled
              ? "Slotify will ask for a 6-digit code after your password when you sign in."
              : "Set up a code from Google Authenticator, Microsoft Authenticator, Authy, or 1Password."
          }
        />
      </div>

      {!twoFactor.enabled && (
        <div className="border-b border-slate-100 bg-cyan-50 p-8">
          <SetupPanel
            twoFactor={twoFactor}
            copied={copied}
            onCopySetupKey={onCopySetupKey}
          />
        </div>
      )}

      {twoFactor.enabled && (
        <div className="border-b border-slate-100 bg-green-50 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-green-500 shadow-sm">
              <CheckCircle2 size={26} strokeWidth={2.4} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-950">
                Two-factor authentication is enabled
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-green-700">
                Your next sign in will require your password and a temporary
                authenticator code.
              </p>
            </div>
          </div>
        </div>
      )}

      <form noValidate onSubmit={onSubmit} className="p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <CodeField
            value={data.two_factor.code}
            error={fieldError(errors, "code", "two_factor")}
            disabled={processing}
            onChange={(value) =>
              onFieldChange("code", value.replace(/\D/g, "").slice(0, 6))
            }
          />

          <PasswordField
            label="Current Password"
            value={data.two_factor.current_password}
            placeholder="Current password"
            error={fieldError(errors, "current_password", "two_factor")}
            disabled={processing}
            autoComplete="current-password"
            onChange={(value) => onFieldChange("current_password", value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <LoadingButton
            type="submit"
            loading={processing}
            loadingText={twoFactor.enabled ? "Disabling..." : "Enabling..."}
            variant={twoFactor.enabled ? "danger" : "primary"}
            className="min-w-44"
          >
            {twoFactor.enabled ? (
              <>
                <XCircle size={17} />
                Disable 2FA
              </>
            ) : (
              <>
                <ShieldCheck size={17} />
                Enable 2FA
              </>
            )}
          </LoadingButton>

          <p className="text-xs font-semibold leading-5 text-slate-400">
            {twoFactor.enabled
              ? "A valid code is required before this protection can be disabled."
              : "The authenticator code refreshes every 30 seconds."}
          </p>
        </div>
      </form>
    </section>
  );
}

function SetupPanel({
  twoFactor,
  copied,
  onCopySetupKey,
}: {
  twoFactor: TwoFactorSettings;
  copied: boolean;
  onCopySetupKey: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm">
          <Smartphone size={27} strokeWidth={2.4} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-black text-slate-950">
            Set up your authenticator app
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-cyan-700">
            Add a new account manually in your authenticator app, then paste the
            setup key below.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SetupStep number="1" title="Open app" />
            <SetupStep number="2" title="Add account" />
            <SetupStep number="3" title="Enter code" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
              Setup Key
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Account: {twoFactor.issuer}: {twoFactor.account_label}
            </p>
          </div>

          <button
            type="button"
            onClick={onCopySetupKey}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-sm transition ${
              copied
                ? "bg-green-500 text-white"
                : "bg-cyan-400 text-white hover:bg-cyan-500"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 size={15} />
                Copied
              </>
            ) : (
              <>
                <Copy size={15} />
                Copy key
              </>
            )}
          </button>
        </div>

        <p className="mt-4 break-all rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 font-mono text-sm font-black tracking-wide text-slate-800">
          {formatSetupKey(twoFactor.setup_key)}
        </p>
      </div>
    </div>
  );
}

function SetupStep({ number, title }: { number: string; title: string }) {
  return (
    <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
      <p className="text-xs font-black text-cyan-500">Step {number}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-800">{title}</p>
    </div>
  );
}

function SecuritySidePanel({ enabled }: { enabled: boolean }) {
  return (
    <aside className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <KeyRound size={23} strokeWidth={2.4} />
        </div>

        <h2 className="text-lg font-black text-slate-950">Login security</h2>

        <div className="mt-5 space-y-4">
          <InfoRow
            title="Password"
            description="Your first sign-in layer."
          />
          <InfoRow
            title="Authenticator code"
            description="A temporary code generated on your device."
          />
          <InfoRow
            title="No email delay"
            description="2FA codes do not depend on Gmail or SendGrid."
          />
        </div>
      </section>

      <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-6">
        <h2 className="text-lg font-black text-slate-950">
          Recommended apps
        </h2>

        <p className="mt-2 text-sm font-semibold leading-6 text-cyan-700">
          Any authenticator app that supports 6-digit TOTP codes will work.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Google Authenticator",
            "Microsoft Authenticator",
            "Authy",
            "1Password",
          ].map((app) => (
            <span
              key={app}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-cyan-700 shadow-sm"
            >
              {app}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-500 shadow-sm">
          <TriangleAlert size={23} strokeWidth={2.4} />
        </div>

        <h2 className="text-lg font-black text-slate-950">Recovery note</h2>

        <p className="mt-2 text-sm font-semibold leading-6 text-amber-700">
          Keep access to your authenticator app. Without it, you may need admin
          help to recover your account.
        </p>

        <div
          className={`mt-5 rounded-2xl px-4 py-3 text-xs font-extrabold ${
            enabled ? "bg-green-100 text-green-700" : "bg-white text-amber-700"
          }`}
        >
          {enabled
            ? "2FA is currently protecting this account."
            : "2FA is not enabled yet."}
        </div>
      </section>
    </aside>
  );
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
        <Icon size={26} strokeWidth={2.4} />
      </div>

      <div>
        <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-500">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black text-slate-950">{title}</h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  placeholder,
  error,
  disabled,
  autoComplete,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  error?: string | string[];
  disabled: boolean;
  autoComplete: string;
  onChange: (value: string) => void;
}) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
        {label}
        <RequiredMark />
      </span>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="password"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 ${formInputClassName(hasError)}`}
        />
      </div>

      <FieldError error={error} label={label} />
    </label>
  );
}

function CodeField({
  value,
  error,
  disabled,
  onChange,
}: {
  value: string;
  error?: string | string[];
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
        Authenticator Code
        <RequiredMark />
      </span>

      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-12 text-center font-mono text-lg font-black tracking-[0.45em] ${formInputClassName(
          hasError,
          false,
        )}`}
        placeholder="000000"
        disabled={disabled}
      />

      <FieldHint>Use the 6-digit code from your authenticator app.</FieldHint>
      <FieldError error={error} label="Code" />
    </label>
  );
}

function InfoRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />

      <div>
        <p className="text-sm font-extrabold text-slate-800">{title}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function validatePasswordForm(data: PasswordFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const currentPasswordError = validateRequired(
    data.user.current_password,
    "Current Password",
  );

  if (currentPasswordError) errors.current_password = currentPasswordError;

  const passwordError = validatePasswordStrength(
    data.user.password,
    "New Password",
  );

  if (passwordError) errors.password = passwordError;

  const confirmationError = validatePasswordConfirmation(
    data.user.password,
    data.user.password_confirmation,
    "Confirm Password",
  );

  if (confirmationError) errors.password_confirmation = confirmationError;

  return errors;
}

function validateTwoFactorForm(data: TwoFactorFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const code = data.two_factor.code.trim();

  if (validateRequired(code, "Code")) {
    errors.code = "Code is required.";
  } else if (!/^\d{6}$/.test(code)) {
    errors.code = "Enter a valid 6-digit code.";
  }

  const currentPasswordError = validateRequired(
    data.two_factor.current_password,
    "Current Password",
  );

  if (currentPasswordError) errors.current_password = currentPasswordError;

  return errors;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
  namespace: "user" | "two_factor",
): string | string[] | undefined {
  return errors[field] || errors[`${namespace}.${field}`];
}

function formatSetupKey(value?: string | null): string {
  if (!value) return "Setup key unavailable";

  return value.match(/.{1,4}/g)?.join(" ") || value;
}