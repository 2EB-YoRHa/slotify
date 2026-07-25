import { useState } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Building2,
  CalendarClock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Send,
  Settings2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import OrganizationMembersTable from "../../components/organizations/OrganizationMembersTable";
import InviteMemberModal from "../../components/organizations/InviteMemberModal";
import OrganizationInvitationsList from "../../components/organizations/OrganizationInvitationsList";
import type {
  Organization,
  OrganizationInvitation,
  OrganizationUser,
  Role,
} from "../../types/organization";

type BookingRuleSummary = {
  id: number;
  max_hours_per_reservation?: number | null;
  min_notice_minutes?: number | null;
  cancellation_limit_hours?: number | null;
  allow_weekend_bookings?: boolean | null;
  active?: boolean | null;
};

type SubscriptionSummary = {
  id: number;
  plan_name?: string | null;
  plan?: string | null;
  status?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
  ends_at?: string | null;
};

type OrganizationShowProps = {
  organization: Organization;
  users?: OrganizationUser[];
  roles?: Role[];
  invitations?: OrganizationInvitation[];
  booking_rule?: BookingRuleSummary | null;
  subscription?: SubscriptionSummary | null;
  can_manage_organization?: boolean;
};

export default function OrganizationShow({
  organization,
  users = [],
  roles = [],
  invitations = [],
  booking_rule = null,
  subscription = null,
  can_manage_organization = false,
}: OrganizationShowProps) {
  const [inviteOpen, setInviteOpen] = useState(false);

  const activeUsers = users.filter((user) => user.active);
  const managers = users.filter((user) => user.role?.name === "manager");
  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === "pending"
  );

  const stats = [
    {
      label: "Members",
      value: users.length,
      helper: `${activeUsers.length} active users`,
      icon: UsersRound,
    },
    {
      label: "Managers",
      value: managers.length,
      helper: "Organization admins",
      icon: ShieldCheck,
    },
    {
      label: "Pending Invites",
      value: pendingInvitations.length,
      helper: "Waiting acceptance",
      icon: Send,
    },
    {
      label: "Plan",
      value: formatPlan(subscription),
      helper: formatStatus(subscription?.status),
      icon: Building2,
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-500"
          >
            Organization Settings
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl font-bold text-slate-950"
          >
            {organization.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-slate-500"
          >
            Manage organization details, members, booking rules and invitations.
          </motion.p>
        </div>

        {can_manage_organization && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3"
          >
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
            >
              <Send size={18} />
              Invite Member
            </button>

            <Link
              href="/organization/edit"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md"
            >
              <Pencil size={18} />
              Edit Organization
            </Link>
          </motion.div>
        )}
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <OrganizationStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <section className="mb-8 grid grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-7 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
                <Building2 size={26} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Organization Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic company information used across Slotify.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <InfoCard
              icon={Building2}
              label="Organization Name"
              value={organization.name}
            />

            <InfoCard
              icon={Settings2}
              label="Slug"
              value={organization.slug}
            />

            <InfoCard
              icon={Mail}
              label="Email"
              value={organization.email || "-"}
            />

            <InfoCard
              icon={Phone}
              label="Phone"
              value={organization.phone || "-"}
            />

            <div className="col-span-2">
              <InfoCard
                icon={MapPin}
                label="Address"
                value={organization.address || "-"}
              />
            </div>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6"
        >
          <SidePanel title="Booking Rules" icon={CalendarClock}>
            <SummaryRow
              label="Max Hours"
              value={`${booking_rule?.max_hours_per_reservation || "-"} hours`}
            />

            <SummaryRow
              label="Min Notice"
              value={`${booking_rule?.min_notice_minutes || "-"} min`}
            />

            <SummaryRow
              label="Cancel Limit"
              value={`${booking_rule?.cancellation_limit_hours || "-"} hours`}
            />

            <SummaryRow
              label="Weekends"
              value={booking_rule?.allow_weekend_bookings ? "Allowed" : "Blocked"}
            />

            <Link
              href="/booking_rule"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
            >
              <Settings2 size={16} />
              View Rules
            </Link>
          </SidePanel>

          <SidePanel title="Subscription" icon={ShieldCheck}>
            <SummaryRow label="Plan" value={formatPlan(subscription)} />

            <SummaryRow
              label="Status"
              value={formatStatus(subscription?.status)}
            />

            <SummaryRow
              label="Renewal"
              value={
                subscription?.expires_at ||
                subscription?.ends_at ||
                "Not configured"
              }
            />

            <Link
              href="/subscription"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
            >
              <ShieldCheck size={16} />
              View Subscription
            </Link>
          </SidePanel>
        </motion.aside>
      </section>

      <section className="mb-8">
        <OrganizationMembersTable
          users={users}
          canManage={can_manage_organization}
        />
      </section>

      <section>
        <OrganizationInvitationsList
          invitations={pendingInvitations}
          canManage={can_manage_organization}
        />
      </section>

      <InviteMemberModal
        open={inviteOpen}
        roles={roles}
        onClose={() => setInviteOpen(false)}
      />
    </AppLayout>
  );
}

type OrganizationStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type OrganizationStatCardProps = {
  stat: OrganizationStat;
  index: number;
};

function OrganizationStatCard({ stat, index }: OrganizationStatCardProps) {
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
  children: React.ReactNode;
};

function SidePanel({ title, icon: Icon, children }: SidePanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>

        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>

      <div>{children}</div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-950">{value}</span>
    </div>
  );
}

function formatPlan(subscription?: SubscriptionSummary | null): string {
  const value = subscription?.plan_name || subscription?.plan;

  if (!value) return "Free";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatStatus(value?: string | null): string {
  if (!value) return "Not configured";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}