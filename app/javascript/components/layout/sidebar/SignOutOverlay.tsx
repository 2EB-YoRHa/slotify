import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function SignOutOverlay({ show }: { show: boolean }) {
  useEffect(() => {
    if (!show) return;

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-120 flex items-center justify-center overflow-hidden bg-slate-950/40 px-4 py-6 backdrop-blur-sm overscroll-contain dark:bg-slate-950/70"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-6 py-7 text-center shadow-xl shadow-slate-950/10 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40 sm:px-8"
          >
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-400 dark:border-cyan-500/20 dark:border-t-cyan-300" />

            <h2 className="text-lg font-extrabold text-slate-950 dark:text-slate-100">
              Signing out
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Closing your session securely...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}