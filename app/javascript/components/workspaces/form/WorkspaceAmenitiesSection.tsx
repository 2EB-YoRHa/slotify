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
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <IconBox icon={Sparkles} large />

          <div>
            <h2 className="text-2xl font-bold text-slate-950">Amenities</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select the features available in this workspace.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600">
          {selectedAmenityIds.length} selected
        </span>
      </div>

      {amenities.length === 0 ? (
        <EmptyAmenitiesState />
      ) : (
        <div className="grid grid-cols-3 gap-4">
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
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        selected
          ? "border-cyan-300 bg-cyan-50 ring-4 ring-cyan-50"
          : "border-slate-200 bg-white hover:border-cyan-100"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          selected ? "bg-cyan-400 text-white" : "bg-cyan-50 text-cyan-500"
        }`}
      >
        {selected ? (
          <CheckCircle2 size={18} strokeWidth={2.4} />
        ) : (
          <Sparkles size={18} strokeWidth={2.4} />
        )}
      </div>

      <span className="font-bold text-slate-900">{amenity.name}</span>
    </motion.button>
  );
}