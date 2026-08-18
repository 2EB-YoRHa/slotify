import { usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
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

const TOAST_DURATION = 4200;

export default function FlashMessages() {
  const { props, url } = usePage<SharedPageProps>();
  const flash = props.flash;

  const incomingMessages = useMemo(() => {
    const messages: ToastMessage[] = [];

    if (flash?.notice) {
      messages.push({
        id: `notice-${url}-${flash.notice}`,
        type: "notice",
        title: "Success",
        message: flash.notice,
      });
    }

    if (flash?.alert) {
      messages.push({
        id: `alert-${url}-${flash.alert}`,
        type: "alert",
        title: "Attention",
        message: flash.alert,
      });
    }

    return messages;
  }, [flash?.notice, flash?.alert, url]);

  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    setMessages(incomingMessages);
  }, [incomingMessages]);

  function dismissToast(id: string) {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== id),
    );
  }

  return (
    <div className="pointer-events-none fixed left-3 right-3 top-20 z-100 mx-auto flex max-w-sm flex-col gap-3 sm:left-auto sm:right-6 sm:top-6 sm:mx-0 sm:w-105 sm:max-w-[calc(100vw-3rem)]">
      <AnimatePresence mode="popLayout">
        {messages.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

type ToastProps = {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
};

function Toast({ toast, onDismiss }: ToastProps) {
  const success = toast.type === "notice";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, TOAST_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: -18,
        scale: 0.96,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: -18,
        scale: 0.96,
        filter: "blur(8px)",
      }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`pointer-events-auto overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-colors sm:p-5 ${
        success
          ? "border-green-100 bg-green-50/95 text-green-700 shadow-green-100/60 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300 dark:shadow-slate-950/30"
          : "border-red-100 bg-red-50/95 text-red-700 shadow-red-100/60 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:shadow-slate-950/30"
      }`}
      role={success ? "status" : "alert"}
    >
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            success
              ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300"
              : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"
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
            className={`truncate text-sm font-extrabold ${
              success
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {toast.title}
          </p>

          <p
            className={`mt-1 wrap-break-word text-sm leading-6 ${
              success
                ? "text-green-700 dark:text-green-300/90"
                : "text-red-700 dark:text-red-300/90"
            }`}
          >
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className={`shrink-0 rounded-lg p-1 transition ${
            success
              ? "text-green-500 hover:bg-green-100 hover:text-green-700 dark:text-green-300 dark:hover:bg-green-500/15 dark:hover:text-green-200"
              : "text-red-500 hover:bg-red-100 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/15 dark:hover:text-red-200"
          }`}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      <motion.div
        initial={{ scaleX: 1, opacity: 1 }}
        animate={{ scaleX: 0, opacity: 0.85 }}
        transition={{
          duration: TOAST_DURATION / 1000,
          ease: "linear",
        }}
        className={`mt-4 h-1 origin-left rounded-full ${
          success
            ? "bg-green-300 dark:bg-green-400"
            : "bg-red-300 dark:bg-red-400"
        }`}
      />
    </motion.div>
  );
}