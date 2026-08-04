import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import type { FormEvent } from "react";
import type { Amenity } from "../../types/amenity";
import type { Workspace, WorkspaceFormData } from "../../types/workspace";
import {
  hasValidationErrors,
  validateIntegerRange,
  validateNumberRange,
  validateRequired,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";
import WorkspaceAmenitiesSection from "./form/WorkspaceAmenitiesSection";
import WorkspaceInformationSection from "./form/WorkspaceInformationSection";
import WorkspaceSummaryPanel from "./form/WorkspaceSummaryPanel";

const WORKSPACE_TYPES = [
  "meeting_room",
  "private_office",
  "open_desk",
  "training_room",
  "phone_booth",
];

type WorkspaceFormProps = {
  workspace?: Workspace | null;
  amenities?: Amenity[];
  selectedAmenityIds?: number[];
  selected_amenity_ids?: number[];
  errors?: Partial<Record<string, string | string[]>>;
};

export default function WorkspaceForm({
  workspace = null,
  amenities = [],
  selectedAmenityIds = [],
  selected_amenity_ids = [],
  errors: initialErrors = {},
}: WorkspaceFormProps) {
  const isEditing = Boolean(workspace?.id);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const initialAmenityIds =
    selectedAmenityIds.length > 0 ? selectedAmenityIds : selected_amenity_ids;

  const {
    data,
    setData,
    post,
    patch,
    processing,
    errors: formErrors,
    transform,
  } = useForm<WorkspaceFormData>({
    name: workspace?.name || "",
    workspace_type: workspace?.workspace_type || "meeting_room",
    capacity: workspace?.capacity || 1,
    floor: workspace?.floor || "",
    zone: workspace?.zone || "",
    location: workspace?.location || "",
    description: workspace?.description || "",
    hourly_rate: workspace?.hourly_rate || 0,
    active: workspace?.active ?? true,
    amenity_ids: initialAmenityIds,
    photo: null,
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateWorkspaceForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    transform((formData) => ({
      workspace: {
        ...formData,
        capacity: Number(formData.capacity),
        hourly_rate: Number(formData.hourly_rate),
        amenity_ids: formData.amenity_ids,
        photo: formData.photo,
      },
    }));

    if (isEditing && workspace?.id) {
      patch(`/workspaces/${workspace.id}`, {
        forceFormData: true,
      });
    } else {
      post("/workspaces", {
        forceFormData: true,
      });
    }
  }

  function updateField<K extends keyof WorkspaceFormData>(
    field: K,
    value: WorkspaceFormData[K],
  ) {
    clearClientError(String(field));

    setData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function toggleAmenity(amenityId: number) {
    clearClientError("amenity_ids");

    const alreadySelected = data.amenity_ids.includes(amenityId);

    const nextAmenityIds = alreadySelected
      ? data.amenity_ids.filter((id) => id !== amenityId)
      : [...data.amenity_ids, amenityId];

    setData("amenity_ids", nextAmenityIds);
  }

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`workspace.${field}`];

      return nextErrors;
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="col-span-2 space-y-8"
      >
        <WorkspaceInformationSection
          data={data}
          errors={errors}
          processing={processing}
          currentPhotoUrl={workspace?.photo_url}
          currentPhotoFilename={workspace?.photo_filename}
          onNameChange={(value) => updateField("name", value)}
          onWorkspaceTypeChange={(value) =>
            updateField("workspace_type", value)
          }
          onCapacityChange={(value) => updateField("capacity", value)}
          onHourlyRateChange={(value) => updateField("hourly_rate", value)}
          onFloorChange={(value) => updateField("floor", value)}
          onZoneChange={(value) => updateField("zone", value)}
          onLocationChange={(value) => updateField("location", value)}
          onDescriptionChange={(value) => updateField("description", value)}
          onPhotoChange={(file) => updateField("photo", file)}
        />

        <WorkspaceAmenitiesSection
          amenities={amenities}
          selectedAmenityIds={data.amenity_ids}
          processing={processing}
          error={errors.amenity_ids || errors["workspace.amenity_ids"]}
          onToggleAmenity={toggleAmenity}
        />
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="space-y-6"
      >
        <WorkspaceSummaryPanel
          workspace={workspace}
          data={data}
          errors={errors}
          isEditing={isEditing}
          processing={processing}
          onActiveChange={(checked) => updateField("active", checked)}
        />
      </motion.aside>
    </form>
  );
}

function validateWorkspaceForm(data: WorkspaceFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateTextLength(data.name, "Workspace Name", {
    min: 3,
    max: 80,
  });

  if (nameError) errors.name = nameError;

  if (!WORKSPACE_TYPES.includes(String(data.workspace_type))) {
    errors.workspace_type = "Select a valid Workspace Type.";
  }

  const capacityError = validateIntegerRange(data.capacity, "Capacity", {
    min: 1,
    max: 200,
  });

  if (capacityError) errors.capacity = capacityError;

  const hourlyRateError = validateNumberRange(data.hourly_rate, "Hourly Rate", {
    min: 0,
    max: 10_000,
  });

  if (hourlyRateError) errors.hourly_rate = hourlyRateError;

  const floorError = validateTextLength(data.floor, "Floor", {
    max: 30,
    required: false,
  });

  if (floorError) errors.floor = floorError;

  const zoneError = validateTextLength(data.zone, "Zone", {
    max: 80,
    required: false,
  });

  if (zoneError) errors.zone = zoneError;

  const locationRequiredError = validateRequired(data.location, "Location");

  if (locationRequiredError) {
    errors.location = locationRequiredError;
  } else {
    const locationLengthError = validateTextLength(data.location, "Location", {
      max: 120,
      required: true,
    });

    if (locationLengthError) errors.location = locationLengthError;
  }

  const descriptionError = validateTextLength(data.description, "Description", {
    max: 500,
    required: false,
  });

  if (descriptionError) errors.description = descriptionError;

  return errors;
}