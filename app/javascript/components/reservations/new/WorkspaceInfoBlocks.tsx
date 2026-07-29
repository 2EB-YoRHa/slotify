import {
  Building2,
  DollarSign,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Amenity } from "../../../types/amenity";
import type { Workspace } from "../../../types/workspace";
import { formatText } from "../../../utils/reservationFormUtils";

type InfoProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

export function Info({ icon: Icon, label, value }: InfoProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-slate-400">
        <Icon size={14} />

        <p className="text-[10px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="font-bold text-slate-800">{value}</p>
    </div>
  );
}

type AmenityChipsProps = {
  amenities: Amenity[];
  maxVisible: number;
};

export function AmenityChips({ amenities, maxVisible }: AmenityChipsProps) {
  if (amenities.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-400">
        No amenities assigned
      </div>
    );
  }

  const visibleAmenities = amenities.slice(0, maxVisible);
  const hiddenCount = amenities.length - visibleAmenities.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleAmenities.map((amenity) => (
        <span
          key={amenity.id}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
        >
          <Sparkles size={12} className="text-cyan-500" />
          {amenity.name}
        </span>
      ))}

      {hiddenCount > 0 && (
        <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600 ring-1 ring-cyan-100">
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
}

type SelectedWorkspaceSummaryProps = {
  workspace?: Workspace | null;
};

export function SelectedWorkspaceSummary({
  workspace,
}: SelectedWorkspaceSummaryProps) {
  if (!workspace) {
    return (
      <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
        Select a workspace to see its details and amenities here.
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-cyan-100 bg-cyan-50/50 p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500">
          <Building2 size={18} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <p className="font-bold text-slate-950">{workspace.name}</p>

          <p className="mt-1 text-xs font-bold uppercase text-slate-400">
            {formatText(workspace.workspace_type)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info icon={UsersRound} label="Capacity" value={workspace.capacity} />

        <Info
          icon={DollarSign}
          label="Rate"
          value={`$${workspace.hourly_rate || 0}/h`}
        />

        <Info icon={Building2} label="Floor" value={workspace.floor || "-"} />

        <Info icon={MapPin} label="Zone" value={workspace.zone || "-"} />
      </div>

      {workspace.location && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-500">
          <MapPin size={15} className="text-slate-400" />
          <span>{workspace.location}</span>
        </div>
      )}

      <div className="mt-4 border-t border-cyan-100 pt-4">
        <div className="mb-3 flex items-center gap-2 text-cyan-600">
          <Sparkles size={15} />

          <p className="text-[10px] font-bold uppercase tracking-wide">
            Amenities Included
          </p>
        </div>

        <AmenityChips amenities={workspace.amenities || []} maxVisible={8} />
      </div>
    </div>
  );
}