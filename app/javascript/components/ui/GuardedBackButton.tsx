import { ArrowLeft } from "lucide-react";

type GuardedBackButtonProps = {
  children: string;
  disabled?: boolean;
  onClick: () => void;
};

export default function GuardedBackButton({
  children,
  disabled = false,
  onClick,
}: GuardedBackButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-10 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:shadow-slate-950/30 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
    >
      <ArrowLeft size={16} className="shrink-0" strokeWidth={2.4} />
      <span className="truncate">{children}</span>
    </button>
  );
}