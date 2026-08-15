import { router } from "@inertiajs/react";
import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Send,
  Trash2,
} from "lucide-react";
import ConfirmDialog from "../ui/ConfirmDialog";
import type { OrganizationInvitation } from "../../types/organization";

type OrganizationInvitationsListProps = {
  invitations: OrganizationInvitation[];
  canManage?: boolean;
};

export default function OrganizationInvitationsList({
  invitations,
  canManage = false,
}: OrganizationInvitationsListProps) {
  const [selectedInvitation, setSelectedInvitation] =
    useState<OrganizationInvitation | null>(null);

  const [processing, setProcessing] = useState(false);
  const [copiedInvitationId, setCopiedInvitationId] = useState<number | null>(
    null,
  );

  function confirmRemoveInvitation() {
    if (!selectedInvitation) return;

    setProcessing(true);

    router.delete(`/organization_invitations/${selectedInvitation.id}`, {
      onFinish: () => {
        setProcessing(false);
        setSelectedInvitation(null);
      },
    });
  }

  async function copyInviteLink(invitation: OrganizationInvitation) {
    const inviteUrl = invitationUrlFor(invitation);

    await navigator.clipboard.writeText(inviteUrl);

    setCopiedInvitationId(invitation.id);

    window.setTimeout(() => {
      setCopiedInvitationId((currentId) =>
        currentId === invitation.id ? null : currentId,
      );
    }, 1800);
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Pending Invitations
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Invitations sent to people who have not joined yet.
            </p>
          </div>

          <span className="w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-500">
            {invitations.length} total
          </span>
        </div>

        {invitations.length === 0 ? (
          <EmptyInvitations />
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const copied = copiedInvitationId === invitation.id;
              const inviteUrl = invitationUrlFor(invitation);

              return (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  inviteUrl={inviteUrl}
                  copied={copied}
                  canManage={canManage}
                  onCopy={() => copyInviteLink(invitation)}
                  onRemove={() => setSelectedInvitation(invitation)}
                />
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(selectedInvitation)}
        title="Remove invitation?"
        description={`This will remove the pending invitation for ${
          selectedInvitation?.email || "this user"
        }. They will no longer be able to accept this invite.`}
        confirmText="Remove Invitation"
        cancelText="Keep Invitation"
        danger
        processing={processing}
        onCancel={() => setSelectedInvitation(null)}
        onConfirm={confirmRemoveInvitation}
      />
    </>
  );
}

function EmptyInvitations() {
  return (
    <div className="rounded-xl bg-slate-50 px-5 py-10 text-center sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Send size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No pending invitations
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        New invitations will appear here until they are accepted.
      </p>
    </div>
  );
}

function InvitationCard({
  invitation,
  inviteUrl,
  copied,
  canManage,
  onCopy,
  onRemove,
}: {
  invitation: OrganizationInvitation;
  inviteUrl: string;
  copied: boolean;
  canManage: boolean;
  onCopy: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-all font-bold text-slate-900">
            {invitation.email}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Role: {formatRole(invitation.role?.name)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Expires: {formatDate(invitation.expires_at)}
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 sm:w-auto"
          >
            <Trash2 size={14} />
            Remove
          </button>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
        <div className="mb-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
              Manual Invite Link
            </p>

            <p className="mt-1 text-xs leading-5 text-cyan-700">
              If the email does not arrive, copy this link and send it manually.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:shrink-0">
            <button
              type="button"
              onClick={onCopy}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-white text-cyan-600 hover:bg-cyan-100"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Link
                </>
              )}
            </button>

            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50"
            >
              <ExternalLink size={14} />
              Open
            </a>
          </div>
        </div>

        <p className="break-all rounded-lg bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-500">
          {inviteUrl}
        </p>
      </div>
    </div>
  );
}

function invitationUrlFor(invitation: OrganizationInvitation): string {
  return `${window.location.origin}/organization_invitations/accept/${encodeURIComponent(
    invitation.token,
  )}`;
}

function formatRole(role?: string | null): string {
  if (!role) return "-";

  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatDate(value?: string | null): string {
  if (!value) return "-";

  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}