import { Building2, Send, ShieldCheck, UsersRound } from "lucide-react";
import {
  formatPlan,
  formatStatus,
  OrganizationStatCard,
  type OrganizationStat,
} from "./OrganizationShowShared";
import type {
  OrganizationShowInvitation,
  OrganizationShowUser,
  SubscriptionSummary,
} from "../../../types/organizationShowTypes";

type OrganizationStatsGridProps = {
  users: OrganizationShowUser[];
  invitations: OrganizationShowInvitation[];
  subscription?: SubscriptionSummary | null;
};

export default function OrganizationStatsGrid({
  users,
  invitations,
  subscription = null,
}: OrganizationStatsGridProps) {
  const activeUsers = users.filter((user) => user.active);
  const managers = users.filter((user) => user.role?.name === "manager");
  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === "pending",
  );

  const stats: OrganizationStat[] = [
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
    <section className="mb-8 grid grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <OrganizationStatCard key={stat.label} stat={stat} index={index} />
      ))}
    </section>
  );
}