import { motion } from "motion/react";
import {
  CalendarClock,
  Clock3,
  LockKeyhole,
  Plus,
} from "lucide-react";
import AppLayout from "../../components/AppLayout";
import BookingTimeSlotForm from "../../components/booking_time_slots/BookingTimeSlotForm";
import BookingTimeSlotList from "../../components/booking_time_slots/BookingTimeSlotList";
import type { BookingTimeSlot } from "../../types/bookingTimeSlot";

type BookingTimeSlotsIndexProps = {
  booking_time_slots?: BookingTimeSlot[];
  custom_time_slots_enabled?: boolean;
};

export default function BookingTimeSlotsIndex({
  booking_time_slots = [],
  custom_time_slots_enabled = false,
}: BookingTimeSlotsIndexProps) {
  return (
    <AppLayout>
      {!custom_time_slots_enabled && (
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 transition-colors dark:border-amber-500/20 dark:bg-amber-500/10 sm:mb-8 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-500 shadow-sm transition-colors dark:bg-amber-500/10 dark:text-amber-300 dark:shadow-none sm:h-12 sm:w-12">
              <LockKeyhole size={22} strokeWidth={2.4} />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-slate-950 dark:text-slate-100 sm:text-lg">
                Custom time slots are a Pro feature
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-amber-100/90">
                Upgrade to Pro to create custom booking schedules. Starter uses
                the standard reservation flow.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8"
        >
          <div className="mb-6 flex items-start gap-3 sm:mb-7 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 sm:h-14 sm:w-14">
              <Plus size={24} strokeWidth={2.4} />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
                Create Time Slot
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Add a reusable schedule block with start time, end time, active
                days, and availability status.
              </p>
            </div>
          </div>

          <BookingTimeSlotForm disabled={!custom_time_slots_enabled} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8"
        >
          <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 sm:h-14 sm:w-14">
                <CalendarClock size={24} strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
                  Saved Time Slots
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Manage the custom schedules available to this organization.
                </p>
              </div>
            </div>

            <div className="w-fit rounded-full bg-slate-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 transition-colors dark:bg-slate-800 dark:text-slate-400">
              {booking_time_slots.length} saved
            </div>
          </div>

          {booking_time_slots.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center transition-colors dark:border-slate-700 dark:bg-slate-800/60">
              <Clock3
                size={34}
                className="text-slate-300 dark:text-slate-500"
                strokeWidth={2.4}
              />

              <h3 className="mt-4 text-lg font-extrabold text-slate-950 dark:text-slate-100">
                No custom time slots yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Create your first time slot to start building a reusable booking
                schedule.
              </p>
            </div>
          ) : (
            <BookingTimeSlotList bookingTimeSlots={booking_time_slots} />
          )}
        </motion.div>
      </section>
    </AppLayout>
  );
}