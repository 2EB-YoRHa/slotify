import { Link } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import { Search, Sparkles } from "lucide-react";
import type { Workspace } from "../../../types/workspace";

export function WorkspaceStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute right-3 top-3 z-20 rounded-full px-3 py-1 text-xs font-extrabold shadow-sm ring-1 sm:right-4 sm:top-4 ${
        active
          ? "bg-green-50/95 text-green-600 ring-green-100 dark:bg-green-500/15 dark:text-green-300 dark:ring-green-500/20"
          : "bg-slate-100/95 text-slate-500 ring-slate-200 dark:bg-slate-800/95 dark:text-slate-400 dark:ring-slate-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function SmallInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3 transition-colors dark:bg-slate-800/60">
      <div className="mb-1 flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Icon size={14} className="shrink-0" />

        <p className="truncate text-[10px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export function AmenityPreview({
  workspace,
  compact = true,
}: {
  workspace: Workspace;
  compact?: boolean;
}) {
  const amenities = workspace.amenities || [];
  const visibleAmenities = amenities.slice(0, compact ? 4 : 6);

  return (
    <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
      <div className="mb-3 flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Sparkles size={15} className="shrink-0" />

        <p className="text-[10px] font-bold uppercase tracking-wide">
          Amenities
        </p>
      </div>

      {amenities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visibleAmenities.map((amenity) => (
            <span
              key={amenity.id}
              className="max-w-full truncate rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
            >
              {amenity.name}
            </span>
          ))}

          {amenities.length > visibleAmenities.length && (
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600 ring-1 ring-cyan-100 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20">
              +{amenities.length - visibleAmenities.length} more
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No amenities assigned.
        </p>
      )}
    </div>
  );
}

export function WorkspaceAction({
  href,
  icon: Icon,
  label,
  primary = false,
  danger = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:shadow-sm ${
        primary
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 hover:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950"
          : danger
            ? "border border-red-100 bg-white text-red-500 hover:bg-red-50 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function EmptyWorkspaceBrowser({
  title = "No workspaces found",
  description,
}: {
  title?: string;
  description: string;
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="px-5 py-10 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-500">
        <Search size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}