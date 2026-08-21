import {
  Building2,
  DollarSign,
  Layers3,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import ReservationStatusBadge from "../ReservationStatusBadge";
import WorkspacePhoto from "../../workspaces/WorkspacePhoto";
import {
  formatRate,
  formatText,
  IconBox,
  InfoCard,
} from "./ReservationShowShared";
import type {
  AmenityChipData,
  ReservationShowData,
} from "../../../types/reservationShowTypes";

type ReservationWorkspacePanelProps = {
  reservation: ReservationShowData;
};

export default function ReservationWorkspacePanel({
  reservation,
}: ReservationWorkspacePanelProps) {
  const workspaceAmenities = reservation.workspace?.amenities || [];

  return (
    <>
      <WorkspacePhoto
        name={reservation.workspace?.name || "Workspace"}
        photoUrl={reservation.workspace?.photo_url}
        galleryPhotos={reservation.workspace?.gallery_photos || []}
        fit="contain"
        position="object-center"
        showThumbnails
        showControls
        className="h-64 rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-800 dark:shadow-slate-950/30 sm:h-96 xl:h-105"
      />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <IconBox icon={Building2} />

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
                Workspace Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Details about the space assigned to this reservation.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <ReservationStatusBadge status={reservation.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          <InfoCard
            icon={Building2}
            label="Workspace"
            value={reservation.workspace?.name || "Workspace removed"}
          />

          <InfoCard
            icon={Layers3}
            label="Type"
            value={formatText(reservation.workspace?.workspace_type)}
          />

          <InfoCard
            icon={UsersRound}
            label="Capacity"
            value={reservation.workspace?.capacity || "-"}
          />

          <InfoCard
            icon={DollarSign}
            label="Hourly Rate"
            value={formatRate(reservation.workspace?.hourly_rate)}
          />

          <InfoCard
            icon={Building2}
            label="Floor"
            value={reservation.workspace?.floor || "-"}
          />

          <InfoCard
            icon={MapPin}
            label="Zone"
            value={reservation.workspace?.zone || "-"}
          />

          <div className="sm:col-span-2 xl:col-span-3">
            <InfoCard
              icon={MapPin}
              label="Location"
              value={reservation.workspace?.location || "-"}
            />
          </div>

          <div className="border-t border-slate-100 pt-6 transition-colors dark:border-slate-800 sm:col-span-2 xl:col-span-3">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <IconBox icon={Sparkles} size="sm" />

                <div className="min-w-0">
                  <h3 className="font-bold text-slate-950 dark:text-slate-100">
                    Amenities Included
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Features available with this workspace reservation.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-400 transition-colors dark:bg-slate-800 dark:text-slate-500">
                {workspaceAmenities.length} assigned
              </span>
            </div>

            <AmenityChips amenities={workspaceAmenities} />
          </div>
        </div>
      </div>
    </>
  );
}

type AmenityChipsProps = {
  amenities: AmenityChipData[];
};

function AmenityChips({ amenities }: AmenityChipsProps) {
  if (amenities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-500">
        No amenities assigned to this workspace.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((amenity) => (
        <span
          key={amenity.id}
          className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
        >
          <Sparkles
            size={13}
            className="shrink-0 text-cyan-500 dark:text-cyan-300"
          />
          <span className="truncate">{amenity.name}</span>
        </span>
      ))}
    </div>
  );
}
