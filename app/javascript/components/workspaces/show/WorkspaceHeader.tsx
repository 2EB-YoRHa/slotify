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
    <div className="mb-8 flex items-start justify-between">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            {isMember ? "Back to Browse Workspaces" : "Back to Workspaces"}
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-6 text-3xl font-bold text-slate-950"
        >
          {workspace.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-slate-500"
        >
          {isMember
            ? "Review capacity, amenities, pricing, and location before creating your reservation."
            : "Review workspace details, amenities, pricing, location, and reservation activity."}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex gap-3"
      >
        {workspace.active && (
          <Link
            href={`/reservations/new?workspace_id=${workspace.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
          >
            <CalendarPlus size={18} />
            Reserve
          </Link>
        )}

        {!isMember && (
          <>
            <Link
              href={`/workspaces/${workspace.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md"
            >
              <Edit3 size={18} />
              Edit
            </Link>

            <Link
              href={`/workspaces/${workspace.id}/delete`}
              className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-3 text-sm font-bold text-red-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md"
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