import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type HeaderActionButtonProps = {
  href?: string;
  icon: LucideIcon;
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

export default function HeaderActionButton({
  href,
  icon: Icon,
  children,
  variant = "primary",
  onClick,
}: HeaderActionButtonProps) {
  const className = actionClassName(variant);

  if (href) {
    return (
      <Link href={href} className={className}>
        <Icon size={16} strokeWidth={2.4} className="shrink-0" />
        <span className="truncate">{children}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon size={16} strokeWidth={2.4} className="shrink-0" />
      <span className="truncate">{children}</span>
    </button>
  );
}

function actionClassName(variant: "primary" | "secondary"): string {
  const base =
    "inline-flex h-10 max-w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black shadow-sm outline-none transition hover:-translate-y-0.5 hover:shadow-md focus:ring-4";

  if (variant === "secondary") {
    return `${base} border border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300 dark:focus:ring-slate-700/40`;
  }

  return `${base} bg-cyan-400 text-white shadow-cyan-100 hover:bg-cyan-500 focus:ring-cyan-100 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 dark:focus:ring-cyan-500/20`;
}