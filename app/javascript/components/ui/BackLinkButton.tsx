import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type BackLinkButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function BackLinkButton({
  href,
  children,
  className = "",
}: BackLinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:shadow-slate-950/30 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300 ${className}`}
    >
      <ArrowLeft size={16} className="shrink-0" strokeWidth={2.4} />
      <span className="truncate">{children}</span>
    </Link>
  );
}