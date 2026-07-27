import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { LockKeyhole, ShieldAlert } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";

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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex justify-center">
          <AuthBrand />
        </header>

        <section className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <ShieldAlert size={30} strokeWidth={2.4} />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-950">
              Account access disabled
            </h1>

            <p className="mt-3 leading-7 text-slate-500">
              Your account is currently inactive. Please contact your
              organization administrator to restore access.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
              <InfoRow label="User" value={name || "-"} />
              <InfoRow label="Email" value={email || "-"} />
              <InfoRow
                label="Organization"
                value={organization_name || "Not assigned"}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/users/sign_in"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-500"
              >
                <LockKeyhole size={17} />
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}