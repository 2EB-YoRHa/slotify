import { Link, useForm } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";
import type {
  BookingRule,
  BookingRuleErrors,
  BookingRuleFormData,
} from "../../types/bookingRule";

type BookingRuleFormProps = {
  bookingRule: BookingRule;
  errors?: BookingRuleErrors;
};

export default function BookingRuleForm({
  bookingRule,
  errors = {},
}: BookingRuleFormProps) {
  const { data, setData, patch, processing, transform } =
    useForm<BookingRuleFormData>({
      max_hours_per_reservation:
        bookingRule.max_hours_per_reservation || "",
      min_notice_minutes: bookingRule.min_notice_minutes || "",
      cancellation_limit_hours:
        bookingRule.cancellation_limit_hours || "",
      allow_weekend_bookings:
        bookingRule.allow_weekend_bookings || false,
    });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    transform((formData) => ({
      booking_rule: {
        max_hours_per_reservation: numberOrBlank(
          formData.max_hours_per_reservation
        ),
        min_notice_minutes: numberOrBlank(formData.min_notice_minutes),
        cancellation_limit_hours: numberOrBlank(
          formData.cancellation_limit_hours
        ),
        allow_weekend_bookings: formData.allow_weekend_bookings,
      },
    }));

    patch("/booking_rule");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
      <section className="col-span-2 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Reservation Limits
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <Field
              label="Max Hours per Reservation"
              error={errors.max_hours_per_reservation}
            >
              <input
                type="number"
                min="1"
                value={data.max_hours_per_reservation}
                onChange={(event) =>
                  setData("max_hours_per_reservation", event.target.value)
                }
                className="input"
                placeholder="Example: 4"
              />
            </Field>

            <Field
              label="Minimum Notice in Minutes"
              error={errors.min_notice_minutes}
            >
              <input
                type="number"
                min="0"
                value={data.min_notice_minutes}
                onChange={(event) =>
                  setData("min_notice_minutes", event.target.value)
                }
                className="input"
                placeholder="Example: 30"
              />
            </Field>

            <Field
              label="Cancellation Limit in Hours"
              error={errors.cancellation_limit_hours}
            >
              <input
                type="number"
                min="0"
                value={data.cancellation_limit_hours}
                onChange={(event) =>
                  setData("cancellation_limit_hours", event.target.value)
                }
                className="input"
                placeholder="Example: 24"
              />
            </Field>

            <div className="rounded-xl border border-slate-200 p-5">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={data.allow_weekend_bookings}
                  onChange={(event) =>
                    setData("allow_weekend_bookings", event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />

                <div>
                  <p className="font-bold text-slate-900">
                    Allow Weekend Bookings
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Members will be able to reserve workspaces on Saturdays and
                    Sundays.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-6">
          <h3 className="font-bold text-slate-800">Example</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            If the max duration is 4 hours and a user tries to reserve a
            workspace for 6 hours, the backend will reject the reservation.
          </p>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Preview</h2>

          <div className="mt-5 space-y-4 text-sm">
            <SummaryItem
              label="Max duration"
              value={
                data.max_hours_per_reservation
                  ? `${data.max_hours_per_reservation} hours`
                  : "-"
              }
            />

            <SummaryItem
              label="Minimum notice"
              value={
                data.min_notice_minutes
                  ? `${data.min_notice_minutes} minutes`
                  : "-"
              }
            />

            <SummaryItem
              label="Cancel limit"
              value={
                data.cancellation_limit_hours
                  ? `${data.cancellation_limit_hours} hours`
                  : "-"
              }
            />

            <SummaryItem
              label="Weekends"
              value={data.allow_weekend_bookings ? "Allowed" : "Blocked"}
            />
          </div>
        </div>

        <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
          <h2 className="font-bold text-orange-700">Policy Warning</h2>

          <p className="mt-2 text-sm leading-6 text-orange-600">
            These rules will affect future reservation attempts. Use values that
            make sense for the organization's operating schedule.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/booking_rule"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={processing}
            className="flex-1 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-60"
          >
            {processing ? "Saving..." : "Save Rules"}
          </button>
        </div>
      </aside>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string | string[];
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      {children}

      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </label>
  );
}

type SummaryItemProps = {
  label: string;
  value: string | number;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function numberOrBlank(value: string | number): string | number {
  if (value === "" || value === null || value === undefined) return "";

  return Number(value);
}