import { Link } from "@inertiajs/react";
import { CalendarPlus } from "lucide-react";
import { formatText } from "../../../utils/reservationFormUtils";
import { SummaryRow } from "./WorkspaceShowShared";
import type { WorkspaceWithAmenities } from "../../../types/workspaceShowTypes";

type WorkspaceSummaryPanelProps = {
  workspace: WorkspaceWithAmenities;
  activeLabel: string;
  reservationCount: number;
  isMember: boolean;
};

export default function WorkspaceSummaryPanel({
  workspace,
  activeLabel,
  reservationCount,
  isMember,
}: WorkspaceSummaryPanelProps) {
  return (
    <>
      <WorkspaceSummary
        workspace={workspace}
        activeLabel={activeLabel}
        reservationCount={reservationCount}
        isMember={isMember}
      />

      {isMember && <MemberBookingPanel workspace={workspace} />}
    </>
  );
}

function WorkspaceSummary({
  workspace,
  activeLabel,
  reservationCount,
  isMember,
}: WorkspaceSummaryPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">
          Workspace Summary
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Quick overview of this workspace.
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-5">
        <SummaryRow label="Name" value={workspace.name} />

        <SummaryRow label="Type" value={formatText(workspace.workspace_type)} />

        <SummaryRow label="Capacity" value={workspace.capacity} />

        <SummaryRow
          label="Rate"
          value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}`}
        />

        <SummaryRow label="Status" value={activeLabel} />

        {!isMember && (
          <SummaryRow label="Reservations" value={reservationCount} />
        )}
      </div>
    </div>
  );
}

type MemberBookingPanelProps = {
  workspace: WorkspaceWithAmenities;
};

function MemberBookingPanel({ workspace }: MemberBookingPanelProps) {
  return (
    <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-8 shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-500">
        <CalendarPlus size={22} strokeWidth={2.4} />
      </div>

      <h2 className="text-xl font-bold text-slate-950">
        Ready to reserve this workspace?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Select this workspace, choose a valid date and time, and Slotify will
        check availability before creating your reservation.
      </p>

      {workspace.active ? (
        <Link
          href={`/reservations/new?workspace_id=${workspace.id}`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
        >
          <CalendarPlus size={18} />
          Reserve Workspace
        </Link>
      ) : (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-500">
          This workspace is currently inactive and cannot be reserved.
        </div>
      )}
    </div>
  );
}