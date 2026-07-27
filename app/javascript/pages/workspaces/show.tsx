import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  DollarSign,
  Edit3,
  Layers3,
  MapPin,
  Sparkles,
  Trash2,
  UsersRound,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import ReservationStatusBadge from "../../components/reservations/ReservationStatusBadge";
import { formatDate, formatTime } from "../../utils/dateTime";
import type { Amenity } from "../../types/amenity";
import type { Workspace } from "../../types/workspace";

type WorkspaceWithAmenities = Workspace & {
  amenities?: Amenity[];
};

type WorkspaceReservation = {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  user?: {
    id: number;
    name: string;
    email?: string | null;
  } | null;
};

type WorkspaceShowProps = {
  workspace: WorkspaceWithAmenities;
  reservations?: WorkspaceReservation[];
  reservation_count?: number;
};

export default function WorkspaceShow({
  workspace,
  reservations = [],
  reservation_count = 0,
}: WorkspaceShowProps) {
  const amenities = workspace.amenities || [];
  const activeLabel = workspace.active ? "Active" : "Inactive";

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
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

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mt-6 text-3xl font-bold text-slate-950"
          >
            Workspace: {workspace.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-2 max-w-2xl text-slate-500"
          >
            Review workspace details, amenities, pricing, location, and
            reservation activity.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-3"
        >
          <Link
            href={`/reservations/new?workspace_id=${workspace.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
          >
            <CalendarPlus size={18} />
            Reserve
          </Link>

          <Link
            href={`/workspaces/${workspace.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md"
          >
            <Edit3 size={18} />
            Edit
          </Link>

          <Link
            href={`/workspaces/${workspace.id}/delete`}
            className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-3 text-sm font-bold text-red-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md"
          >
            <Trash2 size={18} />
            Delete
          </Link>
        </motion.div>
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        <SummaryCard
          index={0}
          icon={Building2}
          label="Type"
          value={formatText(workspace.workspace_type)}
          helper="Workspace category"
        />

        <SummaryCard
          index={1}
          icon={UsersRound}
          label="Capacity"
          value={workspace.capacity}
          helper="Maximum attendees"
        />

        <SummaryCard
          index={2}
          icon={DollarSign}
          label="Hourly Rate"
          value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}`}
          helper="Price per hour"
        />

        <SummaryCard
          index={3}
          icon={workspace.active ? CheckCircle2 : XCircle}
          label="Status"
          value={activeLabel}
          helper={workspace.active ? "Available to reserve" : "Not available"}
        />
      </section>

      <section className="grid grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 space-y-8"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                  <Building2 size={26} strokeWidth={2.4} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Workspace Information
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Main details used for reservations and availability.
                  </p>
                </div>
              </div>

              <StatusBadge active={workspace.active} />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <InfoCard icon={Building2} label="Name" value={workspace.name} />

              <InfoCard
                icon={Layers3}
                label="Type"
                value={formatText(workspace.workspace_type)}
              />

              <InfoCard
                icon={UsersRound}
                label="Capacity"
                value={workspace.capacity}
              />

              <InfoCard
                icon={DollarSign}
                label="Hourly Rate"
                value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}`}
              />

              <InfoCard
                icon={Building2}
                label="Floor"
                value={workspace.floor || "-"}
              />

              <InfoCard
                icon={MapPin}
                label="Zone"
                value={workspace.zone || "-"}
              />

              <div className="col-span-2">
                <InfoCard
                  icon={MapPin}
                  label="Location"
                  value={workspace.location || "-"}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <Sparkles size={26} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-950">Amenities</h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Features available in this workspace.
                </p>
              </div>
            </div>

            {amenities.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Sparkles size={24} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No amenities assigned
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Edit this workspace to assign amenities.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <motion.div
                    key={amenity.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.035 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                      <Sparkles size={18} strokeWidth={2.4} />
                    </div>

                    <p className="font-bold text-slate-900">{amenity.name}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <CalendarClock size={26} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Recent Reservations
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Latest bookings related to this workspace.
                </p>
              </div>
            </div>

            {reservations.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CalendarClock size={24} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No reservations yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  This workspace has no reservation history.
                </p>
              </div>
            ) : (
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[26%]" />
                  <col className="w-[24%]" />
                  <col className="w-[30%]" />
                  <col className="w-[20%]" />
                </colgroup>

                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-4 text-left font-bold">Member</th>
                    <th className="px-4 py-4 text-center font-bold">Date</th>
                    <th className="px-4 py-4 text-center font-bold">Time</th>
                    <th className="px-4 py-4 text-center font-bold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map((reservation, index) => (
                    <motion.tr
                      key={reservation.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.035 }}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-5 align-middle">
                        <p className="font-bold text-slate-950">
                          {reservation.user?.name || "Unknown user"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {reservation.user?.email || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-5 text-center align-middle text-slate-600">
                        {formatDate(reservation.start_time)}
                      </td>

                      <td className="px-4 py-5 text-center align-middle text-slate-600">
                        <div className="inline-flex items-center gap-2">
                          <Clock3 size={15} className="text-slate-400" />
                          {formatTime(reservation.start_time)} -{" "}
                          {formatTime(reservation.end_time)}
                        </div>
                      </td>

                      <td className="px-4 py-5 text-center align-middle">
                        <ReservationStatusBadge status={reservation.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <Building2 size={26} strokeWidth={2.4} />
              </div>

              <h2 className="text-2xl font-bold text-slate-950">
                Workspace Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Quick overview of this workspace.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <SummaryRow label="Name" value={workspace.name} />

              <SummaryRow
                label="Type"
                value={formatText(workspace.workspace_type)}
              />

              <SummaryRow label="Capacity" value={workspace.capacity} />

              <SummaryRow
                label="Rate"
                value={`$${Number(workspace.hourly_rate || 0).toFixed(2)}`}
              />

              <SummaryRow label="Status" value={activeLabel} />

              <SummaryRow label="Reservations" value={reservation_count} />
            </div>
          </div>
        </motion.aside>
      </section>
    </AppLayout>
  );
}

type SummaryCardProps = {
  index: number;
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper: string;
};

function SummaryCard({
  index,
  icon: Icon,
  label,
  value,
  helper,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">{value}</h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{helper}</p>
    </motion.div>
  );
}

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>

      <p className="wrap-break-word text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
