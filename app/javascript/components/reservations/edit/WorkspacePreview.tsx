import { Building2 } from "lucide-react";
import type { Workspace } from "../../../types/workspace";

type WorkspacePreviewProps = {
  workspace?: Workspace | null;
};

export default function WorkspacePreview({ workspace }: WorkspacePreviewProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Building2 size={16} />

        <p className="truncate text-xs font-bold uppercase tracking-wide">
          Selected Workspace
        </p>
      </div>

      <p className="truncate font-bold text-slate-950">
        {workspace?.name || "Not selected"}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Capacity: {workspace?.capacity || "-"}
      </p>
    </div>
  );
}