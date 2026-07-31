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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-950">Available Plans</h2>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Compare plan levels and choose the option that best fits the
          organization.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.06 }}
          >
            <SubscriptionPlanCard
              planKey={plan.key}
              name={plan.name}
              price={plan.price}
              description={plan.description}
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