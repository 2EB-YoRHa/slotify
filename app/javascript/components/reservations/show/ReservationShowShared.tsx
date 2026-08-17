import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { ReservationShowData } from "../../../types/reservationShowTypes";

export type SummaryCardProps = {
  index: number;
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper: string;
};

export function SummaryCard({
  index,
  icon: Icon,
  label,
  value,
  helper,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 dark:hover:border-slate-700 sm:p-5 xl:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5 text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <h2 className="mt-2 truncate text-xl font-bold text-slate-950 dark:text-slate-100">
            {value}
          </h2>
        </div>

        <IconBox icon={Icon} size="sm" />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {helper}
      </p>
    </motion.div>
  );
}

export type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

export function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-800/60 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Icon size={16} className="shrink-0" />

        <p className="truncate text-xs font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="wrap-break-word text-sm font-bold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export type SummaryRowProps = {
  label: string;
  value: string | number;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-3 last:border-0 dark:border-slate-700 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="wrap-break-word text-sm font-bold text-slate-950 dark:text-slate-100 sm:text-right">
        {value}
      </span>
    </div>
  );
}

type IconBoxProps = {
  icon: LucideIcon;
  size?: "sm" | "lg";
};

export function IconBox({ icon: Icon, size = "lg" }: IconBoxProps) {
  const boxClass =
    size === "sm"
      ? "h-10 w-10 rounded-xl"
      : "h-12 w-12 rounded-2xl sm:h-14 sm:w-14";

  const iconSize = size === "sm" ? 19 : 24;

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 ${boxClass}`}
    >
      <Icon size={iconSize} strokeWidth={2.4} />
    </div>
  );
}

export function canModifyReservation(reservation: ReservationShowData): boolean {
  if (typeof reservation.can_modify === "boolean") {
    return reservation.can_modify;
  }

  if (reservation.status === "cancelled") return false;

  return new Date(reservation.end_time).getTime() >= Date.now();
}

export function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatRate(value?: string | number | null): string {
  const amount = Number(value || 0);

  return `$${amount.toFixed(2)}/h`;
}

export function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}