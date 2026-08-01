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
    <section className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle size={30} strokeWidth={2.4} />
        </div>

        <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.25em] text-slate-400">
          Error {status}
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-500">
          {description}
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <Link
            href={action_href}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
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
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mb-10">
        <span className="block text-3xl font-black tracking-[-0.055em] text-slate-950">
          Slotify
        </span>

        <span className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="h-px w-16 bg-linear-to-r from-cyan-400 to-transparent" />
        </span>
      </div>

      {content}
    </main>
  );
}