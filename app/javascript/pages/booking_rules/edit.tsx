import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import BookingRuleForm from "../../components/booking_rules/BookingRuleForm";
import type {
  BookingRule,
  BookingRuleConstraints,
  PlanEntitlements,
} from "../../types/bookingRule";

type BookingRuleEditProps = {
  booking_rule?: BookingRule;
  bookingRule?: BookingRule;
  current_plan?: string;
  plan_entitlements?: PlanEntitlements;
  booking_rule_constraints?: BookingRuleConstraints;
  errors?: Partial<Record<string, string | string[]>>;
};

export default function BookingRuleEdit({
  booking_rule,
  bookingRule,
  current_plan = "starter",
  plan_entitlements,
  booking_rule_constraints,
  errors = {},
}: BookingRuleEditProps) {
  const rule = booking_rule || bookingRule;

  if (!rule || !plan_entitlements || !booking_rule_constraints) {
    return (
      <AppLayout>
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm font-semibold leading-6 text-red-600 sm:p-6">
          Booking rules could not be loaded.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/booking_rule"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            <span className="truncate">Back to Booking Rules</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 sm:mt-6 sm:text-3xl"
        >
          Change Booking Rules
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base"
        >
          Your current plan controls how flexible these booking rules can be.
          Pro unlocks wider limits and advanced scheduling controls.
        </motion.p>
      </div>

      <BookingRuleForm
        bookingRule={rule}
        currentPlan={current_plan}
        planEntitlements={plan_entitlements}
        bookingRuleConstraints={booking_rule_constraints}
        errors={errors}
      />
    </AppLayout>
  );
}