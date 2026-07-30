import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Building2,
  CalendarCheck,
  DoorOpen,
  Sparkles,
  UsersRound,
} from "lucide-react";

export function IconBox({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
      <Icon size={19} strokeWidth={2.4} />
    </div>
  );
}

export function EmptyPanelMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

export function DataBar({ label, width }: { label: string; width: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-medium text-slate-600">
        <span>{label}</span>
        <span>{width}</span>
      </div>

      <div className="h-6 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="h-6 rounded-full bg-cyan-400"
        />
      </div>
    </div>
  );
}

export function iconForStat(label: string): LucideIcon {
  const normalized = label.toLowerCase();

  if (normalized.includes("workspace")) return Building2;
  if (normalized.includes("reservation")) return CalendarCheck;
  if (normalized.includes("available")) return DoorOpen;
  if (normalized.includes("user")) return UsersRound;
  if (normalized.includes("occupancy")) return Activity;

  return Sparkles;
}

export function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}d ago`;
}