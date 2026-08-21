import { motion } from "motion/react";
import { Building2, Zap } from "lucide-react";
import SubscriptionPlanCard from "../SubscriptionPlanCard";
import type { SubscriptionPlan } from "../../../types/subscription";

type AvailablePlansSectionProps = {
  plans: SubscriptionPlan[];
  currentPlan: string;
  billingRequired?: boolean;
  canStartCheckout: boolean;
  canManageBilling: boolean;
};

export default function AvailablePlansSection({
  plans,
  currentPlan,
  billingRequired = false,
  canStartCheckout,
  canManageBilling,
}: AvailablePlansSectionProps) {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p
            className={`text-sm font-extrabold uppercase tracking-wide ${
              billingRequired
                ? "text-amber-500 dark:text-amber-300"
                : "text-cyan-500 dark:text-cyan-300"
            }`}
          >
            {billingRequired ? "Available Plans" : "Plan Options"}
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
            {billingRequired
              ? "Choose a plan to activate the organization"
              : "Change or review the organization plan"}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {billingRequired
              ? "Select Starter or Pro to enable workspaces, reservations, members, and booking rules."
              : "Review the plans available for this organization. Upgrading to Pro keeps existing data and unlocks higher limits and advanced tools."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2 xl:gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.06 }}
            className="h-full min-w-0"
          >
            <SubscriptionPlanCard
              planKey={plan.key}
              currentPlan={currentPlan}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              bestFor={plan.best_for}
              badge={plan.badge}
              limits={plan.limits}
              highlights={plan.highlights}
              featureGroups={plan.feature_groups}
              features={plan.features}
              icon={plan.key === "pro" ? Zap : Building2}
              highlighted={plan.highlighted}
              current={!billingRequired && currentPlan === plan.key}
              billingRequired={billingRequired}
              checkoutReady={plan.checkout_ready}
              canStartCheckout={canStartCheckout}
              canManageBilling={canManageBilling}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}