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
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
        <div className="flex flex-col gap-5 border-b border-slate-200 p-4 transition-colors dark:border-slate-800 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">
              Amenity Library
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Features available to assign across your workspaces.
            </p>
          </div>

          <div className="relative w-full lg:w-72 lg:shrink-0">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search amenities..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/20"
            />
          </div>
        </div>

        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 transition-colors dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-500 sm:px-6">
          Showing {filteredAmenities.length} of {amenities.length} amenities
        </div>

        {filteredAmenities.length === 0 ? (
          <EmptyAmenities hasAmenities={amenities.length > 0} />
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 sm:p-6">
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

function EmptyAmenities({ hasAmenities }: { hasAmenities: boolean }) {
  return (
    <div className="px-5 py-10 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-500">
        <Sparkles size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        {hasAmenities ? "No amenities found" : "No amenities yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {hasAmenities
          ? "Try changing the search text or create a new amenity."
          : "Create your first reusable amenity so it can be assigned to workspaces."}
      </p>
    </div>
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
      className="flex min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-100 hover:bg-cyan-50/30 hover:shadow-sm dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
          <Sparkles size={18} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <p className="wrap-break-word font-bold text-slate-950 dark:text-slate-100">
            {amenity.name}
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Workspace feature
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-sm font-bold text-red-500 transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-sm dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10 sm:h-9 sm:w-9 sm:px-0"
        title="Delete amenity"
      >
        <Trash2 size={16} />
        <span className="sm:hidden">Delete</span>
      </button>
    </motion.div>
  );
}