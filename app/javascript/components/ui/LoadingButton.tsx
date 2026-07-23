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
    primary: "bg-cyan-400 text-white hover:bg-cyan-500",
    danger: "bg-red-500 text-white hover:bg-red-600",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      <span>{loading ? loadingText : children}</span>
    </button>
  );
}