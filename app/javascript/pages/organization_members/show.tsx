import { Link, router } from "@inertiajs/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarCheck,
  Clock3,
  Mail,
  Power,
  PowerOff,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingButton from "../../components/ui/LoadingButton";
import { formatDate, formatTime } from "../../utils/dateTime";
import type { Role } from "../../types/organization";

type Member = {
  id: number;
  name: string;
  email: string;
  active: boolean;
  created_at?: string | null;
  role?: Role | null;
};

type MemberReservation = {
  id: number;
  workspace_name: string;
  start_time: string;
  end_time: string;
  status: string;
};

type OrganizationMemberShowProps = {
  member: Member;
  reservations?: MemberReservation[];
  reservation_count?: number;
  can_toggle_access?: boolean;
};

export default function OrganizationMemberShow({
  member,
  reservations = [],
  reservation_count = 0,
  can_toggle_access = false,
}: OrganizationMemberShowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  function toggleAccess() {
    setProcessing(true);

    router.patch(
      `/organization/members/${member.id}/toggle_active`,
      {},
      {
        onFinish: () => {
          setProcessing(false);
          setConfirmOpen(false);
        },
      }
    );
  }

  const stats = [
    {
      label: "Role",
      value: formatRole(member.role?.name),
      helper: "Current permission level",
      icon: ShieldCheck,
    },
    {
      label: "Access",
      value: member.active ? "Active" : "Inactive",
      helper: member.active ? "Can sign in" : "Access disabled",
      icon: member.active ? Power : PowerOff,
    },
    {
      label: "Reservations",
      value: reservation_count,
      helper: "Historical bookings",
      icon: CalendarCheck,
    },
    {
      label: "Joined",
      value: member.created_at ? formatDate(member.created_at) : "-",
      helper: "Account creation date",
      icon: UserRound,
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/organization"
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-600"
            >
              <ArrowLeft size={16} />
              Back to Organization
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mt-6 text-sm font-bold uppercase tracking-wide text-cyan-500"
          >
            Member Management
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-2 text-3xl font-bold text-slate-950"
          >
            Manage Member
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-1 text-slate-500"
          >
            Review this member profile, access status and reservation activity.
          </motion.p>
        </div>

        {can_toggle_access && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <LoadingButton
              type="button"
              variant={member.active ? "danger" : "primary"}
              loading={false}
              onClick={() => setConfirmOpen(true)}
            >
              {member.active ? "Deactivate Access" : "Activate Access"}
            </LoadingButton>
          </motion.div>
        )}
      </div>

      {!can_toggle_access && (
        <div className="mb-6 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
          You cannot deactivate your own account.
        </div>
      )}

      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <MemberStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <section className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-cyan-50 text-2xl font-extrabold text-cyan-500">
                {initials(member.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-950">
                      {member.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-slate-500">
                      <Mail size={16} />
                      <span className="text-sm">{member.email}</span>
                    </div>
                  </div>

                  <StatusBadge active={member.active} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <InfoCard
                    icon={ShieldCheck}
                    label="Role"
                    value={formatRole(member.role?.name)}
                  />

                  <InfoCard
                    icon={Power}
                    label="Access"
                    value={member.active ? "Enabled" : "Disabled"}
                  />

                  <InfoCard icon={Mail} label="Email" value={member.email} />

                  <InfoCard
                    icon={CalendarCheck}
                    label="Total Reservations"
                    value={reservation_count}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <IconBox icon={CalendarCheck} />

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Recent Reservations
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest reservations created by this member.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                {reservations.length} shown
              </span>
            </div>

            {reservations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CalendarCheck size={24} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No reservations yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  This member has not created any reservations.
                </p>
              </div>
            ) : (
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[34%]" />
                  <col className="w-[22%]" />
                  <col className="w-[26%]" />
                  <col className="w-[18%]" />
                </colgroup>

                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">
                      Workspace
                    </th>

                    <th className="px-6 py-4 text-center font-bold">
                      Date
                    </th>

                    <th className="px-6 py-4 text-center font-bold">
                      Time
                    </th>

                    <th className="px-6 py-4 text-center font-bold">
                      Status
                    </th>
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
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                            <Building2 size={18} strokeWidth={2.4} />
                          </div>

                          <div className="truncate font-bold text-slate-950">
                            {reservation.workspace_name}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center align-middle text-slate-600">
                        {formatDate(reservation.start_time)}
                      </td>

                      <td className="px-6 py-5 text-center align-middle text-slate-600">
                        <div className="inline-flex items-center gap-2">
                          <Clock3 size={15} className="text-slate-400" />
                          {formatTime(reservation.start_time)} -{" "}
                          {formatTime(reservation.end_time)}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center align-middle">
                        <ReservationStatus status={reservation.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="space-y-6"
        >
          <SidePanel title="Access Control" icon={member.active ? Power : PowerOff}>
            <p className="text-sm leading-6 text-slate-500">
              Deactivating a member prevents them from signing in, but keeps
              their historical reservations available for reports and audit.
            </p>

            {can_toggle_access ? (
              <LoadingButton
                type="button"
                variant={member.active ? "danger" : "primary"}
                loading={false}
                onClick={() => setConfirmOpen(true)}
                className="mt-6 w-full"
              >
                {member.active ? "Deactivate Access" : "Activate Access"}
              </LoadingButton>
            ) : (
              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                You cannot disable your own access.
              </div>
            )}
          </SidePanel>

          <SidePanel title="Member Summary" icon={UserRound}>
            <SummaryRow label="Name" value={member.name} />
            <SummaryRow label="Role" value={formatRole(member.role?.name)} />
            <SummaryRow
              label="Status"
              value={member.active ? "Active" : "Inactive"}
            />
            <SummaryRow label="Bookings" value={reservation_count} />
          </SidePanel>
        </motion.aside>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title={member.active ? "Deactivate member?" : "Activate member?"}
        description={
          member.active
            ? `This will prevent ${member.name} from signing in to Slotify. Their reservations will remain in the system.`
            : `This will allow ${member.name} to sign in to Slotify again.`
        }
        confirmText={member.active ? "Deactivate Access" : "Activate Access"}
        cancelText="Cancel"
        danger={member.active}
        processing={processing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={toggleAccess}
      />
    </AppLayout>
  );
}

type MemberStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type MemberStatCardProps = {
  stat: MemberStat;
  index: number;
};

function MemberStatCard({ stat, index }: MemberStatCardProps) {
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

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <IconBox icon={Icon} />
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}

type IconBoxProps = {
  icon: LucideIcon;
};

function IconBox({ icon: Icon }: IconBoxProps) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
      <Icon size={19} strokeWidth={2.4} />
    </div>
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

      <p className="break-words text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SidePanelProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
};

function SidePanel({ title, icon: Icon, children }: SidePanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <IconBox icon={Icon} />

        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>

      {children}
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
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

function ReservationStatus({ status }: { status: string }) {
  const className =
    status === "cancelled"
      ? "bg-red-50 text-red-600"
      : status === "confirmed"
        ? "bg-green-50 text-green-600"
        : "bg-yellow-50 text-yellow-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {formatRole(status)}
    </span>
  );
}

function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}