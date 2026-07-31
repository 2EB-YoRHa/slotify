import { motion } from "motion/react";

export default function SubscriptionHeader() {
  return (
    <div className="mb-8">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-slate-950"
      >
        Subscription
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-2 max-w-2xl text-slate-500"
      >
        Review your organization plan, billing status, usage limits, and
        available subscription options.
      </motion.p>
    </div>
  );
}