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
import WorkspacePhoto from "../../workspaces/WorkspacePhoto";

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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
            Available Workspaces
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredWorkspaces.length} of {workspaces.length}{" "}
            workspaces.
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
            availabilityChecked
              ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300"
              : "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300"
          }`}
        >
          {availabilityChecked ? "Availability checked" : "Check required"}
        </span>
      </div>

      {filteredWorkspaces.length === 0 ? (
        <EmptyWorkspaceSearch />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
    <div className="rounded-xl bg-slate-50 px-5 py-10 text-center transition-colors dark:bg-slate-800/60 sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-colors dark:bg-slate-900 dark:text-slate-500">
        <Building2 size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        No workspaces found
      </h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
      className={`overflow-hidden rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm sm:p-5 ${
        selected
          ? "border-cyan-300 bg-cyan-50 ring-4 ring-cyan-50 dark:border-cyan-500/50 dark:bg-cyan-500/10 dark:ring-cyan-500/15"
          : "border-slate-200 bg-white hover:border-cyan-100 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-cyan-500/40"
      } ${unavailable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <WorkspacePhoto
        name={workspace.name}
        photoUrl={workspace.photo_url}
        fit="contain"
        position="object-center"
        className="-mx-4 -mt-4 mb-4 h-44 rounded-t-xl bg-slate-100 transition-colors dark:bg-slate-800 sm:-mx-5 sm:-mt-5 sm:mb-5 sm:h-56"
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
            <Building2 size={20} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-950 dark:text-slate-100">
              {workspace.name}
            </h3>

            <p className="mt-1 truncate text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
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
        <div className="mt-5 flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 transition-colors dark:bg-slate-800/60 dark:text-slate-400">
          <MapPin
            size={15}
            className="shrink-0 text-slate-400 dark:text-slate-500"
          />
          <span className="truncate">{workspace.location}</span>
        </div>
      )}

      <div className="mt-5 border-t border-slate-100 pt-4 transition-colors dark:border-slate-800">
        <div className="mb-3 flex items-center gap-2 text-slate-400 dark:text-slate-500">
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
      <span className="w-fit rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300">
        Check first
      </span>
    );
  }

  if (unavailable) {
    return (
      <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-500/15 dark:text-red-300">
        Unavailable
      </span>
    );
  }

  return (
    <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 dark:bg-green-500/15 dark:text-green-300">
      Available
    </span>
  );
}