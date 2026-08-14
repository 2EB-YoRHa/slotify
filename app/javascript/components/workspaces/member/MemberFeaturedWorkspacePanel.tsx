import { motion } from "motion/react";
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
import type { ReactNode } from "react";
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
      className="overflow-hidden rounded-xl border border-cyan-100 bg-white shadow-sm"
    >
      <div className="grid grid-cols-5">
        <WorkspacePhoto
          name={workspace.name}
          photoUrl={workspace.photo_url}
          galleryPhotos={workspace.gallery_photos || []}
          fit="contain"
          position="object-center"
          className="col-span-2 h-full min-h-80 border-0 bg-slate-100 p-3"
        />

        <div className="col-span-3 bg-linear-to-br from-cyan-50 to-white p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-cyan-600 shadow-sm">
                <Sparkles size={14} />
                Suggested workspace
              </div>

              <h2 className="text-3xl font-extrabold text-slate-950">
                {workspace.name}
              </h2>

              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-slate-400">
                {formatText(workspace.workspace_type)}
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
              Available
            </span>
          </div>

          {workspace.description && (
            <p className="mb-6 max-w-2xl text-sm leading-6 text-slate-600">
              {workspace.description}
            </p>
          )}

          <div className="mb-6 grid grid-cols-3 gap-4">
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

          <div className="mt-7 flex flex-wrap gap-3">
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
    <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-[10px] font-extrabold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-extrabold text-slate-950">{value}</p>
    </div>
  );
}