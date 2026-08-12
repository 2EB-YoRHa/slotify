import { Link, useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ExternalLink,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand";
import AuthFooter from "../../components/auth/AuthFooter";
import FlashMessages from "../../components/ui/FlashMessages";
import LoadingButton from "../../components/ui/LoadingButton";

type DevelopmentManualLinks = {
  confirmation_url?: string;
};

type ConfirmationRequiredProps = {
  email?: string | null;
  invitation_token?: string | null;
  development_manual_links?: DevelopmentManualLinks;
  errors?: Partial<Record<string, string | string[]>>;
};

type ConfirmationFormData = {
  user: {
    email: string;
  };
};

export default function ConfirmationRequired({
  email = null,
  invitation_token = null,
  development_manual_links = {},
}: ConfirmationRequiredProps) {
  const { data, setData, post, processing } = useForm<ConfirmationFormData>({
    user: {
      email: email || "",
    },
  });

  function handleResend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    post("/users/confirmation", {
      preserveScroll: true,
    });
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
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-xl rounded-3xl border border-cyan-100 bg-white p-10 text-center shadow-sm"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-500">
              <MailCheck size={38} strokeWidth={2.4} />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-950">
              Confirm your email
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              Your account was created, but you need to confirm your email
              address before signing in to Slotify.
            </p>

            {email && (
              <div className="mt-7 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
                <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                  Confirmation sent to
                </p>

                <p className="mt-2 break-all text-base font-extrabold text-slate-950">
                  {email}
                </p>
              </div>
            )}

            {development_manual_links.confirmation_url && (
              <div className="mt-7 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-left">
                <p className="text-xs font-extrabold uppercase tracking-wide text-amber-600">
                  Development Email Shortcut
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-700">
                  SendGrid already attempted to send the confirmation email. If
                  Gmail delays it, use this temporary development link to
                  continue testing immediately.
                </p>

                <a
                  href={development_manual_links.confirmation_url}
                  className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-cyan-600 transition hover:bg-cyan-50"
                >
                  <span>Confirm account now</span>
                  <ExternalLink size={16} />
                </a>

                <p className="mt-3 break-all rounded-xl bg-white/70 px-4 py-3 text-xs font-semibold leading-5 text-amber-700">
                  {development_manual_links.confirmation_url}
                </p>
              </div>
            )}

            <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-500 shadow-sm">
                  <ShieldCheck size={19} strokeWidth={2.4} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-slate-950">
                    Why this is required
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Email confirmation protects your account and confirms that
                    the address belongs to you before access is enabled.
                  </p>
                </div>
              </div>
            </div>

            <form noValidate onSubmit={handleResend} className="mt-8">
              <input
                type="hidden"
                value={data.user.email}
                onChange={(event) =>
                  setData("user", { email: event.target.value })
                }
                readOnly
              />

              <LoadingButton
                type="submit"
                loading={processing}
                loadingText="Sending..."
                className="w-full"
              >
                <RefreshCw size={17} />
                Resend confirmation email
              </LoadingButton>
            </form>

            <div className="mt-5 flex justify-center">
              <Link
                href={
                  invitation_token
                    ? `/users/sign_in?invitation_token=${invitation_token}`
                    : "/users/sign_in"
                }
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}