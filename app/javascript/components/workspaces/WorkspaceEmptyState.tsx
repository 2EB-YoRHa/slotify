import { Link } from "@inertiajs/react";

export default function WorkspaceEmptyState() {
  return (
    <div className="flex min-h-[650px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-3xl border border-dashed border-cyan-200 bg-cyan-50 text-6xl text-cyan-400">
          ⌖
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          No workspaces available
        </h2>

        <p className="mt-4 text-lg leading-8 text-slate-500">
          It looks like your organization hasn't added any coworking locations
          yet. Start by setting up your first workspace for your team.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/workspaces/new"
            className="rounded-lg bg-cyan-400 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
          >
            + Add Workspace
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm text-slate-500">
          <span>ⓘ</span>
          <span>You need Admin or Manager permissions to add new workspaces.</span>
        </div>
      </div>
    </div>
  );
}