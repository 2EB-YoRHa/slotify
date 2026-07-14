import { router } from "@inertiajs/react";
import type { Amenity } from "../../types/amenity";

type DeleteAmenityModalProps = {
  amenity: Amenity | null;
  onClose: () => void;
};

export default function DeleteAmenityModal({
  amenity,
  onClose,
}: DeleteAmenityModalProps) {
  if (!amenity) return null;

  function confirmDelete() {
    if (!amenity) return;

    router.delete(`/amenities/${amenity.id}`, {
      onSuccess: onClose,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-500">
            !
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Delete Amenity
            </h2>

            <p className="text-sm text-slate-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-bold text-slate-900">{amenity.name}</span>?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmDelete}
            className="flex-1 rounded-lg bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}