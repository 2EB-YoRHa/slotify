import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

type IconBoxProps = {
  icon: LucideIcon;
};

export function IconBox({ icon: Icon }: IconBoxProps) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
      <Icon size={19} strokeWidth={2.4} />
    </div>
  );
}

export type SubscriptionStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type SubscriptionStatCardProps = {
  stat: SubscriptionStat;
  index: number;
};

export function SubscriptionStatCard({
  stat,
  index,
}: SubscriptionStatCardProps) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <IconBox icon={Icon} />
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

type UsageMeterProps = {
  label: string;
  value: string;
  percentage: number;
  helper: string;
};

export function UsageMeter({
  label,
  value,
  percentage,
  helper,
}: UsageMeterProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-700">{label}</p>

          <p className="mt-1 text-xs text-slate-400">{helper}</p>
        </div>

        <p className="text-sm font-extrabold text-slate-950">{value}</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-cyan-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}