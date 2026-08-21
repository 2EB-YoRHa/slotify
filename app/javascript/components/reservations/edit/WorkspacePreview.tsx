import { Building2, DollarSign, MapPin, UsersRound } from "lucide-react";
import type { Workspace } from "../../../types/workspace";
import { formatText } from "../../../utils/reservationFormUtils";
import WorkspacePhoto from "../../workspaces/WorkspacePhoto";

type WorkspacePreviewProps = {
  workspace?: Workspace | null;
};

export default function WorkspacePreview({ workspace }: WorkspacePreviewProps) {
  if (!workspace) {
    return (
      <div className="min-w-0 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-800/60 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <Building2 size={16} />

          <p className="truncate text-xs font-bold uppercase tracking-wide">
            Selected Workspace
          </p>
        </div>

        <p className="font-bold text-slate-950 dark:text-slate-100">
          Not selected
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose a workspace to preview capacity and pricing.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-cyan-100 bg-cyan-50/50 transition-colors dark:border-cyan-500/20 dark:bg-cyan-500/10">
      <WorkspacePhoto
        name={workspace.name}
        photoUrl={workspace.photo_url}
        galleryPhotos={workspace.gallery_photos || []}
        fit="contain"
        position="object-center"
        className="h-40 w-full bg-slate-100 transition-colors dark:bg-slate-800"
      />

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
            <Building2 size={18} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-bold text-slate-950 dark:text-slate-100">
              {workspace.name}
            </p>

            <p className="mt-1 truncate text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
              {formatText(workspace.workspace_type)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PreviewInfo
            icon={UsersRound}
            label="Capacity"
            value={`${workspace.capacity} people`}
          />

          <PreviewInfo
            icon={DollarSign}
            label="Rate"
            value={`$${workspace.hourly_rate || 0}/h`}
          />
        </div>

        {workspace.location && (
          <div className="mt-4 flex min-w-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-500 transition-colors dark:bg-slate-900 dark:text-slate-400">
            <MapPin
              size={15}
              className="shrink-0 text-slate-400 dark:text-slate-500"
            />
            <span className="truncate">{workspace.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

type PreviewInfoProps = {
  icon: typeof UsersRound;
  label: string;
  value: string;
};

function PreviewInfo({ icon: Icon, label, value }: PreviewInfoProps) {
  return (
    <div className="min-w-0 rounded-lg bg-white p-3 transition-colors dark:bg-slate-900">
      <div className="mb-1 flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Icon size={14} />

        <p className="truncate text-[10px] font-bold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}