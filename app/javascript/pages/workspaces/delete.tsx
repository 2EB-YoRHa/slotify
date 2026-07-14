import { Link, router } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import type { Workspace } from "../../types/workspace";

type DeleteWorkspaceProps = {
  workspace: Workspace;
};

export default function DeleteWorkspace({ workspace }: DeleteWorkspaceProps) {
  function handleDelete() {
    router.delete(`/workspaces/${workspace.id}`);
  }

  return (
    <AppLayout>
      <div className="relative min-h-[calc(100vh-10rem)] overflow-hidden rounded-xl bg-white">
        <div className="pointer-events-none absolute left-20 top-16 h-24 w-72 rounded-full bg-slate-100 blur-2xl" />
        <div className="pointer-events-none absolute right-20 top-32 h-20 w-80 rounded-full bg-red-100 blur-2xl" />
        <div className="pointer-events-none absolute bottom-20 left-32 h-20 w-72 rounded-full bg-slate-100 blur-2xl" />

        <div className="relative z-10 flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-8 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-500">
                !
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Delete Workspace
                </h1>

                <p className="mt-1 text-slate-500">
                  This action will remove the workspace from the organization.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-base leading-7 text-slate-700">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-900">
                  {workspace.name}
                </span>
                ?
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <InfoCard label="Type" value={formatType(workspace.workspace_type)} />
                <InfoCard label="Capacity" value={`${workspace.capacity} people`} />
                <InfoCard label="Location" value={workspace.location || "-"} />
                <InfoCard label="Rate" value={`$${workspace.hourly_rate || 0}/hour`} />
              </div>

              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-600">
                This will delete the workspace record. If this workspace has
                reservations, review the behavior in the backend before using
                this action in production.
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-slate-600">
              <span className="font-bold text-cyan-500">ⓘ</span>

              <p>
                For demo purposes, this screen provides a safer confirmation
                flow instead of using a browser alert.
              </p>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href={`/workspaces/${workspace.id}`}
                className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Go Back
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-600"
              >
                Delete Workspace
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

type InfoCardProps = {
  label: string;
  value: string | number;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

function formatType(type?: string | null): string {
  if (!type) return "-";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}