import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Building2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Settings2,
} from "lucide-react";
import { IconBox, InfoCard } from "./OrganizationShowShared";
import type { OrganizationShowData } from "../../../types/organizationShowTypes";

type OrganizationProfileCardProps = {
  organization: OrganizationShowData;
  canManageOrganization?: boolean;
};

export default function OrganizationProfileCard({
  organization,
  canManageOrganization = false,
}: OrganizationProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8 xl:col-span-2"
    >
      <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <IconBox icon={Building2} />

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100 sm:text-2xl">
              Organization Profile
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Basic company information used across Slotify.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:shrink-0 sm:flex-row sm:items-center">
          <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 dark:bg-green-500/15 dark:text-green-300">
            Active
          </span>

          {canManageOrganization && (
            <Link
              href="/organization/edit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:shadow-slate-950/30 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300 sm:h-10 sm:w-auto"
            >
              <Pencil size={16} strokeWidth={2.4} />
              Edit
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <InfoCard
          icon={Building2}
          label="Organization Name"
          value={organization.name}
        />

        <InfoCard icon={Settings2} label="Slug" value={organization.slug} />

        <InfoCard icon={Mail} label="Email" value={organization.email || "-"} />

        <InfoCard icon={Phone} label="Phone" value={organization.phone || "-"} />

        <div className="sm:col-span-2">
          <InfoCard
            icon={MapPin}
            label="Address"
            value={organization.address || "-"}
          />
        </div>
      </div>
    </motion.div>
  );
}