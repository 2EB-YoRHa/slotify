import { Link, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Building2,
  DollarSign,
  PlusCircle,
  UsersRound,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import MemberWorkspaceGrid from "../../components/workspaces/MemberWorkspaceGrid";
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
  const activeCount = workspaces.filter((workspace) => workspace.active).length;

  return (
    <AppLayout>
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-950"
          >
            Browse Workspaces
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-2xl text-slate-500"
          >
            Explore available rooms, offices, desks, amenities, pricing, and
            capacity before creating your next reservation.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-cyan-100 bg-cyan-50 px-5 py-3 text-sm font-bold text-cyan-700"
        >
          {activeCount} spaces available
        </motion.div>
      </div>

      <MemberWorkspaceGrid workspaces={workspaces} />
    </AppLayout>
  );
}

function ManagerWorkspacesIndex({ workspaces }: { workspaces: Workspace[] }) {
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
    <AppLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-950"
          >
            Workspaces
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-2xl text-slate-500"
          >
            Browse and manage desks, rooms, offices, amenities, pricing, and
            availability for your organization.
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
            <PlusCircle size={18} />
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