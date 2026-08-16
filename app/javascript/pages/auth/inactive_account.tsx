import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  LockKeyhole,
  Mail,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import FlashMessages from "../../components/ui/FlashMessages";

type InactiveAccountProps = {
  name?: string | null;
  email?: string | null;
  organization_name?: string | null;
};

export default function InactiveAccount({
  name = null,
  email = null,
  organization_name = null,
}: InactiveAccountProps) {
  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <FlashMessages />

      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl flex-col sm:min-h-[calc(100vh-5rem)]">
        <header className="mb-6 flex justify-center sm:mb-10">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-5 text-center shadow-sm sm:p-8 lg:p-10"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-500 sm:mb-6 sm:h-20 sm:w-20">
              <ShieldAlert size={32} strokeWidth={2.4} />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
              Account access disabled
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              This account is currently inactive. Please contact your
              organization administrator to restore access.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
              <InfoRow icon={UserRound} label="User" value={name || "-"} />
              <InfoRow icon={Mail} label="Email" value={email || "-"} />
              <InfoRow
                icon={Building2}
                label="Organization"
                value={organization_name || "Not assigned"}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/users/sign_in"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:bg-cyan-500"
              >
                <LockKeyhole size={17} />
                Back to Sign In
              </Link>

              <Link
                href="/users/password/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft size={17} />
                Reset password instead
              </Link>
            </div>
          </motion.div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}

type InfoRowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon size={15} className="shrink-0" />
        <span>{label}</span>
      </div>

      <span className="wrap-break-word text-sm font-bold text-slate-950 sm:text-right">
        {value}
      </span>
    </div>
  );
}