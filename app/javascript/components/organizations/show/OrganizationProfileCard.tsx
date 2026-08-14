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
      className="col-span-2 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-7 flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <IconBox icon={Building2} />

          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Organization Profile
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic company information used across Slotify.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
            Active
          </span>

          {canManageOrganization && (
            <Link
              href="/organization/edit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
            >
              <Pencil size={16} strokeWidth={2.4} />
              Edit
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <InfoCard
          icon={Building2}
          label="Organization Name"
          value={organization.name}
        />

        <InfoCard icon={Settings2} label="Slug" value={organization.slug} />

        <InfoCard icon={Mail} label="Email" value={organization.email || "-"} />

        <InfoCard icon={Phone} label="Phone" value={organization.phone || "-"} />

        <div className="col-span-2">
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