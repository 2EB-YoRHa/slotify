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
};

export default function WorkspaceSummaryPanel({
  workspace,
  data,
  errors,
  isEditing,
  processing,
  onActiveChange,
}: WorkspaceSummaryPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">
          {isEditing ? "Update Workspace" : "Create Workspace"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Review the workspace configuration before saving.
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-5">
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
        <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
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

        <a
          href={isEditing && workspace?.id ? `/workspaces/${workspace.id}` : "/workspaces"}
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </a>
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
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}