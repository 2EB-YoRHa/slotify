import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Info, LockKeyhole } from "lucide-react";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";

export function SecurityHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
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

export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-w-0">
      <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export function PasswordField({
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
    <label className="block min-w-0">
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

export function CodeField({
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
    <label className="block min-w-0">
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
        className={`h-12 text-center font-mono text-lg font-black tracking-[0.25em] sm:tracking-[0.45em] ${formInputClassName(
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

export function InlineNote({
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

  const Icon: LucideIcon = tone === "green" ? CheckCircle2 : Info;

  return (
    <p
      className={`flex min-w-0 items-start gap-2 text-xs font-semibold leading-5 ${toneClasses[tone]}`}
    >
      <Icon size={15} className="mt-0.5 shrink-0" />
      <span className="min-w-0 wrap-break-word">{text}</span>
    </p>
  );
}