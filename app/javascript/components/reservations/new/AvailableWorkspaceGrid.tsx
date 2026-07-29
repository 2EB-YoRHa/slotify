import { motion } from "motion/react";
import {
  Building2,
  DollarSign,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { Workspace } from "../../../types/workspace";
import { formatText } from "../../../utils/reservationFormUtils";
import { AmenityChips, Info } from "./WorkspaceInfoBlocks";

type AvailableWorkspaceGridProps = {
  workspaces: Workspace[];
  filteredWorkspaces: Workspace[];
  selectedWorkspaceId: number | string;
  unavailableWorkspaceIds: number[];
  availabilityChecked: boolean;
  processing: boolean;
  onSelectWorkspace: (workspaceId: number) => void;
};

export default function AvailableWorkspaceGrid({
  workspaces,
  filteredWorkspaces,
  selectedWorkspaceId,
  unavailableWorkspaceIds,
  availabilityChecked,
  processing,
  onSelectWorkspace,
}: AvailableWorkspaceGridProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Available Workspaces
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Showing {filteredWorkspaces.length} of {workspaces.length}{" "}
            workspaces.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            availabilityChecked
              ? "bg-green-50 text-green-600"
              : "bg-yellow-50 text-yellow-600"
          }`}
        >
          {availabilityChecked ? "Availability checked" : "Check required"}
        </span>
      </div>

      {filteredWorkspaces.length === 0 ? (
        <EmptyWorkspaceSearch />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredWorkspaces.map((workspace, index) => {
            const unavailable = unavailableWorkspaceIds.includes(workspace.id);
            const selected = Number(selectedWorkspaceId) === workspace.id;

            return (
              <WorkspaceOption
                key={workspace.id}
                workspace={workspace}
                index={index}
                selected={selected}
                unavailable={unavailable}
                disabled={processing || unavailable}
                availabilityChecked={availabilityChecked}
                onSelect={() => onSelectWorkspace(workspace.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyWorkspaceSearch() {
  return (
    <div className="rounded-xl bg-slate-50 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Building2 size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No workspaces found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Try changing the search text.
      </p>
    </div>
  );
}

type WorkspaceOptionProps = {
  workspace: Workspace;
  index: number;
  selected: boolean;
  unavailable: boolean;
  disabled: boolean;
  availabilityChecked: boolean;
  onSelect: () => void;
};

function WorkspaceOption({
  workspace,
  index,
  selected,
  unavailable,
  disabled,
  availabilityChecked,
  onSelect,
}: WorkspaceOptionProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      onClick={onSelect}
      disabled={disabled}
      className={`rounded-xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        selected
          ? "border-cyan-300 bg-cyan-50 ring-4 ring-cyan-50"
          : "border-slate-200 bg-white hover:border-cyan-100"
      } ${unavailable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
            <Building2 size={20} strokeWidth={2.4} />
          </div>

          <div>
            <h3 className="font-bold text-slate-950">{workspace.name}</h3>

            <p className="mt-1 text-xs font-bold uppercase text-slate-400">
              {formatText(workspace.workspace_type)}
            </p>
          </div>
        </div>

        <AvailabilityBadge
          checked={availabilityChecked}
          unavailable={unavailable}
        />
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
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <MapPin size={15} className="text-slate-400" />
          <span className="truncate">{workspace.location}</span>
        </div>
      )}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-3 flex items-center gap-2 text-slate-400">
          <Sparkles size={15} />

          <p className="text-[10px] font-bold uppercase tracking-wide">
            Amenities
          </p>
        </div>

        <AmenityChips amenities={workspace.amenities || []} maxVisible={4} />
      </div>
    </motion.button>
  );
}

function AvailabilityBadge({
  checked,
  unavailable,
}: {
  checked: boolean;
  unavailable: boolean;
}) {
  if (!checked) {
    return (
      <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-600">
        Check first
      </span>
    );
  }

  if (unavailable) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
        Unavailable
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
      Available
    </span>
  );
}