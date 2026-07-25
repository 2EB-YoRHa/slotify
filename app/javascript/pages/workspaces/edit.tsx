import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowLeft, Building2, Pencil } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import WorkspaceForm from "../../components/workspaces/WorkspaceForm";
import type { Amenity } from "../../types/amenity";
import type { Workspace } from "../../types/workspace";

type EditWorkspaceProps = {
  workspace: Workspace;
  amenities?: Amenity[];
  selected_amenity_ids?: number[];
  selectedAmenityIds?: number[];
  errors?: Partial<Record<string, string | string[]>>;
};

export default function EditWorkspace({
  workspace,
  amenities = [],
  selected_amenity_ids = [],
  selectedAmenityIds = [],
  errors = {},
}: EditWorkspaceProps) {
  const selectedIds =
    selectedAmenityIds.length > 0 ? selectedAmenityIds : selected_amenity_ids;

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href={`/workspaces/${workspace.id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
            >
              <ArrowLeft size={16} />
              Back to Workspace
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mt-6 text-sm font-bold uppercase tracking-wide text-cyan-500"
          >
            Workspace Management
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-2 text-3xl font-bold text-slate-950"
          >
            Edit Workspace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-1 text-slate-500"
          >
            Update workspace information, amenities, pricing and availability.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500"
        >
          <Pencil size={24} strokeWidth={2.4} />
        </motion.div>
      </div>

      <WorkspaceForm
        workspace={workspace}
        amenities={amenities}
        selectedAmenityIds={selectedIds}
        errors={errors}
      />
    </AppLayout>
  );
}