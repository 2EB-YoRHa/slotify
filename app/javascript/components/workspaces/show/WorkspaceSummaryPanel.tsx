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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
          Workspace Summary
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Quick overview of this workspace.
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 transition-colors dark:bg-slate-800/60 sm:p-5">
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
    <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-5 shadow-sm transition-colors dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
        <CalendarPlus size={22} strokeWidth={2.4} />
      </div>

      <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">
        Ready to reserve this workspace?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Select this workspace, choose a valid date and time, and Slotify will
        check availability before creating your reservation.
      </p>

      {workspace.active ? (
        <Link
          href={`/reservations/new?workspace_id=${workspace.id}`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950"
        >
          <CalendarPlus size={18} />
          Reserve Workspace
        </Link>
      ) : (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-500 transition-colors dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          This workspace is currently inactive and cannot be reserved.
        </div>
      )}
    </div>
  );
}