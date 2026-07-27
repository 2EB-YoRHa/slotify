import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import BookingRuleForm from "../../components/booking_rules/BookingRuleForm";
import type { BookingRule } from "../../types/bookingRule";

type BookingRuleEditProps = {
  booking_rule?: BookingRule;
  bookingRule?: BookingRule;
  errors?: Partial<Record<string, string | string[]>>;
};

export default function BookingRuleEdit({
  booking_rule,
  bookingRule,
  errors = {},
}: BookingRuleEditProps) {
  const rule = booking_rule || bookingRule;

  if (!rule) {
    return (
      <AppLayout>
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
          Booking rules could not be loaded.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/booking_rule"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            Back to Booking Rules
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-6 text-3xl font-bold text-slate-950"
        >
          Change Booking Rules
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-slate-500"
        >
          Change reservation duration, advance notice, cancellation limits, and
          weekend booking availability.
        </motion.p>
      </div>

      <BookingRuleForm bookingRule={rule} errors={errors} />
    </AppLayout>
  );
}