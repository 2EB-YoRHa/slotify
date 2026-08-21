import {
  Building2,
  DollarSign,
  Layers3,
  MapPin,
  UsersRound,
} from "lucide-react";
import { formatText } from "../../../utils/reservationFormUtils";
import { IconBox, InfoCard, StatusBadge } from "./WorkspaceShowShared";
import type { WorkspaceWithAmenities } from "../../../types/workspaceShowTypes";

type WorkspaceInformationProps = {
  workspace: WorkspaceWithAmenities;
};

export default function WorkspaceInformation({
  workspace,
}: WorkspaceInformationProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <IconBox icon={Building2} />

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
              Workspace Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Main details used for reservations and availability.
            </p>
          </div>
        </div>

        <StatusBadge active={workspace.active} />
      </div>

      {workspace.description && (
        <div className="mb-6 rounded-xl border border-cyan-100 bg-cyan-50/50 p-4 transition-colors dark:border-cyan-500/20 dark:bg-cyan-500/10 sm:p-5">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {workspace.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <InfoCard icon={Building2} label="Name" value={workspace.name} />

        <InfoCard
          icon={Layers3}
          label="Type"
          value={formatText(workspace.workspace_type)}
        />

        <InfoCard
          icon={UsersRound}
          label="Capacity"
          value={workspace.capacity}
        />

        <InfoCard
          icon={DollarSign}
          label="Hourly Rate"
          value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}`}
        />

        <InfoCard
          icon={Building2}
          label="Floor"
          value={workspace.floor || "-"}
        />

        <InfoCard icon={MapPin} label="Zone" value={workspace.zone || "-"} />

        <div className="sm:col-span-2">
          <InfoCard
            icon={MapPin}
            label="Location"
            value={workspace.location || "-"}
          />
        </div>
      </div>
    </div>
  );
}