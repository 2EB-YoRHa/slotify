import { motion } from "motion/react";
import { CreditCard, LockKeyhole } from "lucide-react";

type SubscriptionHeaderProps = {
  currentPlanLabel: string;
  status: string;
  billingRequired?: boolean;
};

export default function SubscriptionHeader({
  currentPlanLabel,
  status,
  billingRequired = false,
}: SubscriptionHeaderProps) {
  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-8"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950">
            Subscription
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Review the current plan, billing date, usage, and available plan
            options.
          </p>
        </div>

        <div
          className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-sm ${
            billingRequired
              ? "border-amber-100 bg-amber-50"
              : "border-cyan-100 bg-white"
          }`}
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              billingRequired
                ? "bg-white text-amber-500"
                : "bg-cyan-50 text-cyan-500"
            }`}
          >
            {billingRequired ? (
              <LockKeyhole size={21} strokeWidth={2.4} />
            ) : (
              <CreditCard size={21} strokeWidth={2.4} />
            )}
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
              Current Plan
            </p>

            <p className="text-base font-extrabold text-slate-950">
              {currentPlanLabel}
            </p>

            <p
              className={`mt-1 text-xs font-bold ${
                billingRequired ? "text-amber-600" : "text-green-600"
              }`}
            >
              {status}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}