import { motion } from "motion/react";
import { CreditCard, Info, ShieldCheck } from "lucide-react";

type BillingModeNoticeProps = {
  currentPlanLabel: string;
  canStartCheckout: boolean;
  canManageBilling: boolean;
};

export default function BillingModeNotice({
  currentPlanLabel,
  canStartCheckout,
  canManageBilling,
}: BillingModeNoticeProps) {
  if (canStartCheckout) {
    return (
      <NoticeContainer
        icon={CreditCard}
        title="Ready to start billing"
        description="No active Stripe subscription was found for this organization. Selecting a plan will open Stripe Checkout and create the first subscription."
      />
    );
  }

  if (canManageBilling) {
    return (
      <NoticeContainer
        icon={ShieldCheck}
        title="Active Stripe subscription detected"
        description={`This organization is currently on the ${currentPlanLabel} plan. Plan changes, payment methods, and cancellations are managed from the Stripe Customer Portal to avoid duplicate subscriptions.`}
      />
    );
  }

  return (
    <NoticeContainer
      icon={Info}
      title="Billing portal unavailable"
      description="This organization has subscription information, but no Stripe customer is linked yet. Review the Stripe configuration before managing billing."
    />
  );
}

type NoticeContainerProps = {
  icon: typeof Info;
  title: string;
  description: string;
};

function NoticeContainer({
  icon: Icon,
  title,
  description,
}: NoticeContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.11 }}
      className="mb-8 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
          <Icon size={21} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-base font-extrabold text-slate-950">{title}</h2>

          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}