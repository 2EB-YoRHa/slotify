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
    amenity.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-950 sm:text-xl">
              Amenity Library
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Features available to assign across your workspaces.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
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

        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 sm:px-6">
          Showing {filteredAmenities.length} of {amenities.length} amenities
        </div>

        {filteredAmenities.length === 0 ? (
          <div className="px-5 py-10 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Sparkles size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No amenities found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Try changing the search text or create a new amenity.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6">
            {filteredAmenities.map((amenity, index) => (
              <AmenityCard
                key={amenity.id}
                amenity={amenity}
                index={index}
                onDelete={() => setSelectedAmenity(amenity)}
              />
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

type AmenityCardProps = {
  amenity: Amenity;
  index: number;
  onDelete: () => void;
};

function AmenityCard({ amenity, index, onDelete }: AmenityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-100 hover:bg-cyan-50/30 hover:shadow-sm"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Sparkles size={18} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <p className="wrap-break-word font-bold text-slate-950">
            {amenity.name}
          </p>
          <p className="text-xs text-slate-400">Workspace feature</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-sm"
        title="Delete amenity"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}