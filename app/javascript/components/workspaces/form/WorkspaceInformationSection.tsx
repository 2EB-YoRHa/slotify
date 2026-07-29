import {
  Building2,
  DollarSign,
  Layers3,
  MapPin,
  StickyNote,
  UsersRound,
} from "lucide-react";
import type { WorkspaceFormData } from "../../../types/workspace";
import { fieldError, workspaceTypes } from "../../../utils/workspaceFormUtils";
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
  onNameChange: (value: string) => void;
  onWorkspaceTypeChange: (value: string) => void;
  onCapacityChange: (value: string) => void;
  onHourlyRateChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onZoneChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export default function WorkspaceInformationSection({
  data,
  errors,
  processing,
  onNameChange,
  onWorkspaceTypeChange,
  onCapacityChange,
  onHourlyRateChange,
  onFloorChange,
  onZoneChange,
  onLocationChange,
  onDescriptionChange,
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
          placeholder="Executive Meeting Room"
          disabled={processing}
          error={fieldError(errors, "name")}
          onChange={onNameChange}
        />

        <SelectInput
          icon={Layers3}
          label="Workspace Type"
          value={data.workspace_type}
          disabled={processing}
          error={fieldError(errors, "workspace_type")}
          options={workspaceTypes}
          onChange={onWorkspaceTypeChange}
        />

        <NumberInput
          icon={UsersRound}
          label="Capacity"
          value={data.capacity}
          min="1"
          disabled={processing}
          error={fieldError(errors, "capacity")}
          onChange={onCapacityChange}
        />

        <NumberInput
          icon={DollarSign}
          label="Hourly Rate"
          value={data.hourly_rate}
          min="0"
          step="0.01"
          disabled={processing}
          error={fieldError(errors, "hourly_rate")}
          onChange={onHourlyRateChange}
        />

        <TextInput
          icon={Building2}
          label="Floor"
          value={data.floor}
          placeholder="2"
          disabled={processing}
          error={fieldError(errors, "floor")}
          onChange={onFloorChange}
        />

        <TextInput
          icon={MapPin}
          label="Zone"
          value={data.zone}
          placeholder="North Wing"
          disabled={processing}
          error={fieldError(errors, "zone")}
          onChange={onZoneChange}
        />

        <div className="col-span-2">
          <TextInput
            icon={MapPin}
            label="Location"
            value={data.location}
            placeholder="Building A, second floor"
            disabled={processing}
            error={fieldError(errors, "location")}
            onChange={onLocationChange}
          />
        </div>

        <div className="col-span-2">
          <TextAreaInput
            icon={StickyNote}
            label="Description"
            value={data.description}
            placeholder="Describe this workspace..."
            disabled={processing}
            error={fieldError(errors, "description")}
            onChange={onDescriptionChange}
          />
        </div>
      </div>
    </div>
  );
}