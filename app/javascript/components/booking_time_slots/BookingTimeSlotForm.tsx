import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Clock3,
  LockKeyhole,
  Tag,
  ToggleLeft,
} from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import {
  FieldError,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";
import type {
  BookingTimeSlot,
  BookingTimeSlotFormData,
} from "../../types/bookingTimeSlot";

type BookingTimeSlotFormProps = {
  bookingTimeSlot?: BookingTimeSlot | null;
  disabled?: boolean;
  onCancel?: () => void;
};

const DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

const DEFAULT_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export default function BookingTimeSlotForm({
  bookingTimeSlot = null,
  disabled = false,
  onCancel,
}: BookingTimeSlotFormProps) {
  const isEditing = Boolean(bookingTimeSlot?.id);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const {
    data,
    setData,
    post,
    patch,
    processing,
    errors,
    reset,
    transform,
  } = useForm<BookingTimeSlotFormData>({
    name: bookingTimeSlot?.name || "",
    start_time: minuteToTime(bookingTimeSlot?.start_minute ?? 8 * 60),
    end_time: minuteToTime(bookingTimeSlot?.end_minute ?? 12 * 60),
    days_of_week:
      bookingTimeSlot?.days ||
      daysFromString(bookingTimeSlot?.days_of_week) ||
      DEFAULT_DAYS,
    active: bookingTimeSlot?.active ?? true,
  });

  const mergedErrors: Record<string, string | string[] | undefined> = {
    ...errors,
    ...clientErrors,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(data);
    setClientErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    transform((formData) => ({
      booking_time_slot: {
        name: formData.name.trim(),
        start_minute: timeToMinute(formData.start_time),
        end_minute: timeToMinute(formData.end_time),
        days_of_week: formData.days_of_week.join(","),
        active: formData.active,
      },
    }));

    if (isEditing && bookingTimeSlot?.id) {
      patch(`/booking_time_slots/${bookingTimeSlot.id}`, {
        preserveScroll: true,
        onSuccess: () => onCancel?.(),
      });
    } else {
      post("/booking_time_slots", {
        preserveScroll: true,
        onSuccess: () => {
          reset();

          setData({
            name: "",
            start_time: "08:00",
            end_time: "12:00",
            days_of_week: DEFAULT_DAYS,
            active: true,
          });
        },
      });
    }
  }

  function toggleDay(day: string) {
    clearError("days_of_week");

    const selected = data.days_of_week.includes(day);

    setData(
      "days_of_week",
      selected
        ? data.days_of_week.filter((item) => item !== day)
        : [...data.days_of_week, day],
    );
  }

  function clearError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`booking_time_slot.${field}`];

      return nextErrors;
    });
  }

  const locked = disabled || processing;

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      {disabled && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <LockKeyhole
              size={18}
              className="mt-0.5 shrink-0 text-amber-500"
            />

            <p className="text-sm font-semibold leading-6 text-amber-700">
              Upgrade to Pro to create and manage custom time slots.
            </p>
          </div>
        </div>
      )}

      <TextInput
        label="Time Slot Name"
        icon={Tag}
        value={data.name}
        placeholder="Enter time slot name"
        disabled={locked}
        error={fieldError(mergedErrors, "name")}
        required
        onChange={(value) => {
          clearError("name");
          setData("name", value);
        }}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="Start Time"
          icon={Clock3}
          type="time"
          value={data.start_time}
          disabled={locked}
          error={fieldError(mergedErrors, "start_time")}
          required
          onChange={(value) => {
            clearError("start_time");
            setData("start_time", value);
          }}
        />

        <TextInput
          label="End Time"
          icon={Clock3}
          type="time"
          value={data.end_time}
          disabled={locked}
          error={fieldError(mergedErrors, "end_time")}
          required
          onChange={(value) => {
            clearError("end_time");
            setData("end_time", value);
          }}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-950">
          Active Days
          <RequiredMark show />
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const selected = data.days_of_week.includes(day.value);

            return (
              <button
                key={day.value}
                type="button"
                disabled={locked}
                onClick={() => toggleDay(day.value)}
                className={`rounded-xl border px-3 py-3 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  selected
                    ? "border-cyan-200 bg-cyan-50 text-cyan-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-cyan-100 hover:text-cyan-600"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>

        <FieldError
          error={fieldError(mergedErrors, "days_of_week")}
          label="Active Days"
        />
      </div>

      <div
        className={`rounded-2xl border p-5 ${
          data.active
            ? "border-cyan-100 bg-cyan-50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
              <ToggleLeft size={19} strokeWidth={2.4} />
            </div>

            <div>
              <p className="font-bold text-slate-950">Time Slot Status</p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Inactive time slots stay saved but should not be used for new
                scheduling options.
              </p>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <span
              className={`text-sm font-bold ${
                data.active ? "text-cyan-600" : "text-slate-400"
              }`}
            >
              {data.active ? "Active" : "Inactive"}
            </span>

            <input
              type="checkbox"
              checked={data.active}
              disabled={locked}
              onChange={(event) => setData("active", event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-cyan-400"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {isEditing && (
          <button
            type="button"
            disabled={processing}
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}

        <LoadingButton
          type="submit"
          loading={processing}
          disabled={disabled}
          loadingText={isEditing ? "Saving..." : "Creating..."}
        >
          {isEditing ? "Save Time Slot" : "Create Time Slot"}
        </LoadingButton>
      </div>
    </form>
  );
}

type TextInputProps = {
  label: string;
  icon: typeof Tag;
  value: string;
  placeholder?: string;
  type?: string;
  disabled: boolean;
  required?: boolean;
  error?: string | string[];
  onChange: (value: string) => void;
};

function TextInput({
  label,
  icon: Icon,
  value,
  placeholder,
  type = "text",
  disabled,
  required = false,
  error,
  onChange,
}: TextInputProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-950">
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
          className={`${formInputClassName(hasError, false)} pl-11`}
        />
      </div>

      <FieldError error={error} label={label} />
    </label>
  );
}

function validateForm(data: BookingTimeSlotFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (data.name.trim().length < 3) {
    errors.name = "Time Slot Name must be at least 3 characters.";
  }

  if (!data.start_time) {
    errors.start_time = "Start Time is required.";
  }

  if (!data.end_time) {
    errors.end_time = "End Time is required.";
  }

  if (data.start_time && data.end_time) {
    const startMinute = timeToMinute(data.start_time);
    const endMinute = timeToMinute(data.end_time);

    if (endMinute <= startMinute) {
      errors.end_time = "End Time must be after Start Time.";
    }
  }

  if (data.days_of_week.length === 0) {
    errors.days_of_week = "Select at least one active day.";
  }

  return errors;
}

function timeToMinute(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

function minuteToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
}

function daysFromString(value?: string | null): string[] {
  if (!value) return DEFAULT_DAYS;

  const days = value
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean);

  return days.length > 0 ? days : DEFAULT_DAYS;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`booking_time_slot.${field}`];
}