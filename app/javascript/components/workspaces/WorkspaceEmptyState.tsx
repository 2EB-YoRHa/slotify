import { Link } from "@inertiajs/react";
import { Building2, Info, PlusCircle } from "lucide-react";

export default function WorkspaceEmptyState() {
  return (
    <div className="flex min-h-104 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-10 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:min-h-160 sm:p-8">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-dashed border-cyan-200 bg-cyan-50 text-cyan-400 transition-colors dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 sm:mb-8 sm:h-32 sm:w-32">
          <Building2 size={44} strokeWidth={2.2} />
        </div>

        <h2 className="wrap-break-word text-2xl font-black text-slate-950 dark:text-slate-100 sm:text-3xl">
          No workspaces available
        </h2>

        <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-lg sm:leading-8">
          It looks like your organization has not added any coworking locations
          yet. Start by setting up your first workspace for your team.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/workspaces/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 sm:w-auto"
          >
            <PlusCircle size={16} />
            Add Workspace
          </Link>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mx-auto mt-8 inline-flex max-w-full items-start gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm leading-6 text-slate-500 transition-colors dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400 sm:items-center sm:rounded-full sm:px-5 sm:py-2">
          <Info size={16} className="mt-0.5 shrink-0 sm:mt-0" />
          <span className="wrap-break-word">
            You need Admin or Manager permissions to add new workspaces.
          </span>
        </div>
      </div>
    </div>
  );
}