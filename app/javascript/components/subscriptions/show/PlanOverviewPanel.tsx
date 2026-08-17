import { motion } from "motion/react";
import { CalendarClock } from "lucide-react";
import { IconBox, SummaryRow } from "./SubscriptionShowShared";
import { formatDate } from "../../../helpers/subscriptionShowHelpers";

type PlanOverviewPanelProps = {
  currentPlanLabel: string;
  status: string;
  workspaceUsage: string;
  memberUsage: string;
  referenceDate?: string | null;
};

export default function PlanOverviewPanel({
  currentPlanLabel,
  status,
  workspaceUsage,
  memberUsage,
  referenceDate = null,
}: PlanOverviewPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30"
    >
      <div className="mb-5 flex items-center gap-3">
        <IconBox icon={CalendarClock} />

        <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
          Plan Overview
        </h2>
      </div>

      <div className="rounded-xl bg-slate-50 p-5 transition-colors dark:bg-slate-800/60">
        <SummaryRow label="Plan" value={currentPlanLabel} />
        <SummaryRow label="Status" value={status} />
        <SummaryRow label="Workspaces" value={workspaceUsage} />
        <SummaryRow label="Members" value={memberUsage} />

        <SummaryRow
          label="Date"
          value={referenceDate ? formatDate(referenceDate) : "Not configured"}
        />
      </div>
    </motion.aside>
  );
}