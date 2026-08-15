import { Link } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import { Search, Sparkles, XCircle } from "lucide-react";
import type { Workspace } from "../../../types/workspace";

export function WorkspaceStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute right-3 top-3 z-20 rounded-full px-3 py-1 text-xs font-extrabold shadow-sm ring-1 sm:right-4 sm:top-4 ${
        active
          ? "bg-green-50/95 text-green-600 ring-green-100"
          : "bg-slate-100/95 text-slate-500 ring-slate-200"
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
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-slate-400">
        <Icon size={14} />

        <p className="truncate text-[10px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-bold text-slate-800">{value}</p>
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
    <div className="mt-5 border-t border-slate-100 pt-4">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Sparkles size={15} />

        <p className="text-[10px] font-bold uppercase tracking-wide">
          Amenities
        </p>
      </div>

      {amenities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visibleAmenities.map((amenity) => (
            <span
              key={amenity.id}
              className="max-w-full truncate rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
            >
              {amenity.name}
            </span>
          ))}

          {amenities.length > visibleAmenities.length && (
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600 ring-1 ring-cyan-100">
              +{amenities.length - visibleAmenities.length} more
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No amenities assigned.</p>
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
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:shadow-sm ${
        primary
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 hover:bg-cyan-500"
          : danger
            ? "border border-red-100 bg-white text-red-500 hover:bg-red-50"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

export function EmptyWorkspaceBrowser({
  title = "No workspaces match your filters",
  description,
  hasFilters,
  onClear,
}: {
  title?: string;
  description: string;
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-5 py-10 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:h-16 sm:w-16">
        <Search size={28} strokeWidth={2.4} />
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-slate-950 sm:text-xl">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
        >
          <XCircle size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
}
