import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
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
  active: boolean;
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
    active: bookingRule.active ?? true,
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
        max_hours_per_reservation: Number(
          formData.max_hours_per_reservation
        ),
        min_notice_minutes: Number(formData.min_notice_minutes),
        cancellation_limit_hours: Number(formData.cancellation_limit_hours),
      },
    }));

    patch("/booking_rule");
  }

  function updateField(
    field: keyof BookingRuleFormData,
    value: string | number | boolean
  ) {
    setData(field, value as never);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">Booking Rules</h2>

        <p className="mt-2 text-sm text-slate-500">
          Configure the rules that control how members create and cancel
          reservations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Max Hours Per Reservation
          </span>

          <input
            type="number"
            min="1"
            value={data.max_hours_per_reservation}
            onChange={(event) =>
              updateField("max_hours_per_reservation", event.target.value)
            }
            className="input"
            disabled={processing}
            required
          />

          <FormError error={errors.max_hours_per_reservation} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Minimum Notice Minutes
          </span>

          <input
            type="number"
            min="0"
            value={data.min_notice_minutes}
            onChange={(event) =>
              updateField("min_notice_minutes", event.target.value)
            }
            className="input"
            disabled={processing}
            required
          />

          <FormError error={errors.min_notice_minutes} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Cancellation Limit Hours
          </span>

          <input
            type="number"
            min="0"
            value={data.cancellation_limit_hours}
            onChange={(event) =>
              updateField("cancellation_limit_hours", event.target.value)
            }
            className="input"
            disabled={processing}
            required
          />

          <FormError error={errors.cancellation_limit_hours} />
        </label>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="font-bold text-slate-950">Rule Status</p>

          <p className="mt-1 text-sm text-slate-500">
            Active rules are applied when creating or cancelling reservations.
          </p>

          <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={data.active}
              onChange={(event) =>
                updateField("active", event.target.checked)
              }
              disabled={processing}
              className="h-4 w-4 rounded border-slate-300 text-cyan-400"
            />

            Active
          </label>
        </div>

        <div className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-bold text-slate-950">
                Allow Weekend Bookings
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                When enabled, members can create reservations on Saturday and
                Sunday.
              </p>
            </div>

            <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={data.allow_weekend_bookings}
                onChange={(event) =>
                  updateField("allow_weekend_bookings", event.target.checked)
                }
                disabled={processing}
                className="h-4 w-4 rounded border-slate-300 text-cyan-400"
              />

              Enabled
            </label>
          </div>

          <FormError error={errors.allow_weekend_bookings} />
        </div>
      </div>

      {getBaseError(errors) && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {getBaseError(errors)}
        </div>
      )}

      <div className="mt-8 rounded-xl bg-cyan-50 p-5 text-sm leading-6 text-cyan-700">
        <p className="font-bold">Example</p>
        <p className="mt-1">
          If max hours is 2 and minimum notice is 60 minutes, members can only
          reserve up to 2 hours and must book at least 1 hour in advance.
        </p>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <a
          href="/booking_rule"
          className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
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

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>
): string | null {
  const error = errors.base;

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}