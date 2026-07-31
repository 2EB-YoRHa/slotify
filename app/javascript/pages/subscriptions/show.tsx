import AppLayout from "../../components/AppLayout";
import AvailablePlansSection from "../../components/subscriptions/show/AvailablePlansSection";
import CurrentPlanPanel from "../../components/subscriptions/show/CurrentPlanPanel";
import PlanOverviewPanel from "../../components/subscriptions/show/PlanOverviewPanel";
import SubscriptionHeader from "../../components/subscriptions/show/SubscriptionHeader";
import SubscriptionStatsGrid from "../../components/subscriptions/show/SubscriptionStatsGrid";
import BillingModeNotice from "../../components/subscriptions/show/BillingModeNotice";
import {
  formatPlan,
  formatStatus,
  formatUsage,
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

  const referenceDate =
    subscription?.expires_at ||
    subscription?.ends_at ||
    subscription?.started_at ||
    subscription?.starts_at ||
    null;

  const workspaceUsage = formatUsage(
    usage?.workspaces_used,
    usage?.workspace_limit,
  );

  const memberUsage = formatUsage(usage?.member_slots_used, usage?.user_limit);

  return (
    <AppLayout>
      <SubscriptionHeader />

      <SubscriptionStatsGrid
        currentPlanLabel={currentPlanLabel}
        status={status}
        workspaceUsage={workspaceUsage}
        memberUsage={memberUsage}
      />

      <BillingModeNotice
        currentPlanLabel={currentPlanLabel}
        canStartCheckout={can_start_checkout}
        canManageBilling={can_manage_billing}
      />

      <section className="mb-8 grid grid-cols-3 gap-8">
        <CurrentPlanPanel
          currentPlanLabel={currentPlanLabel}
          status={status}
          referenceDate={referenceDate}
          workspaceUsage={workspaceUsage}
          memberUsage={memberUsage}
          usage={usage}
          canManageBilling={can_manage_billing}
        />

        <PlanOverviewPanel
          currentPlanLabel={currentPlanLabel}
          status={status}
          referenceDate={referenceDate}
          workspaceUsage={workspaceUsage}
          memberUsage={memberUsage}
        />
      </section>

      <AvailablePlansSection
        plans={plans}
        currentPlan={currentPlan}
        canStartCheckout={can_start_checkout}
        canManageBilling={can_manage_billing}
      />
    </AppLayout>
  );
}
