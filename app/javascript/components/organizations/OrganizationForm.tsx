import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { Building2, Hash, Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
      noValidate
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <Building2 size={26} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Organization Details
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Update the organization profile information shown across Slotify.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TextInput
          icon={Building2}
          label="Organization Name"
          value={data.name}
          placeholder="Enter organization name"
          disabled={processing}
          required
          helper="Use the official or public name of the organization."
          error={errors.name}
          onChange={(value) => updateField("name", value)}
        />

        <TextInput
          icon={Hash}
          label="Slug"
          value={data.slug}
          placeholder="Generated automatically from the name"
          disabled={processing}
          required
          helper="Used as a unique URL-friendly identifier."
          error={errors.slug}
          onChange={(value) => updateField("slug", value)}
        />

        <TextInput
          icon={Mail}
          type="email"
          label="Email"
          value={data.email}
          placeholder="Enter contact email"
          disabled={processing}
          helper="Optional. Used as the organization contact email."
          error={errors.email}
          onChange={(value) => updateField("email", value)}
        />

        <TextInput
          icon={Phone}
          label="Phone"
          value={data.phone}
          placeholder="Enter contact phone"
          disabled={processing}
          helper="Optional. Use only numbers and basic phone symbols."
          error={errors.phone}
          onChange={(value) => updateField("phone", value)}
        />

        <label className="col-span-2 block">
          <FieldLabel label="Address" />

          <div className="relative">
            <MapPin
              size={17}
              className="pointer-events-none absolute left-4 top-4 text-slate-400"
            />

            <textarea
              value={data.address}
              maxLength={200}
              onChange={(event) => updateField("address", event.target.value)}
              className={`${fieldClassName(Boolean(errors.address))} min-h-32 resize-y`}
              placeholder="Enter organization address"
              disabled={processing}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-4">
            <FormHelper helper="Optional. Add the main physical location or business address." />

            <span className="text-xs font-semibold text-slate-400">
              {data.address.length}/200
            </span>
          </div>

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

type TextInputProps = {
  icon: LucideIcon;
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  helper?: string;
  required?: boolean;
  error?: string | string[];
  onChange: (value: string) => void;
};

function TextInput({
  icon: Icon,
  label,
  type = "text",
  value,
  placeholder,
  disabled,
  helper,
  required = false,
  error,
  onChange,
}: TextInputProps) {
  const hasError = Boolean(error);

  return (
    <label className="block">
      <FieldLabel label={label} required={required} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          required={required}
          aria-invalid={hasError}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName(hasError)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <FormHelper helper={helper} />
      <FormError error={error} />
    </label>
  );
}

type FieldLabelProps = {
  label: string;
  required?: boolean;
};

function FieldLabel({ label, required = false }: FieldLabelProps) {
  return (
    <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </span>
  );
}

type FormHelperProps = {
  helper?: string;
};

function FormHelper({ helper }: FormHelperProps) {
  if (!helper) return null;

  return <p className="mt-2 text-xs font-semibold text-slate-400">{helper}</p>;
}

type FormErrorProps = {
  error?: string | string[];
};

function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = Array.isArray(error) ? error.join(", ") : error;

  return <p className="mt-2 text-xs font-semibold text-red-500">{message}</p>;
}

function fieldClassName(hasError: boolean): string {
  const baseClass =
    "w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  if (hasError) {
    return `${baseClass} border border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-50`;
  }

  return `${baseClass} border border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50`;
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>,
): string | null {
  const error = errors.base;

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}
