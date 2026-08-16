import { CheckCircle2, Circle } from "lucide-react";

type PasswordChecklistProps = {
  password: string;
  passwordConfirmation: string;
};

export function isStrongPassword(
  password: string,
  passwordConfirmation: string,
): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password.length > 0 &&
    password === passwordConfirmation
  );
}

export default function PasswordChecklist({
  password,
  passwordConfirmation,
}: PasswordChecklistProps) {
  const checks = [
    {
      label: "8+ characters",
      checked: password.length >= 8,
    },
    {
      label: "Uppercase letter",
      checked: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      checked: /[a-z]/.test(password),
    },
    {
      label: "Number",
      checked: /\d/.test(password),
    },
    {
      label: "Symbol",
      checked: /[^A-Za-z0-9]/.test(password),
    },
    {
      label: "Passwords match",
      checked: password.length > 0 && password === passwordConfirmation,
    },
  ];

  const ready = checks.every((check) => check.checked);

  return (
    <div
      className={`rounded-xl border p-4 text-sm transition ${
        ready
          ? "border-green-100 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10"
          : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
      }`}
    >
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="font-bold text-slate-700 dark:text-slate-200">
          Password requirements
        </span>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
            ready
              ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
              : "bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          }`}
        >
          {ready ? "Ready" : "Incomplete"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2">
        {checks.map((check) => (
          <CheckItem
            key={check.label}
            checked={check.checked}
            label={check.label}
          />
        ))}
      </div>
    </div>
  );
}

type CheckItemProps = {
  checked: boolean;
  label: string;
};

function CheckItem({ checked, label }: CheckItemProps) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 ${
        checked
          ? "bg-white/70 text-green-700 dark:bg-green-500/10 dark:text-green-300"
          : "text-slate-500 dark:text-slate-400"
      }`}
    >
      {checked ? (
        <CheckCircle2 size={15} className="shrink-0" />
      ) : (
        <Circle size={15} className="shrink-0" />
      )}

      <span className="truncate font-semibold">{label}</span>
    </div>
  );
}