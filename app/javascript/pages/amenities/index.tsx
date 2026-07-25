import { motion } from "motion/react";
import {
  PlusCircle,
  Sparkles,
  Tags,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
  const stats = [
    {
      label: "Total Amenities",
      value: amenities.length,
      helper: "Available options",
      icon: Sparkles,
    },
    {
      label: "Workspace Features",
      value: amenities.length,
      helper: "Reusable tags",
      icon: Tags,
    },
    {
      label: "Configuration",
      value: "Active",
      helper: "Ready for assignment",
      icon: Wrench,
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-500"
        >
          Workspace Configuration
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl font-bold text-slate-950"
        >
          Amenities
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-slate-500"
        >
          Create and manage amenities that can be assigned to workspaces.
        </motion.p>
      </div>

      <section className="mb-8 grid grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <AmenityStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <section className="grid grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-1"
        >
          <AmenityForm errors={errors} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="col-span-2"
        >
          <AmenitiesList amenities={amenities} />
        </motion.div>
      </section>
    </AppLayout>
  );
}

type AmenityStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type AmenityStatCardProps = {
  stat: AmenityStat;
  index: number;
};

function AmenityStatCard({ stat, index }: AmenityStatCardProps) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}