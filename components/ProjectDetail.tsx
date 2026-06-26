import ErrorBoundary from "@/components/ErrorBoundary"
import ProjectGallery from "@/components/ProjectGallery"
import Link from "next/link"

interface Props {
  projectName: string
  isModal?: boolean
  onClose?: () => void
}

const transformString = (input: string) =>
  input.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

export default async function ProjectDetail({ projectName, isModal = false, onClose }: Props) {
  const username = "mitsch01"

  const res = await fetch(`https://api.github.com/repos/${username}/${projectName}`, {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` },
  })

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-8">
        <p className="text-2xl font-bold uppercase text-white mb-4">Project not found</p>
        <Link href="/#projects" className="text-raspberry uppercase text-sm tracking-widest hover:underline">
          ← Back to projects
        </Link>
      </div>
    )
  }

  const project = await res.json()
  const languagesRes = await fetch(`https://api.github.com/repos/${username}/${projectName}/languages`, {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` },
  })
  const languagesData = await languagesRes.json()
  const languages = Object.keys(languagesData)

  return (
    <ErrorBoundary fallback={
      <p className="text-gray-400 text-sm uppercase tracking-widest py-8">
        Project details unavailable — check back soon.
      </p>
    }>
      <div className={`${isModal ? "min-h-screen bg-black text-white" : "min-h-screen bg-white text-black"}`}>

        {/* Close button — only shown in modal mode */}
        {isModal && (
          <button
            onClick={onClose}
            className="fixed top-8 right-10 text-white text-5xl z-50 hover:text-raspberry transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        )}

        <div className="pt-24 pb-16 px-8 md:px-16 max-w-screen-lg mx-auto">

          {/* Title */}
          <h1 className={`text-4xl md:text-6xl font-bold uppercase mb-6 ${isModal ? "text-white" : "text-black"}`}>
            {transformString(project.name)}
          </h1>

          {/* Description */}
          <p className={`text-lg leading-relaxed mb-10 ${isModal ? "text-gray-300" : "text-gray-700"}`}>
            {project.description || "No description available."}
          </p>

          {/* Gallery */}
          <ProjectGallery projectName={projectName} />

          {/* Meta */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-10">
            <div className="flex flex-col gap-2">
              <p className={`text-sm ${isModal ? "text-gray-400" : "text-gray-600"}`}>
                <span className="font-bold uppercase tracking-wider">Languages: </span>
                {languages.join(", ")}
              </p>
              <p className={`text-sm ${isModal ? "text-gray-400" : "text-gray-600"}`}>
                <span className="font-bold uppercase tracking-wider">Tags: </span>
                {project.topics?.length > 0 ? project.topics.join(", ") : "none"}
              </p>
              <p className={`text-sm ${isModal ? "text-gray-400" : "text-gray-600"}`}>
                <span className="font-bold uppercase tracking-wider">Created: </span>
                {new Date(project.created_at).toLocaleDateString()}
              </p>
              <p className={`text-sm ${isModal ? "text-gray-400" : "text-gray-600"}`}>
                <span className="font-bold uppercase tracking-wider">Updated: </span>
                {new Date(project.updated_at).toLocaleDateString()}
              </p>
            </div>

            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-bold uppercase tracking-widest hover:text-raspberry transition-colors ${isModal ? "text-white" : "text-black"}`}
            >
              View on GitHub ↗
            </a>
          </div>

          {/* Back link */}
          {!isModal && (
            <div className="text-center mt-16">
              <Link
                href="/#projects"
                className="bg-raspberry hover:bg-raspberry-hover text-white py-3 px-8 uppercase text-sm tracking-widest transition-colors"
              >
                ← Back to all projects
              </Link>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}