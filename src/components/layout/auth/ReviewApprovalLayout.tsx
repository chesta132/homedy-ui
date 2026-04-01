import { HomedyLogo } from "@/components/ui/logo";
import { motion } from "motion/react";

export function ReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mb-6 flex justify-center">
          <HomedyLogo size="48" />
        </div>
        {children}
      </motion.div>
    </div>
  );
}
