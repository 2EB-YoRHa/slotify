import { useEffect } from "react";
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
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;

      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!open) return null;

  const Icon = danger ? AlertTriangle : HelpCircle;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center overflow-hidden bg-slate-950/40 px-4 py-6 backdrop-blur-[2px] overscroll-contain dark:bg-slate-950/70">
      <div className="max-h-[calc(100dvh-3rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-2xl transition-colors dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40 sm:p-7">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            danger
              ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300"
              : "bg-cyan-50 text-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-300"
          }`}
        >
          <Icon size={25} strokeWidth={2.4} />
        </div>

        <h2 className="mt-5 wrap-break-word text-xl font-black leading-tight text-slate-950 dark:text-slate-100 sm:text-2xl">
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-sm wrap-break-word text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={processing}
            className={`rounded-2xl px-5 py-3 text-sm font-black text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
              danger
                ? "bg-red-500 shadow-red-100 hover:bg-red-600 dark:shadow-none dark:hover:bg-red-400"
                : "bg-cyan-400 shadow-cyan-100 hover:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-300 dark:hover:text-slate-950"
            }`}
          >
            {processing ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}