import { motion } from "motion/react";
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
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <AmenityForm errors={errors} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <AmenitiesList amenities={amenities} />
        </motion.div>
      </section>
    </AppLayout>
  );
}
