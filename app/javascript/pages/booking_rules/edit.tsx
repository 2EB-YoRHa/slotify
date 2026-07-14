import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import BookingRuleForm from "../../components/booking_rules/BookingRuleForm";
import type {
  BookingRule,
  BookingRuleErrors,
} from "../../types/bookingRule";

type BookingRuleEditProps = {
  booking_rule: BookingRule;
  errors?: BookingRuleErrors;
};

export default function BookingRuleEdit({
  booking_rule,
  errors = {},
}: BookingRuleEditProps) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-2 text-sm text-slate-400">
              <Link href="/booking_rule" className="hover:text-cyan-500">
                Booking Rules
              </Link>{" "}
              / Edit
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Edit Booking Rules
            </h1>

            <p className="mt-1 text-slate-500">
              Define how members can create and cancel reservations.
            </p>
          </div>

          <Link
            href="/booking_rule"
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Rules
          </Link>
        </div>

        <BookingRuleForm bookingRule={booking_rule} errors={errors} />
      </div>
    </AppLayout>
  );
}