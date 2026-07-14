import AppLayout from "../../components/AppLayout";
import WorkspaceForm from "../../components/workspaces/WorkspaceForm";
import type { Amenity, Workspace, WorkspaceErrors } from "../../types/workspace";

type EditWorkspaceProps = {
  workspace: Workspace;
  amenities?: Amenity[];
  errors?: WorkspaceErrors;
};

export default function EditWorkspace({
  workspace,
  amenities = [],
  errors = {},
}: EditWorkspaceProps) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Workspace
          </h1>

          <p className="mt-1 text-slate-500">
            Modify details for {workspace.name}.
          </p>
        </div>

        <WorkspaceForm
          mode="edit"
          workspace={workspace}
          amenities={amenities}
          errors={errors}
        />
      </div>
    </AppLayout>
  );
}