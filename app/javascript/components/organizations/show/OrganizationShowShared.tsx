import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { SubscriptionSummary } from "../../../types/organizationShowTypes";

export function IconBox({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
      <Icon size={19} strokeWidth={2.4} />
    </div>
  );
}

export type OrganizationStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type OrganizationStatCardProps = {
  stat: OrganizationStat;
  index: number;
};

export function OrganizationStatCard({
  stat,
  index,
}: OrganizationStatCardProps) {
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

      <p className="wrap-break-word text-sm font-bold text-slate-900">
        {value}
      </p>
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <IconBox icon={Icon} />

        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>

      <div>{children}</div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="break-words text-sm font-bold text-slate-950 sm:text-right">
        {value}
      </span>
    </div>
  );
}

export function formatPlan(subscription?: SubscriptionSummary | null): string {
  const value = subscription?.plan_name || subscription?.plan;

  if (!value) return "Free";

  return formatOrganizationText(value);
}

export function formatStatus(value?: string | null): string {
  if (!value) return "Not configured";

  return formatOrganizationText(value);
}

export function formatOrganizationText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}