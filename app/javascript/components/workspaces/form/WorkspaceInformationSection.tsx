import {
  Building2,
  DollarSign,
  ImagePlus,
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
  onPhotoChange: (file: File | null) => void;
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
  onPhotoChange,
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
        <div className="col-span-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Workspace Photo
            </span>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-cyan-300 hover:bg-cyan-50/40">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm">
                  <ImagePlus size={22} strokeWidth={2.4} />
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/webp"
                    disabled={processing}
                    onChange={(event) =>
                      onPhotoChange(event.target.files?.[0] || null)
                    }
                    className="block w-full text-sm font-medium text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    PNG, JPG, JPEG or WEBP. Maximum size: 5MB.
                  </p>

                  {data.photo && (
                    <p className="mt-2 text-xs font-bold text-cyan-600">
                      Selected file: {data.photo.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
