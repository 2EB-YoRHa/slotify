import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  Clock3,
  TimerReset,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import {
  FieldError,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";
import type { BookingRule } from "../../types/bookingRule";

type BookingRuleFormProps = {
  bookingRule: BookingRule;
  errors?: Partial<Record<string, string | string[]>>;
};

type BookingRuleFormData = {
  max_hours_per_reservation: number | string;
  min_notice_minutes: number | string;
  cancellation_limit_hours: number | string;
  allow_weekend_bookings: boolean;
};

export default function BookingRuleForm({
  bookingRule,
  errors: initialErrors = {},
}: BookingRuleFormProps) {
  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
    transform,
  } = useForm<BookingRuleFormData>({
    max_hours_per_reservation: bookingRule.max_hours_per_reservation ?? 2,
    min_notice_minutes: bookingRule.min_notice_minutes ?? 60,
    cancellation_limit_hours: bookingRule.cancellation_limit_hours ?? 24,
    allow_weekend_bookings: bookingRule.allow_weekend_bookings ?? false,
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    transform((formData) => ({
      booking_rule: {
        ...formData,
        max_hours_per_reservation: numericValue(
          formData.max_hours_per_reservation,
        ),
        min_notice_minutes: numericValue(formData.min_notice_minutes),
        cancellation_limit_hours: numericValue(
          formData.cancellation_limit_hours,
        ),
      },
    }));

    patch("/booking_rule");
  }

  function updateField<K extends keyof BookingRuleFormData>(
    field: K,
    value: BookingRuleFormData[K],
  ) {
    setData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <CalendarClock size={26} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-950">Booking Rules</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Configure how members can create, schedule, and cancel reservations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <RuleInput
          icon={Clock3}
          label="Maximum Reservation Duration"
          helper="Maximum number of hours allowed in a single reservation."
          value={data.max_hours_per_reservation}
          min="1"
          max="12"
          placeholder="Enter maximum hours"
          disabled={processing}
          error={fieldError(errors, "max_hours_per_reservation")}
          onChange={(value) => updateField("max_hours_per_reservation", value)}
        />

        <RuleInput
          icon={CalendarClock}
          label="Minimum Notice"
          helper="Minimum minutes required before a reservation can start."
          value={data.min_notice_minutes}
          min="0"
          max="10080"
          placeholder="Enter notice in minutes"
          disabled={processing}
          error={fieldError(errors, "min_notice_minutes")}
          onChange={(value) => updateField("min_notice_minutes", value)}
        />

        <RuleInput
          icon={TimerReset}
          label="Cancellation Limit"
          helper="Minimum hours required before a reservation can be cancelled."
          value={data.cancellation_limit_hours}
          min="0"
          max="168"
          placeholder="Enter limit in hours"
          disabled={processing}
          error={fieldError(errors, "cancellation_limit_hours")}
          onChange={(value) => updateField("cancellation_limit_hours", value)}
        />
      </div>

      <div className="mt-6">
        <ToggleCard
          icon={CalendarDays}
          title="Weekend Bookings"
          description="When enabled, members can create reservations on Saturday and Sunday."
          checked={data.allow_weekend_bookings}
          disabled={processing}
          label={data.allow_weekend_bookings ? "Allowed" : "Blocked"}
          onChange={(checked) => updateField("allow_weekend_bookings", checked)}
        />
      </div>

      {getBaseError(errors) && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {getBaseError(errors)}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-cyan-100 bg-cyan-50 p-5 text-sm leading-6 text-cyan-700">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-bold">Rule example</p>

            <p className="mt-1">
              With a maximum duration of 2 hours and a minimum notice of 60
              minutes, members can reserve up to 2 hours and must book at least
              1 hour before the reservation starts.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <a
          href="/booking_rule"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </a>

        <LoadingButton
          type="submit"
          loading={processing}
          loadingText="Saving..."
        >
          Save Rules
        </LoadingButton>
      </div>
    </form>
  );
}

type RuleInputProps = {
  icon: LucideIcon;
  label: string;
  helper: string;
  value: string | number;
  min: string;
  max: string;
  placeholder: string;
  disabled: boolean;
  error?: string | string[];
  onChange: (value: string) => void;
};

function RuleInput({
  icon: Icon,
  label,
  helper,
  value,
  min,
  max,
  placeholder,
  disabled,
  error,
  onChange,
}: RuleInputProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>

        <div>
          <FieldLabel label={label} required />

          <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
        </div>
      </div>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName(hasError)}
        disabled={disabled}
      />

      <div className="mt-2 flex justify-between gap-4 text-xs font-semibold text-slate-400">
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>

      <FormError error={error} label={label} />
    </label>
  );
}

type ToggleCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

function ToggleCard({
  icon: Icon,
  title,
  description,
  checked,
  disabled,
  label,
  onChange,
}: ToggleCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 transition ${
        checked ? "border-cyan-200 bg-cyan-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
            <Icon size={19} strokeWidth={2.4} />
          </div>

          <div>
            <p className="font-bold text-slate-950">{title}</p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <span
            className={`text-sm font-bold ${
              checked ? "text-cyan-600" : "text-slate-400"
            }`}
          >
            {label}
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
    <span className="flex items-center gap-1 font-bold text-slate-950">
      {label}
      <RequiredMark show={required} />
    </span>
  );
}

type FormErrorProps = {
  error?: string | string[];
  label?: string;
};

function FormError({ error, label }: FormErrorProps) {
  return <FieldError error={error} label={label} />;
}

function fieldClassName(hasError: boolean): string {
  return formInputClassName(hasError, false);
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`booking_rule.${field}`];
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>,
): string | null {
  const error = errors.base || errors["booking_rule.base"];

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}

function numericValue(value: string | number): string | number {
  if (value === "") return value;

  return Number(value);
}
