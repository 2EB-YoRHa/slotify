import {
  Building2,
  CheckCircle2,
  DollarSign,
  UsersRound,
  XCircle,
} from "lucide-react";
import { formatText } from "../../../utils/reservationFormUtils";
import { SummaryCard } from "./WorkspaceShowShared";
import type { WorkspaceWithAmenities } from "../../../types/workspaceShowTypes";

type WorkspaceStatsProps = {
  workspace: WorkspaceWithAmenities;
  activeLabel: string;
};

export default function WorkspaceStats({
  workspace,
  activeLabel,
}: WorkspaceStatsProps) {
  return (
    <section className="mb-8 grid grid-cols-4 gap-6">
      <SummaryCard
        index={0}
        icon={Building2}
        label="Type"
        value={formatText(workspace.workspace_type)}
        helper="Workspace category"
      />

      <SummaryCard
        index={1}
        icon={UsersRound}
        label="Capacity"
        value={workspace.capacity}
        helper="Maximum attendees"
      />

      <SummaryCard
        index={2}
        icon={DollarSign}
        label="Hourly Rate"
        value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}`}
        helper="Price per hour"
      />

      <SummaryCard
        index={3}
        icon={workspace.active ? CheckCircle2 : XCircle}
        label="Status"
        value={activeLabel}
        helper={workspace.active ? "Available to reserve" : "Not available"}
      />
    </section>
  );
}