import { motion } from "motion/react";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { Amenity } from "../../../types/amenity";
import { FormError, IconBox } from "./WorkspaceFormFields";

type WorkspaceAmenitiesSectionProps = {
  amenities: Amenity[];
  selectedAmenityIds: number[];
  processing: boolean;
  error?: string | string[];
  onToggleAmenity: (amenityId: number) => void;
};

export default function WorkspaceAmenitiesSection({
  amenities,
  selectedAmenityIds,
  processing,
  error,
  onToggleAmenity,
}: WorkspaceAmenitiesSectionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <IconBox icon={Sparkles} large />

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
              Amenities
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Select the features available in this workspace.
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
          {selectedAmenityIds.length} selected
        </span>
      </div>

      {amenities.length === 0 ? (
        <EmptyAmenitiesState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {amenities.map((amenity, index) => {
            const selected = selectedAmenityIds.includes(amenity.id);

            return (
              <AmenityOption
                key={amenity.id}
                amenity={amenity}
                index={index}
                selected={selected}
                disabled={processing}
                onToggle={() => onToggleAmenity(amenity.id)}
              />
            );
          })}
        </div>
      )}

      <FormError error={error} />
    </div>
  );
}

function EmptyAmenitiesState() {
  return (
    <div className="rounded-xl bg-slate-50 px-5 py-10 text-center transition-colors dark:bg-slate-800/60 sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-colors dark:bg-slate-900 dark:text-slate-500">
        <Sparkles size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        No amenities available
      </h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Create amenities first before assigning them to workspaces.
      </p>
    </div>
  );
}

type AmenityOptionProps = {
  amenity: Amenity;
  index: number;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
};

function AmenityOption({
  amenity,
  index,
  selected,
  disabled,
  onToggle,
}: AmenityOptionProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      onClick={onToggle}
      disabled={disabled}
      className={`flex min-w-0 items-center gap-3 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        selected
          ? "border-cyan-300 bg-cyan-50 ring-4 ring-cyan-50 dark:border-cyan-500/50 dark:bg-cyan-500/10 dark:ring-cyan-500/15"
          : "border-slate-200 bg-white hover:border-cyan-100 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-cyan-500/40"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          selected
            ? "bg-cyan-400 text-white dark:bg-cyan-300 dark:text-slate-950"
            : "bg-cyan-50 text-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-300"
        }`}
      >
        {selected ? (
          <CheckCircle2 size={18} strokeWidth={2.4} />
        ) : (
          <Sparkles size={18} strokeWidth={2.4} />
        )}
      </div>

      <span className="min-w-0 truncate font-bold text-slate-900 dark:text-slate-100">
        {amenity.name}
      </span>
    </motion.button>
  );
}