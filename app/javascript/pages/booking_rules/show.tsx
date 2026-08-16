import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  CalendarClock,
  CalendarDays,
  Clock3,
  Pencil,
  ShieldCheck,
  TimerReset,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import type { BookingRule } from "../../types/bookingRule";

type BookingRuleShowProps = {
  booking_rule?: BookingRule | null;
};

export default function BookingRuleShow({
  booking_rule = null,
}: BookingRuleShowProps) {
  const rulesActive = Boolean(booking_rule);
  const weekendsAllowed = booking_rule?.allow_weekend_bookings ?? false;

  const stats = [
    {
      label: "Max Duration",
      value: `${booking_rule?.max_hours_per_reservation || "-"} h`,
      helper: "Maximum booking length",
      icon: Clock3,
    },
    {
      label: "Min Notice",
      value: `${booking_rule?.min_notice_minutes || "-"} min`,
      helper: "Required advance time",
      icon: CalendarClock,
    },
    {
      label: "Cancel Limit",
      value: `${booking_rule?.cancellation_limit_hours || "-"} h`,
      helper: "Before booking starts",
      icon: TimerReset,
    },
  ];

  return (
    <AppLayout>
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mb-8 xl:grid-cols-3 xl:gap-6">
        {stats.map((stat, index) => (
          <RuleStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8 xl:col-span-2"
        >
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 sm:h-14 sm:w-14">
                <ShieldCheck size={24} strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  Current Reservation Policy
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  These settings control the reservation experience for members.
                </p>
              </div>
            </div>

            <StatusBadge active={rulesActive} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <RuleCard
              icon={Clock3}
              title="Maximum reservation duration"
              value={`${booking_rule?.max_hours_per_reservation || "-"} hours`}
              description="Members cannot create reservations longer than this limit."
            />

            <RuleCard
              icon={CalendarClock}
              title="Minimum notice"
              value={`${booking_rule?.min_notice_minutes || "-"} minutes`}
              description="Members must book at least this amount of time in advance."
            />

            <RuleCard
              icon={TimerReset}
              title="Cancellation limit"
              value={`${booking_rule?.cancellation_limit_hours || "-"} hours`}
              description="Members can cancel only before this configured time limit."
            />

            <RuleCard
              icon={CalendarDays}
              title="Weekend bookings"
              value={weekendsAllowed ? "Allowed" : "Blocked"}
              description={
                weekendsAllowed
                  ? "Members can reserve spaces on Saturday and Sunday."
                  : "Members cannot reserve spaces during weekends."
              }
            />
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6 xl:sticky xl:top-24 xl:self-start"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex min-w-0 items-center gap-3">
              <IconBox icon={rulesActive ? ToggleRight : ToggleLeft} />

              <h2 className="text-lg font-bold text-slate-950">
                Policy Status
              </h2>
            </div>

            <p className="text-sm leading-6 text-slate-500">
              {rulesActive
                ? "Booking rules are currently active and are applied when members create or cancel reservations."
                : "Booking rules are inactive. Reservation restrictions may not be applied until the rules are enabled."}
            </p>

            <Link
              href="/booking_rule/edit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
            >
              <Pencil size={16} />
              Change Rules
            </Link>
          </div>
        </motion.aside>
      </section>
    </AppLayout>
  );
}

type RuleStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type RuleStatCardProps = {
  stat: RuleStat;
  index: number;
};

function RuleStatCard({ stat, index }: RuleStatCardProps) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5 xl:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5 text-slate-500">
            {stat.label}
          </p>

          <h2 className="mt-2 truncate text-2xl font-bold text-slate-950 sm:text-3xl">
            {stat.value}
          </h2>
        </div>

        <IconBox icon={Icon} />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}

type RuleCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
};

function RuleCard({ icon: Icon, title, value, description }: RuleCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
      <div className="mb-4 flex min-w-0 items-start gap-3">
        <IconBox icon={Icon} />

        <div className="min-w-0">
          <p className="wrap-break-word font-bold text-slate-950">{title}</p>
          <p className="mt-1 wrap-break-word text-sm font-bold text-cyan-500">
            {value}
          </p>
        </div>
      </div>

      <p className="text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

type IconBoxProps = {
  icon: LucideIcon;
};

function IconBox({ icon: Icon }: IconBoxProps) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
      <Icon size={19} strokeWidth={2.4} />
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}