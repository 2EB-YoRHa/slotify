import { ArrowLeft } from "lucide-react";

type GuardedBackButtonProps = {
  children: string;
  disabled?: boolean;
  onClick: () => void;
};

export default function GuardedBackButton({
  children,
  disabled = false,
  onClick,
}: GuardedBackButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 transition hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <ArrowLeft size={16} />
      {children}
    </button>
  );
}