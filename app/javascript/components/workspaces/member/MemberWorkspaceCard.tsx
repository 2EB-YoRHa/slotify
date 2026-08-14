import { motion } from "motion/react";
import {
  Building2,
  CalendarPlus,
  DollarSign,
  Grid3X3,
  Layers3,
  MapPin,
  UsersRound,
} from "lucide-react";
import WorkspacePhoto from "../WorkspacePhoto";
import type { Workspace } from "../../../types/workspace";
import { formatText } from "../../../utils/reservationFormUtils";
import {
  AmenityPreview,
  SmallInfo,
  WorkspaceAction,
} from "../browser/WorkspaceBrowserShared";

export default function MemberWorkspaceCard({
  workspace,
  index,
}: {
  workspace: Workspace;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-cyan-100 hover:shadow-md"
    >
      <div className="relative">
        <WorkspacePhoto
          name={workspace.name}
          photoUrl={workspace.photo_url}
          galleryPhotos={workspace.gallery_photos || []}
          fit="contain"
          position="object-center"
          className="h-60 w-full border-0 bg-slate-100 p-2"
        />

        <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-green-600 shadow-sm">
          Available
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
            <Building2 size={20} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold text-slate-950">
              {workspace.name}
            </h3>

            <p className="mt-1 text-xs font-extrabold uppercase tracking-wide text-slate-400">
              {formatText(workspace.workspace_type)}
            </p>
          </div>
        </div>

        {workspace.description && (
          <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-500">
            {workspace.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <SmallInfo
            icon={UsersRound}
            label="Capacity"
            value={`${workspace.capacity} people`}
          />

          <SmallInfo
            icon={DollarSign}
            label="Rate"
            value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}/h`}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SmallInfo
            icon={Layers3}
            label="Floor"
            value={workspace.floor || "-"}
          />

          <SmallInfo
            icon={Grid3X3}
            label="Zone"
            value={workspace.zone || "-"}
          />
        </div>

        {workspace.location && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <MapPin size={15} className="shrink-0 text-slate-400" />

            <span className="truncate">{workspace.location}</span>
          </div>
        )}

        <AmenityPreview workspace={workspace} compact />

        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <WorkspaceAction
            href={`/workspaces/${workspace.id}`}
            icon={Building2}
            label="Details"
          />

          <WorkspaceAction
            href={`/reservations/new?workspace_id=${workspace.id}`}
            icon={CalendarPlus}
            label="Reserve"
            primary
          />
        </div>
      </div>
    </motion.article>
  );
}