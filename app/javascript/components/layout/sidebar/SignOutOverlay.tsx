import { AnimatePresence, motion } from "motion/react";

export default function SignOutOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-120 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-xl"
          >
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-400" />

            <h2 className="text-lg font-extrabold text-slate-950">
              Signing out
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Closing your session securely...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}