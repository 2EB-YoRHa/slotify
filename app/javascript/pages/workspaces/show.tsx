import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  Edit,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import AppLayout from "../../components/AppLayout";
import WorkspaceGallery from "../../components/workspaces/WorkspaceGallery";
import type { Reservation } from "../../types/reservation";
import type { Workspace } from "../../types/workspace";

type WorkspaceShowProps = {
  workspace: Workspace;
  reservations?: Reservation[];
  reservation_count?: number;
};

export default function WorkspaceShow({
  workspace,
  reservations = [],
  reservation_count = 0,
}: WorkspaceShowProps) {
  return (
    <AppLayout>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            Back to Workspaces
          </Link>
        </motion.div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
                  workspace.active
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {workspace.active ? "Active" : "Inactive"}
              </span>

              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                {formatWorkspaceType(workspace.workspace_type)}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
              {workspace.name}
            </h1>

            <p className="mt-3 max-w-3xl text-slate-500">
              {workspace.description || "No description added yet."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex gap-3"
          >
            <Link
              href={`/workspaces/${workspace.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
            >
              <Edit size={16} />
              Edit
            </Link>

            <Link
              href={`/workspaces/${workspace.id}/delete`}
              className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={16} />
              Delete
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-[1.15fr_0.85fr] gap-6">
        <WorkspaceGallery workspace={workspace} />

        <section className="space-y-6">
          <WorkspaceInfoCard workspace={workspace} />

          <WorkspaceAmenitiesCard workspace={workspace} />

          <ReservationSummaryCard
            reservationCount={reservation_count}
            reservations={reservations}
          />
        </section>
      </div>
    </AppLayout>
  );
}

type WorkspaceInfoCardProps = {
  workspace: Workspace;
};

function WorkspaceInfoCard({ workspace }: WorkspaceInfoCardProps) {
  const items = [
    {
      label: "Capacity",
      value: `${workspace.capacity} people`,
      icon: Users,
    },
    {
      label: "Hourly Rate",
      value: `$${workspace.hourly_rate || 0}`,
      icon: CalendarClock,
    },
    {
      label: "Location",
      value: workspace.location || "Not specified",
      icon: MapPin,
    },
    {
      label: "Floor / Zone",
      value: [workspace.floor, workspace.zone].filter(Boolean).join(" · ") || "Not specified",
      icon: Building2,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-extrabold text-slate-950">
        Workspace Details
      </h2>

      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                <Icon size={18} strokeWidth={2.4} />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  {item.label}
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkspaceAmenitiesCard({ workspace }: WorkspaceInfoCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-extrabold text-slate-950">Amenities</h2>

      {workspace.amenities && workspace.amenities.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {workspace.amenities.map((amenity) => (
            <span
              key={amenity.id}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700"
            >
              <CheckCircle2 size={14} />
              {amenity.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-500">No amenities assigned.</p>
      )}
    </div>
  );
}

type ReservationSummaryCardProps = {
  reservationCount: number;
  reservations: Reservation[];
};

function ReservationSummaryCard({
  reservationCount,
  reservations,
}: ReservationSummaryCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Reservation History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {reservationCount} total reservation
            {reservationCount === 1 ? "" : "s"}
          </p>
        </div>

        <Link
          href="/reservations"
          className="text-sm font-bold text-cyan-500 hover:text-cyan-600"
        >
          View all
        </Link>
      </div>

      {reservations.length === 0 ? (
        <p className="text-sm text-slate-500">No reservations yet.</p>
      ) : (
        <div className="space-y-3">
          {reservations.slice(0, 5).map((reservation) => (
            <div
              key={reservation.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-bold text-slate-700">
                {formatDateTime(reservation.start_time)}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {reservation.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatWorkspaceType(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}