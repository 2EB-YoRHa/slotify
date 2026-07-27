import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import {
  CalendarClock,
  CalendarDays,
  Clock3,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
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
    max_hours_per_reservation: bookingRule.max_hours_per_reservation || 2,
    min_notice_minutes: bookingRule.min_notice_minutes || 60,
    cancellation_limit_hours: bookingRule.cancellation_limit_hours || 2,
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
        max_hours_per_reservation: Number(formData.max_hours_per_reservation),
        min_notice_minutes: Number(formData.min_notice_minutes),
        cancellation_limit_hours: Number(formData.cancellation_limit_hours),
      },
    }));

    patch("/booking_rule");
  }

  function updateField(
    field: keyof BookingRuleFormData,
    value: string | number | boolean,
  ) {
    setData(field, value as never);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="grid grid-cols-3 gap-5">
        <RuleInput
          icon={Clock3}
          label="Max Hours Per Reservation"
          helper="Maximum duration allowed per booking."
          value={data.max_hours_per_reservation}
          min="1"
          disabled={processing}
          error={errors.max_hours_per_reservation}
          onChange={(value) => updateField("max_hours_per_reservation", value)}
        />

        <RuleInput
          icon={CalendarClock}
          label="Minimum Notice Minutes"
          helper="How early a member must book."
          value={data.min_notice_minutes}
          min="0"
          disabled={processing}
          error={errors.min_notice_minutes}
          onChange={(value) => updateField("min_notice_minutes", value)}
        />

        <RuleInput
          icon={TimerReset}
          label="Cancellation Limit Hours"
          helper="Latest allowed cancellation window."
          value={data.cancellation_limit_hours}
          min="0"
          disabled={processing}
          error={errors.cancellation_limit_hours}
          onChange={(value) => updateField("cancellation_limit_hours", value)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5">
        <ToggleCard
          icon={CalendarDays}
          title="Allow Weekend Bookings"
          description="When enabled, members can create reservations on Saturday and Sunday."
          checked={data.allow_weekend_bookings}
          disabled={processing}
          label={data.allow_weekend_bookings ? "Enabled" : "Disabled"}
          onChange={(checked) => updateField("allow_weekend_bookings", checked)}
        />

      </div>

      {getBaseError(errors) && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {getBaseError(errors)}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-cyan-100 bg-cyan-50 p-5 text-sm leading-6 text-cyan-700">
        <p className="font-bold">Example</p>
        <p className="mt-1">
          If max hours is 2 and minimum notice is 60 minutes, members can only
          reserve up to 2 hours and must book at least 1 hour in advance.
        </p>
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
  disabled,
  error,
  onChange,
}: RuleInputProps) {
  return (
    <label className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>

        <div>
          <p className="font-bold text-slate-950">{label}</p>
          <p className="text-xs text-slate-500">{helper}</p>
        </div>
      </div>

      <input
        type="number"
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
        disabled={disabled}
        required
      />

      <FormError error={error} />
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
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

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>,
): string | null {
  const error = errors.base;

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}
