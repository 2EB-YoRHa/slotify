import { usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import HeaderActionButton from "../../components/ui/HeaderActionButton";
import {
  Building2,
  DollarSign,
  PlusCircle,
  UsersRound,
  CheckCircle2,
  Grid3X3,
  List,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import MemberWorkspaceGrid from "../../components/workspaces/MemberWorkspaceGrid";
import ManagerWorkspaceGrid from "../../components/workspaces/ManagerWorkspaceGrid";
import WorkspaceTable from "../../components/workspaces/WorkspaceTable";
import type { Workspace } from "../../types/workspace";

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
};

type SharedPageProps = {
  current_user?: CurrentUser | null;
};

type WorkspacesIndexProps = {
  workspaces?: Workspace[];
};

export default function WorkspacesIndex({
  workspaces = [],
}: WorkspacesIndexProps) {
  const { current_user } = usePage<SharedPageProps>().props;
  const isMember = current_user?.role === "member";

  if (isMember) {
    return <MemberWorkspacesIndex workspaces={workspaces} />;
  }

  return <ManagerWorkspacesIndex workspaces={workspaces} />;
}

function MemberWorkspacesIndex({ workspaces }: { workspaces: Workspace[] }) {
  return (
    <AppLayout>
      <MemberWorkspaceGrid workspaces={workspaces} />
    </AppLayout>
  );
}

function ManagerWorkspacesIndex({ workspaces }: { workspaces: Workspace[] }) {
  const [viewMode, setViewMode] = useState<"table" | "browse">("table");
  const activeWorkspaces = workspaces.filter((workspace) => workspace.active);

  const totalCapacity = workspaces.reduce(
    (sum, workspace) => sum + Number(workspace.capacity || 0),
    0,
  );

  const averageRate =
    workspaces.length > 0
      ? workspaces.reduce(
          (sum, workspace) => sum + Number(workspace.hourly_rate || 0),
          0,
        ) / workspaces.length
      : 0;

  const stats = [
    {
      label: "Total Spaces",
      value: workspaces.length,
      helper: "Registered workspaces",
      icon: Building2,
    },
    {
      label: "Active Spaces",
      value: activeWorkspaces.length,
      helper: "Available for reservations",
      icon: CheckCircle2,
    },
    {
      label: "Total Capacity",
      value: totalCapacity,
      helper: "Maximum people supported",
      icon: UsersRound,
    },
    {
      label: "Average Rate",
      value: `$${averageRate.toFixed(2)}`,
      helper: "Average hourly price",
      icon: DollarSign,
    },
  ];

  return (
    <AppLayout
      headerActions={
        <HeaderActionButton href="/workspaces/new" icon={PlusCircle}>
          New Workspace
        </HeaderActionButton>
      }
    >
      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <WorkspaceStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <div className="mb-6 flex justify-end">
        <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "table" ? (
        <WorkspaceTable workspaces={workspaces} />
      ) : (
        <ManagerWorkspaceGrid workspaces={workspaces} />
      )}
    </AppLayout>
  );
}

type WorkspaceStat = {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
};

type WorkspaceStatCardProps = {
  stat: WorkspaceStat;
  index: number;
};

function WorkspaceStatCard({ stat, index }: WorkspaceStatCardProps) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            {stat.value}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Icon size={19} strokeWidth={2.4} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
    </motion.div>
  );
}

type ViewModeToggleProps = {
  viewMode: "table" | "browse";
  onChange: (viewMode: "table" | "browse") => void;
};

function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      <ViewModeButton
        label="Table"
        icon={List}
        selected={viewMode === "table"}
        onClick={() => onChange("table")}
      />

      <ViewModeButton
        label="Browse"
        icon={Grid3X3}
        selected={viewMode === "browse"}
        onClick={() => onChange("browse")}
      />
    </div>
  );
}

type ViewModeButtonProps = {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
};

function ViewModeButton({
  label,
  icon: Icon,
  selected,
  onClick,
}: ViewModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
        selected
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100"
          : "text-slate-500 hover:bg-cyan-50 hover:text-cyan-600"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
