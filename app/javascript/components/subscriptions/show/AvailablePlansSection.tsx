import { motion } from "motion/react";
import { Building2, Zap } from "lucide-react";
import SubscriptionPlanCard from "../SubscriptionPlanCard";
import type { SubscriptionPlan } from "../../../types/subscription";

type AvailablePlansSectionProps = {
  plans: SubscriptionPlan[];
  currentPlan: string;
  canStartCheckout: boolean;
  canManageBilling: boolean;
};

export default function AvailablePlansSection({
  plans,
  currentPlan,
  canStartCheckout,
  canManageBilling,
}: AvailablePlansSectionProps) {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-500">
            Subscription Options
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Choose the operating level that fits your coworking
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Starter is focused on essential reservation control for smaller
            spaces. Pro is designed for growing operations that need scale,
            visibility, and stronger management tools.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.06 }}
            className="h-full"
          >
            <SubscriptionPlanCard
              planKey={plan.key}
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
              current={currentPlan === plan.key}
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