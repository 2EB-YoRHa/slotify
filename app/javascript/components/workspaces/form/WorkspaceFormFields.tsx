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
  error?: string | string[];
  onChange: (value: string) => void;
};

export function TextInput({
  icon: Icon,
  label,
  value,
  placeholder,
  disabled,
  error,
  onChange,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

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
  disabled: boolean;
  error?: string | string[];
  onChange: (value: string) => void;
};

export function NumberInput({
  icon: Icon,
  label,
  value,
  min,
  step,
  disabled,
  error,
  onChange,
}: NumberInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

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
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          disabled={disabled}
          required
        />
      </div>

      <FormError error={error} />
    </label>
  );
}

type SelectInputProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  disabled: boolean;
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
  error,
  options,
  onChange,
}: SelectInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          disabled={disabled}
          required
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

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
  error?: string | string[];
  onChange: (value: string) => void;
};

export function TextAreaInput({
  icon: Icon,
  label,
  value,
  placeholder,
  disabled,
  error,
  onChange,
}: TextAreaInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-4 text-slate-400"
        />

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-32 w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          placeholder={placeholder}
          disabled={disabled}
        />
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

type FormErrorProps = {
  error?: string | string[];
};

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}