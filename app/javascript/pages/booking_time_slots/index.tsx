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
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 text-3xl font-extrabold text-slate-950"
        >
          Custom Time Slots
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-3xl text-slate-500"
        >
          Define reusable reservation blocks for your organization. These time
          slots help managers standardize booking schedules for members.
        </motion.p>
      </div>

      {!custom_time_slots_enabled && (
        <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-500 shadow-sm">
              <LockKeyhole size={22} strokeWidth={2.4} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-950">
                Custom time slots are a Pro feature
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upgrade to Pro to create custom booking schedules. Starter uses
                the standard reservation flow.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="grid grid-cols-[0.9fr_1.1fr] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
              <Plus size={26} strokeWidth={2.4} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Create Time Slot
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
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
          className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-7 flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <CalendarClock size={26} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Saved Time Slots
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Manage the custom schedules available to this organization.
                </p>
              </div>
            </div>

            <div className="rounded-full bg-slate-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
              {booking_time_slots.length} saved
            </div>
          </div>

          {booking_time_slots.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
              <Clock3 size={34} className="text-slate-300" strokeWidth={2.4} />

              <h3 className="mt-4 text-lg font-extrabold text-slate-950">
                No custom time slots yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
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
