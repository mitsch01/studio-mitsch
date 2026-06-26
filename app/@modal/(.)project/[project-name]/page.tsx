"use client"

import ProjectDetail from "@/components/ProjectDetail"
import { motion, AnimatePresence } from "motion/react"
import { useRouter } from "next/navigation"

interface Props {
  params: { "project-name": string }
}

export default function ProjectModal({ params }: Props) {
  const router = useRouter()
  const projectName = params["project-name"]

  const handleClose = () => router.back()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black overflow-y-auto"
      >
        <ProjectDetail
          projectName={projectName}
          isModal={true}
          onClose={handleClose}
        />
      </motion.div>
    </AnimatePresence>
  )
}