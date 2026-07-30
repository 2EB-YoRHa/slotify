import {
  CalendarCheck,
  Power,
  PowerOff,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { formatDate } from "../../../utils/dateTime";
import {
  formatMemberText,
  MemberStatCard,
  type MemberStat,
} from "./OrganizationMemberShowShared";
import type { OrganizationMember } from "../../../types/organizationMemberShowTypes";

type OrganizationMemberStatsProps = {
  member: OrganizationMember;
  reservationCount: number;
};

export default function OrganizationMemberStats({
  member,
  reservationCount,
}: OrganizationMemberStatsProps) {
  const stats: MemberStat[] = [
    {
      label: "Role",
      value: formatMemberText(member.role?.name),
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
      value: reservationCount,
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
    <section className="mb-8 grid grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <MemberStatCard key={stat.label} stat={stat} index={index} />
      ))}
    </section>
  );
}