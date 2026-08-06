import {
  Building2,
  DollarSign,
  Layers3,
  MapPin,
  StickyNote,
  UsersRound,
} from "lucide-react";
import type {
  WorkspaceFormData,
  WorkspacePhotoItem,
} from "../../../types/workspace";
import { fieldError, workspaceTypes } from "../../../utils/workspaceFormUtils";
import WorkspaceExtraPhotosUpload from "./WorkspaceExtraPhotosUpload";
import WorkspacePhotoUpload from "./WorkspacePhotoUpload";
import {
  IconBox,
  NumberInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "./WorkspaceFormFields";

type WorkspaceInformationSectionProps = {
  data: WorkspaceFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  currentPhotoUrl?: string | null;
  currentPhotoFilename?: string | null;
  existingExtraPhotoCount?: number;
  existingExtraPhotos?: WorkspacePhotoItem[];
  multipleWorkspacePhotosEnabled?: boolean;
  onNameChange: (value: string) => void;
  onWorkspaceTypeChange: (value: string) => void;
  onCapacityChange: (value: string) => void;
  onHourlyRateChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onZoneChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPhotoChange: (file: File | null) => void;
  onExtraPhotosChange: (files: File[]) => void;
};

export default function WorkspaceInformationSection({
  data,
  errors,
  processing,
  currentPhotoUrl = null,
  currentPhotoFilename = null,
  existingExtraPhotoCount = 0,
  existingExtraPhotos = [],
  multipleWorkspacePhotosEnabled = false,
  onNameChange,
  onWorkspaceTypeChange,
  onCapacityChange,
  onHourlyRateChange,
  onFloorChange,
  onZoneChange,
  onLocationChange,
  onDescriptionChange,
  onPhotoChange,
  onExtraPhotosChange,
}: WorkspaceInformationSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-start gap-4">
        <IconBox icon={Building2} large />

        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Workspace Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Define the workspace name, category, capacity and physical location.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <TextInput
          icon={Building2}
          label="Workspace Name"
          value={data.name}
          placeholder="Enter workspace name"
          disabled={processing}
          required
          maxLength={80}
          helper="Use a short and clear name for this workspace."
          error={fieldError(errors, "name")}
          onChange={onNameChange}
        />

        <SelectInput
          icon={Layers3}
          label="Workspace Type"
          value={data.workspace_type}
          disabled={processing}
          helper="Choose the category that best describes how this space is used."
          error={fieldError(errors, "workspace_type")}
          options={workspaceTypes}
          onChange={onWorkspaceTypeChange}
        />

        <NumberInput
          icon={UsersRound}
          label="Capacity"
          value={data.capacity}
          min="1"
          placeholder="Enter capacity"
          disabled={processing}
          helper="Maximum number of people allowed in this workspace."
          error={fieldError(errors, "capacity")}
          onChange={onCapacityChange}
        />

        <NumberInput
          icon={DollarSign}
          label="Hourly Rate"
          value={data.hourly_rate}
          min="0"
          step="0.01"
          placeholder="Enter hourly rate"
          disabled={processing}
          helper="Price charged per reserved hour."
          error={fieldError(errors, "hourly_rate")}
          onChange={onHourlyRateChange}
        />

        <TextInput
          icon={Building2}
          label="Floor"
          value={data.floor}
          placeholder="Enter floor or level"
          disabled={processing}
          maxLength={30}
          helper="Optional. Helps users locate the workspace."
          error={fieldError(errors, "floor")}
          onChange={onFloorChange}
        />

        <TextInput
          icon={MapPin}
          label="Zone"
          value={data.zone}
          placeholder="Enter zone or area"
          disabled={processing}
          maxLength={80}
          helper="Optional. Use this when the workspace belongs to a specific area."
          error={fieldError(errors, "zone")}
          onChange={onZoneChange}
        />

        <div className="col-span-2">
          <TextInput
            icon={MapPin}
            label="Location"
            value={data.location}
            placeholder="Enter workspace location"
            disabled={processing}
            required
            maxLength={120}
            helper="Use a clear location reference inside the building."
            error={fieldError(errors, "location")}
            onChange={onLocationChange}
          />
        </div>

        <div className="col-span-2">
          <TextAreaInput
            icon={StickyNote}
            label="Description"
            value={data.description}
            placeholder="Describe the workspace, equipment, and recommended use."
            disabled={processing}
            maxLength={500}
            helper="Briefly describe the use case, equipment, and best fit for this space."
            error={fieldError(errors, "description")}
            onChange={onDescriptionChange}
          />
        </div>

        <div className="col-span-2">
          <WorkspacePhotoUpload
            selectedFile={data.photo}
            initialPreviewUrl={currentPhotoUrl}
            currentFilename={currentPhotoFilename}
            disabled={processing}
            error={fieldError(errors, "photo")}
            onPhotoChange={onPhotoChange}
          />
        </div>

        <div className="col-span-2">
          <WorkspaceExtraPhotosUpload
            enabled={multipleWorkspacePhotosEnabled}
            selectedFiles={data.extra_photos}
            existingPhotos={existingExtraPhotos}
            existingPhotoCount={existingExtraPhotoCount}
            disabled={processing}
            error={fieldError(errors, "extra_photos")}
            onPhotosChange={onExtraPhotosChange}
          />
        </div>
      </div>
    </div>
  );
}
