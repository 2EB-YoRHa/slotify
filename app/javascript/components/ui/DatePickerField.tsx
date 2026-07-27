import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type DatePickerFieldProps = {
  label: string;
  value: string;
  disabled?: boolean;
  min?: string;
  onChange: (value: string) => void;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DatePickerField({
  label,
  value,
  disabled = false,
  min,
  onChange,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    value ? parseDate(value) : new Date(),
  );

  const days = calendarDays(visibleMonth, value, min);

  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function selectDate(date: string, isDisabled: boolean) {
    if (disabled || isDisabled) return;

    onChange(date);
    setVisibleMonth(parseDate(date));
    setOpen(false);
  }

  function goToPreviousMonth() {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
    );
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <motion.button
        type="button"
        whileHover={disabled ? undefined : { y: -1 }}
        whileTap={disabled ? undefined : { scale: 0.99 }}
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left outline-none transition hover:border-cyan-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
            <CalendarDays size={17} strokeWidth={2.4} />
          </span>

          <span className="text-sm font-bold text-slate-800">
            {formatDisplayDate(value)}
          </span>
        </span>

        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {open ? "Close" : "Change"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <ChevronLeft size={17} />
              </button>

              <p className="text-sm font-extrabold text-slate-950">
                {monthLabel}
              </p>

              <button
                type="button"
                onClick={goToNextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-[10px] font-extrabold uppercase tracking-wide text-slate-400"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => selectDate(day.date, day.disabled)}
                  disabled={day.disabled}
                  className={`flex h-9 items-center justify-center rounded-xl text-sm font-bold transition ${
                    day.selected
                      ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100"
                      : day.currentMonth
                        ? "text-slate-700 hover:bg-cyan-50 hover:text-cyan-600"
                        : "text-slate-300 hover:bg-slate-50"
                  } ${
                    day.today && !day.selected ? "ring-1 ring-cyan-200" : ""
                  } ${
                    day.disabled
                      ? "cursor-not-allowed text-slate-200 hover:bg-transparent hover:text-slate-200"
                      : ""
                  }`}
                >
                  {day.dayNumber}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Selected
              </span>

              <span className="text-sm font-extrabold text-slate-900">
                {formatDisplayDate(value)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type CalendarDay = {
  date: string;
  dayNumber: number;
  currentMonth: boolean;
  selected: boolean;
  today: boolean;
  disabled: boolean;
};

function calendarDays(
  visibleMonth: Date,
  selectedDate: string,
  min?: string,
): CalendarDay[] {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

  const days: CalendarDay[] = [];

  for (let index = firstWeekDay - 1; index >= 0; index -= 1) {
    const date = new Date(year, month, -index);
    days.push(buildCalendarDay(date, selectedDate, min, false));
  }

  for (let day = 1; day <= daysInCurrentMonth; day += 1) {
    const date = new Date(year, month, day);
    days.push(buildCalendarDay(date, selectedDate, min, true));
  }

  while (days.length < 42) {
    const date = new Date(year, month, days.length - firstWeekDay + 1);
    days.push(buildCalendarDay(date, selectedDate, min, false));
  }

  return days;
}

function buildCalendarDay(
  date: Date,
  selectedDate: string,
  min: string | undefined,
  currentMonth: boolean,
): CalendarDay {
  const dateValue = formatDateValue(date);

  return {
    date: dateValue,
    dayNumber: date.getDate(),
    currentMonth,
    selected: dateValue === selectedDate,
    today: dateValue === formatDateValue(new Date()),
    disabled: Boolean(min && dateValue < min),
  };
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string): string {
  if (!value) return "Select date";

  return parseDate(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}