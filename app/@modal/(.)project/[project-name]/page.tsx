"use client";

import ProjectDetail from "@/components/ProjectDetail";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

interface Props {
  params: { "project-name": string };
}

export default function ProjectModal({ params }: Props) {
  const router = useRouter();
  const projectName = params["project-name"];
  const handleClose = () => router.back();

  return (
    <AnimatePresence>
      {/* Backdrop — click outside to close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 md:p-12"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClose();
        }}
        tabIndex={0}
      >
        {/* Card — stop click from bubbling to backdrop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-black rounded-2xl overflow-y-auto max-h-[90vh] w-full max-w-4xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✕ Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-4xl leading-none z-10 transition-colors"
            aria-label="Close"
          >
            &times;
          </button>

          <ProjectDetail
            projectName={projectName}
            isModal={true}
            onClose={handleClose}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
