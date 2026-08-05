import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { UsageTone } from "../../../helpers/subscriptionShowHelpers";

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
    <div className={`rounded-2xl border p-5 ${toneClasses.container}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-slate-800">{label}</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
        </div>

        <p className={`text-sm font-extrabold ${toneClasses.text}`}>{value}</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white">
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
      container: "border-red-100 bg-red-50",
      bar: "bg-red-400",
      text: "text-red-600",
    };
  }

  if (tone === "warning") {
    return {
      container: "border-amber-100 bg-amber-50",
      bar: "bg-amber-400",
      text: "text-amber-600",
    };
  }

  if (tone === "unlimited") {
    return {
      container: "border-cyan-100 bg-cyan-50",
      bar: "bg-cyan-400",
      text: "text-cyan-600",
    };
  }

  return {
    container: "border-slate-100 bg-slate-50",
    bar: "bg-cyan-400",
    text: "text-slate-700",
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