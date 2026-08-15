import { Moon } from "lucide-react";

export default function DarkModeToggle() {
  return (
    <button
      type="button"
      aria-label="Dark mode"
      title="Dark mode"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
    >
      <Moon size={17} strokeWidth={2.4} />
    </button>
  );
}