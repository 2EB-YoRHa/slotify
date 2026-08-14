import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  CheckCircle2,
  Copy,
  Info,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import AppLayout from "../../components/AppLayout";
import PasswordChecklist from "../../components/auth/PasswordChecklist";
import AccountSettingsNav from "../../components/account/AccountSettingsNav";
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
      <div className="mx-auto max-w-5xl space-y-8">
        <SecurityHero />

        <AccountSettingsNav active="security" />

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
      </div>
    </AppLayout>
  );
}

function SecurityHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          Security
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Manage your password and protect your Slotify account with an
          authenticator app.
        </p>
      </div>
    </section>
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
      <SectionHeader
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            title={
              twoFactor.enabled
                ? "Your account is protected"
                : "Add authenticator protection"
            }
            description={
              twoFactor.enabled
                ? "Slotify will ask for a 6-digit code after your password when you sign in."
                : "Use a 6-digit code from an authenticator app instead of waiting for email."
            }
          />

          <TwoFactorStatus enabled={twoFactor.enabled} />
        </div>
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
        <div className="border-b border-slate-100 bg-green-50 px-8 py-5">
          <InlineNote
            tone="green"
            text="Two-factor authentication is enabled. Your next login will require your password and an authenticator code."
          />
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

        <div className="mt-5">
          <InlineNote
            tone="amber"
            text="Keep access to your authenticator app. Without it, you may need admin help to recover your account."
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

function TwoFactorStatus({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${
        enabled
          ? "bg-green-50 text-green-600"
          : "bg-amber-50 text-amber-600"
      }`}
    >
      {enabled ? <CheckCircle2 size={17} /> : <TriangleAlert size={17} />}
      {enabled ? "2FA enabled" : "2FA not enabled"}
    </div>
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
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm">
          <Smartphone size={24} strokeWidth={2.4} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-black text-slate-950">
            Set up your authenticator app
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-cyan-700">
            Add a new account manually, copy the setup key, then enter the
            6-digit code generated by the app.
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
                className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-cyan-700 shadow-sm"
              >
                {app}
              </span>
            ))}
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

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
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

      <FieldError error={error} label="Code" />

      <FieldHint>Use the 6-digit code from your authenticator app.</FieldHint>
    </label>
  );
}

function InlineNote({
  tone,
  text,
}: {
  tone: "green" | "amber";
  text: string;
}) {
  const toneClasses = {
    green: "text-green-700",
    amber: "text-amber-700",
  };

  const Icon = tone === "green" ? CheckCircle2 : Info;

  return (
    <p
      className={`flex items-start gap-2 text-xs font-semibold leading-5 ${toneClasses[tone]}`}
    >
      <Icon size={15} className="mt-0.5 shrink-0" />
      <span>{text}</span>
    </p>
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