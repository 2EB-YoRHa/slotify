import { Link, useForm } from "@inertiajs/react";
import type {
  Amenity,
  Workspace,
  WorkspaceErrors,
  WorkspaceFormData,
} from "../../types/workspace";

type WorkspaceFormProps = {
  mode: "create" | "edit";
  workspace?: Workspace;
  amenities: Amenity[];
  errors?: WorkspaceErrors;
};

const defaultFormData: WorkspaceFormData = {
  name: "",
  workspace_type: "",
  capacity: "",
  floor: "",
  zone: "",
  location: "",
  description: "",
  hourly_rate: "",
  active: true,
  amenity_ids: [],
};

export default function WorkspaceForm({
  mode,
  workspace,
  amenities,
  errors = {},
}: WorkspaceFormProps) {
  const initialAmenityIds =
    workspace?.amenities?.map((amenity) => Number(amenity.id)) || [];

  const initialData: WorkspaceFormData =
    mode === "edit" && workspace
      ? {
          name: workspace.name || "",
          workspace_type: workspace.workspace_type || "",
          capacity: workspace.capacity || "",
          floor: workspace.floor || "",
          zone: workspace.zone || "",
          location: workspace.location || "",
          description: workspace.description || "",
          hourly_rate: workspace.hourly_rate || "",
          active: workspace.active ?? true,
          amenity_ids: initialAmenityIds,
        }
      : defaultFormData;

  const { data, setData, post, patch, processing, transform } =
    useForm(initialData);

  const isEditing = mode === "edit";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    transform((formData) => ({
      workspace: {
        ...formData,
        amenity_ids: formData.amenity_ids,
      },
    }));

    if (isEditing && workspace) {
      patch(`/workspaces/${workspace.id}`);
    } else {
      post("/workspaces");
    }
  }

  function toggleAmenity(id: number) {
    const amenityId = Number(id);
    const exists = data.amenity_ids.includes(amenityId);

    if (exists) {
      setData(
        "amenity_ids",
        data.amenity_ids.filter((currentId) => currentId !== amenityId)
      );
    } else {
      setData("amenity_ids", [...data.amenity_ids, amenityId]);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 p-8">
        <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-slate-500">
          1. General Information
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Workspace Name" error={errors.name}>
            <input
              type="text"
              value={data.name}
              onChange={(event) => setData("name", event.target.value)}
              placeholder="e.g. Skyline Conference Room"
              className="input"
            />
          </Field>

          <Field label="Type" error={errors.workspace_type}>
            <select
              value={data.workspace_type}
              onChange={(event) =>
                setData("workspace_type", event.target.value)
              }
              className="input"
            >
              <option value="">Select type</option>
              <option value="desk">Desk</option>
              <option value="meeting_room">Meeting Room</option>
              <option value="private_office">Private Office</option>
              <option value="studio">Studio</option>
            </select>
          </Field>

          <Field label="Capacity" error={errors.capacity}>
            <input
              type="number"
              value={data.capacity}
              onChange={(event) => setData("capacity", event.target.value)}
              placeholder="Max people"
              className="input"
            />
          </Field>

          <Field label="Hourly Rate" error={errors.hourly_rate}>
            <input
              type="number"
              value={data.hourly_rate}
              onChange={(event) => setData("hourly_rate", event.target.value)}
              placeholder="Price per hour"
              className="input"
            />
          </Field>

          <Field label="Status">
            <select
              value={data.active ? "active" : "inactive"}
              onChange={(event) =>
                setData("active", event.target.value === "active")
              }
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="border-b border-slate-200 p-8">
        <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-slate-500">
          2. Location Details
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Floor">
            <input
              type="text"
              value={data.floor}
              onChange={(event) => setData("floor", event.target.value)}
              placeholder="e.g. 4"
              className="input"
            />
          </Field>

          <Field label="Zone / Wing">
            <input
              type="text"
              value={data.zone}
              onChange={(event) => setData("zone", event.target.value)}
              placeholder="e.g. East Wing"
              className="input"
            />
          </Field>

          <div className="col-span-2">
            <Field label="Location">
              <input
                type="text"
                value={data.location}
                onChange={(event) => setData("location", event.target.value)}
                placeholder="e.g. Main Campus, Building A"
                className="input"
              />
            </Field>
          </div>

          <div className="col-span-2">
            <Field label="Description">
              <textarea
                value={data.description}
                onChange={(event) =>
                  setData("description", event.target.value)
                }
                placeholder="Describe this workspace..."
                rows={4}
                className="input"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 p-8">
        <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-slate-500">
          3. Available Amenities
        </h2>

        {amenities.length === 0 ? (
          <p className="text-sm text-slate-400">
            No amenities have been created yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {amenities.map((amenity) => (
              <label
                key={amenity.id}
                className="flex items-center gap-3 text-sm font-medium text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={data.amenity_ids.includes(Number(amenity.id))}
                  onChange={() => toggleAmenity(amenity.id)}
                  className="h-4 w-4 rounded border-slate-300"
                />

                {amenity.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 p-6">
        <Link
          href={isEditing && workspace ? `/workspaces/${workspace.id}` : "/workspaces"}
          className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={processing}
          className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-60"
        >
          {processing
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Save Workspace"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string | string[];
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      {children}

      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </label>
  );
}