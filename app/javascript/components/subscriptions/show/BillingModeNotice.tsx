import { motion } from "motion/react";
import { CreditCard, Info, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
        tone="cyan"
        title="Billing is ready to start"
        description="This organization does not have an active Stripe subscription yet. Choosing a plan will open Stripe Checkout."
      />
    );
  }

  if (canManageBilling) {
    return (
      <NoticeContainer
        icon={ShieldCheck}
        tone="green"
        title="Billing is managed through Stripe"
        description={`This organization is currently on ${currentPlanLabel}. Plan changes, payment methods, invoices, and cancellations should be managed in the Stripe Customer Portal.`}
      />
    );
  }

  return (
    <NoticeContainer
      icon={Info}
      tone="amber"
      title="Billing portal is not available"
      description="Subscription information exists, but no Stripe customer is linked yet. Review the Stripe configuration before managing billing."
    />
  );
}

type NoticeContainerProps = {
  icon: LucideIcon;
  tone: "cyan" | "green" | "amber";
  title: string;
  description: string;
};

function NoticeContainer({
  icon: Icon,
  tone,
  title,
  description,
}: NoticeContainerProps) {
  const toneClass = {
    cyan: "border-cyan-100 bg-cyan-50 text-cyan-600",
    green: "border-green-100 bg-green-50 text-green-600",
    amber: "border-amber-100 bg-amber-50 text-amber-600",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`mb-8 rounded-2xl border p-5 shadow-sm ${toneClass}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
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