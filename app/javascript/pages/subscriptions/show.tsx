import AppLayout from "../../components/AppLayout";
import AvailablePlansSection from "../../components/subscriptions/show/AvailablePlansSection";
import BillingModeNotice from "../../components/subscriptions/show/BillingModeNotice";
import CurrentPlanPanel from "../../components/subscriptions/show/CurrentPlanPanel";
import SubscriptionHeader from "../../components/subscriptions/show/SubscriptionHeader";
import {
  formatPlan,
  formatStatus,
  normalizePlan,
} from "../../helpers/subscriptionShowHelpers";
import type {
  Subscription,
  SubscriptionPlan,
  SubscriptionUsage,
} from "../../types/subscription";

type SubscriptionShowProps = {
  subscription?: Subscription | null;
  plans?: SubscriptionPlan[];
  usage?: SubscriptionUsage | null;
  can_manage_billing?: boolean;
  can_start_checkout?: boolean;
};

export default function SubscriptionShow({
  subscription = null,
  plans = [],
  usage = null,
  can_manage_billing = false,
  can_start_checkout = true,
}: SubscriptionShowProps) {
  const currentPlan = normalizePlan(
    subscription?.plan_name || subscription?.plan,
  );

  const currentPlanLabel = formatPlan(currentPlan);
  const status = formatStatus(subscription?.status);
  const activePlan = plans.find((plan) => plan.key === currentPlan);

  const referenceDate =
    subscription?.expires_at ||
    subscription?.ends_at ||
    subscription?.started_at ||
    subscription?.starts_at ||
    null;

  return (
    <AppLayout>
      <SubscriptionHeader
        currentPlanLabel={currentPlanLabel}
        status={status}
        activePlan={activePlan}
      />

      <BillingModeNotice
        currentPlanLabel={currentPlanLabel}
        canStartCheckout={can_start_checkout}
        canManageBilling={can_manage_billing}
      />

      <CurrentPlanPanel
        currentPlanLabel={currentPlanLabel}
        status={status}
        referenceDate={referenceDate}
        usage={usage}
        activePlan={activePlan}
        canManageBilling={can_manage_billing}
      />

      <AvailablePlansSection
        plans={plans}
        currentPlan={currentPlan}
        canStartCheckout={can_start_checkout}
        canManageBilling={can_manage_billing}
      />
    </AppLayout>
  );
}