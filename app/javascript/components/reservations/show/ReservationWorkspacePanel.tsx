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
        fit="contain"
        position="object-center"
        className="h-105 rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
      />

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <IconBox icon={Building2} />

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Workspace Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Details about the space assigned to this reservation.
              </p>
            </div>
          </div>

          <ReservationStatusBadge status={reservation.status} />
        </div>

        <div className="grid grid-cols-3 gap-5">
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

          <div className="col-span-3">
            <InfoCard
              icon={MapPin}
              label="Location"
              value={reservation.workspace?.location || "-"}
            />
          </div>

          <div className="col-span-3 border-t border-slate-100 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconBox icon={Sparkles} size="sm" />

                <div>
                  <h3 className="font-bold text-slate-950">
                    Amenities Included
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Features available with this workspace reservation.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-400">
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
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-400">
        No amenities assigned to this workspace.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((amenity) => (
        <span
          key={amenity.id}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
        >
          <Sparkles size={13} className="text-cyan-500" />
          {amenity.name}
        </span>
      ))}
    </div>
  );
}