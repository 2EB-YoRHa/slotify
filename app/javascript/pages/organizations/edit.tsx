import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import OrganizationForm from "../../components/organizations/OrganizationForm";
import type {
  Organization,
  OrganizationErrors,
} from "../../types/organization";

type OrganizationEditProps = {
  organization: Organization;
  errors?: OrganizationErrors;
};

export default function OrganizationEdit({
  organization,
  errors = {},
}: OrganizationEditProps) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-2 text-sm text-slate-400">
              <Link href="/organization" className="hover:text-cyan-500">
                Organization
              </Link>{" "}
              / Edit
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Edit Organization
            </h1>

            <p className="mt-1 text-slate-500">
              Update your coworking organization information.
            </p>
          </div>

          <Link
            href="/organization"
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Organization
          </Link>
        </div>

        <OrganizationForm organization={organization} errors={errors} />
      </div>
    </AppLayout>
  );
}