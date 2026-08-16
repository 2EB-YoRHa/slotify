import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type IconBoxProps = {
  icon: LucideIcon;
  large?: boolean;
};

export function IconBox({ icon: Icon, large = false }: IconBoxProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 ${
        large ? "h-12 w-12 sm:h-14 sm:w-14" : "h-10 w-10"
      }`}
    >
      <Icon size={large ? 24 : 19} strokeWidth={2.4} />
    </div>
  );
}

export type MemberStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type MemberStatCardProps = {
  stat: MemberStat;
  index: number;
};

export function MemberStatCard({ stat, index }: MemberStatCardProps) {
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

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

export function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon size={16} className="shrink-0" />
        <p className="truncate text-xs font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="wrap-break-word text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SidePanelProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
};

export function SidePanel({ title, icon: Icon, children }: SidePanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-5 flex min-w-0 items-center gap-3">
        <IconBox icon={Icon} />

        <h2 className="min-w-0 wrap-break-word text-lg font-bold text-slate-950">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="wrap-break-word text-sm font-bold text-slate-950 sm:text-right">
        {value}
      </span>
    </div>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
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

export function formatMemberText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}