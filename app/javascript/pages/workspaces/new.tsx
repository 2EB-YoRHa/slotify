import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import WorkspaceForm from "../../components/workspaces/WorkspaceForm";
import type { Amenity } from "../../types/amenity";

type NewWorkspaceProps = {
  amenities?: Amenity[];
  multiple_workspace_photos_enabled?: boolean;
  errors?: Partial<Record<string, string | string[]>>;
};

export default function NewWorkspace({
  amenities = [],
  multiple_workspace_photos_enabled = false,
  errors = {},
}: NewWorkspaceProps) {
  return (
    <AppLayout>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            Back to Workspaces
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-6 text-3xl font-bold text-slate-950"
        >
          Create Workspace
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-slate-500"
        >
          Add a bookable space with capacity, pricing, location details, and
          amenities.
        </motion.p>
      </div>

      <WorkspaceForm
        amenities={amenities}
        multipleWorkspacePhotosEnabled={multiple_workspace_photos_enabled}
        errors={errors}
      />
    </AppLayout>
  );
}