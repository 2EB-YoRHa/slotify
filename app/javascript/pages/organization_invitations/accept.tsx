import { router } from "@inertiajs/react";
import { motion } from "motion/react";
import { Mail, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
    <main className="min-h-dvh bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-10">
      <FlashMessages />

      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl flex-col sm:min-h-[calc(100vh-5rem)]">
        <header className="mb-6 flex justify-center sm:mb-10">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-8 lg:p-10"
          >
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-300">
              <UsersRound size={26} strokeWidth={2.4} />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-950 dark:text-slate-100 sm:text-3xl">
              Organization Invitation
            </h1>

            <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
              You have been invited to join{" "}
              <span className="font-bold text-slate-950 dark:text-slate-100">
                {invitation.organization?.name || "this organization"}
              </span>{" "}
              as{" "}
              <span className="font-bold text-slate-950 dark:text-slate-100">
                {formatRole(invitation.role?.name)}
              </span>
              .
            </p>

            {authenticated && current_user && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 transition-colors dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                You are currently signed in as{" "}
                <span className="break-all font-bold text-slate-950 dark:text-slate-100">
                  {current_user.email}
                </span>
                .
              </div>
            )}

            {authenticated && !email_matches && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-600 transition-colors dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                This invitation belongs to{" "}
                <span className="break-all font-bold">{invitation.email}</span>.
                Please sign in with that email address to accept it.
              </div>
            )}

            <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-left transition-colors dark:bg-slate-800/60 sm:p-6">
              <InfoItem
                icon={UsersRound}
                label="Organization"
                value={invitation.organization?.name || "-"}
              />

              <InfoItem
                icon={Mail}
                label="Invited Email"
                value={invitation.email}
              />

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

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
              {!authenticated && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      router.visit(
                        `/users/sign_in?invitation_token=${invitation.token}`,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.visit(
                        `/users/sign_up?invitation_token=${invitation.token}`,
                      )
                    }
                    className="w-full rounded-xl bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 sm:w-auto"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={acceptInvitation}
                    className="w-full rounded-xl bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 sm:w-auto"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={signOut}
                    className="w-full rounded-xl bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 sm:w-auto"
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
  icon: LucideIcon;
  label: string;
  value: string | number;
};

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-4 last:border-0 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 items-center gap-3">
        <Icon size={17} className="shrink-0 text-slate-400 dark:text-slate-500" />

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>

      <span className="wrap-break-word text-sm font-bold text-slate-950 dark:text-slate-100 sm:text-right">
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