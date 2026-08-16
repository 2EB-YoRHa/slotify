import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarPlus,
  DollarSign,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import WorkspacePhoto from "../WorkspacePhoto";
import type { Workspace } from "../../../types/workspace";
import { formatText } from "../../../utils/reservationFormUtils";
import {
  AmenityPreview,
  WorkspaceAction,
} from "../browser/WorkspaceBrowserShared";

export default function MemberFeaturedWorkspacePanel({
  workspace,
}: {
  workspace: Workspace;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="overflow-hidden rounded-xl border border-cyan-100 bg-white shadow-sm transition-colors dark:border-cyan-500/20 dark:bg-slate-900 dark:shadow-slate-950/30"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <WorkspacePhoto
          name={workspace.name}
          photoUrl={workspace.photo_url}
          galleryPhotos={workspace.gallery_photos || []}
          fit="contain"
          position="object-center"
          className="h-56 w-full border-0 bg-slate-100 p-3 dark:bg-slate-800 sm:h-72 lg:col-span-2 lg:h-full lg:min-h-80"
        />

        <div className="bg-linear-to-br from-cyan-50 to-white p-5 transition-colors dark:from-cyan-500/10 dark:to-slate-900 sm:p-8 lg:col-span-3">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-cyan-600 shadow-sm transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                <Sparkles size={14} />
                <span className="truncate">Suggested workspace</span>
              </div>

              <h2 className="wrap-break-word text-2xl font-extrabold text-slate-950 dark:text-slate-100 sm:text-3xl">
                {workspace.name}
              </h2>

              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {formatText(workspace.workspace_type)}
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 transition-colors dark:bg-green-500/15 dark:text-green-300">
              Available
            </span>
          </div>

          {workspace.description && (
            <p className="mb-6 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {workspace.description}
            </p>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FeaturedInfo
              icon={<UsersRound size={15} />}
              label="Capacity"
              value={`${workspace.capacity} people`}
            />

            <FeaturedInfo
              icon={<DollarSign size={15} />}
              label="Rate"
              value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}/h`}
            />

            <FeaturedInfo
              icon={<MapPin size={15} />}
              label="Location"
              value={workspace.location || "Not provided"}
            />
          </div>

          <AmenityPreview workspace={workspace} compact={false} />

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <WorkspaceAction
              href={`/reservations/new?workspace_id=${workspace.id}`}
              icon={CalendarPlus}
              label="Reserve Workspace"
              primary
            />

            <WorkspaceAction
              href={`/workspaces/${workspace.id}`}
              icon={ArrowRight}
              label="View Details"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function FeaturedInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white bg-white/80 p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-950/50 dark:shadow-none">
      <div className="mb-2 flex items-center gap-2 text-slate-400 dark:text-slate-500">
        {icon}

        <p className="truncate text-[10px] font-extrabold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-extrabold text-slate-950 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}