import { router } from "@inertiajs/react";
import type { OrganizationInvitation } from "../../types/organization";

type OrganizationInvitationsListProps = {
  invitations: OrganizationInvitation[];
};

export default function OrganizationInvitationsList({
  invitations,
}: OrganizationInvitationsListProps) {
  return (
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
          {invitations.map((invitation) => (
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

                <button
                  type="button"
                  onClick={() =>
                    router.delete(
                      `/organization_invitations/${invitation.id}`
                    )
                  }
                  className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Invite Token
                </p>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {invitation.token}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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