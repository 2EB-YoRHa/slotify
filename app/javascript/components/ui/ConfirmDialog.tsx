import { AlertTriangle, HelpCircle } from "lucide-react";

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

  const Icon = danger ? AlertTriangle : HelpCircle;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-2xl">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            danger ? "bg-red-50 text-red-500" : "bg-cyan-50 text-cyan-500"
          }`}
        >
          <Icon size={25} strokeWidth={2.4} />
        </div>

        <h2 className="mt-5 text-2xl font-black text-slate-950">
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={processing}
            className={`rounded-2xl px-5 py-3 text-sm font-black text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
              danger
                ? "bg-red-500 shadow-red-100 hover:bg-red-600"
                : "bg-cyan-400 shadow-cyan-100 hover:bg-cyan-500"
            }`}
          >
            {processing ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}