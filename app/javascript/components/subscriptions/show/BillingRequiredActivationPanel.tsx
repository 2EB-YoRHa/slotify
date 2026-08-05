import { motion } from "motion/react";
import {
  Building2,
  CalendarCheck,
  LockKeyhole,
  Settings2,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const unlockItems = [
  {
    title: "Workspace Management",
    description:
      "Create spaces, define capacity, upload photos, assign amenities, and control availability.",
    icon: Building2,
  },
  {
    title: "Reservation Operations",
    description:
      "Let members book available workspaces while Slotify prevents schedule conflicts.",
    icon: CalendarCheck,
  },
  {
    title: "Member Access",
    description:
      "Invite users, assign roles, and control who can manage or reserve workspaces.",
    icon: UsersRound,
  },
  {
    title: "Booking Rules",
    description:
      "Configure reservation duration, cancellation limits, notice time, and weekend access.",
    icon: Settings2,
  },
];

export default function BillingRequiredActivationPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-10 rounded-3xl border border-amber-100 bg-white p-8 shadow-sm"
    >
      <div className="mb-8 flex items-start justify-between gap-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-amber-600">
            <LockKeyhole size={14} />
            Activation Required
          </div>

          <h2 className="text-2xl font-extrabold text-slate-950">
            Choose Starter or Pro to activate this organization
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
            Your account has been created successfully. Subscription activation
            unlocks the operational tools needed to manage workspaces,
            reservations, members, and booking rules.
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-right">
          <p className="text-xs font-extrabold uppercase tracking-wide text-amber-500">
            Current Access
          </p>

          <p className="mt-1 text-xl font-extrabold text-slate-950">Locked</p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            Plan selection required
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {unlockItems.map((item, index) => (
          <UnlockCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
}

type UnlockCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
};

function UnlockCard({
  title,
  description,
  icon: Icon,
  index,
}: UnlockCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 + index * 0.04 }}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
        <Icon size={20} strokeWidth={2.4} />
      </div>

      <h3 className="text-sm font-extrabold text-slate-950">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </motion.div>
  );
}