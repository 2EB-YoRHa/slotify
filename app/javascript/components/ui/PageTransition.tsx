import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePage } from "@inertiajs/react";

type PageTransitionProps = {
  children: ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const { url } = usePage();

  return (
    <motion.div
      key={url}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}