import type { ButtonHTMLAttributes, ReactNode } from "react";

type LoadingButtonVariant = "primary" | "danger" | "secondary";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
  variant?: LoadingButtonVariant;
  children: ReactNode;
};

export default function LoadingButton({
  loading = false,
  loadingText = "Processing...",
  variant = "primary",
  children,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary:
      "bg-cyan-400 text-white shadow-cyan-100 hover:bg-cyan-500 focus:ring-cyan-100 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950 dark:focus:ring-cyan-500/20",
    danger:
      "bg-red-500 text-white shadow-red-100 hover:bg-red-600 focus:ring-red-100 dark:shadow-none dark:hover:bg-red-400 dark:focus:ring-red-500/20",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-700/40",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold shadow-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="truncate">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}