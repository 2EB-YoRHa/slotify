import { Search, XCircle } from "lucide-react";
import type { ReactNode } from "react";

export function WorkspaceBrowserHeader({
  title,
  description,
  shownCount,
  totalCount,
}: {
  title: string;
  description: string;
  shownCount: number;
  totalCount: number;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="wrap-break-word text-lg font-extrabold text-slate-950 dark:text-slate-100 sm:text-xl">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="w-fit shrink-0 rounded-full bg-slate-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-500">
        {shownCount} of {totalCount} shown
      </div>
    </div>
  );
}

export function WorkspaceSearchInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full min-w-0 flex-1 sm:min-w-80">
      <Search
        size={17}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
      />
    </div>
  );
}

export function WorkspaceSelectFilter<T extends string>({
  value,
  onChange,
  children,
  className = "sm:w-44",
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  children: ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value as T)}
      className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20 ${className}`}
    >
      {children}
    </select>
  );
}

export function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
    >
      <XCircle size={16} className="shrink-0" />
      <span>Clear</span>
    </button>
  );
}