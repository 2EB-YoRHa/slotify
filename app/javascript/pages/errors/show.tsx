import { Link, usePage } from "@inertiajs/react";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import AppLayout from "../../components/AppLayout";

type ErrorShowProps = {
  status: number;
  title: string;
  description: string;
  action_label: string;
  action_href: string;
};

type SharedCurrentUser = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
};

type SharedPageProps = ErrorShowProps & {
  current_user?: SharedCurrentUser | null;
};

export default function ErrorShow({
  status,
  title,
  description,
  action_label,
  action_href,
}: ErrorShowProps) {
  const { props } = usePage<SharedPageProps>();
  const isSignedIn = Boolean(props.current_user);

  const content = (
    <section className="flex min-h-[70dvh] items-center justify-center px-0 py-6 sm:py-8">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8 lg:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 sm:h-16 sm:w-16">
          <AlertTriangle size={30} strokeWidth={2.4} />
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 sm:text-sm sm:tracking-[0.25em]">
          Error {status}
        </p>

        <h1 className="mt-3 wrap-break-word text-2xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-lg wrap-break-word text-sm leading-7 text-slate-500 sm:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 sm:w-auto"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <Link
            href={action_href}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md sm:w-auto"
          >
            <Home size={17} />
            {action_label}
          </Link>
        </div>
      </div>
    </section>
  );

  if (isSignedIn) {
    return <AppLayout>{content}</AppLayout>;
  }

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8">
      <div className="mb-8 sm:mb-10">
        <span className="block truncate text-3xl font-black tracking-[-0.055em] text-slate-950">
          Slotify
        </span>

        <span className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
          <span className="h-px w-16 bg-linear-to-r from-cyan-400 to-transparent" />
        </span>
      </div>

      {content}
    </main>
  );
}