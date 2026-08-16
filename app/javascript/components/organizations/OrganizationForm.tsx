import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Building2, Hash, Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import ConfirmDialog from "../ui/ConfirmDialog";
import useUnsavedChangesGuard from "../../hooks/useUnsavedChangesGuard";
import { normalizeString } from "../../utils/dirtyForm";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";
import {
  hasValidationErrors,
  validateEmail,
  validatePhone,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";
import type { Organization, OrganizationFormData } from "../../types/organization";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type OrganizationFormProps = {
  organization: Organization;
  errors?: Partial<Record<string, string | string[]>>;
};

export default function OrganizationForm({
  organization,
  errors: initialErrors = {},
}: OrganizationFormProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const initialOrganizationData: OrganizationFormData = {
    name: organization.name || "",
    slug: organization.slug || "",
    email: organization.email || "",
    phone: organization.phone || "",
    address: organization.address || "",
  };

  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
    transform,
  } = useForm<OrganizationFormData>(initialOrganizationData);

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const organizationDirty = organizationFormChanged(
    data,
    initialOrganizationData,
  );

  const unsavedChangesGuard = useUnsavedChangesGuard({
    enabled: organizationDirty && !processing,
    title: "Discard organization changes?",
    description:
      "You have unsaved organization changes. If you leave now, those changes will be lost.",
    confirmText: "Discard Changes",
    cancelText: "Keep Editing",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateOrganizationForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    transform((formData) => ({
      organization: formData,
    }));

    unsavedChangesGuard.allowNextNavigation();

    patch("/organization");
  }

  function updateField(field: keyof OrganizationFormData, value: string) {
    clearClientError(field);

    setData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`organization.${field}`];

      return nextErrors;
    });
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8"
      >
        <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 sm:h-14 sm:w-14">
            <Building2 size={24} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
              Organization Details
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update the organization profile information shown across Slotify.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <TextInput
            icon={Building2}
            label="Organization Name"
            value={data.name}
            placeholder="Enter organization name"
            disabled={processing}
            required
            helper="Use the official or public name of the organization."
            error={fieldError(errors, "name")}
            onChange={(value) => updateField("name", value)}
          />

          <TextInput
            icon={Hash}
            label="Slug"
            value={data.slug}
            placeholder="Generated automatically from the name"
            disabled={processing}
            required
            helper="Use lowercase letters, numbers, and hyphens only."
            error={fieldError(errors, "slug")}
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
            error={fieldError(errors, "email")}
            onChange={(value) => updateField("email", value)}
          />

          <TextInput
            icon={Phone}
            label="Phone"
            value={data.phone}
            placeholder="Enter contact phone"
            disabled={processing}
            helper="Optional. Use only numbers and basic phone symbols."
            error={fieldError(errors, "phone")}
            onChange={(value) => updateField("phone", value)}
          />

          <label className="block min-w-0 md:col-span-2">
            <FieldLabel label="Address" />

            <div className="relative">
              <MapPin
                size={17}
                className="pointer-events-none absolute left-4 top-4 text-slate-400"
              />

              <textarea
                value={data.address}
                maxLength={200}
                aria-invalid={hasFieldError(fieldError(errors, "address"))}
                onChange={(event) => updateField("address", event.target.value)}
                className={`${formInputClassName(
                  hasFieldError(fieldError(errors, "address")),
                )} min-h-32 resize-y`}
                placeholder="Enter organization address"
                disabled={processing}
              />
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <FieldHint>
                Optional. Add the main physical location or business address.
              </FieldHint>

              <span className="shrink-0 text-xs font-semibold text-slate-400 sm:text-right">
                {data.address.length}/200
              </span>
            </div>

            <FieldError error={fieldError(errors, "address")} label="Address" />
          </label>
        </div>

        {getBaseError(errors) && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-600">
            {getBaseError(errors)}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
          <button
            type="button"
            disabled={processing}
            onClick={() => unsavedChangesGuard.guardedVisit("/organization")}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>

          <LoadingButton
            type="submit"
            loading={processing}
            loadingText="Saving..."
            className="w-full sm:w-auto"
          >
            Save Changes
          </LoadingButton>
        </div>
      </form>

      <ConfirmDialog
        open={unsavedChangesGuard.confirmOpen}
        title={unsavedChangesGuard.title}
        description={unsavedChangesGuard.description}
        confirmText={unsavedChangesGuard.confirmText}
        cancelText={unsavedChangesGuard.cancelText}
        danger
        onCancel={unsavedChangesGuard.cancelNavigation}
        onConfirm={unsavedChangesGuard.confirmNavigation}
      />
    </>
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
  const hasError = hasFieldError(error);

  return (
    <label className="block min-w-0">
      <FieldLabel label={label} required={required} />

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          aria-invalid={hasError}
          onChange={(event) => onChange(event.target.value)}
          className={formInputClassName(hasError)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <FieldHint>{helper}</FieldHint>
      <FieldError error={error} label={label} />
    </label>
  );
}

type FieldLabelProps = {
  label: string;
  required?: boolean;
};

function FieldLabel({ label, required = false }: FieldLabelProps) {
  return (
    <span className="mb-2 flex min-w-0 items-center gap-1 text-sm font-bold text-slate-700">
      <span className="truncate">{label}</span>
      <RequiredMark show={required} />
    </span>
  );
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`organization.${field}`];
}

function getBaseError(
  errors: Record<string, string | string[] | undefined>,
): string | null {
  const error = errors.base || errors["organization.base"];

  if (!error) return null;

  return Array.isArray(error) ? error.join(", ") : error;
}

function validateOrganizationForm(data: OrganizationFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateTextLength(data.name, "Organization Name", {
    min: 3,
    max: 100,
  });

  if (nameError) errors.name = nameError;

  const slugError = validateTextLength(data.slug, "Slug", {
    min: 3,
    max: 120,
  });

  if (slugError) {
    errors.slug = slugError;
  } else if (!SLUG_REGEX.test(data.slug.trim())) {
    errors.slug =
      "Slug can only include lowercase letters, numbers, and hyphens.";
  }

  const emailError = validateEmail(data.email, "Email", {
    required: false,
  });

  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(data.phone, "Phone");

  if (phoneError) errors.phone = phoneError;

  const addressError = validateTextLength(data.address, "Address", {
    max: 200,
    required: false,
  });

  if (addressError) errors.address = addressError;

  return errors;
}

function organizationFormChanged(
  data: OrganizationFormData,
  initialData: OrganizationFormData,
): boolean {
  return (
    normalizeString(data.name) !== normalizeString(initialData.name) ||
    normalizeString(data.slug) !== normalizeString(initialData.slug) ||
    normalizeString(data.email) !== normalizeString(initialData.email) ||
    normalizeString(data.phone) !== normalizeString(initialData.phone) ||
    normalizeString(data.address) !== normalizeString(initialData.address)
  );
}