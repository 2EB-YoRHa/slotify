import { motion } from "motion/react";
import { Search, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteAmenityModal from "./DeleteAmenityModal";
import type { Amenity } from "../../types/amenity";

type AmenitiesListProps = {
  amenities: Amenity[];
};

export default function AmenitiesList({ amenities }: AmenitiesListProps) {
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [search, setSearch] = useState("");

  const filteredAmenities = amenities.filter((amenity) =>
    amenity.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Amenity Library
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Features available to assign across your workspaces.
            </p>
          </div>

          <div className="relative w-72">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search amenities..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
            />
          </div>
        </div>

        <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          Showing {filteredAmenities.length} of {amenities.length} amenities
        </div>

        {filteredAmenities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Sparkles size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No amenities found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing the search text or create a new amenity.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-6">
            {filteredAmenities.map((amenity, index) => (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-100 hover:bg-cyan-50/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                    <Sparkles size={18} strokeWidth={2.4} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-950">{amenity.name}</p>
                    <p className="text-xs text-slate-400">Workspace feature</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAmenity(amenity)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-sm"
                  title="Delete amenity"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <DeleteAmenityModal
        amenity={selectedAmenity}
        onClose={() => setSelectedAmenity(null)}
      />
    </>
  );
}