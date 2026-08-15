import type { LucideIcon } from "lucide-react";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";
import { autoCompleteFor } from "../../utils/profileForm";

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

export function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
      <p className="truncate text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 wrap-break-word text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

type TextFieldProps = {
  label: string;
  icon: LucideIcon;
  value: string;
  placeholder: string;
  type?: string;
  disabled: boolean;
  required?: boolean;
  error?: string | string[];
  helper?: string;
  onChange: (value: string) => void;
};

export function ProfileTextField({
  label,
  icon: Icon,
  value,
  placeholder,
  type = "text",
  disabled,
  required = true,
  error,
  helper,
  onChange,
}: TextFieldProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
        {label}
        <RequiredMark show={required} />
      </span>

      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 ${formInputClassName(hasError)}`}
          autoComplete={autoCompleteFor(label, type)}
        />
      </div>

      <FieldError error={error} label={label} />
      <FieldHint>{helper}</FieldHint>
    </label>
  );
}