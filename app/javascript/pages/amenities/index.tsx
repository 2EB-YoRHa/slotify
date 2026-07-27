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
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-950"
        >
          Amenities
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 max-w-2xl text-slate-500"
        >
          Manage reusable workspace features such as Wi-Fi, parking, projectors,
          and meeting equipment.
        </motion.p>
      </div>

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