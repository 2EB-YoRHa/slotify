import {
  AlertTriangle,
  Building2,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import DatePickerField from "../../ui/DatePickerField";
import TimeSlotPicker from "../../ui/TimeSlotPicker";
import { extractDate } from "../../../utils/reservationFormUtils";
import type { TimeSlot } from "../../../utils/timeSlots";
import type { Workspace } from "../../../types/workspace";

type EditReservationFormData = {
  workspace_id: number | string;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count: number | string;
  notes: string;
};

type EditReservationScheduleSectionProps = {
  workspaces: Workspace[];
  data: EditReservationFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  selectedSlot: TimeSlot;
  timeSlots: TimeSlot[];
  canManageStatus: boolean;
  hasCustomSlots: boolean;
  noCustomSlotsForSelectedDate: boolean;
  customTimeSlotViolation: boolean;
  onWorkspaceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateChange: (date: string) => void;
  onSlotChange: (slotLabel: string) => void;
};

export default function EditReservationScheduleSection({
  workspaces,
  data,
  errors,
  processing,
  selectedSlot,
  timeSlots,
  canManageStatus,
  hasCustomSlots,
  noCustomSlotsForSelectedDate,
  customTimeSlotViolation,
  onWorkspaceChange,
  onStatusChange,
  onDateChange,
  onSlotChange,
}: EditReservationScheduleSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 sm:h-14 sm:w-14">
          <CalendarDays size={24} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
            Reservation Schedule
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Update the workspace, date, time slot and reservation status. Custom
            time slots are enforced when they are active for the organization.
          </p>
        </div>
      </div>

      {(noCustomSlotsForSelectedDate || customTimeSlotViolation) && (
        <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 p-4 transition-colors dark:border-amber-500/20 dark:bg-amber-500/10">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-300"
            />

            <div className="text-sm leading-6 text-amber-700 dark:text-amber-200/90">
              {noCustomSlotsForSelectedDate && (
                <p className="font-semibold">
                  There are no active custom time slots available for this date.
                  Choose another date or create a matching time slot.
                </p>
              )}

              {customTimeSlotViolation && (
                <p className="font-semibold">
                  This reservation uses a time that is not part of the current
                  active custom time slots. Choose one of the available slots
                  before saving.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {hasCustomSlots && (
        <div className="mb-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-semibold leading-6 text-cyan-700 transition-colors dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300">
          Custom time slots are active. Confirmed reservations must match one of
          the configured slots for the selected date.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block min-w-0">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Workspace
          </span>

          <div className="relative">
            <Building2
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <select
              value={data.workspace_id}
              onChange={(event) => onWorkspaceChange(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
              disabled={processing}
              required
            >
              <option value="">Select workspace</option>

              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          <FormError error={errors.workspace_id} />
        </label>

        {canManageStatus && (
          <label className="block min-w-0">
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Status
            </span>

            <div className="relative">
              <ShieldCheck
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <select
                value={data.status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
                disabled={processing}
                required
              >
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <FormError error={errors.status} />
          </label>
        )}

        <div className="space-y-6 md:col-span-2">
          <div className="w-full max-w-xl">
            <DatePickerField
              label="Reservation Date"
              value={extractDate(data.start_time)}
              disabled={processing}
              onChange={onDateChange}
            />

            <FormError error={errors.start_time} />
          </div>

          <TimeSlotPicker
            label="Time Slot"
            value={selectedSlot.label}
            options={timeSlots}
            disabled={processing || noCustomSlotsForSelectedDate}
            onChange={onSlotChange}
          />

          <FormError error={errors.end_time} />
        </div>
      </div>
    </div>
  );
}

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return (
    <p className="mt-2 text-xs font-semibold text-red-500 dark:text-red-300">
      {message}
    </p>
  );
}