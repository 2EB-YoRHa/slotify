import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Workspace } from "../../types/workspace";

type DeleteWorkspaceProps = {
  workspace: Workspace;
};

export default function DeleteWorkspace({ workspace }: DeleteWorkspaceProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  function confirmDeleteWorkspace() {
    setProcessing(true);

    router.delete(`/workspaces/${workspace.id}`, {
      onFinish: () => {
        setProcessing(false);
        setConfirmOpen(false);
      },
    });
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href={`/workspaces/${workspace.id}`}
            className="text-sm font-bold text-cyan-500 hover:text-cyan-600"
          >
            ← Back to Workspace
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-950">
            Delete Workspace
          </h1>

          <p className="mt-2 text-slate-500">
            Review the workspace details before permanently deleting it.
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wide text-red-500">
                Dangerous Action
              </p>

              <h2 className="text-2xl font-bold text-slate-950">
                Are you sure you want to delete this workspace?
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                This action will permanently remove the workspace from Slotify.
                This should only be done when the space is no longer available
                for reservations.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-500">
              !
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-6">
            <InfoRow label="Workspace" value={workspace.name} />

            <InfoRow
              label="Type"
              value={formatText(workspace.workspace_type)}
            />

            <InfoRow label="Capacity" value={workspace.capacity} />

            <InfoRow label="Location" value={workspace.location || "-"} />

            <InfoRow
              label="Hourly Rate"
              value={
                workspace.hourly_rate
                  ? `$${workspace.hourly_rate}`
                  : "Not configured"
              }
            />

            <InfoRow
              label="Status"
              value={workspace.active ? "Active" : "Inactive"}
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Link
              href={`/workspaces/${workspace.id}`}
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Keep Workspace
            </Link>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-lg bg-red-500 px-6 py-3 text-sm font-bold text-white hover:bg-red-600"
            >
              Delete Workspace
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete workspace?"
        description={`This will permanently delete ${workspace.name}. This action cannot be undone.`}
        confirmText="Delete Workspace"
        cancelText="Keep Workspace"
        danger
        processing={processing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDeleteWorkspace}
      />
    </AppLayout>
  );
}

type InfoRowProps = {
  label: string;
  value: string | number;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-4 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-950">{value}</span>
    </div>
  );
}

function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}