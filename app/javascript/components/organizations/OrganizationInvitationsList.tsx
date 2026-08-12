import { router } from "@inertiajs/react";
import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
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
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Pending Invitations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Invitations sent to people who have not joined yet.
            </p>
          </div>

          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-500">
            {invitations.length} total
          </span>
        </div>

        {invitations.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">
            No pending invitations yet.
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const copied = copiedInvitationId === invitation.id;
              const inviteUrl = invitationUrlFor(invitation);

              return (
                <div
                  key={invitation.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">
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
                        onClick={() => setSelectedInvitation(invitation)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                          Manual Invite Link
                        </p>

                        <p className="mt-1 text-xs leading-5 text-cyan-700">
                          If the email does not arrive, copy this link and send
                          it manually.
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => copyInviteLink(invitation)}
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition ${
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
                          className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50"
                        >
                          <ExternalLink size={14} />
                          Open
                        </a>
                      </div>
                    </div>

                    <p className="break-all rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                      {inviteUrl}
                    </p>
                  </div>
                </div>
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