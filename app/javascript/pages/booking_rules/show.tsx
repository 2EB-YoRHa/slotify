import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import type { BookingRule } from "../../types/bookingRule";

type BookingRuleShowProps = {
  booking_rule: BookingRule;
};

export default function BookingRuleShow({
  booking_rule,
}: BookingRuleShowProps) {
  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Booking Rules
          </h1>

          <p className="mt-1 text-slate-500">
            Configure how members can reserve workspaces in this organization.
          </p>
        </div>

        <Link
          href="/booking_rule/edit"
          className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
        >
          Edit Rules
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <section className="col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Current Reservation Rules
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These rules apply only to the current organization.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-5">
              <RuleCard
                title="Max Hours per Reservation"
                value={
                  booking_rule.max_hours_per_reservation
                    ? `${booking_rule.max_hours_per_reservation} hours`
                    : "Not configured"
                }
                description="Maximum duration allowed for a single reservation."
              />

              <RuleCard
                title="Minimum Notice"
                value={
                  booking_rule.min_notice_minutes
                    ? `${booking_rule.min_notice_minutes} minutes`
                    : "Not configured"
                }
                description="How much advance time is required before booking."
              />

              <RuleCard
                title="Cancellation Limit"
                value={
                  booking_rule.cancellation_limit_hours
                    ? `${booking_rule.cancellation_limit_hours} hours`
                    : "Not configured"
                }
                description="Minimum hours before start time to cancel a reservation."
              />

              <RuleCard
                title="Weekend Bookings"
                value={
                  booking_rule.allow_weekend_bookings
                    ? "Allowed"
                    : "Not allowed"
                }
                description="Controls whether members can book on Saturdays and Sundays."
              />
            </div>
          </div>

          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-6">
            <h2 className="font-bold text-slate-800">
              How these rules are used
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              When a member creates a reservation, Slotify checks the selected
              time against these rules. If the reservation does not meet the
              organization's policy, the system blocks it before saving.
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Rule Summary</h2>

            <div className="mt-5 space-y-4 text-sm">
              <SummaryItem
                label="Max duration"
                value={
                  booking_rule.max_hours_per_reservation
                    ? `${booking_rule.max_hours_per_reservation}h`
                    : "-"
                }
              />

              <SummaryItem
                label="Minimum notice"
                value={
                  booking_rule.min_notice_minutes
                    ? `${booking_rule.min_notice_minutes} min`
                    : "-"
                }
              />

              <SummaryItem
                label="Cancel limit"
                value={
                  booking_rule.cancellation_limit_hours
                    ? `${booking_rule.cancellation_limit_hours}h`
                    : "-"
                }
              />

              <SummaryItem
                label="Weekends"
                value={
                  booking_rule.allow_weekend_bookings ? "Allowed" : "Blocked"
                }
              />
            </div>
          </div>

          <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
            <h2 className="font-bold text-orange-700">Important</h2>

            <p className="mt-2 text-sm leading-6 text-orange-600">
              Changing these rules affects future reservation attempts. Existing
              reservations are not automatically modified.
            </p>
          </div>

          <Link
            href="/organization"
            className="block rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Organization
          </Link>
        </aside>
      </div>
    </AppLayout>
  );
}

type RuleCardProps = {
  title: string;
  value: string | number;
  description: string;
};

function RuleCard({ title, value, description }: RuleCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-sm font-bold text-slate-900">{title}</p>

      <p className="mt-3 text-2xl font-bold text-cyan-500">{value}</p>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
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