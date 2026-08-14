import AppLayout from "../../components/AppLayout";
import WorkspaceForm from "../../components/workspaces/WorkspaceForm";
import type { Amenity } from "../../types/amenity";
import type { Workspace } from "../../types/workspace";

type EditWorkspaceProps = {
  workspace: Workspace;
  amenities?: Amenity[];
  selected_amenity_ids?: number[];
  selectedAmenityIds?: number[];
  multiple_workspace_photos_enabled?: boolean;
  errors?: Partial<Record<string, string | string[]>>;
};

export default function EditWorkspace({
  workspace,
  amenities = [],
  selected_amenity_ids = [],
  selectedAmenityIds = [],
  multiple_workspace_photos_enabled = false,
  errors = {},
}: EditWorkspaceProps) {
  const selectedIds =
    selectedAmenityIds.length > 0 ? selectedAmenityIds : selected_amenity_ids;

  return (
    <AppLayout>
      <WorkspaceForm
        workspace={workspace}
        amenities={amenities}
        selectedAmenityIds={selectedIds}
        multipleWorkspacePhotosEnabled={multiple_workspace_photos_enabled}
        errors={errors}
        backHref={`/workspaces/${workspace.id}`}
        backLabel="Back to Workspace"
        title="Edit Workspace"
        description="Update capacity, pricing, location, amenities, and availability for this workspace."
      />
    </AppLayout>
  );
}