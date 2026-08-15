import { motion } from "motion/react";
import { CheckCircle2, Clock3 } from "lucide-react";

type TimeSlot = {
  label: string;
  start: string;
  end: string;
  durationHours?: number;
  source?: "standard" | "custom";
};

type TimeSlotPickerProps = {
  label: string;
  value: string;
  options: TimeSlot[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function TimeSlotPicker({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: TimeSlotPickerProps) {
  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="block text-sm font-bold text-slate-700">
          {label}
        </span>

        {options.length > 0 && (
          <span className="w-fit rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-400">
            {options.length === 1
              ? "1 available slot"
              : `${options.length} available slots`}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {options.map((slot) => {
          const selected = value === slot.label;

          return (
            <motion.button
              key={slot.label}
              type="button"
              whileHover={disabled ? undefined : { y: -1 }}
              whileTap={disabled ? undefined : { scale: 0.985 }}
              onClick={() => onChange(slot.label)}
              disabled={disabled}
              className={`group rounded-2xl border px-4 py-4 text-left transition sm:px-5 ${
                selected
                  ? "border-cyan-300 bg-cyan-50 shadow-sm ring-4 ring-cyan-50"
                  : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50"
              } ${
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between gap-4 sm:gap-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <p className="text-xl font-black leading-none text-slate-950 sm:text-2xl">
                      {formatHour(slot.start)}
                    </p>

                    <p className="text-sm font-bold text-slate-400">
                      — {formatHour(slot.end)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {slot.durationHours && (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                        {formatDuration(slot.durationHours)}
                      </span>
                    )}

                    {slot.source === "custom" && (
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">
                        Custom slot
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${
                    selected
                      ? "bg-cyan-400 text-white"
                      : "bg-slate-50 text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-500"
                  }`}
                >
                  {selected ? (
                    <CheckCircle2 size={19} strokeWidth={2.4} />
                  ) : (
                    <Clock3 size={19} strokeWidth={2.4} />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function formatHour(value: string): string {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = minuteText || "00";
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}

function formatDuration(value: number): string {
  if (!Number.isFinite(value)) return "Flexible";

  if (value === 1) return "1 hour";

  return `${value} hours`;
}