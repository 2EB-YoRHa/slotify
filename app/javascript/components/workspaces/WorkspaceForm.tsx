import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import LoadingButton from "../ui/LoadingButton";
import type { Amenity } from "../../types/amenity";
import type {
  Workspace,
  WorkspaceErrors,
  WorkspaceFormData,
} from "../../types/workspace";

type WorkspaceFormProps = {
  mode: "create" | "edit";
  workspace?: Workspace | null;
  amenities?: Amenity[];
  errors?: WorkspaceErrors;
};

export default function WorkspaceForm({
  mode,
  workspace = null,
  amenities = [],
  errors: initialErrors = {},
}: WorkspaceFormProps) {
  const { data, setData, post, patch, processing, errors: formErrors, transform } =
    useForm<WorkspaceFormData>({
      name: workspace?.name || "",
      workspace_type: workspace?.workspace_type || "meeting_room",
      capacity: workspace?.capacity || "",
      floor: workspace?.floor || "",
      zone: workspace?.zone || "",
      location: workspace?.location || "",
      description: workspace?.description || "",
      hourly_rate: workspace?.hourly_rate || "",
      active: workspace?.active ?? true,
      amenity_ids: workspace?.amenities?.map((amenity) => amenity.id) || [],
    });

  const errors = {
    ...initialErrors,
    ...formErrors,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    transform((formData) => ({
      workspace: {
        ...formData,
        capacity: Number(formData.capacity),
        hourly_rate:
          formData.hourly_rate === "" ? null : Number(formData.hourly_rate),
      },
    }));

    if (mode === "edit" && workspace) {
      patch(`/workspaces/${workspace.id}`);
    } else {
      post("/workspaces");
    }
  }

  function updateField(
    field: keyof WorkspaceFormData,
    value: string | number | boolean | number[]
  ) {
    setData(field, value as never);
  }

  function toggleAmenity(amenityId: number, checked: boolean) {
    if (checked) {
      updateField("amenity_ids", [...data.amenity_ids, amenityId]);
      return;
    }

    updateField(
      "amenity_ids",
      data.amenity_ids.filter((id) => id !== amenityId)
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">
          {mode === "edit" ? "Edit Workspace" : "Create Workspace"}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Complete the workspace information used for reservations and
          availability.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Workspace Name
          </span>

          <input
            type="text"
            value={data.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="input"
            placeholder="Conference Room A"
            disabled={processing}
            required
          />

          <FormError error={errors.name} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Workspace Type
          </span>

          <select
            value={data.workspace_type}
            onChange={(event) =>
              updateField("workspace_type", event.target.value)
            }
            className="input"
            disabled={processing}
            required
          >
            <option value="meeting_room">Meeting Room</option>
            <option value="private_office">Private Office</option>
            <option value="hot_desk">Hot Desk</option>
            <option value="event_space">Event Space</option>
            <option value="training_room">Training Room</option>
          </select>

          <FormError error={errors.workspace_type} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Capacity
          </span>

          <input
            type="number"
            min="1"
            value={data.capacity}
            onChange={(event) => updateField("capacity", event.target.value)}
            className="input"
            placeholder="8"
            disabled={processing}
            required
          />

          <FormError error={errors.capacity} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Hourly Rate
          </span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={data.hourly_rate}
            onChange={(event) =>
              updateField("hourly_rate", event.target.value)
            }
            className="input"
            placeholder="25.00"
            disabled={processing}
          />

          <FormError error={errors.hourly_rate} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Floor
          </span>

          <input
            type="text"
            value={data.floor}
            onChange={(event) => updateField("floor", event.target.value)}
            className="input"
            placeholder="2nd Floor"
            disabled={processing}
          />

          <FormError error={errors.floor} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Zone
          </span>

          <input
            type="text"
            value={data.zone}
            onChange={(event) => updateField("zone", event.target.value)}
            className="input"
            placeholder="North Wing"
            disabled={processing}
          />

          <FormError error={errors.zone} />
        </label>

        <label className="col-span-2 block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Location
          </span>

          <input
            type="text"
            value={data.location}
            onChange={(event) => updateField("location", event.target.value)}
            className="input"
            placeholder="Building A, San José"
            disabled={processing}
          />

          <FormError error={errors.location} />
        </label>

        <label className="col-span-2 block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Description
          </span>

          <textarea
            value={data.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="input min-h-32"
            placeholder="Describe the workspace, equipment, and ideal use."
            disabled={processing}
          />

          <FormError error={errors.description} />
        </label>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-950">Amenities</h3>
            <p className="text-sm text-slate-500">
              Select the amenities available in this workspace.
            </p>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
            {data.amenity_ids.length} selected
          </span>
        </div>

        {amenities.length === 0 ? (
          <p className="rounded-lg bg-white p-4 text-sm text-slate-400">
            No amenities available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {amenities.map((amenity) => (
              <label
                key={amenity.id}
                className="flex items-center gap-3 rounded-lg bg-white p-3 text-sm font-medium text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={data.amenity_ids.includes(amenity.id)}
                  onChange={(event) =>
                    toggleAmenity(amenity.id, event.target.checked)
                  }
                  disabled={processing}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-400"
                />

                {amenity.name}
              </label>
            ))}
          </div>
        )}

        <FormError error={errors.amenity_ids} />
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 p-5">
        <div>
          <p className="font-bold text-slate-950">Workspace Status</p>
          <p className="text-sm text-slate-500">
            Inactive workspaces will not be available for reservations.
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            checked={data.active}
            onChange={(event) => updateField("active", event.target.checked)}
            disabled={processing}
            className="h-4 w-4 rounded border-slate-300 text-cyan-400"
          />

          Active
        </label>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <a
          href="/workspaces"
          className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>

        <LoadingButton
          type="submit"
          loading={processing}
          loadingText={mode === "edit" ? "Saving..." : "Creating..."}
        >
          {mode === "edit" ? "Save Changes" : "Create Workspace"}
        </LoadingButton>
      </div>
    </form>
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