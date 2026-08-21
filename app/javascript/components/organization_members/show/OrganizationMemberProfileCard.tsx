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
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-cyan-50 text-xl font-extrabold text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 sm:h-20 sm:w-20 sm:text-2xl">
          {initials(member.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h2 className="wrap-break-word text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
                {member.name}
              </h2>

              <div className="mt-2 flex min-w-0 items-start gap-2 text-slate-500 dark:text-slate-400">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <span className="break-all text-sm">{member.email}</span>
              </div>
            </div>

            <StatusBadge active={member.active} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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