import type { Amenity } from "../../types/amenity";

type AmenitiesListProps = {
  amenities: Amenity[];
  onRequestDelete: (amenity: Amenity) => void;
};

export default function AmenitiesList({
  amenities,
  onRequestDelete,
}: AmenitiesListProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Existing Amenities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            These options appear when creating or editing workspaces.
          </p>
        </div>

        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-500">
          {amenities.length} total
        </span>
      </div>

      {amenities.length === 0 ? (
        <NoAmenities />
      ) : (
        <div className="divide-y divide-slate-100">
          {amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  ✦
                </div>

                <div>
                  <p className="font-bold text-slate-900">{amenity.name}</p>

                  <p className="text-sm text-slate-400">Workspace feature</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRequestDelete(amenity)}
                className="rounded-lg border border-red-100 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NoAmenities() {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-50 text-4xl text-cyan-400">
        ✦
      </div>

      <h3 className="text-xl font-bold text-slate-900">No amenities yet</h3>

      <p className="mt-2 text-slate-500">
        Create your first amenity to start tagging workspaces.
      </p>
    </div>
  );
}