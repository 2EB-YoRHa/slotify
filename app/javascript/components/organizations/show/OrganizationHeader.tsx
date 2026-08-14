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
  canManageOrganization,
  onOpenInvite,
}: OrganizationHeaderProps) {
  if (!canManageOrganization) return null;

  return (
    <div className="mb-6 flex justify-end">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-wrap justify-end gap-3"
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
    </div>
  );
}