import { Power } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IconBoxProps = {
  icon: LucideIcon;
  large?: boolean;
};

export function IconBox({ icon: Icon, large = false }: IconBoxProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 ${
        large ? "h-14 w-14" : "h-10 w-10"
      }`}
    >
      <Icon size={large ? 26 : 19} strokeWidth={2.4} />
    </div>
  );
}

type TextInputProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  placeholder?: string;
  disabled: boolean;
  helper?: string;
  required?: boolean;
  maxLength?: number;
  error?: string | string[];
  onChange: (value: string) => void;
};

export function TextInput({
  icon: Icon,
  label,
  value,
  placeholder,
  disabled,
  helper,
  required = false,
  maxLength,
  error,
  onChange,
}: TextInputProps) {
  const hasError = Boolean(error);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={value}
          maxLength={maxLength}
          required={required}
          aria-invalid={hasError}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName(hasError)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <FormHelper helper={helper} />
      <FormError error={error} />
    </label>
  );
}

type NumberInputProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  min: string;
  step?: string;
  placeholder?: string;
  disabled: boolean;
  helper?: string;
  required?: boolean;
  error?: string | string[];
  onChange: (value: string) => void;
};

export function NumberInput({
  icon: Icon,
  label,
  value,
  min,
  step,
  placeholder,
  disabled,
  helper,
  required = true,
  error,
  onChange,
}: NumberInputProps) {
  const hasError = Boolean(error);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="number"
          min={min}
          step={step}
          value={value}
          required={required}
          aria-invalid={hasError}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName(hasError)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <FormHelper helper={helper} />
      <FormError error={error} />
    </label>
  );
}

type SelectInputProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  disabled: boolean;
  helper?: string;
  required?: boolean;
  error?: string | string[];
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
};

export function SelectInput({
  icon: Icon,
  label,
  value,
  disabled,
  helper,
  required = true,
  error,
  options,
  onChange,
}: SelectInputProps) {
  const hasError = Boolean(error);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={value}
          required={required}
          aria-invalid={hasError}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName(hasError)} appearance-none bg-white pr-10`}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <FormHelper helper={helper} />
      <FormError error={error} />
    </label>
  );
}

type TextAreaInputProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  placeholder?: string;
  disabled: boolean;
  helper?: string;
  required?: boolean;
  maxLength?: number;
  error?: string | string[];
  onChange: (value: string) => void;
};

export function TextAreaInput({
  icon: Icon,
  label,
  value,
  placeholder,
  disabled,
  helper,
  required = false,
  maxLength,
  error,
  onChange,
}: TextAreaInputProps) {
  const hasError = Boolean(error);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-4 text-slate-400"
        />

        <textarea
          value={value}
          required={required}
          maxLength={maxLength}
          aria-invalid={hasError}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName(hasError)} min-h-32 resize-y`}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <FormHelper helper={helper} />

        {maxLength && (
          <span className="text-xs font-semibold text-slate-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <FormError error={error} />
    </label>
  );
}

type ToggleStatusProps = {
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleStatus({
  checked,
  disabled,
  onChange,
}: ToggleStatusProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-start gap-3">
          <IconBox icon={Power} />

          <div>
            <p className="font-bold text-slate-950">Workspace Active</p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Active workspaces can be selected when creating reservations.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <span
            className={`text-sm font-bold ${
              checked ? "text-cyan-600" : "text-slate-400"
            }`}
          >
            {checked ? "Active" : "Inactive"}
          </span>

          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-slate-300 text-cyan-400"
          />
        </label>
      </div>
    </div>
  );
}

type FieldLabelProps = {
  label: string;
  required?: boolean;
};

function FieldLabel({ label, required = false }: FieldLabelProps) {
  return (
    <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
      {label}

      {required && <span className="text-red-500">*</span>}
    </span>
  );
}

type FormHelperProps = {
  helper?: string;
};

function FormHelper({ helper }: FormHelperProps) {
  if (!helper) return null;

  return <p className="mt-2 text-xs font-semibold text-slate-400">{helper}</p>;
}

type FormErrorProps = {
  error?: string | string[];
};

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function fieldClassName(hasError: boolean): string {
  const baseClass =
    "w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  if (hasError) {
    return `${baseClass} border border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-50`;
  }

  return `${baseClass} border border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50`;
}