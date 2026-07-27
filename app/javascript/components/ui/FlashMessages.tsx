import { usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

type Flash = {
  notice?: string | null;
  alert?: string | null;
};

type SharedPageProps = {
  flash?: Flash;
};

type ToastType = "notice" | "alert";

type ToastMessage = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
};

export default function FlashMessages() {
  const { flash } = usePage<SharedPageProps>().props;

  const messages: ToastMessage[] = [
    flash?.notice
      ? {
          id: `notice-${flash.notice}`,
          type: "notice",
          title: "Success",
          message: flash.notice,
        }
      : null,
    flash?.alert
      ? {
          id: `alert-${flash.alert}`,
          type: "alert",
          title: "Attention",
          message: flash.alert,
        }
      : null,
  ].filter(Boolean) as ToastMessage[];

  return (
    <div className="fixed right-6 top-6 z-[100] flex w-[420px] max-w-[calc(100vw-3rem)] flex-col gap-3">
      <AnimatePresence>
        {messages.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

type ToastProps = {
  toast: ToastMessage;
};

function Toast({ toast }: ToastProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const success = toast.type === "notice";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 90, scale: 0.98 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [90, 0, 0, 60],
        scale: [0.98, 1, 1, 0.98],
      }}
      exit={{ opacity: 0, x: 90, scale: 0.98 }}
      transition={{
        duration: 4.2,
        times: [0, 0.08, 0.86, 1],
        ease: "easeOut",
      }}
      onAnimationComplete={() => setVisible(false)}
      className={`overflow-hidden rounded-2xl border p-5 shadow-xl backdrop-blur ${
        success
          ? "border-green-100 bg-green-50/95 text-green-700 shadow-green-100/60"
          : "border-red-100 bg-red-50/95 text-red-700 shadow-red-100/60"
      }`}
      role={success ? "status" : "alert"}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {success ? (
            <CheckCircle2 size={20} strokeWidth={2.4} />
          ) : (
            <AlertTriangle size={20} strokeWidth={2.4} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-extrabold ${
              success ? "text-green-700" : "text-red-700"
            }`}
          >
            {toast.title}
          </p>

          <p
            className={`mt-1 text-sm leading-6 ${
              success ? "text-green-700" : "text-red-700"
            }`}
          >
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setVisible(false)}
          className={`rounded-lg p-1 transition ${
            success
              ? "text-green-500 hover:bg-green-100 hover:text-green-700"
              : "text-red-500 hover:bg-red-100 hover:text-red-700"
          }`}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 3.6, delay: 0.35, ease: "linear" }}
        className={`mt-4 h-1 origin-left rounded-full ${
          success ? "bg-green-300" : "bg-red-300"
        }`}
      />
    </motion.div>
  );
}