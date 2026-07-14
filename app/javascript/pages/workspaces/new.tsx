import AppLayout from "../../components/AppLayout";
import WorkspaceForm from "../../components/workspaces/WorkspaceForm";
import type { Amenity, WorkspaceErrors } from "../../types/workspace";

type NewWorkspaceProps = {
  amenities?: Amenity[];
  errors?: WorkspaceErrors;
};

export default function NewWorkspace({
  amenities = [],
  errors = {},
}: NewWorkspaceProps) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Add New Workspace
          </h1>

          <p className="mt-1 text-slate-500">
            Create a new bookable spot for your team.
          </p>
        </div>

        <WorkspaceForm mode="create" amenities={amenities} errors={errors} />
      </div>
    </AppLayout>
  );
}