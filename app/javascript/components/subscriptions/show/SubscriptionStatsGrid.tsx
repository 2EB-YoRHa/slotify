import { CreditCard, Database, Sparkles, UsersRound } from "lucide-react";
import {
  SubscriptionStatCard,
  type SubscriptionStat,
} from "./SubscriptionShowShared";

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
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mb-8 xl:grid-cols-4 xl:gap-6">
      {stats.map((stat, index) => (
        <SubscriptionStatCard key={stat.label} stat={stat} index={index} />
      ))}
    </section>
  );
}