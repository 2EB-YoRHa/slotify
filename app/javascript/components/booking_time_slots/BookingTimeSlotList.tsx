import { router } from "@inertiajs/react";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Edit,
  Power,
  Trash2,
} from "lucide-react";
import BookingTimeSlotForm from "./BookingTimeSlotForm";
import type { BookingTimeSlot } from "../../types/bookingTimeSlot";

type BookingTimeSlotListProps = {
  bookingTimeSlots: BookingTimeSlot[];
};

export default function BookingTimeSlotList({
  bookingTimeSlots,
}: BookingTimeSlotListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {bookingTimeSlots.map((slot) => {
        const editing = editingId === slot.id;

        return (
          <div
            key={slot.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            {editing ? (
              <BookingTimeSlotForm
                bookingTimeSlot={slot}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <TimeSlotCard
                slot={slot}
                onEdit={() => setEditingId(slot.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

type TimeSlotCardProps = {
  slot: BookingTimeSlot;
  onEdit: () => void;
};

function TimeSlotCard({ slot, onEdit }: TimeSlotCardProps) {
  const [processing, setProcessing] = useState(false);

  function toggleActive() {
    setProcessing(true);

    router.patch(
      `/booking_time_slots/${slot.id}`,
      {
        booking_time_slot: {
          name: slot.name,
          start_minute: slot.start_minute,
          end_minute: slot.end_minute,
          days_of_week: slot.days_of_week,
          active: !slot.active,
        },
      },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      },
    );
  }

  function deleteSlot() {
    const confirmed = window.confirm(
      `Delete "${slot.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setProcessing(true);

    router.delete(`/booking_time_slots/${slot.id}`, {
      preserveScroll: true,
      onFinish: () => setProcessing(false),
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-lg font-extrabold text-slate-950">
              {slot.name}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
                slot.active
                  ? "bg-green-50 text-green-600"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {slot.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2">
              <Clock3 size={16} className="text-cyan-500" />
              {slot.start_time_label || minuteToTime(slot.start_minute)} -{" "}
              {slot.end_time_label || minuteToTime(slot.end_minute)}
            </span>

            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2">
              <CalendarDays size={16} className="text-cyan-500" />
              {formatDays(slot.days || daysFromString(slot.days_of_week))}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={processing}
            onClick={onEdit}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            title="Edit time slot"
          >
            <Edit size={17} />
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={toggleActive}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            title={slot.active ? "Deactivate time slot" : "Activate time slot"}
          >
            <Power size={17} />
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={deleteSlot}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            title="Delete time slot"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Metric
          label="Start"
          value={slot.start_time_label || minuteToTime(slot.start_minute)}
        />

        <Metric
          label="End"
          value={slot.end_time_label || minuteToTime(slot.end_minute)}
        />

        <Metric
          label="Duration"
          value={`${slot.duration_minutes || slot.end_minute - slot.start_minute} min`}
        />
      </div>
    </div>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl bg-white px-4 py-3">
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-700">{value}</p>
    </div>
  );
}

function daysFromString(value: string): string[] {
  return value
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean);
}

function formatDays(days: string[]): string {
  const labels: Record<string, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };

  return days.map((day) => labels[day] || day).join(", ");
}

function minuteToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}