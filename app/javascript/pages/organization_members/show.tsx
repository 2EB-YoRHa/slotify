import { Link, router } from "@inertiajs/react";
import { useState } from "react";
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
  total_price?: number | string | null;
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

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link
            href="/organization"
            className="text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            ← Back to Organization
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-950">
            Manage Member
          </h1>

          <p className="mt-2 text-slate-500">
            Review this member profile and manage their access.
          </p>
        </div>

        {can_toggle_access && (
          <LoadingButton
            type="button"
            variant={member.active ? "danger" : "primary"}
            loading={false}
            onClick={() => setConfirmOpen(true)}
          >
            {member.active ? "Deactivate Access" : "Activate Access"}
          </LoadingButton>
        )}
      </div>

      {!can_toggle_access && (
        <div className="mb-6 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
          You cannot deactivate your own account.
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        <section className="col-span-2 space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-xl font-bold text-cyan-500">
                {initials(member.name)}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  {member.name}
                </h2>

                <p className="mt-1 text-slate-500">{member.email}</p>

                <div className="mt-4 flex gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {formatRole(member.role?.name)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      member.active
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {member.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5">
              <InfoCard label="Role" value={formatRole(member.role?.name)} />
              <InfoCard
                label="Status"
                value={member.active ? "Active" : "Inactive"}
              />
              <InfoCard label="Email" value={member.email} />
              <InfoCard
                label="Joined"
                value={member.created_at ? formatDate(member.created_at) : "-"}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                Recent Reservations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest reservations created by this member.
              </p>
            </div>

            {reservations.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">
                This member has no reservations yet.
              </div>
            ) : (
              <table className="w-full table-fixed text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">
                      Workspace
                    </th>
                    <th className="px-6 py-4 text-center font-medium">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center font-medium">
                      Time
                    </th>
                    <th className="px-6 py-4 text-center font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {reservation.workspace_name}
                      </td>

                      <td className="px-6 py-4 text-center text-slate-600">
                        {formatDate(reservation.start_time)}
                      </td>

                      <td className="px-6 py-4 text-center text-slate-600">
                        {formatTime(reservation.start_time)} -{" "}
                        {formatTime(reservation.end_time)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {formatRole(reservation.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Member Summary
            </h2>

            <div className="mt-6 space-y-4">
              <SummaryRow label="Total Reservations" value={reservation_count} />
              <SummaryRow label="Current Role" value={formatRole(member.role?.name)} />
              <SummaryRow
                label="Access"
                value={member.active ? "Enabled" : "Disabled"}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Access Control
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Deactivating a member prevents them from signing in, but keeps
              their historical reservations in the system.
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
          </div>
        </aside>
      </div>

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

type InfoCardProps = {
  label: string;
  value: string | number;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-950">{value}</span>
    </div>
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