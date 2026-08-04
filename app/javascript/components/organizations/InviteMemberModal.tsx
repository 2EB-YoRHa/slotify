import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../ui/FormFeedback";
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

  const errors: Record<string, string | string[] | undefined> = formErrors;
  const emailError = errors.email || errors["organization_invitation.email"];
  const roleError = errors.role_id || errors["organization_invitation.role_id"];

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    post("/organization_invitations", {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  function updateEmail(email: string) {
    setData("organization_invitation", {
      ...data.organization_invitation,
      email,
    });
  }

  function updateRole(roleId: string) {
    setData("organization_invitation", {
      ...data.organization_invitation,
      role_id: roleId,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="grid grid-cols-2">
          <div className="border-r border-slate-200 bg-slate-50 p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-2xl text-cyan-500">
              +
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Invite New Member
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Send an invitation to a teammate so they can join this
              organization and access Slotify.
            </p>

            <div className="mt-8 space-y-5 text-sm">
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

          <form noValidate onSubmit={handleSubmit} className="p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Invitation Details
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the email address and select the access level.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="text-xl text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <label className="block">
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

            <label className="mt-5 block">
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

            <div className="mt-8 flex gap-3">
              <LoadingButton
                type="button"
                variant="secondary"
                loading={false}
                disabled={processing}
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </LoadingButton>

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Sending..."
                className="flex-1"
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
    <div>
      <p className="font-bold text-slate-800">{title}</p>
      <p className="mt-1 leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function formatRole(role: string): string {
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}