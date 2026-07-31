import { router } from "@inertiajs/react";
import { motion } from "motion/react";
import { CreditCard } from "lucide-react";
import type { SubscriptionUsage } from "../../../types/subscription";
import { SummaryRow, UsageMeter } from "./SubscriptionShowShared";
import {
  formatDate,
  usagePercentage,
} from "../../../helpers/subscriptionShowHelpers";

type CurrentPlanPanelProps = {
  currentPlanLabel: string;
  status: string;
  referenceDate?: string | null;
  workspaceUsage: string;
  memberUsage: string;
  usage?: SubscriptionUsage | null;
  canManageBilling: boolean;
};

export default function CurrentPlanPanel({
  currentPlanLabel,
  status,
  referenceDate = null,
  workspaceUsage,
  memberUsage,
  usage = null,
  canManageBilling,
}: CurrentPlanPanelProps) {
  function openBillingPortal() {
    if (!canManageBilling) return;

    router.post("/subscription/portal");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="col-span-2 rounded-2xl border border-cyan-100 bg-linear-to-br from-cyan-50 to-white p-8 shadow-sm"
    >
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-xl">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-white shadow-sm shadow-cyan-100">
            <CreditCard size={26} strokeWidth={2.4} />
          </div>

          <h2 className="text-4xl font-extrabold text-slate-950">
            {currentPlanLabel}
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            This plan controls workspace limits, member management, booking
            rules, billing access, and reporting features for the organization.
          </p>

          <button
            type="button"
            disabled={!canManageBilling}
            onClick={openBillingPortal}
            className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
              canManageBilling
                ? "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            <CreditCard size={17} />
            Manage Billing
          </button>
        </div>

        <div className="w-64 rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
          <SummaryRow label="Status" value={status} />

          <SummaryRow
            label="Reference Date"
            value={referenceDate ? formatDate(referenceDate) : "Not configured"}
          />

          <SummaryRow label="Workspaces" value={workspaceUsage} />

          <SummaryRow label="Members" value={memberUsage} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5">
        <UsageMeter
          label="Workspace Usage"
          value={workspaceUsage}
          percentage={usagePercentage(
            usage?.workspaces_used,
            usage?.workspace_limit,
          )}
          helper="Registered workspaces compared with plan limit"
        />

        <UsageMeter
          label="Member Usage"
          value={memberUsage}
          percentage={usagePercentage(
            usage?.member_slots_used,
            usage?.user_limit,
          )}
          helper="Users plus pending invitations compared with plan limit"
        />
      </div>
    </motion.div>
  );
}