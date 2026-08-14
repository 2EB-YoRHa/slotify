import { motion } from "motion/react";

export default function SubscriptionHeader() {
  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-slate-950">
          Subscription
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Review the current plan, billing date, usage, and available plan
          options.
        </p>
      </motion.div>
    </section>
  );
}