import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";

export default function EditWorkspace({ workspace, amenities = {}, errors = {} }) {
  const initialAmenityIds =
    workspace.amenities?.map((amenity) => Number(amenity.id)) || [];

  const { data, setData, patch, processing, transform } = useForm({
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
  });

  function handleSubmit(event) {
    event.preventDefault();

    transform((data) => ({
      workspace: {
        ...data,
        amenity_ids: data.amenity_ids,
      },
    }));

    patch(`/workspaces/${workspace.id}`);
  }

  function toggleAmenity(id) {
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
    <AppLayout>
      <div className="grid min-h-[calc(100vh-8rem)] grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="hidden items-center justify-center bg-slate-100 lg:flex">
          <div className="text-center text-slate-400">
            <div className="mb-4 text-5xl">⌖</div>
            <p>{workspace.name}</p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-slate-200 p-8">
            <h1 className="text-3xl font-bold">Edit Workspace</h1>
            <p className="mt-1 text-slate-500">
              Modify details for {workspace.name}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            <div className="flex-1 space-y-8 overflow-y-auto p-8">
              <section>
                <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-600">
                  General Information
                </h2>

                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <Field label="Workspace Name" error={errors.name}>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="input"
                      />
                    </Field>
                  </div>

                  <Field label="Workspace Type" error={errors.workspace_type}>
                    <select
                      value={data.workspace_type}
                      onChange={(e) =>
                        setData("workspace_type", e.target.value)
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
                      onChange={(e) => setData("capacity", e.target.value)}
                      className="input"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-600">
                  Logistics & Pricing
                </h2>

                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <Field label="Physical Location">
                      <input
                        type="text"
                        value={data.location}
                        onChange={(e) => setData("location", e.target.value)}
                        className="input"
                      />
                    </Field>
                  </div>

                  <Field label="Floor">
                    <input
                      type="text"
                      value={data.floor}
                      onChange={(e) => setData("floor", e.target.value)}
                      className="input"
                    />
                  </Field>

                  <Field label="Zone / Wing">
                    <input
                      type="text"
                      value={data.zone}
                      onChange={(e) => setData("zone", e.target.value)}
                      className="input"
                    />
                  </Field>

                  <Field label="Hourly Rate" error={errors.hourly_rate}>
                    <input
                      type="number"
                      value={data.hourly_rate}
                      onChange={(e) => setData("hourly_rate", e.target.value)}
                      className="input"
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={data.active ? "active" : "inactive"}
                      onChange={(e) =>
                        setData("active", e.target.value === "active")
                      }
                      className="input"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Field>
                </div>

                <div className="mt-5">
                  <Field label="Description">
                    <textarea
                      value={data.description}
                      onChange={(e) => setData("description", e.target.value)}
                      rows="4"
                      className="input"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-600">
                  Amenities
                </h2>

                {amenities.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No amenities available.
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
              </section>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-6">
              <Link
                href={`/workspaces/${workspace.id}`}
                className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-60"
              >
                {processing ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ label, error, children }) {
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