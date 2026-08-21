import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Mail, Send, ShieldCheck, UserPlus, X } from "lucide-react";
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

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;

      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const errors: Record<string, string | string[] | undefined> = {
    ...formErrors,
    ...clientErrors,
  };

  const selectedRole = roles.find(
    (role) => String(role.id) === String(data.organization_invitation.role_id),
  );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/45 px-3 py-4 backdrop-blur-sm overscroll-contain sm:px-4 sm:py-6">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/20 overscroll-contain transition-colors dark:bg-slate-900 dark:shadow-slate-950/50"
      >
        <header className="shrink-0 border-b border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300 sm:h-14 sm:w-14">
                <UserPlus size={24} strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <h2 className="wrap-break-word text-xl font-black leading-tight text-slate-950 dark:text-slate-100 sm:text-2xl">
                  Invite New Member
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Send an invitation and assign the initial access level.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              disabled={processing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close invitation modal"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="space-y-5">
            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                Email Address
                <RequiredMark />
              </span>

              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  type="email"
                  value={data.organization_invitation.email}
                  onChange={(event) => updateEmail(event.target.value)}
                  className={formInputClassName(hasFieldError(emailError))}
                  placeholder="Enter member email"
                  disabled={processing}
                  autoComplete="email"
                />
              </div>

              <FieldHint>
                The invitation will be sent to this email address.
              </FieldHint>

              <FieldError error={emailError} label="Email Address" />
            </label>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                Initial Role
                <RequiredMark />
              </span>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <select
                  value={data.organization_invitation.role_id}
                  onChange={(event) => updateRole(event.target.value)}
                  className={`${formInputClassName(
                    hasFieldError(roleError),
                  )} appearance-none bg-white pr-10 dark:bg-slate-900`}
                  disabled={processing}
                >
                  {roles.length === 0 ? (
                    <option value="">No roles available</option>
                  ) : (
                    roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {formatRole(role.name)}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <FieldError error={roleError} label="Initial Role" />
            </label>

            <RolePreview role={selectedRole} />
          </div>
        </div>

        <footer className="shrink-0 border-t border-slate-200 bg-slate-50/80 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <LoadingButton
              type="button"
              variant="secondary"
              loading={false}
              disabled={processing}
              onClick={closeModal}
              className="w-full sm:w-auto"
            >
              Cancel
            </LoadingButton>

            <LoadingButton
              type="submit"
              loading={processing}
              loadingText="Sending..."
              className="w-full sm:w-auto"
            >
              <Send size={17} strokeWidth={2.4} />
              Send Invitation
            </LoadingButton>
          </div>
        </footer>
      </form>
    </div>
  );
}

type RolePreviewProps = {
  role?: Role | null;
};

function RolePreview({ role = null }: RolePreviewProps) {
  if (!role) {
    return (
      <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm font-semibold leading-6 text-yellow-700 transition-colors dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-200">
        Select a role before sending the invitation.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 transition-colors dark:border-cyan-500/20 dark:bg-cyan-500/10">
      <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600 dark:text-cyan-300">
        Selected role
      </p>

      <p className="mt-2 wrap-break-word text-base font-black text-slate-950 dark:text-slate-100">
        {formatRole(role.name)}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
        {roleDescription(role.name)}
      </p>
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

function roleDescription(role: string): string {
  if (role === "manager" || role === "coworking_owner") {
    return "Can manage organization settings, workspaces, reservations, members, and invitations.";
  }

  return "Can browse available workspaces and manage their own reservations.";
}