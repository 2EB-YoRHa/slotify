import { router } from "@inertiajs/react";
import { motion } from "motion/react";
import { Mail, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import FlashMessages from "../../components/ui/FlashMessages";
import type { OrganizationInvitation } from "../../types/organization";

type CurrentUser = {
  id: number;
  name: string;
  email: string;
};

type AcceptInvitationProps = {
  invitation: OrganizationInvitation;
  current_user?: CurrentUser | null;
  authenticated?: boolean;
  email_matches?: boolean;
};

export default function AcceptInvitation({
  invitation,
  current_user = null,
  authenticated = false,
  email_matches = false,
}: AcceptInvitationProps) {
  function acceptInvitation() {
    router.patch(`/organization_invitations/accept/${invitation.token}`);
  }

  function signOut() {
    router.delete("/users/sign_out");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <FlashMessages />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"
          >
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
              <UsersRound size={26} strokeWidth={2.4} />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-950">
              Organization Invitation
            </h1>

            <p className="mt-3 leading-7 text-slate-500">
              You have been invited to join{" "}
              <span className="font-bold text-slate-950">
                {invitation.organization?.name || "this organization"}
              </span>{" "}
              as{" "}
              <span className="font-bold text-slate-950">
                {formatRole(invitation.role?.name)}
              </span>
              .
            </p>

            {authenticated && current_user && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                You are currently signed in as{" "}
                <span className="font-bold text-slate-950">
                  {current_user.email}
                </span>
                .
              </div>
            )}

            {authenticated && !email_matches && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-600">
                This invitation belongs to{" "}
                <span className="font-bold">{invitation.email}</span>. Please
                sign in with that email address to accept it.
              </div>
            )}

            <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-left">
              <InfoItem
                icon={UsersRound}
                label="Organization"
                value={invitation.organization?.name || "-"}
              />

              <InfoItem icon={Mail} label="Invited Email" value={invitation.email} />

              <InfoItem
                icon={ShieldCheck}
                label="Role"
                value={formatRole(invitation.role?.name)}
              />

              <InfoItem
                icon={UserRound}
                label="Invited By"
                value={invitation.invited_by?.email || "-"}
              />
            </div>

            <div className="mt-8 flex justify-center gap-4">
              {!authenticated && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      router.visit(
                        `/users/sign_in?invitation_token=${invitation.token}`
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.visit(
                        `/users/sign_up?invitation_token=${invitation.token}`
                      )
                    }
                    className="rounded-xl bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500"
                  >
                    Create Account
                  </button>
                </>
              )}

              {authenticated && email_matches && (
                <>
                  <button
                    type="button"
                    onClick={() => router.visit("/")}
                    className="rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={acceptInvitation}
                    className="rounded-xl bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500"
                  >
                    Accept Invitation
                  </button>
                </>
              )}

              {authenticated && !email_matches && (
                <>
                  <button
                    type="button"
                    onClick={() => router.visit("/")}
                    className="rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={signOut}
                    className="rounded-xl bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}

type InfoItemProps = {
  icon: typeof UsersRound;
  label: string;
  value: string | number;
};

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-slate-200 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <Icon size={17} className="text-slate-400" />
        <span className="text-sm text-slate-500">{label}</span>
      </div>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function formatRole(role?: string | null): string {
  if (!role) return "-";

  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}