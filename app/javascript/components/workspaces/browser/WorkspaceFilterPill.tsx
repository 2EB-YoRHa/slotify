type WorkspaceFilterPillProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function WorkspaceFilterPill({
  label,
  selected,
  onClick,
}: WorkspaceFilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition ${
        selected
          ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950"
          : "bg-slate-100 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
      }`}
    >
      {label}
    </button>
  );
}