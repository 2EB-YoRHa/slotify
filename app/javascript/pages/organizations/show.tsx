import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import OrganizationMembersTable from "../../components/organizations/OrganizationMembersTable";
import { useState } from "react";
import InviteMemberModal from "../../components/organizations/InviteMemberModal";
import OrganizationInvitationsList from "../../components/organizations/OrganizationInvitationsList";
import type {
  BookingRule,
  Organization,
  OrganizationInvitation,
  OrganizationUser,
  Role,
  Subscription,
} from "../../types/organization";

type OrganizationShowProps = {
  organization: Organization;
  users?: OrganizationUser[];
  invitations?: OrganizationInvitation[];
  roles?: Role[];
  booking_rule?: BookingRule | null;
  subscription?: Subscription | null;
};

export default function OrganizationShow({
  organization,
  users = [],
  invitations = [],
  roles = [],
  booking_rule = null,
  subscription = null,
}: OrganizationShowProps) {
  const activeUsers = users.filter((user) => user.active).length;
  const inactiveUsers = users.length - activeUsers;
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Organization Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage your coworking organization, members, and reservation rules.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/organization/edit"
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Edit Organization
          </Link>

          <button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
          >
            + Invite Member
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-6">
        <StatCard label="Total Members" value={users.length} />
        <StatCard label="Active Members" value={activeUsers} />
        <StatCard label="Inactive Members" value={inactiveUsers} />
        <StatCard
          label="Current Plan"
          value={subscription?.plan_name || "No Plan"}
        />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <section className="col-span-2 space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Organization Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic information about this coworking organization.
                </p>
              </div>

              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-500">
                {organization.slug}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <InfoItem label="Name" value={organization.name} />
              <InfoItem label="Email" value={organization.email || "-"} />
              <InfoItem label="Phone" value={organization.phone || "-"} />
              <InfoItem label="Address" value={organization.address || "-"} />
            </div>
          </div>

          <OrganizationMembersTable users={users} />
        </section>

        <aside className="space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Subscription</h2>

            <div className="mt-5 rounded-xl bg-cyan-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-500">
                Current Plan
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {subscription?.plan_name || "No active plan"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Status: {subscription?.status || "Not configured"}
              </p>
            </div>

            <Link
              href="/subscription"
              className="mt-5 block rounded-lg border border-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              View Subscription
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Booking Rules</h2>

            {booking_rule ? (
              <div className="mt-5 space-y-4 text-sm">
                <RuleItem
                  label="Max hours per reservation"
                  value={
                    booking_rule.max_hours_per_reservation
                      ? `${booking_rule.max_hours_per_reservation} hours`
                      : "-"
                  }
                />

                <RuleItem
                  label="Minimum notice"
                  value={
                    booking_rule.min_notice_minutes
                      ? `${booking_rule.min_notice_minutes} minutes`
                      : "-"
                  }
                />

                <RuleItem
                  label="Cancellation limit"
                  value={
                    booking_rule.cancellation_limit_hours
                      ? `${booking_rule.cancellation_limit_hours} hours`
                      : "-"
                  }
                />

                <RuleItem
                  label="Weekend bookings"
                  value={
                    booking_rule.allow_weekend_bookings
                      ? "Allowed"
                      : "Not allowed"
                  }
                />
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                No booking rules have been configured yet.
              </p>
            )}

            <Link
              href="/booking_rule"
              className="mt-5 block rounded-lg bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-white hover:bg-cyan-500"
            >
              Manage Rules
            </Link>
          </div>

          <OrganizationInvitationsList invitations={invitations} />
        </aside>
      </div>
      <InviteMemberModal
        open={inviteModalOpen}
        roles={roles}
        onClose={() => setInviteModalOpen(false)}
      />
    </AppLayout>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}

type InfoItemProps = {
  label: string;
  value: string | number;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

type RuleItemProps = {
  label: string;
  value: string | number;
};

function RuleItem({ label, value }: RuleItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
