import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import LoadingButton from "../ui/LoadingButton";
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
  errors: initialErrors = {},
}: OrganizationFormProps) {
  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
    transform,
  } = useForm<OrganizationFormData>({
    name: organization.name || "",
    slug: organization.slug || "",
    email: organization.email || "",
    phone: organization.phone || "",
    address: organization.address || "",
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    transform((formData) => ({
      organization: formData,
    }));

    patch("/organization");
  }

  function updateField(field: keyof OrganizationFormData, value: string) {
    setData(field, value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">
          Organization Details
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Update the information used to identify your coworking organization.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Organization Name
          </span>

          <input
            type="text"
            value={data.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="input"
            placeholder="Slotify Demo"
            disabled={processing}
            required
          />

          <FormError error={errors.name} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Slug
          </span>

          <input
            type="text"
            value={data.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            className="input"
            placeholder="slotify-demo"
            disabled={processing}
            required
          />

          <FormError error={errors.slug} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Email
          </span>

          <input
            type="email"
            value={data.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="input"
            placeholder="admin@slotify.com"
            disabled={processing}
          />

          <FormError error={errors.email} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Phone
          </span>

          <input
            type="text"
            value={data.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="input"
            placeholder="8888-8888"
            disabled={processing}
          />

          <FormError error={errors.phone} />
        </label>

        <label className="col-span-2 block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Address
          </span>

          <textarea
            value={data.address}
            onChange={(event) => updateField("address", event.target.value)}
            className="input min-h-32"
            placeholder="San José, Costa Rica"
            disabled={processing}
          />

          <FormError error={errors.address} />
        </label>
      </div>

      {getBaseError(errors) && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {getBaseError(errors)}
        </div>
      )}

      <div className="mt-8 flex justify-end gap-4">
        <a
          href="/organization"
          className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>

        <LoadingButton
          type="submit"
          loading={processing}
          loadingText="Saving..."
        >
          Save Changes
        </LoadingButton>
      </div>
    </form>
  );
}

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>
): string | null {
  const error = errors.base;

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}