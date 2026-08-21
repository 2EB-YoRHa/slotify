import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import OrganizationForm from "../../components/organizations/OrganizationForm";
import type { Organization } from "../../types/organization";

type OrganizationEditProps = {
  organization: Organization;
  errors?: Partial<Record<string, string | string[]>>;
};

export default function OrganizationEdit({
  organization,
  errors = {},
}: OrganizationEditProps) {
  return (
    <AppLayout>
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/organization"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
          >
            <ArrowLeft size={16} />
            <span className="truncate">Back to Organization</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-5 wrap-break-word text-2xl font-black leading-tight text-slate-950 dark:text-slate-100 sm:mt-6 sm:text-3xl"
        >
          Edit Organization
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
        >
          Update organization contact information, address, and public workspace
          profile details.
        </motion.p>
      </div>

      <OrganizationForm organization={organization} errors={errors} />
    </AppLayout>
  );
}