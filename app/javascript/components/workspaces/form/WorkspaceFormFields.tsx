import { Power } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../../ui/FormFeedback";

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
  maxLength,
  error,
  onChange,
}: TextInputProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <FieldLabel label={label} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={value}
          maxLength={maxLength}
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
  error,
  onChange,
}: NumberInputProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <FieldLabel label={label} />

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
  error,
  options,
  onChange,
}: SelectInputProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <FieldLabel label={label} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={value}
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
  maxLength,
  error,
  onChange,
}: TextAreaInputProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <FieldLabel label={label} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-4 text-slate-400"
        />

        <textarea
          value={value}
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
      <RequiredMark show={required} />
    </span>
  );
}

type FormHelperProps = {
  helper?: string;
};

function FormHelper({ helper }: FormHelperProps) {
  return <FieldHint>{helper}</FieldHint>;
}

type FormErrorProps = {
  error?: string | string[];
};

export function FormError({ error }: FormErrorProps) {
  return <FieldError error={error} />;
}

function fieldClassName(hasError: boolean): string {
  return formInputClassName(hasError);
}
