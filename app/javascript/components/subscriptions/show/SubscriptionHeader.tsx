import { motion } from "motion/react";
import { CreditCard, LockKeyhole, Sparkles } from "lucide-react";
import type { SubscriptionPlan } from "../../../types/subscription";

type SubscriptionHeaderProps = {
  currentPlanLabel: string;
  status: string;
  activePlan?: SubscriptionPlan;
  billingRequired?: boolean;
};

export default function SubscriptionHeader({
  currentPlanLabel,
  status,
  activePlan,
  billingRequired = false,
}: SubscriptionHeaderProps) {
  return (
    <section
      className={`mb-8 overflow-hidden rounded-3xl border p-8 shadow-sm ${
        billingRequired
          ? "border-amber-100 bg-linear-to-br from-amber-50 via-white to-slate-50"
          : "border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-slate-50"
      }`}
    >
      <div className="grid grid-cols-[1.3fr_0.7fr] gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-5 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-sm ${
              billingRequired
                ? "border-amber-100 text-amber-600"
                : "border-cyan-100 text-cyan-600"
            }`}
          >
            {billingRequired ? (
              <LockKeyhole size={14} />
            ) : (
              <Sparkles size={14} />
            )}
            Subscription Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950"
          >
            {billingRequired
              ? "Activate your organization with the right plan."
              : "Manage the plan that powers your coworking operation."}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 max-w-3xl text-base leading-7 text-slate-600"
          >
            {billingRequired
              ? "Choose Starter for essential reservation operations or Pro for advanced control, stronger visibility, and unlimited growth."
              : "Review your current subscription, monitor usage, manage billing, and compare available plan options."}
          </motion.p>

          {!billingRequired && activePlan?.best_for && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-6 max-w-3xl rounded-2xl border border-white bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-sm"
            >
              <span className="font-extrabold text-slate-950">
                Current fit:{" "}
              </span>
              {activePlan.best_for}
            </motion.div>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="rounded-3xl border border-white bg-white/85 p-6 shadow-sm"
        >
          <div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm ${
              billingRequired
                ? "bg-amber-400 shadow-amber-100"
                : "bg-cyan-400 shadow-cyan-100"
            }`}
          >
            {billingRequired ? (
              <LockKeyhole size={26} strokeWidth={2.4} />
            ) : (
              <CreditCard size={26} strokeWidth={2.4} />
            )}
          </div>

          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            {billingRequired ? "Organization Access" : "Current Plan"}
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {currentPlanLabel}
          </h2>

          <div
            className={`mt-4 inline-flex rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide ${
              billingRequired
                ? "bg-amber-50 text-amber-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {status}
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            {billingRequired
              ? "Select a plan below to unlock dashboards, workspaces, reservations, members, and booking rules."
              : activePlan?.description ||
                "Your subscription controls plan limits and billing access."}
          </p>
        </motion.aside>
      </div>
    </section>
  );
}