import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { Pencil, Send } from "lucide-react";
import type { OrganizationShowData } from "../../../types/organizationShowTypes";

type OrganizationHeaderProps = {
  organization: OrganizationShowData;
  canManageOrganization: boolean;
  onOpenInvite: () => void;
};

export default function OrganizationHeader({
  organization,
  canManageOrganization,
  onOpenInvite,
}: OrganizationHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-950"
        >
          {organization.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 max-w-2xl text-slate-500"
        >
          Manage your organization details, members, invitations, booking rules,
          and subscription information.
        </motion.p>
      </div>

      {canManageOrganization && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-3"
        >
          <button
            type="button"
            onClick={onOpenInvite}
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
  );
}