import { AlertCircle, Info } from "lucide-react";

export type FormErrorValue = string | string[] | undefined | null;

type FieldErrorProps = {
  error?: FormErrorValue;
};

export function FieldError({ error }: FieldErrorProps) {
  const message = errorMessage(error);

  if (!message) return null;

  return (
    <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-red-600">
      <AlertCircle size={15} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

type FieldHintProps = {
  children?: string | null;
};

export function FieldHint({ children }: FieldHintProps) {
  if (!children) return null;

  return (
    <p className="mt-2 flex items-start gap-2 text-xs font-semibold leading-5 text-slate-400">
      <Info size={14} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

type RequiredMarkProps = {
  show?: boolean;
};

export function RequiredMark({ show = true }: RequiredMarkProps) {
  if (!show) return null;

  return <span className="text-red-500">*</span>;
}

export function errorMessage(error?: FormErrorValue): string | null {
  if (!error) return null;

  if (Array.isArray(error)) {
    return error.filter(Boolean).join(", ");
  }

  return error;
}

export function hasFieldError(error?: FormErrorValue): boolean {
  return Boolean(errorMessage(error));
}

export function formInputClassName(hasError: boolean, paddingLeft = true) {
  const baseClass =
    "w-full rounded-xl border bg-white py-3 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  const leftPadding = paddingLeft ? "pl-11" : "pl-4";

  if (hasError) {
    return `${baseClass} ${leftPadding} border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-50`;
  }

  return `${baseClass} ${leftPadding} border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50`;
}