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
    <div className="mb-5 flex items-start justify-between gap-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="rounded-full bg-slate-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-400">
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
    <div className="relative min-w-80 flex-1">
      <Search
        size={17}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
      />
    </div>
  );
}

export function WorkspaceSelectFilter<T extends string>({
  value,
  onChange,
  children,
  className = "w-44",
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
      className={`h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 ${className}`}
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
      className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
    >
      <XCircle size={16} />
      Clear
    </button>
  );
}