import { motion } from "motion/react";
import { CreditCard, Sparkles } from "lucide-react";
import type { SubscriptionPlan } from "../../../types/subscription";

type SubscriptionHeaderProps = {
  currentPlanLabel: string;
  status: string;
  activePlan?: SubscriptionPlan;
};

export default function SubscriptionHeader({
  currentPlanLabel,
  status,
  activePlan,
}: SubscriptionHeaderProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-slate-50 p-8 shadow-sm">
      <div className="grid grid-cols-[1.3fr_0.7fr] gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-cyan-600 shadow-sm"
          >
            <Sparkles size={14} />
            Subscription Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950"
          >
            Manage the plan that powers your coworking operation.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 max-w-3xl text-base leading-7 text-slate-600"
          >
            Compare Starter and Pro, review current usage, and keep billing
            aligned with the size of your organization.
          </motion.p>

          {activePlan?.best_for && (
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
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-white shadow-sm shadow-cyan-100">
            <CreditCard size={26} strokeWidth={2.4} />
          </div>

          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Current Plan
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {currentPlanLabel}
          </h2>

          <div className="mt-4 inline-flex rounded-full bg-green-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-green-600">
            {status}
          </div>

          {activePlan?.description && (
            <p className="mt-5 text-sm leading-6 text-slate-500">
              {activePlan.description}
            </p>
          )}
        </motion.aside>
      </div>
    </section>
  );
}