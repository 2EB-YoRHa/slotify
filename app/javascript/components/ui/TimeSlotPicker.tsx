import { motion } from "motion/react";
import { CheckCircle2, Clock3 } from "lucide-react";

type TimeSlot = {
  label: string;
  start: string;
  end: string;
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
      <div className="mb-3 flex items-center justify-between">
        <span className="block text-sm font-bold text-slate-700">
          {label}
        </span>

        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-400">
          {options.length} options
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {options.map((slot) => {
          const selected = value === slot.label;

          return (
            <motion.button
              key={slot.label}
              type="button"
              whileHover={disabled ? undefined : { y: -1 }}
              whileTap={disabled ? undefined : { scale: 0.98 }}
              onClick={() => onChange(slot.label)}
              disabled={disabled}
              className={`relative rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-cyan-300 bg-cyan-50 ring-4 ring-cyan-50"
                  : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50"
              } ${
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-cyan-400 text-white"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Clock3 size={17} strokeWidth={2.4} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-slate-950">
                      {formatHour(slot.start)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-400">
                      to {formatHour(slot.end)}
                    </p>
                  </div>
                </div>

                {selected && (
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-cyan-500"
                    strokeWidth={2.4}
                  />
                )}
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