import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, ShieldCheck, UserPlus, X } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
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
  validateRequired,
  type ValidationErrors,
} from "../../utils/clientValidation";
import type { Role } from "../../types/organization";

type InviteMemberModalProps = {
  open: boolean;
  roles: Role[];
  onClose: () => void;
};

type InvitationFormData = {
  organization_invitation: {
    email: string;
    role_id: number | string;
  };
};

export default function InviteMemberModal({
  open,
  roles,
  onClose,
}: InviteMemberModalProps) {
  const defaultRole = roles.find((role) => role.name === "member") || roles[0];
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});

  const {
    data,
    setData,
    post,
    processing,
    reset,
    errors: formErrors,
  } = useForm<InvitationFormData>({
    organization_invitation: {
      email: "",
      role_id: defaultRole?.id || "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...formErrors,
    ...clientErrors,
  };

  const emailError = fieldError(errors, "email");
  const roleError = fieldError(errors, "role_id");

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateInvitationForm(data);
    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    post("/organization_invitations", {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setClientErrors({});
        onClose();
      },
    });
  }

  function updateEmail(email: string) {
    clearClientError("email");

    setData("organization_invitation", {
      ...data.organization_invitation,
      email,
    });
  }

  function updateRole(roleId: string) {
    clearClientError("role_id");

    setData("organization_invitation", {
      ...data.organization_invitation,
      role_id: roleId,
    });
  }

  function closeModal() {
    if (processing) return;

    setClientErrors({});
    onClose();
  }

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`organization_invitation.${field}`];

      return nextErrors;
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 sm:mb-6 sm:h-14 sm:w-14">
              <UserPlus size={24} strokeWidth={2.4} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Invite New Member
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Send an invitation to a teammate so they can join this
              organization and access Slotify.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3 lg:mt-8 lg:grid-cols-1 lg:space-y-0">
              <InfoItem
                title="Role-Based Access"
                description="Assign member or manager permissions."
              />

              <InfoItem
                title="Workspace Access"
                description="Members can reserve active workspaces."
              />

              <InfoItem
                title="Secure Invitation"
                description="A unique token is generated for each invite."
              />
            </div>
          </div>

          <form noValidate onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Invitation Details
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Enter the email address and select the access level.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={processing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close invitation modal"
              >
                <X size={20} />
              </button>
            </div>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
                Email Address
                <RequiredMark />
              </span>

              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={data.organization_invitation.email}
                  onChange={(event) => updateEmail(event.target.value)}
                  className={formInputClassName(hasFieldError(emailError))}
                  placeholder="Enter member email"
                  disabled={processing}
                />
              </div>

              <FieldHint>
                The invitation will be linked to this exact email address.
              </FieldHint>

              <FieldError error={emailError} label="Email Address" />
            </label>

            <label className="mt-5 block min-w-0">
              <span className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
                Initial Role
                <RequiredMark />
              </span>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={data.organization_invitation.role_id}
                  onChange={(event) => updateRole(event.target.value)}
                  className={`${formInputClassName(
                    hasFieldError(roleError),
                  )} appearance-none bg-white pr-10`}
                  disabled={processing}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {formatRole(role.name)}
                    </option>
                  ))}
                </select>
              </div>

              <FieldHint>
                Members can book spaces. Managers can also administer the
                organization.
              </FieldHint>

              <FieldError error={roleError} label="Initial Role" />
            </label>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <LoadingButton
                type="button"
                variant="secondary"
                loading={false}
                disabled={processing}
                onClick={closeModal}
                className="w-full sm:flex-1"
              >
                Cancel
              </LoadingButton>

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Sending..."
                className="w-full sm:flex-1"
              >
                Send Invitation
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

type InfoItemProps = {
  title: string;
  description: string;
};

function InfoItem({ title, description }: InfoItemProps) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-4 lg:bg-transparent lg:p-0">
      <p className="break-words font-bold text-slate-800">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function validateInvitationForm(data: InvitationFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(
    data.organization_invitation.email,
    "Email Address",
    {
      required: true,
    },
  );

  if (emailError) {
    errors.email = emailError;
  }

  const roleError = validateRequired(
    data.organization_invitation.role_id,
    "Initial Role",
  );

  if (roleError) {
    errors.role_id = roleError;
  }

  return errors;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`organization_invitation.${field}`];
}

function formatRole(role: string): string {
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}