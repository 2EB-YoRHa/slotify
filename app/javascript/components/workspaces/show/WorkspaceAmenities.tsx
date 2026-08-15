import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import type { Amenity } from "../../../types/amenity";
import { IconBox } from "./WorkspaceShowShared";

type WorkspaceAmenitiesProps = {
  amenities: Amenity[];
  isMember: boolean;
};

export default function WorkspaceAmenities({
  amenities,
  isMember,
}: WorkspaceAmenitiesProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
        <IconBox icon={Sparkles} />

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
            Amenities
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Features available in this workspace.
          </p>
        </div>
      </div>

      {amenities.length === 0 ? (
        <EmptyAmenitiesState isMember={isMember} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                <Sparkles size={18} strokeWidth={2.4} />
              </div>

              <p className="truncate font-bold text-slate-900">
                {amenity.name}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyAmenitiesState({ isMember }: { isMember: boolean }) {
  return (
    <div className="rounded-xl bg-slate-50 px-5 py-10 text-center sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Sparkles size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No amenities assigned
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {isMember
          ? "This workspace does not have amenities listed yet."
          : "Edit this workspace to assign amenities."}
      </p>
    </div>
  );
}