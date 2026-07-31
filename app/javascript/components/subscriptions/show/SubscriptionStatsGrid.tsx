import { CreditCard, Database, Sparkles, UsersRound } from "lucide-react";
import { SubscriptionStatCard, type SubscriptionStat } from "./SubscriptionShowShared";

type SubscriptionStatsGridProps = {
  currentPlanLabel: string;
  status: string;
  workspaceUsage: string;
  memberUsage: string;
};

export default function SubscriptionStatsGrid({
  currentPlanLabel,
  status,
  workspaceUsage,
  memberUsage,
}: SubscriptionStatsGridProps) {
  const stats: SubscriptionStat[] = [
    {
      label: "Current Plan",
      value: currentPlanLabel,
      helper: "Plan assigned to the organization",
      icon: CreditCard,
    },
    {
      label: "Status",
      value: status,
      helper: "Current subscription state",
      icon: Sparkles,
    },
    {
      label: "Workspace Access",
      value: workspaceUsage,
      helper: "Current workspaces / plan limit",
      icon: Database,
    },
    {
      label: "Members",
      value: memberUsage,
      helper: "Users plus pending invitations",
      icon: UsersRound,
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <SubscriptionStatCard key={stat.label} stat={stat} index={index} />
      ))}
    </section>
  );
}