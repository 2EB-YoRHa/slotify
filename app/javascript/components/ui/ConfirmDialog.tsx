type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  processing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  processing = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${
            danger ? "bg-red-50 text-red-500" : "bg-cyan-50 text-cyan-500"
          }`}
        >
          {danger ? "!" : "?"}
        </div>

        <h2 className="text-xl font-bold text-slate-950">{title}</h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={processing}
            className={`rounded-lg px-5 py-3 text-sm font-bold text-white disabled:opacity-60 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-cyan-400 hover:bg-cyan-500"
            }`}
          >
            {processing ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}