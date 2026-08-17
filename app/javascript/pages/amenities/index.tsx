import AppLayout from "../../components/AppLayout";
import AmenityForm from "../../components/amenities/AmenityForm";
import AmenitiesList from "../../components/amenities/AmenitiesList";
import type { Amenity } from "../../types/amenity";

type AmenitiesIndexProps = {
  amenities?: Amenity[];
  errors?: Partial<Record<string, string | string[]>>;
};

export default function AmenitiesIndex({
  amenities = [],
  errors = {},
}: AmenitiesIndexProps) {
  return (
    <AppLayout>
      <section className="space-y-6 sm:space-y-8">
        <AmenityForm errors={errors} />
        <AmenitiesList amenities={amenities} />
      </section>
    </AppLayout>
  );
}