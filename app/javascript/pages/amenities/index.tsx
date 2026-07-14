import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import AmenityForm from "../../components/amenities/AmenityForm";
import AmenitiesList from "../../components/amenities/AmenitiesList";
import DeleteAmenityModal from "../../components/amenities/DeleteAmenityModal";
import type { Amenity } from "../../types/amenity";

type AmenitiesErrors = {
  name?: string | string[];
};

type AmenitiesIndexProps = {
  amenities?: Amenity[];
  errors?: AmenitiesErrors;
};

export default function AmenitiesIndex({
  amenities = [],
  errors = {},
}: AmenitiesIndexProps) {
  const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Amenities</h1>

          <p className="mt-1 text-slate-500">
            Manage the features that can be assigned to workspaces.
          </p>
        </div>

        <a
          href="/workspaces"
          className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Back to Workspaces
        </a>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <section className="col-span-2">
          <AmenitiesList
            amenities={amenities}
            onRequestDelete={setAmenityToDelete}
          />
        </section>

        <aside className="space-y-6">
          <AmenityForm errors={errors} />

          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-6">
            <h2 className="font-bold text-slate-800">How this is used</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Amenities are selected when creating or editing a workspace. They
              help members understand what each space includes before booking.
            </p>
          </div>
        </aside>
      </div>

      <DeleteAmenityModal
        amenity={amenityToDelete}
        onClose={() => setAmenityToDelete(null)}
      />
    </AppLayout>
  );
}