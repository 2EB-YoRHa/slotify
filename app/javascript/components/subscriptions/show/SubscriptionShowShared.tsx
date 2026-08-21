import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { UsageTone } from "../../../helpers/subscriptionShowHelpers";

type IconBoxProps = {
  icon: LucideIcon;
};

export function IconBox({ icon: Icon }: IconBoxProps) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
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
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 dark:hover:border-slate-700 sm:p-5 xl:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5 text-slate-500 dark:text-slate-400">
            {stat.label}
          </p>

          <h2 className="mt-2 truncate text-2xl font-bold text-slate-950 dark:text-slate-100 sm:text-3xl">
            {stat.value}
          </h2>
        </div>

        <IconBox icon={Icon} />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {stat.helper}
      </p>
    </motion.div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-3 last:border-0 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="wrap-break-word text-sm font-bold text-slate-950 dark:text-slate-100 sm:text-right">
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
  tone?: UsageTone;
  overLimit?: boolean;
};

export function UsageMeter({
  label,
  value,
  percentage,
  helper,
  tone = "safe",
  overLimit = false,
}: UsageMeterProps) {
  const toneClasses = usageToneClasses(tone);

  return (
    <div
      className={`min-w-0 rounded-2xl border p-4 transition-colors sm:p-5 ${toneClasses.container}`}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {helper}
          </p>
        </div>

        <p className={`shrink-0 text-sm font-extrabold ${toneClasses.text}`}>
          {value}
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white dark:bg-slate-950/70">
        <div
          className={`h-full rounded-full transition-all ${toneClasses.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className={`mt-3 text-xs font-bold ${toneClasses.text}`}>
        {usageHelperText(tone, percentage, overLimit)}
      </p>
    </div>
  );
}

function usageToneClasses(tone: UsageTone) {
  if (tone === "danger") {
    return {
      container:
        "border-red-100 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
      bar: "bg-red-400",
      text: "text-red-600 dark:text-red-300",
    };
  }

  if (tone === "warning") {
    return {
      container:
        "border-amber-100 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
      bar: "bg-amber-400",
      text: "text-amber-600 dark:text-amber-300",
    };
  }

  if (tone === "unlimited") {
    return {
      container:
        "border-cyan-100 bg-cyan-50 dark:border-cyan-500/20 dark:bg-cyan-500/10",
      bar: "bg-cyan-400",
      text: "text-cyan-600 dark:text-cyan-300",
    };
  }

  return {
    container:
      "border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60",
    bar: "bg-cyan-400",
    text: "text-slate-700 dark:text-slate-200",
  };
}

function usageHelperText(
  tone: UsageTone,
  percentage: number,
  overLimit: boolean,
): string {
  if (tone === "unlimited") {
    return "Unlimited on this plan.";
  }

  if (overLimit) {
    return "This usage is above the current plan limit.";
  }

  if (tone === "danger") {
    return "Limit reached or almost reached.";
  }

  if (tone === "warning") {
    return "Getting close to the plan limit.";
  }

  return `${percentage}% of plan limit used.`;
}