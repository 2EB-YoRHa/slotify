import { useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Building2,
  Camera,
  Check,
  DollarSign,
  ImagePlus,
  Layers,
  LockKeyhole,
  MapPin,
  Tag,
  ToggleLeft,
  Users,
  X,
  Zap,
} from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import {
  FieldError,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";
import {
  hasValidationErrors,
  validateIntegerRange,
  validateNumberRange,
  validateRequired,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";
import type { Amenity } from "../../types/amenity";
import type { Workspace, WorkspaceFormData } from "../../types/workspace";

type WorkspaceFormProps = {
  workspace?: Workspace;
  amenities?: Amenity[];
  selectedAmenityIds?: number[];
  multipleWorkspacePhotosEnabled?: boolean;
  errors?: Partial<Record<string, string | string[]>>;
};

const WORKSPACE_TYPES = [
  { value: "meeting_room", label: "Meeting Room" },
  { value: "private_office", label: "Private Office" },
  { value: "open_desk", label: "Open Desk" },
  { value: "training_room", label: "Training Room" },
  { value: "phone_booth", label: "Phone Booth" },
];

export default function WorkspaceForm({
  workspace,
  amenities = [],
  selectedAmenityIds = [],
  multipleWorkspacePhotosEnabled = false,
  errors: initialErrors = {},
}: WorkspaceFormProps) {
  const isEditing = Boolean(workspace);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [extraPhotoPreviewUrls, setExtraPhotoPreviewUrls] = useState<string[]>(
    [],
  );

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
    capacity: workspace?.capacity || "",
    floor: workspace?.floor || "",
    zone: workspace?.zone || "",
    location: workspace?.location || "",
    description: workspace?.description || "",
    hourly_rate: workspace?.hourly_rate || "",
    active: workspace?.active ?? true,
    amenity_ids: selectedAmenityIds,
    photo: null,
    extra_photos: [],
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const existingGalleryPhotos = useMemo(
    () => workspace?.gallery_photos || [],
    [workspace],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateWorkspaceForm(data);

    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    transform((formData) => ({
      workspace: {
        ...formData,
        capacity: numericValue(formData.capacity),
        hourly_rate: numericValue(formData.hourly_rate),
      },
    }));

    const options = {
      forceFormData: true,
    };

    if (isEditing && workspace) {
      patch(`/workspaces/${workspace.id}`, options);
    } else {
      post("/workspaces", options);
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

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`workspace.${field}`];

      return nextErrors;
    });
  }

  function handleAmenityToggle(amenityId: number) {
    const selected = data.amenity_ids.includes(amenityId);

    updateField(
      "amenity_ids",
      selected
        ? data.amenity_ids.filter((id) => id !== amenityId)
        : [...data.amenity_ids, amenityId],
    );
  }

  function handleMainPhotoChange(file: File | null) {
    updateField("photo", file);

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setPhotoPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function handleExtraPhotosChange(files: FileList | null) {
    if (!multipleWorkspacePhotosEnabled) return;

    extraPhotoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));

    const selectedFiles = Array.from(files || []);

    updateField("extra_photos", selectedFiles);
    setExtraPhotoPreviewUrls(
      selectedFiles.map((file) => URL.createObjectURL(file)),
    );
  }

  function clearExtraPhotos() {
    extraPhotoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));

    updateField("extra_photos", []);
    setExtraPhotoPreviewUrls([]);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <Building2 size={26} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Workspace Details
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Define how this workspace appears to managers and members when they
            browse available spaces.
          </p>
        </div>
      </div>

      {getBaseError(errors) && (
        <div className="mb-6">
          <FieldError error={getBaseError(errors)} label="Workspace" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <TextField
          label="Workspace Name"
          icon={Building2}
          value={data.name}
          placeholder="Board Room A"
          error={fieldError(errors, "name")}
          disabled={processing}
          required
          onChange={(value) => updateField("name", value)}
        />

        <SelectField
          label="Workspace Type"
          icon={Tag}
          value={data.workspace_type}
          options={WORKSPACE_TYPES}
          error={fieldError(errors, "workspace_type")}
          disabled={processing}
          required
          onChange={(value) => updateField("workspace_type", value)}
        />

        <TextField
          label="Capacity"
          icon={Users}
          type="number"
          value={data.capacity}
          placeholder="8"
          error={fieldError(errors, "capacity")}
          disabled={processing}
          required
          onChange={(value) => updateField("capacity", value)}
        />

        <TextField
          label="Hourly Rate"
          icon={DollarSign}
          type="number"
          value={data.hourly_rate}
          placeholder="25"
          error={fieldError(errors, "hourly_rate")}
          disabled={processing}
          required
          onChange={(value) => updateField("hourly_rate", value)}
        />

        <TextField
          label="Floor"
          icon={Layers}
          value={data.floor}
          placeholder="2nd floor"
          error={fieldError(errors, "floor")}
          disabled={processing}
          onChange={(value) => updateField("floor", value)}
        />

        <TextField
          label="Zone"
          icon={MapPin}
          value={data.zone}
          placeholder="North wing"
          error={fieldError(errors, "zone")}
          disabled={processing}
          onChange={(value) => updateField("zone", value)}
        />
      </div>

      <div className="mt-5">
        <TextField
          label="Location"
          icon={MapPin}
          value={data.location}
          placeholder="Main building, second floor"
          error={fieldError(errors, "location")}
          disabled={processing}
          required
          onChange={(value) => updateField("location", value)}
        />
      </div>

      <div className="mt-5">
        <TextAreaField
          label="Description"
          value={data.description}
          placeholder="Describe the workspace, ideal use cases, and important details."
          error={fieldError(errors, "description")}
          disabled={processing}
          onChange={(value) => updateField("description", value)}
        />
      </div>

      <div className="mt-6">
        <StatusToggle
          active={data.active}
          disabled={processing}
          onChange={(checked) => updateField("active", checked)}
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <MainPhotoUploader
          currentPhotoUrl={workspace?.photo_url}
          currentPhotoFilename={workspace?.photo_filename}
          previewUrl={photoPreviewUrl}
          error={fieldError(errors, "photo")}
          disabled={processing}
          onChange={handleMainPhotoChange}
        />

        <ExtraPhotosUploader
          enabled={multipleWorkspacePhotosEnabled}
          existingGalleryCount={existingGalleryPhotos.length}
          previewUrls={extraPhotoPreviewUrls}
          error={fieldError(errors, "extra_photos")}
          disabled={processing}
          onChange={handleExtraPhotosChange}
          onClear={clearExtraPhotos}
        />
      </div>

      {existingGalleryPhotos.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-950">
                Existing Gallery
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Saved photos already attached to this workspace.
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
              {existingGalleryPhotos.length} photo
              {existingGalleryPhotos.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {existingGalleryPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.url}
                alt={photo.filename}
                className="h-28 w-full rounded-xl border border-white bg-white object-cover shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <AmenitiesPicker
          amenities={amenities}
          selectedIds={data.amenity_ids}
          disabled={processing}
          onToggle={handleAmenityToggle}
        />
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <a
          href={workspace ? `/workspaces/${workspace.id}` : "/workspaces"}
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </a>

        <LoadingButton
          type="submit"
          loading={processing}
          loadingText={isEditing ? "Saving..." : "Creating..."}
        >
          {isEditing ? "Save Workspace" : "Create Workspace"}
        </LoadingButton>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  icon?: typeof Building2;
  value: string | number;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string | string[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

function TextField({
  label,
  icon: Icon = Building2,
  value,
  placeholder,
  type = "text",
  required = false,
  error,
  disabled = false,
  onChange,
}: FieldProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />

      <div className="relative mt-2">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`${formInputClassName(hasError, false)} pl-11`}
        />
      </div>

      <FieldError error={error} label={label} />
    </label>
  );
}

type SelectFieldProps = FieldProps & {
  options: Array<{
    value: string;
    label: string;
  }>;
};

function SelectField({
  label,
  icon: Icon = Tag,
  value,
  options,
  required = false,
  error,
  disabled = false,
  onChange,
}: SelectFieldProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />

      <div className="relative mt-2">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`${formInputClassName(hasError, false)} pl-11`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <FieldError error={error} label={label} />
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  error?: string | string[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

function TextAreaField({
  label,
  value,
  placeholder,
  error,
  disabled = false,
  onChange,
}: TextAreaFieldProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <FieldLabel label={label} />

      <textarea
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className={`${formInputClassName(hasError, false)} mt-2 resize-none`}
      />

      <div className="mt-2 flex justify-between gap-4">
        <FieldError error={error} label={label} />

        <span className="text-xs font-semibold text-slate-400">
          {value.length}/500
        </span>
      </div>
    </label>
  );
}

type StatusToggleProps = {
  active: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
};

function StatusToggle({ active, disabled, onChange }: StatusToggleProps) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        active ? "border-cyan-100 bg-cyan-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
            <ToggleLeft size={19} strokeWidth={2.4} />
          </div>

          <div>
            <p className="font-bold text-slate-950">Workspace Availability</p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Inactive workspaces are hidden from new reservation flows but keep
              their historical reservations.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <span
            className={`text-sm font-bold ${
              active ? "text-cyan-600" : "text-slate-400"
            }`}
          >
            {active ? "Active" : "Inactive"}
          </span>

          <input
            type="checkbox"
            checked={active}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-cyan-400"
          />
        </label>
      </div>
    </div>
  );
}

type MainPhotoUploaderProps = {
  currentPhotoUrl?: string | null;
  currentPhotoFilename?: string | null;
  previewUrl?: string | null;
  error?: string | string[];
  disabled: boolean;
  onChange: (file: File | null) => void;
};

function MainPhotoUploader({
  currentPhotoUrl,
  currentPhotoFilename,
  previewUrl,
  error,
  disabled,
  onChange,
}: MainPhotoUploaderProps) {
  const hasImage = Boolean(previewUrl || currentPhotoUrl);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
          <Camera size={19} strokeWidth={2.4} />
        </div>

        <div>
          <p className="font-bold text-slate-950">Main Photo</p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            This is the primary image shown on workspace cards and search
            results.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {hasImage ? (
          <img
            src={previewUrl || currentPhotoUrl || undefined}
            alt={currentPhotoFilename || "Workspace photo preview"}
            className="h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-52 flex-col items-center justify-center text-slate-400">
            <ImagePlus size={30} strokeWidth={2.4} />

            <p className="mt-3 text-sm font-bold">No main photo selected</p>
          </div>
        )}
      </div>

      <label className="mt-4 block">
        <input
          type="file"
          accept="image/png,image/jpg,image/jpeg,image/webp"
          disabled={disabled}
          onChange={(event) =>
            onChange(event.target.files ? event.target.files[0] : null)
          }
          className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-500 file:mr-4 file:border-0 file:bg-cyan-50 file:px-4 file:py-3 file:text-sm file:font-bold file:text-cyan-600 hover:file:bg-cyan-100"
        />
      </label>

      <FieldError error={error} label="Main Photo" />
    </div>
  );
}

type ExtraPhotosUploaderProps = {
  enabled: boolean;
  existingGalleryCount: number;
  previewUrls: string[];
  error?: string | string[];
  disabled: boolean;
  onChange: (files: FileList | null) => void;
  onClear: () => void;
};

function ExtraPhotosUploader({
  enabled,
  existingGalleryCount,
  previewUrls,
  error,
  disabled,
  onChange,
  onClear,
}: ExtraPhotosUploaderProps) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        enabled
          ? "border-cyan-100 bg-cyan-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${
              enabled ? "text-cyan-500" : "text-slate-400"
            }`}
          >
            {enabled ? (
              <Zap size={19} strokeWidth={2.4} />
            ) : (
              <LockKeyhole size={19} strokeWidth={2.4} />
            )}
          </div>

          <div>
            <p className="font-bold text-slate-950">Extra Gallery Photos</p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {enabled
                ? "Pro allows additional photos to show a richer workspace gallery."
                : "Extra workspace photos are a Pro feature. Starter keeps one main photo per workspace."}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
            enabled ? "bg-white text-cyan-600" : "bg-white text-slate-400"
          }`}
        >
          {enabled ? "Pro Active" : "Pro Only"}
        </span>
      </div>

      <label className={enabled ? "block" : "pointer-events-none block opacity-50"}>
        <input
          type="file"
          multiple
          accept="image/png,image/jpg,image/jpeg,image/webp"
          disabled={disabled || !enabled}
          onChange={(event) => onChange(event.target.files)}
          className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-500 file:mr-4 file:border-0 file:bg-cyan-50 file:px-4 file:py-3 file:text-sm file:font-bold file:text-cyan-600 hover:file:bg-cyan-100"
        />
      </label>

      {previewUrls.length > 0 && (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
              New photos selected
            </p>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-500"
            >
              <X size={14} />
              Clear
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {previewUrls.map((url) => (
              <img
                key={url}
                src={url}
                alt="Extra workspace preview"
                className="h-24 w-full rounded-xl border border-white bg-white object-cover shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      {existingGalleryCount > 0 && (
        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-500">
          This workspace currently has {existingGalleryCount} saved gallery
          photo{existingGalleryCount === 1 ? "" : "s"}.
        </p>
      )}

      <FieldError error={error} label="Extra Gallery Photos" />
    </div>
  );
}

type AmenitiesPickerProps = {
  amenities: Amenity[];
  selectedIds: number[];
  disabled: boolean;
  onToggle: (amenityId: number) => void;
};

function AmenitiesPicker({
  amenities,
  selectedIds,
  disabled,
  onToggle,
}: AmenitiesPickerProps) {
  if (amenities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
        No amenities available yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4">
        <p className="font-bold text-slate-950">Amenities</p>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Select the amenities available in this workspace.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {amenities.map((amenity) => {
          const selected = selectedIds.includes(amenity.id);

          return (
            <button
              key={amenity.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(amenity.id)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                selected
                  ? "border-cyan-200 bg-white text-cyan-600 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-cyan-100 hover:text-cyan-600"
              }`}
            >
              <span>{amenity.name}</span>

              {selected && <Check size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type FieldLabelProps = {
  label: string;
  required?: boolean;
};

function FieldLabel({ label, required = false }: FieldLabelProps) {
  return (
    <span className="flex items-center gap-1 text-sm font-bold text-slate-950">
      {label}
      <RequiredMark show={required} />
    </span>
  );
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`workspace.${field}`];
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>,
): string | null {
  const error = errors.base || errors["workspace.base"];

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}

function numericValue(value: string | number): string | number {
  if (value === "") return value;

  return Number(value);
}

function validateWorkspaceForm(data: WorkspaceFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError =
    validateRequired(data.name, "Workspace Name") ||
    validateTextLength(data.name, "Workspace Name", {
      min: 3,
      max: 80,
    });

  if (nameError) errors.name = nameError;

  const locationError =
    validateRequired(data.location, "Location") ||
    validateTextLength(data.location, "Location", {
      max: 120,
    });

  if (locationError) errors.location = locationError;

const capacityError =
  validateRequired(data.capacity, "Capacity") ||
  validateIntegerRange(data.capacity, "Capacity", {
    min: 1,
    max: 200,
  });

  if (capacityError) errors.capacity = capacityError;

  const hourlyRateError =
    validateRequired(data.hourly_rate, "Hourly Rate") ||
    validateNumberRange(data.hourly_rate, "Hourly Rate", {
      min: 0,
      max: 10_000,
    });

  if (hourlyRateError) errors.hourly_rate = hourlyRateError;

  const floorError = validateTextLength(data.floor, "Floor", {
    max: 30,
  });

  if (floorError) errors.floor = floorError;

  const zoneError = validateTextLength(data.zone, "Zone", {
    max: 80,
  });

  if (zoneError) errors.zone = zoneError;

  const descriptionError = validateTextLength(
    data.description,
    "Description",
    {
      max: 500,
    },
  );

  if (descriptionError) errors.description = descriptionError;

  return errors;
}