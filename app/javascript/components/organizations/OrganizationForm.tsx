import { Link, useForm } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";
import type {
  Organization,
  OrganizationErrors,
  OrganizationFormData,
} from "../../types/organization";

type OrganizationFormProps = {
  organization: Organization;
  errors?: OrganizationErrors;
};

export default function OrganizationForm({
  organization,
  errors = {},
}: OrganizationFormProps) {
  const { data, setData, patch, processing, transform } =
    useForm<OrganizationFormData>({
      name: organization.name || "",
      slug: organization.slug || "",
      email: organization.email || "",
      phone: organization.phone || "",
      address: organization.address || "",
    });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    transform((formData) => ({
      organization: formData,
    }));

    patch("/organization");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
      <section className="col-span-2 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <Field label="Organization Name" error={errors.name}>
                <input
                  type="text"
                  value={data.name}
                  onChange={(event) => setData("name", event.target.value)}
                  className="input"
                  placeholder="Design Studio"
                />
              </Field>
            </div>

            <Field label="Slug" error={errors.slug}>
              <input
                type="text"
                value={data.slug}
                onChange={(event) => setData("slug", event.target.value)}
                className="input"
                placeholder="design-studio"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={data.email}
                onChange={(event) => setData("email", event.target.value)}
                className="input"
                placeholder="contact@organization.com"
              />
            </Field>

            <Field label="Phone" error={errors.phone}>
              <input
                type="text"
                value={data.phone}
                onChange={(event) => setData("phone", event.target.value)}
                className="input"
                placeholder="8888-8888"
              />
            </Field>

            <div className="col-span-2">
              <Field label="Address" error={errors.address}>
                <textarea
                  value={data.address}
                  onChange={(event) => setData("address", event.target.value)}
                  rows={4}
                  className="input"
                  placeholder="Organization address..."
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-5">
          <h3 className="font-bold text-slate-800">Multiempresa</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            These settings belong only to this organization. Workspaces,
            reservations, users, and rules are filtered by organization.
          </p>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Preview</h2>

          <div className="mt-5 rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Organization
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {data.name || "Organization name"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              /{data.slug || "organization-slug"}
            </p>
          </div>

          <div className="mt-5 space-y-4 text-sm">
            <SummaryItem label="Email" value={data.email || "-"} />
            <SummaryItem label="Phone" value={data.phone || "-"} />
            <SummaryItem label="Address" value={data.address || "-"} />
          </div>
        </div>

        <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
          <h2 className="font-bold text-orange-700">Important</h2>

          <p className="mt-2 text-sm leading-6 text-orange-600">
            Changing the slug may affect how the organization is identified
            inside the system.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/organization"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={processing}
            className="flex-1 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-60"
          >
            {processing ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </aside>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string | string[];
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      {children}

      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </label>
  );
}

type SummaryItemProps = {
  label: string;
  value: string | number;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}