import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { CalendarClock, Settings2, ShieldCheck } from "lucide-react";
import {
  formatPlan,
  formatStatus,
  SidePanel,
  SummaryRow,
} from "./OrganizationShowShared";
import type {
  BookingRuleSummary,
  SubscriptionSummary,
} from "../../../types/organizationShowTypes";

type OrganizationSidePanelsProps = {
  bookingRule?: BookingRuleSummary | null;
  subscription?: SubscriptionSummary | null;
};

export default function OrganizationSidePanels({
  bookingRule = null,
  subscription = null,
}: OrganizationSidePanelsProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      className="space-y-6 xl:sticky xl:top-24 xl:self-start"
    >
      <BookingRulesPanel bookingRule={bookingRule} />
      <SubscriptionPanel subscription={subscription} />
    </motion.aside>
  );
}

function BookingRulesPanel({
  bookingRule,
}: {
  bookingRule?: BookingRuleSummary | null;
}) {
  return (
    <SidePanel title="Booking Rules" icon={CalendarClock}>
      <SummaryRow
        label="Max Hours"
        value={`${bookingRule?.max_hours_per_reservation || "-"} hours`}
      />

      <SummaryRow
        label="Min Notice"
        value={`${bookingRule?.min_notice_minutes || "-"} min`}
      />

      <SummaryRow
        label="Cancel Limit"
        value={`${bookingRule?.cancellation_limit_hours || "-"} hours`}
      />

      <SummaryRow
        label="Weekends"
        value={bookingRule?.allow_weekend_bookings ? "Allowed" : "Blocked"}
      />

      <Link
        href="/booking_rule"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
      >
        <Settings2 size={16} />
        View Rules
      </Link>
    </SidePanel>
  );
}

function SubscriptionPanel({
  subscription,
}: {
  subscription?: SubscriptionSummary | null;
}) {
  return (
    <SidePanel title="Subscription" icon={ShieldCheck}>
      <SummaryRow label="Plan" value={formatPlan(subscription)} />

      <SummaryRow label="Status" value={formatStatus(subscription?.status)} />

      <SummaryRow
        label="Renewal"
        value={
          subscription?.expires_at ||
          subscription?.ends_at ||
          "Not configured"
        }
      />

      <Link
        href="/subscription"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
      >
        <ShieldCheck size={16} />
        View Subscription
      </Link>
    </SidePanel>
  );
}