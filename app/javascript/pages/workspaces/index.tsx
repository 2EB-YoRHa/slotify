import { Link } from "@inertiajs/react";
import AppLayout from "../../components/AppLayout";
import WorkspaceEmptyState from "../../components/workspaces/WorkspaceEmptyState";
import WorkspaceTable from "../../components/workspaces/WorkspaceTable";
import type { Workspace } from "../../types/workspace";

type WorkspacesIndexProps = {
  workspaces?: Workspace[];
};

export default function WorkspacesIndex({
  workspaces = [],
}: WorkspacesIndexProps) {
  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workspaces</h1>

          <p className="mt-1 text-slate-500">
            Manage your organization's desks, rooms, and studios.
          </p>
        </div>

        <Link
          href="/workspaces/new"
          className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-500"
        >
          + Add Workspace
        </Link>
      </div>

      {workspaces.length === 0 ? (
        <WorkspaceEmptyState />
      ) : (
        <WorkspaceTable workspaces={workspaces} />
      )}
    </AppLayout>
  );
}