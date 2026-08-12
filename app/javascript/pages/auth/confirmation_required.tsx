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
  const { data, post, processing } = useForm<ConfirmationFormData>({
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
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-sm"
          >
            <div className="bg-linear-to-b from-cyan-50 to-white px-10 pt-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-cyan-500 shadow-sm">
                <MailCheck size={38} strokeWidth={2.4} />
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                Confirm your email
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                Your account was created successfully. Confirm your email
                address before signing in to Slotify.
              </p>
            </div>

            <div className="px-10 pb-10 pt-7">
              {email && (
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 text-center">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                    Confirmation sent to
                  </p>

                  <p className="mt-2 break-all text-base font-black text-slate-950">
                    {email}
                  </p>
                </div>
              )}

              {development_manual_links.confirmation_url && (
                <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-5">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-amber-600">
                    Development shortcut
                  </p>

                  <p className="mt-2 text-sm font-semibold leading-6 text-amber-700">
                    SendGrid already attempted to send the email. Use this link
                    only while testing locally.
                  </p>

                  <a
                    href={development_manual_links.confirmation_url}
                    className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-black text-cyan-600 shadow-sm transition hover:bg-cyan-50"
                  >
                    <span>Confirm account now</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm">
                    <ShieldCheck size={20} strokeWidth={2.4} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-950">
                      Why this is required
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Email confirmation protects your account and verifies that
                      the address belongs to you.
                    </p>
                  </div>
                </div>
              </div>

              <form noValidate onSubmit={handleResend} className="mt-6">
                <input type="hidden" name="user[email]" value={data.user.email} readOnly />

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-950">
                        Did not receive the email?
                      </p>

                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">
                        SendGrid can take a few minutes depending on the email
                        provider.
                      </p>
                    </div>

                    <LoadingButton
                      type="submit"
                      loading={processing}
                      loadingText="Sending..."
                      variant="secondary"
                      className="shrink-0 border-cyan-100 px-4 text-cyan-600 hover:bg-cyan-50"
                    >
                      <RefreshCw size={16} />
                      Resend
                    </LoadingButton>
                  </div>
                </div>
              </form>

              <div className="mt-5 flex justify-center">
                <Link
                  href={
                    invitation_token
                      ? `/users/sign_in?invitation_token=${invitation_token}`
                      : "/users/sign_in"
                  }
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-cyan-600"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        <AuthFooter />
      </div>
    </main>
  );
}