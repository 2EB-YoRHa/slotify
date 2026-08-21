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
import {
  normalizeNumber,
  normalizeString,
  sameNumberArray,
} from "../../utils/dirtyForm";
import useUnsavedChangesGuard from "../../hooks/useUnsavedChangesGuard";
import ConfirmDialog from "../ui/ConfirmDialog";
import GuardedBackButton from "../ui/GuardedBackButton";
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
  multipleWorkspacePhotosEnabled?: boolean;
  multiple_workspace_photos_enabled?: boolean;
  errors?: Partial<Record<string, string | string[]>>;
  backHref?: string;
  backLabel?: string;
  title?: string;
  description?: string;
};

export default function WorkspaceForm({
  workspace = null,
  amenities = [],
  selectedAmenityIds = [],
  selected_amenity_ids = [],
  multipleWorkspacePhotosEnabled = false,
  multiple_workspace_photos_enabled = false,
  errors: initialErrors = {},
  backHref = "/workspaces",
  backLabel,
  title,
  description,
}: WorkspaceFormProps) {
  const isEditing = Boolean(workspace?.id);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const extraPhotosEnabled =
    multipleWorkspacePhotosEnabled || multiple_workspace_photos_enabled;

  const initialAmenityIds =
    selectedAmenityIds.length > 0 ? selectedAmenityIds : selected_amenity_ids;

  const initialWorkspaceData: WorkspaceFormData = {
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
    extra_photos: [],
    remove_photo: false,
    remove_extra_photo_ids: [],
  };

  const {
    data,
    setData,
    post,
    patch,
    processing,
    errors: formErrors,
    transform,
  } = useForm<WorkspaceFormData>(initialWorkspaceData);

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const formDirty = workspaceFormChanged(data, initialWorkspaceData);

  const unsavedChangesGuard = useUnsavedChangesGuard({
    enabled: formDirty && !processing,
    title: isEditing ? "Discard workspace changes?" : "Discard new workspace?",
    description: isEditing
      ? "You have unsaved changes for this workspace. If you leave now, those changes will be lost."
      : "You have started creating a workspace. If you leave now, the information entered will be lost.",
    confirmText: isEditing ? "Discard Changes" : "Discard Workspace",
    cancelText: "Keep Editing",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateWorkspaceForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    transform((formData) => {
      const payload: Record<string, unknown> = {
        name: formData.name,
        workspace_type: formData.workspace_type,
        capacity: Number(formData.capacity),
        floor: formData.floor,
        zone: formData.zone,
        location: formData.location,
        description: formData.description,
        hourly_rate: Number(formData.hourly_rate),
        active: formData.active,
        amenity_ids: formData.amenity_ids,
      };

      if (formData.photo instanceof File) {
        payload.photo = formData.photo;
      }

      if (formData.extra_photos.length > 0) {
        payload.extra_photos = formData.extra_photos;
      }

      if (formData.remove_photo) {
        payload.remove_photo = true;
      }

      if (formData.remove_extra_photo_ids.length > 0) {
        payload.remove_extra_photo_ids = formData.remove_extra_photo_ids;
      }

      return {
        workspace: payload,
      };
    });

    unsavedChangesGuard.allowNextNavigation();

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

  function updatePhoto(file: File | null) {
    clearClientError("photo");

    setData((currentData) => ({
      ...currentData,
      photo: file,
      remove_photo: file ? false : currentData.remove_photo,
    }));
  }

  function updateRemovePhoto(removePhoto: boolean) {
    clearClientError("photo");

    setData((currentData) => ({
      ...currentData,
      photo: removePhoto ? null : currentData.photo,
      remove_photo: removePhoto,
    }));
  }

  function updateExtraPhotos(files: File[]) {
    clearClientError("extra_photos");
    updateField("extra_photos", files);
  }

  function updateRemovedExtraPhotoIds(ids: number[]) {
    clearClientError("extra_photos");
    updateField("remove_extra_photo_ids", ids);
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
    <>
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GuardedBackButton
            disabled={processing}
            onClick={() => unsavedChangesGuard.guardedVisit(backHref)}
          >
            {backLabel ||
              (isEditing ? "Back to Workspace" : "Back to Workspaces")}
          </GuardedBackButton>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 dark:text-slate-100 sm:mt-6 sm:text-3xl"
        >
          {title || (isEditing ? "Edit Workspace" : "Create Workspace")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
        >
          {description ||
            (isEditing
              ? "Update capacity, pricing, location, amenities, and availability for this workspace."
              : "Add a bookable space with capacity, pricing, location details, and amenities.")}
        </motion.p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8"
      >
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-6 xl:col-span-2 xl:space-y-8"
        >
          <WorkspaceInformationSection
            data={data}
            errors={errors}
            processing={processing}
            currentPhotoUrl={workspace?.photo_url}
            currentPhotoFilename={workspace?.photo_filename}
            existingExtraPhotoCount={workspace?.extra_photos?.length || 0}
            existingExtraPhotos={workspace?.extra_photos || []}
            multipleWorkspacePhotosEnabled={extraPhotosEnabled}
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
            onPhotoChange={updatePhoto}
            onRemovePhotoChange={updateRemovePhoto}
            onExtraPhotosChange={updateExtraPhotos}
            onRemovedExtraPhotoIdsChange={updateRemovedExtraPhotoIds}
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
          className="space-y-6 xl:sticky xl:top-24 xl:self-start"
        >
          <WorkspaceSummaryPanel
            workspace={workspace}
            data={data}
            errors={errors}
            isEditing={isEditing}
            processing={processing}
            onActiveChange={(checked) => updateField("active", checked)}
            onCancel={() =>
              unsavedChangesGuard.guardedVisit(
                isEditing && workspace?.id
                  ? `/workspaces/${workspace.id}`
                  : "/workspaces",
              )
            }
          />
        </motion.aside>
      </form>

      <ConfirmDialog
        open={unsavedChangesGuard.confirmOpen}
        title={unsavedChangesGuard.title}
        description={unsavedChangesGuard.description}
        confirmText={unsavedChangesGuard.confirmText}
        cancelText={unsavedChangesGuard.cancelText}
        danger
        onCancel={unsavedChangesGuard.cancelNavigation}
        onConfirm={unsavedChangesGuard.confirmNavigation}
      />
    </>
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

function workspaceFormChanged(
  data: WorkspaceFormData,
  initialData: WorkspaceFormData,
): boolean {
  return (
    normalizeString(data.name) !== normalizeString(initialData.name) ||
    normalizeString(data.workspace_type) !==
      normalizeString(initialData.workspace_type) ||
    normalizeNumber(data.capacity) !== normalizeNumber(initialData.capacity) ||
    normalizeString(data.floor) !== normalizeString(initialData.floor) ||
    normalizeString(data.zone) !== normalizeString(initialData.zone) ||
    normalizeString(data.location) !== normalizeString(initialData.location) ||
    normalizeString(data.description) !==
      normalizeString(initialData.description) ||
    normalizeNumber(data.hourly_rate) !==
      normalizeNumber(initialData.hourly_rate) ||
    Boolean(data.active) !== Boolean(initialData.active) ||
    !sameNumberArray(data.amenity_ids, initialData.amenity_ids) ||
    data.photo instanceof File ||
    data.extra_photos.length > 0 ||
    data.remove_photo ||
    data.remove_extra_photo_ids.length > 0
  );
}