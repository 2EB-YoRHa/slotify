import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  DollarSign,
  Layers3,
  MapPin,
  Power,
  Sparkles,
  StickyNote,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import type { Amenity } from "../../types/amenity";
import type { Workspace } from "../../types/workspace";

type WorkspaceFormProps = {
  workspace?: Workspace | null;
  amenities?: Amenity[];
  selectedAmenityIds?: number[];
  selected_amenity_ids?: number[];
  errors?: Partial<Record<string, string | string[]>>;
};

type WorkspaceFormData = {
  name: string;
  workspace_type: string;
  capacity: number | string;
  floor: string;
  zone: string;
  location: string;
  description: string;
  hourly_rate: number | string;
  active: boolean;
  amenity_ids: number[];
};

const workspaceTypes = [
  { value: "meeting_room", label: "Meeting Room" },
  { value: "private_office", label: "Private Office" },
  { value: "open_desk", label: "Open Desk" },
  { value: "training_room", label: "Training Room" },
  { value: "phone_booth", label: "Phone Booth" },
];

export default function WorkspaceForm({
  workspace = null,
  amenities = [],
  selectedAmenityIds = [],
  selected_amenity_ids = [],
  errors: initialErrors = {},
}: WorkspaceFormProps) {
  const isEditing = Boolean(workspace?.id);
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
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    transform((formData) => ({
      workspace: {
        ...formData,
        capacity: Number(formData.capacity),
        hourly_rate: Number(formData.hourly_rate),
        amenity_ids: formData.amenity_ids,
      },
    }));

    if (isEditing && workspace?.id) {
      patch(`/workspaces/${workspace.id}`);
    } else {
      post("/workspaces");
    }
  }

  function toggleAmenity(amenityId: number) {
    const alreadySelected = data.amenity_ids.includes(amenityId);

    const nextAmenityIds = alreadySelected
      ? data.amenity_ids.filter((id) => id !== amenityId)
      : [...data.amenity_ids, amenityId];

    setData("amenity_ids", nextAmenityIds);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="col-span-2 space-y-8"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-start gap-4">
            <IconBox icon={Building2} large />

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Workspace Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Define the workspace name, category, capacity and physical
                location.
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
              onChange={(value) => setData("name", value)}
            />

            <SelectInput
              icon={Layers3}
              label="Workspace Type"
              value={data.workspace_type}
              disabled={processing}
              error={fieldError(errors, "workspace_type")}
              options={workspaceTypes}
              onChange={(value) => setData("workspace_type", value)}
            />

            <NumberInput
              icon={UsersRound}
              label="Capacity"
              value={data.capacity}
              min="1"
              disabled={processing}
              error={fieldError(errors, "capacity")}
              onChange={(value) => setData("capacity", value)}
            />

            <NumberInput
              icon={DollarSign}
              label="Hourly Rate"
              value={data.hourly_rate}
              min="0"
              step="0.01"
              disabled={processing}
              error={fieldError(errors, "hourly_rate")}
              onChange={(value) => setData("hourly_rate", value)}
            />

            <TextInput
              icon={Building2}
              label="Floor"
              value={data.floor}
              placeholder="2"
              disabled={processing}
              error={fieldError(errors, "floor")}
              onChange={(value) => setData("floor", value)}
            />

            <TextInput
              icon={MapPin}
              label="Zone"
              value={data.zone}
              placeholder="North Wing"
              disabled={processing}
              error={fieldError(errors, "zone")}
              onChange={(value) => setData("zone", value)}
            />

            <div className="col-span-2">
              <TextInput
                icon={MapPin}
                label="Location"
                value={data.location}
                placeholder="Building A, second floor"
                disabled={processing}
                error={fieldError(errors, "location")}
                onChange={(value) => setData("location", value)}
              />
            </div>

            <label className="col-span-2 block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Description
              </span>

              <div className="relative">
                <StickyNote
                  size={17}
                  className="pointer-events-none absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  value={data.description}
                  onChange={(event) =>
                    setData("description", event.target.value)
                  }
                  className="min-h-32 w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  placeholder="Describe this workspace..."
                  disabled={processing}
                />
              </div>

              <FormError error={fieldError(errors, "description")} />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <IconBox icon={Sparkles} large />

              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Amenities
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select the features available in this workspace.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600">
              {data.amenity_ids.length} selected
            </span>
          </div>

          {amenities.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Sparkles size={24} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No amenities available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create amenities first before assigning them to workspaces.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {amenities.map((amenity, index) => {
                const selected = data.amenity_ids.includes(amenity.id);

                return (
                  <motion.button
                    key={amenity.id}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.035 }}
                    onClick={() => toggleAmenity(amenity.id)}
                    disabled={processing}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                      selected
                        ? "border-cyan-300 bg-cyan-50 ring-4 ring-cyan-50"
                        : "border-slate-200 bg-white hover:border-cyan-100"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        selected
                          ? "bg-cyan-400 text-white"
                          : "bg-cyan-50 text-cyan-500"
                      }`}
                    >
                      {selected ? (
                        <CheckCircle2 size={18} strokeWidth={2.4} />
                      ) : (
                        <Sparkles size={18} strokeWidth={2.4} />
                      )}
                    </div>

                    <span className="font-bold text-slate-900">
                      {amenity.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          <FormError error={fieldError(errors, "amenity_ids")} />
        </div>
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="space-y-6"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">

            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              {isEditing ? "Update Workspace" : "Create Workspace"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the workspace configuration before saving.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <SummaryRow label="Name" value={data.name || "Not set"} />

            <SummaryRow
              label="Type"
              value={formatText(data.workspace_type)}
            />

            <SummaryRow label="Capacity" value={data.capacity || "-"} />

            <SummaryRow
              label="Rate"
              value={`$${Number(data.hourly_rate || 0).toFixed(2)}`}
            />

            <SummaryRow
              label="Amenities"
              value={data.amenity_ids.length}
            />

            <SummaryRow
              label="Status"
              value={data.active ? "Active" : "Inactive"}
            />
          </div>

          <ToggleStatus
            checked={data.active}
            disabled={processing}
            onChange={(checked) => setData("active", checked)}
          />

          {getBaseError(errors) && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {getBaseError(errors)}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <LoadingButton
              type="submit"
              loading={processing}
              loadingText={isEditing ? "Saving..." : "Creating..."}
              className="w-full"
            >
              {isEditing ? "Save Changes" : "Create Workspace"}
            </LoadingButton>

            <a
              href={isEditing && workspace?.id ? `/workspaces/${workspace.id}` : "/workspaces"}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </a>
          </div>
        </div>
      </motion.aside>
    </form>
  );
}

type IconBoxProps = {
  icon: LucideIcon;
  large?: boolean;
};

function IconBox({ icon: Icon, large = false }: IconBoxProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 ${
        large ? "h-14 w-14" : "h-10 w-10"
      }`}
    >
      <Icon size={large ? 26 : 19} strokeWidth={2.4} />
    </div>
  );
}

type TextInputProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  placeholder?: string;
  disabled: boolean;
  error?: string | string[];
  onChange: (value: string) => void;
};

function TextInput({
  icon: Icon,
  label,
  value,
  placeholder,
  disabled,
  error,
  onChange,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <FormError error={error} />
    </label>
  );
}

type NumberInputProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  min: string;
  step?: string;
  disabled: boolean;
  error?: string | string[];
  onChange: (value: string) => void;
};

function NumberInput({
  icon: Icon,
  label,
  value,
  min,
  step,
  disabled,
  error,
  onChange,
}: NumberInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          disabled={disabled}
          required
        />
      </div>

      <FormError error={error} />
    </label>
  );
}

type SelectInputProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  disabled: boolean;
  error?: string | string[];
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
};

function SelectInput({
  icon: Icon,
  label,
  value,
  disabled,
  error,
  options,
  onChange,
}: SelectInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
          disabled={disabled}
          required
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <FormError error={error} />
    </label>
  );
}

type ToggleStatusProps = {
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleStatus({ checked, disabled, onChange }: ToggleStatusProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-start gap-3">
          <IconBox icon={Power} />

          <div>
            <p className="font-bold text-slate-950">Workspace Active</p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Active workspaces can be selected when creating reservations.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <span
            className={`text-sm font-bold ${
              checked ? "text-cyan-600" : "text-slate-400"
            }`}
          >
            {checked ? "Active" : "Inactive"}
          </span>

          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-slate-300 text-cyan-400"
          />
        </label>
      </div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string
): string | string[] | undefined {
  return errors[field] || errors[`workspace.${field}`];
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>
): string | null {
  const error = errors.base;

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}