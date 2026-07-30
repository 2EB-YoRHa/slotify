import { motion } from "motion/react";
import { CalendarCheck, Mail, Power, ShieldCheck } from "lucide-react";
import {
  formatMemberText,
  InfoCard,
  initials,
  StatusBadge,
} from "./OrganizationMemberShowShared";
import type { OrganizationMember } from "../../../types/organizationMemberShowTypes";

type OrganizationMemberProfileCardProps = {
  member: OrganizationMember;
  reservationCount: number;
};

export default function OrganizationMemberProfileCard({
  member,
  reservationCount,
}: OrganizationMemberProfileCardProps) {
  return (
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
              value={formatMemberText(member.role?.name)}
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
              value={reservationCount}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}