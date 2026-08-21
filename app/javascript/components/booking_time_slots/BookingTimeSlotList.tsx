import { router } from "@inertiajs/react";
import { useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Clock3,
  Edit,
  Power,
  Trash2,
} from "lucide-react";
import BookingTimeSlotForm from "./BookingTimeSlotForm";
import ConfirmDialog from "../ui/ConfirmDialog";
import type { BookingTimeSlot } from "../../types/bookingTimeSlot";

type BookingTimeSlotListProps = {
  bookingTimeSlots: BookingTimeSlot[];
};

export default function BookingTimeSlotList({
  bookingTimeSlots,
}: BookingTimeSlotListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dirtyEditing, setDirtyEditing] = useState(false);
  const [pendingEditId, setPendingEditId] = useState<number | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<BookingTimeSlot | null>(
    null,
  );
  const [processingDelete, setProcessingDelete] = useState(false);

  function requestEdit(slotId: number) {
    if (editingId && editingId !== slotId && dirtyEditing) {
      setPendingEditId(slotId);
      return;
    }

    setDirtyEditing(false);
    setEditingId(slotId);
  }

  function confirmSwitchEdit() {
    if (!pendingEditId) return;

    setEditingId(pendingEditId);
    setPendingEditId(null);
    setDirtyEditing(false);
  }

  function cancelEdit() {
    setDirtyEditing(false);
    setEditingId(null);
  }

  function confirmDeleteSlot() {
    if (!slotToDelete) return;

    setProcessingDelete(true);

    router.delete(`/booking_time_slots/${slotToDelete.id}`, {
      preserveScroll: true,
      onFinish: () => {
        setProcessingDelete(false);
        setSlotToDelete(null);
      },
    });
  }

  return (
    <>
      <div className="space-y-4">
        {bookingTimeSlots.map((slot) => {
          const editing = editingId === slot.id;

          return (
            <div
              key={slot.id}
              className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950/40 dark:shadow-slate-950/30 sm:p-5"
            >
              {editing ? (
                <BookingTimeSlotForm
                  bookingTimeSlot={slot}
                  onCancel={cancelEdit}
                  onDirtyChange={setDirtyEditing}
                />
              ) : (
                <TimeSlotCard
                  slot={slot}
                  onEdit={() => requestEdit(slot.id)}
                  onDelete={() => setSlotToDelete(slot)}
                />
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(pendingEditId)}
        title="Discard current time slot changes?"
        description="You are editing another time slot. If you continue, your unsaved changes will be lost."
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        danger
        onCancel={() => setPendingEditId(null)}
        onConfirm={confirmSwitchEdit}
      />

      <ConfirmDialog
        open={Boolean(slotToDelete)}
        title="Delete time slot?"
        description={`This will permanently delete ${
          slotToDelete?.name || "this time slot"
        }. Existing reservations will remain, but this schedule option will no longer be available.`}
        confirmText="Delete Time Slot"
        cancelText="Keep Time Slot"
        danger
        processing={processingDelete}
        onCancel={() => setSlotToDelete(null)}
        onConfirm={confirmDeleteSlot}
      />
    </>
  );
}

type TimeSlotCardProps = {
  slot: BookingTimeSlot;
  onEdit: () => void;
  onDelete: () => void;
};

function TimeSlotCard({ slot, onEdit, onDelete }: TimeSlotCardProps) {
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

  const duration = slot.duration_minutes || slot.end_minute - slot.start_minute;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <div className="mb-2 flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="min-w-0 wrap-break-word text-lg font-black text-slate-950 dark:text-slate-100 sm:text-xl">
              {slot.name}
            </h3>

            <span
              className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                slot.active
                  ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {slot.active ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="wrap-break-word text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
            {formatDays(slot.days || daysFromString(slot.days_of_week))}
          </p>
        </div>

        <div className="grid w-full shrink-0 grid-cols-3 gap-2 sm:w-auto sm:flex">
          <IconButton
            title="Edit time slot"
            disabled={processing}
            onClick={onEdit}
          >
            <Edit size={17} />
          </IconButton>

          <IconButton
            title={slot.active ? "Deactivate time slot" : "Activate time slot"}
            disabled={processing}
            onClick={toggleActive}
          >
            <Power size={17} />
          </IconButton>

          <IconButton
            title="Delete time slot"
            danger
            disabled={processing}
            onClick={onDelete}
          >
            <Trash2 size={17} />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric
          icon={Clock3}
          label="Start"
          value={slot.start_time_label || minuteToTime(slot.start_minute)}
        />

        <Metric
          icon={Clock3}
          label="End"
          value={slot.end_time_label || minuteToTime(slot.end_minute)}
        />

        <Metric
          icon={CalendarDays}
          label="Duration"
          value={formatDuration(duration)}
        />
      </div>
    </div>
  );
}

function IconButton({
  title,
  danger = false,
  disabled,
  onClick,
  children,
}: {
  title: string;
  danger?: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 w-full items-center justify-center rounded-xl border bg-white transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 sm:w-10 ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
          : "border-slate-200 text-slate-500 hover:border-cyan-200 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
      }`}
    >
      {children}
    </button>
  );
}

type MetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition-colors dark:border-slate-700 dark:bg-slate-800/60">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">
        <Icon size={15} className="shrink-0 text-cyan-500 dark:text-cyan-300" />
        <span className="truncate">{label}</span>
      </div>

      <p className="wrap-break-word text-lg font-black text-slate-950 dark:text-slate-100">
        {value}
      </p>
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
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  return days.map((day) => labels[day] || day).join(", ");
}

function minuteToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatDuration(value: number): string {
  if (value === 60) return "1 hour";

  if (value % 60 === 0) {
    return `${value / 60} hours`;
  }

  return `${value} min`;
}