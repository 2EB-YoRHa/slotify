import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";

export default function NewWorkspace({ amenities = [], errors = {} }) {
    const { data, setData, post, processing, transform } = useForm({
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
    });

    function handleSubmit(event) {
        event.preventDefault();

        transform((data) => ({
            workspace: {
                ...data,
                amenity_ids: data.amenity_ids,
            },
        }));

        post("/workspaces");
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
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Add New Workspace</h1>
                    <p className="mt-1 text-slate-500">
                        Create a new bookable spot for your team.
                    </p>
                </div>

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
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="e.g. Skyline Conference Room"
                                    className="input"
                                />
                            </Field>

                            <Field label="Type" error={errors.workspace_type}>
                                <select
                                    value={data.workspace_type}
                                    onChange={(e) => setData("workspace_type", e.target.value)}
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
                                    placeholder="Max people"
                                    className="input"
                                />
                            </Field>

                            <Field label="Hourly Rate" error={errors.hourly_rate}>
                                <input
                                    type="number"
                                    value={data.hourly_rate}
                                    onChange={(e) => setData("hourly_rate", e.target.value)}
                                    placeholder="Price per hour"
                                    className="input"
                                />
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
                                    onChange={(e) => setData("floor", e.target.value)}
                                    placeholder="e.g. 4"
                                    className="input"
                                />
                            </Field>

                            <Field label="Zone / Wing">
                                <input
                                    type="text"
                                    value={data.zone}
                                    onChange={(e) => setData("zone", e.target.value)}
                                    placeholder="e.g. East Wing"
                                    className="input"
                                />
                            </Field>

                            <div className="col-span-2">
                                <Field label="Location">
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData("location", e.target.value)}
                                        placeholder="e.g. Main Campus, Building A"
                                        className="input"
                                    />
                                </Field>
                            </div>

                            <div className="col-span-2">
                                <Field label="Description">
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Describe this workspace..."
                                        rows="4"
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
                                            checked={data.amenity_ids.includes(amenity.id)}
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
                            href="/workspaces"
                            className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-60"
                        >
                            {processing ? "Saving..." : "Save Workspace"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </span>

            {children}

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </label>
    );
}