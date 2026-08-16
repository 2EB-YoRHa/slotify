import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label?: string;
  value: string;
  options: SelectOption[];
  icon: LucideIcon;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function SelectField({
  label,
  value,
  options,
  icon: Icon,
  disabled = false,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="block min-w-0">
      {label && (
        <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}

      <motion.div
        whileHover={disabled ? undefined : { y: -1 }}
        transition={{ duration: 0.16 }}
        className="group relative"
      >
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition group-focus-within:text-cyan-500 dark:text-slate-500 dark:group-focus-within:text-cyan-300"
        />

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm font-bold text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20 dark:disabled:bg-slate-900/60 dark:disabled:text-slate-600"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-cyan-500 dark:text-slate-500 dark:group-focus-within:text-cyan-300"
        />
      </motion.div>
    </label>
  );
}