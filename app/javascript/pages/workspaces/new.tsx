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
      <WorkspaceForm
        amenities={amenities}
        multipleWorkspacePhotosEnabled={multiple_workspace_photos_enabled}
        errors={errors}
        backHref="/workspaces"
        backLabel="Back to Workspaces"
        title="Create Workspace"
        description="Add a bookable space with capacity, pricing, location details, and amenities."
      />
    </AppLayout>
  );
}