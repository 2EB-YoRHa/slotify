import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Building2,
  DoorOpen,
  Plus,
  UsersRound,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import WorkspaceTable from "../../components/workspaces/WorkspaceTable";
import type { Workspace } from "../../types/workspace";

type WorkspacesIndexProps = {
  workspaces?: Workspace[];
};

export default function WorkspacesIndex({
  workspaces = [],
}: WorkspacesIndexProps) {
  const activeWorkspaces = workspaces.filter((workspace) => workspace.active);
  const totalCapacity = workspaces.reduce(
    (sum, workspace) => sum + Number(workspace.capacity || 0),
    0
  );

  const averageRate =
    workspaces.length === 0
      ? 0
      : workspaces.reduce(
          (sum, workspace) => sum + Number(workspace.hourly_rate || 0),
          0
        ) / workspaces.length;

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
      helper: "Available for booking",
      icon: DoorOpen,
    },
    {
      label: "Total Capacity",
      value: totalCapacity,
      helper: "People capacity",
      icon: UsersRound,
    },
    {
      label: "Avg. Rate",
      value: `$${averageRate.toFixed(2)}`,
      helper: "Per hour",
      icon: WalletCards,
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-500"
          >
            Workspace Management
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl font-bold text-slate-950"
          >
            Workspaces
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-slate-500"
          >
            Manage rooms, offices, desks and spaces available for reservations.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link
            href="/workspaces/new"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-md"
          >
            <Plus size={18} />
            New Workspace
          </Link>
        </motion.div>
      </div>

      <section className="mb-8 grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <WorkspaceStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <WorkspaceTable workspaces={workspaces} />
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