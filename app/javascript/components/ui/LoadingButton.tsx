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
      "bg-cyan-400 text-white shadow-cyan-100 hover:bg-cyan-500 focus:ring-cyan-100",
    danger:
      "bg-red-500 text-white shadow-red-100 hover:bg-red-600 focus:ring-red-100",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-100",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold shadow-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}