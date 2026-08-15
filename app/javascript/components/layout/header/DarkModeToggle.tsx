import { Moon } from "lucide-react";

export default function DarkModeToggle() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm transition hover:bg-slate-50"
    >
      <Moon size={16} />
      Dark Mode
      <span className="relative h-5 w-9 rounded-full bg-slate-200">
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  );
}