import { AlertCircle, Info } from "lucide-react";

export type FormErrorValue = string | string[] | undefined | null;

type FieldErrorProps = {
  error?: FormErrorValue;
  label?: string;
};

export function FieldError({ error, label = "This field" }: FieldErrorProps) {
  const message = errorMessage(error, label);

  if (!message) return null;

  return (
    <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <AlertCircle size={15} className="mt-0.5 shrink-0" />

      <span className="wrap-break-word">{message}</span>
    </div>
  );
}

type FieldHintProps = {
  children?: string | null;
};

export function FieldHint({ children }: FieldHintProps) {
  if (!children) return null;

  return (
    <p className="mt-2 flex items-start gap-2 text-xs font-semibold leading-5 text-slate-400 dark:text-slate-500">
      <Info size={14} className="mt-0.5 shrink-0" />

      <span className="wrap-break-word">{children}</span>
    </p>
  );
}

type RequiredMarkProps = {
  show?: boolean;
};

export function RequiredMark({ show = true }: RequiredMarkProps) {
  if (!show) return null;

  return <span className="text-red-500 dark:text-red-300">*</span>;
}

export function errorMessage(
  error?: FormErrorValue,
  label = "This field",
): string | null {
  if (!error) return null;

  const rawMessage = Array.isArray(error)
    ? error.filter(Boolean).join(", ")
    : error;

  if (!rawMessage) return null;

  return humanizeRailsMessage(rawMessage.trim(), label);
}

export function hasFieldError(error?: FormErrorValue): boolean {
  return Boolean(errorMessage(error));
}

export function formInputClassName(hasError: boolean, paddingLeft = true) {
  const baseClass =
    "w-full rounded-xl border bg-white py-3 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900/60 dark:disabled:text-slate-600";

  const leftPadding = paddingLeft ? "pl-11" : "pl-4";

  if (hasError) {
    return `${baseClass} ${leftPadding} border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-50 dark:border-red-500/50 dark:bg-red-500/10 dark:focus:border-red-400 dark:focus:ring-red-500/20`;
  }

  return `${baseClass} ${leftPadding} border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:border-slate-700 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20`;
}

function humanizeRailsMessage(message: string, label: string): string {
  const field = label.trim() || "This field";
  const lowerField = field.toLowerCase();

  if (messageAlreadyIncludesField(message, field)) {
    return ensurePeriod(message);
  }

  if (message.includes("can't be blank")) {
    return `${field} is required.`;
  }

  if (message.includes("is invalid")) {
    return `Enter a valid ${lowerField}.`;
  }

  if (message.includes("is not included in the list")) {
    return `Select a valid ${lowerField}.`;
  }

  if (message.includes("must be greater than 0")) {
    return `${field} must be greater than 0.`;
  }

  if (message.includes("must be greater than or equal to 0")) {
    return `${field} cannot be negative.`;
  }

  if (message.includes("must be an integer")) {
    return `${field} must be a whole number.`;
  }

  if (message.includes("must be less than or equal to")) {
    return `${field} ${message}`;
  }

  if (message.includes("is too short")) {
    return `${field} ${message}`;
  }

  if (message.includes("is too long")) {
    return `${field} ${message}`;
  }

  if (message.includes("has already been taken")) {
    return `${field} is already in use.`;
  }

  if (message.includes("must include at least one uppercase letter")) {
    return `${field} must include at least one uppercase letter.`;
  }

  if (message.includes("must include at least one lowercase letter")) {
    return `${field} must include at least one lowercase letter.`;
  }

  if (message.includes("must include at least one number")) {
    return `${field} must include at least one number.`;
  }

  if (message.includes("must include at least one symbol")) {
    return `${field} must include at least one symbol.`;
  }

  if (message.includes("already belongs to this organization")) {
    return "This email already belongs to this organization.";
  }

  if (message.includes("already has a pending invitation")) {
    return "This email already has a pending invitation.";
  }

  return ensurePeriod(message);
}

function messageAlreadyIncludesField(message: string, field: string): boolean {
  return message.toLowerCase().startsWith(field.toLowerCase());
}

function ensurePeriod(message: string): string {
  return message.endsWith(".") ? message : `${message}.`;
}