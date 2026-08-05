import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Images,
  LockKeyhole,
  ShieldCheck,
  TimerReset,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import {
  FieldError,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";
import {
  hasValidationErrors,
  validateIntegerRange,
  type ValidationErrors,
} from "../../utils/clientValidation";
import type {
  BookingRule,
  BookingRuleConstraints,
  BookingRuleFormData,
  PlanEntitlements,
} from "../../types/bookingRule";

type BookingRuleFormProps = {
  bookingRule: BookingRule;
  currentPlan?: string;
  planEntitlements?: PlanEntitlements;
  bookingRuleConstraints?: BookingRuleConstraints;
  errors?: Partial<Record<string, string | string[]>>;
};

const DEFAULT_ENTITLEMENTS: PlanEntitlements = {
  advanced_booking_rules: false,
  custom_time_slots: false,
  usage_insights: false,
  availability_command_center: false,
  multiple_workspace_photos: false,
  priority_support: false,
};

const DEFAULT_CONSTRAINTS: BookingRuleConstraints = {
  max_hours_per_reservation_min: 1,
  max_hours_per_reservation_max: 4,
  min_notice_minutes_min: 0,
  min_notice_minutes_max: 1_440,
  cancellation_limit_hours_min: 0,
  cancellation_limit_hours_max: 72,
};

export default function BookingRuleForm({
  bookingRule,
  currentPlan = "starter",
  planEntitlements = DEFAULT_ENTITLEMENTS,
  bookingRuleConstraints = DEFAULT_CONSTRAINTS,
  errors: initialErrors = {},
}: BookingRuleFormProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const isPro = currentPlan === "pro";

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
    ...clientErrors,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateBookingRuleForm(
      data,
      bookingRuleConstraints,
    );

    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

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
    clearClientError(String(field));

    setData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`booking_rule.${field}`];

      return nextErrors;
    });
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
            Configure how members can create, schedule, and cancel
            reservations. Your current plan controls the allowed rule ranges.
          </p>
        </div>
      </div>

      <PlanRulesBanner currentPlan={currentPlan} isPro={isPro} />

      <div className="grid grid-cols-3 gap-5">
        <RuleInput
          icon={Clock3}
          label="Maximum Reservation Duration"
          helper={
            isPro
              ? "Pro allows longer reservations for full-day operations."
              : "Starter allows standard reservations up to 4 hours."
          }
          value={data.max_hours_per_reservation}
          min={String(bookingRuleConstraints.max_hours_per_reservation_min)}
          max={String(bookingRuleConstraints.max_hours_per_reservation_max)}
          placeholder="Enter maximum hours"
          disabled={processing}
          error={fieldError(errors, "max_hours_per_reservation")}
          onChange={(value) => updateField("max_hours_per_reservation", value)}
        />

        <RuleInput
          icon={CalendarClock}
          label="Minimum Notice"
          helper={
            isPro
              ? "Pro allows notice rules up to 7 days."
              : "Starter allows notice rules up to 24 hours."
          }
          value={data.min_notice_minutes}
          min={String(bookingRuleConstraints.min_notice_minutes_min)}
          max={String(bookingRuleConstraints.min_notice_minutes_max)}
          placeholder="Enter notice in minutes"
          disabled={processing}
          error={fieldError(errors, "min_notice_minutes")}
          onChange={(value) => updateField("min_notice_minutes", value)}
        />

        <RuleInput
          icon={TimerReset}
          label="Cancellation Limit"
          helper={
            isPro
              ? "Pro allows cancellation policies up to 7 days."
              : "Starter allows cancellation policies up to 72 hours."
          }
          value={data.cancellation_limit_hours}
          min={String(bookingRuleConstraints.cancellation_limit_hours_min)}
          max={String(bookingRuleConstraints.cancellation_limit_hours_max)}
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

      <PlanEntitlementsGrid
        currentPlan={currentPlan}
        planEntitlements={planEntitlements}
      />

      {getBaseError(errors) && (
        <div className="mt-6">
          <FieldError error={getBaseError(errors)} label="Booking Rules" />
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

type PlanRulesBannerProps = {
  currentPlan: string;
  isPro: boolean;
};

function PlanRulesBanner({ currentPlan, isPro }: PlanRulesBannerProps) {
  return (
    <div
      className={`mb-8 rounded-2xl border p-5 ${
        isPro
          ? "border-cyan-100 bg-cyan-50"
          : "border-amber-100 bg-amber-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${
            isPro ? "text-cyan-500" : "text-amber-500"
          }`}
        >
          {isPro ? (
            <Zap size={21} strokeWidth={2.4} />
          ) : (
            <LockKeyhole size={21} strokeWidth={2.4} />
          )}
        </div>

        <div>
          <p
            className={`text-sm font-extrabold uppercase tracking-wide ${
              isPro ? "text-cyan-600" : "text-amber-600"
            }`}
          >
            {formatPlan(currentPlan)} Plan
          </p>

          <h3 className="mt-1 text-lg font-extrabold text-slate-950">
            {isPro
              ? "Advanced booking rules are unlocked"
              : "Standard booking rule limits are active"}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isPro
              ? "Pro allows longer reservations, wider notice windows, custom scheduling preparation, and premium operational controls."
              : "Starter keeps booking rules simple for smaller operations. Upgrade to Pro to unlock wider rule limits and advanced scheduling tools."}
          </p>
        </div>
      </div>
    </div>
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
        checked
          ? "border-cyan-200 bg-cyan-50"
          : "border-slate-200 bg-slate-50"
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

type PlanEntitlementsGridProps = {
  currentPlan: string;
  planEntitlements: PlanEntitlements;
};

function PlanEntitlementsGrid({
  currentPlan,
  planEntitlements,
}: PlanEntitlementsGridProps) {
  const isPro = currentPlan === "pro";

  const items = [
    {
      label: "Advanced Booking Rules",
      description: "Wider reservation, notice, and cancellation limits.",
      enabled: planEntitlements.advanced_booking_rules,
      icon: ShieldCheck,
    },
    {
      label: "Custom Time Slots",
      description: "Prepare custom booking schedules for your organization.",
      enabled: planEntitlements.custom_time_slots,
      icon: CalendarClock,
    },
    {
      label: "Usage Insights",
      description: "Unlock operational visibility for workspace usage.",
      enabled: planEntitlements.usage_insights,
      icon: BarChart3,
    },
    {
      label: "Availability Command Center",
      description: "Premium availability controls for busier coworking teams.",
      enabled: planEntitlements.availability_command_center,
      icon: Zap,
    },
    {
      label: "Multiple Workspace Photos",
      description: "Show richer workspace galleries instead of one photo.",
      enabled: planEntitlements.multiple_workspace_photos,
      icon: Images,
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Plan Capabilities
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {isPro
              ? "These premium capabilities are enabled for this organization."
              : "These premium capabilities are locked on Starter and can be unlocked with Pro."}
          </p>
        </div>

        {!isPro && (
          <a
            href="/subscription"
            className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-slate-800"
          >
            Upgrade to Pro
          </a>
        )}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {items.map((item) => (
          <CapabilityCard
            key={item.label}
            label={item.label}
            description={item.description}
            enabled={item.enabled}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}

type CapabilityCardProps = {
  label: string;
  description: string;
  enabled: boolean;
  icon: LucideIcon;
};

function CapabilityCard({
  label,
  description,
  enabled,
}: CapabilityCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        enabled
          ? "border-cyan-100 bg-cyan-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ${
          enabled ? "text-cyan-500" : "text-slate-400"
        }`}
      >
        {enabled ? (
          <CheckCircle2 size={17} strokeWidth={2.4} />
        ) : (
          <LockKeyhole size={17} strokeWidth={2.4} />
        )}
      </div>

      <p className="text-xs font-extrabold leading-5 text-slate-950">
        {label}
      </p>

      <p className="mt-1 text-[11px] leading-5 text-slate-500">
        {description}
      </p>
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

function validateBookingRuleForm(
  data: BookingRuleFormData,
  constraints: BookingRuleConstraints,
): ValidationErrors {
  const errors: ValidationErrors = {};

  const maxHoursError = validateIntegerRange(
    data.max_hours_per_reservation,
    "Maximum Reservation Duration",
    {
      min: constraints.max_hours_per_reservation_min,
      max: constraints.max_hours_per_reservation_max,
    },
  );

  if (maxHoursError) {
    errors.max_hours_per_reservation = maxHoursError;
  }

  const noticeError = validateIntegerRange(
    data.min_notice_minutes,
    "Minimum Notice",
    {
      min: constraints.min_notice_minutes_min,
      max: constraints.min_notice_minutes_max,
    },
  );

  if (noticeError) {
    errors.min_notice_minutes = noticeError;
  }

  const cancellationError = validateIntegerRange(
    data.cancellation_limit_hours,
    "Cancellation Limit",
    {
      min: constraints.cancellation_limit_hours_min,
      max: constraints.cancellation_limit_hours_max,
    },
  );

  if (cancellationError) {
    errors.cancellation_limit_hours = cancellationError;
  }

  return errors;
}

function formatPlan(plan: string): string {
  return plan
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}