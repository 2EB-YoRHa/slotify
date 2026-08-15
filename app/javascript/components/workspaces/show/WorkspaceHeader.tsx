import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowLeft, CalendarPlus, Edit3, Trash2 } from "lucide-react";
import type { WorkspaceWithAmenities } from "../../../types/workspaceShowTypes";

type WorkspaceHeaderProps = {
  workspace: WorkspaceWithAmenities;
  isMember: boolean;
};

export default function WorkspaceHeader({
  workspace,
  isMember,
}: WorkspaceHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-5 sm:mb-8 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            <span className="truncate">
              {isMember ? "Back to Browse Workspaces" : "Back to Workspaces"}
            </span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 sm:mt-6 sm:text-3xl"
        >
          {workspace.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base"
        >
          {isMember
            ? "Review capacity, amenities, pricing, and location before creating your reservation."
            : "Review workspace details, amenities, pricing, location, and reservation activity."}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:flex xl:shrink-0"
      >
        {workspace.active && (
          <Link
            href={`/reservations/new?workspace_id=${workspace.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md xl:w-auto"
          >
            <CalendarPlus size={18} />
            Reserve
          </Link>
        )}

        {!isMember && (
          <>
            <Link
              href={`/workspaces/${workspace.id}/edit`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md xl:w-auto"
            >
              <Edit3 size={18} />
              Edit
            </Link>

            <Link
              href={`/workspaces/${workspace.id}/delete`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-3 text-sm font-bold text-red-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md xl:w-auto"
            >
              <Trash2 size={18} />
              Delete
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}