import LoadingButton from "../../ui/LoadingButton";
import type { Workspace, WorkspaceFormData } from "../../../types/workspace";
import { formatText } from "../../../utils/reservationFormUtils";
import { formatMoney, getBaseError } from "../../../utils/workspaceFormUtils";
import { ToggleStatus } from "./WorkspaceFormFields";

type WorkspaceSummaryPanelProps = {
  workspace?: Workspace | null;
  data: WorkspaceFormData;
  errors: Record<string, string | string[] | undefined>;
  isEditing: boolean;
  processing: boolean;
  onActiveChange: (checked: boolean) => void;
  onCancel: () => void;
};

export default function WorkspaceSummaryPanel({
  data,
  errors,
  isEditing,
  processing,
  onActiveChange,
  onCancel,
}: WorkspaceSummaryPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
          {isEditing ? "Update Workspace" : "Create Workspace"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Review the workspace configuration before saving.
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 transition-colors dark:bg-slate-800/60 sm:p-5">
        <SummaryRow label="Name" value={data.name || "Not set"} />

        <SummaryRow label="Type" value={formatText(data.workspace_type)} />

        <SummaryRow label="Capacity" value={data.capacity || "-"} />

        <SummaryRow label="Rate" value={formatMoney(data.hourly_rate)} />

        <SummaryRow label="Amenities" value={data.amenity_ids.length} />

        <SummaryRow label="Status" value={data.active ? "Active" : "Inactive"} />
      </div>

      <ToggleStatus
        checked={data.active}
        disabled={processing}
        onChange={onActiveChange}
      />

      {getBaseError(errors) && (
        <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-600 transition-colors dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {getBaseError(errors)}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <LoadingButton
          type="submit"
          loading={processing}
          loadingText={isEditing ? "Saving..." : "Creating..."}
          className="w-full"
        >
          {isEditing ? "Save Changes" : "Create Workspace"}
        </LoadingButton>

        <button
          type="button"
          disabled={processing}
          onClick={onCancel}
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-3 last:border-0 dark:border-slate-700 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>

      <span className="wrap-break-word text-sm font-bold text-slate-950 dark:text-slate-100 sm:text-right">
        {value}
      </span>
    </div>
  );
}