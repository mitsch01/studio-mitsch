import Link from "next/link"
import HeaderBlack from "components/HeaderBlack"
import ProjectGallery from "components/ProjectGallery"
import Footer from "components/Footer"

export default async function ProjectDetail({ params }) {
  const username = "mitsch01"
  const { "project-name": projectName } = params

  // Fetch project details from GitHub
  const res = await fetch(`https://api.github.com/repos/${username}/${projectName}`)
  if (!res.ok) {
    return <div>Project not found</div>
  }
  const project = await res.json()

  // Fetch languages used in the project
  const languagesRes = await fetch(`https://api.github.com/repos/${username}/${projectName}/languages`)
  const languagesData = await languagesRes.json()
  const languages = Object.keys(languagesData)

  const transformString = input => {
    return input
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div>
      <HeaderBlack />
      <div className='mt-36 p-28 max-w-screen-lg mx-auto'>
        {/* Header */}
        <h1 className='text-4xl font-bold uppercase text-black mb-6'>{transformString(project.name)}</h1>

        {/* Description */}
        <p className='text-lg text-gray-800 leading-relaxed mb-6'>{project.description || "No description available."}</p>

        {/* Project Gallery */}
        <ProjectGallery projectName={projectName} />

        <div className='flex justify-between items-start'>
          {/* Left Column: Project Details */}
          <div className='flex-grow'>
            {/* Languages */}
            <p className='text-lg text-gray-800 leading-relaxed'>
              <strong>Languages:</strong> {languages.join(", ")}
            </p>
            {/* Tags */}
            <p className='text-lg text-gray-800 leading-relaxed'>
              <strong>Tags:</strong> {project.topics.length > 0 ? project.topics.join(", ") : "none"}
            </p>
            {/* Created At */}
            <p className='text-lg text-gray-800 leading-relaxed'>
              <strong>Created at:</strong> {new Date(project.created_at).toLocaleDateString()}
            </p>
            {/* Updated At */}
            <p className='text-lg text-gray-800 leading-relaxed'>
              <strong>Last updated:</strong> {new Date(project.updated_at).toLocaleDateString()}
            </p>
          </div>

          {/* Right Column: GitHub Link */}
          <div className='ml-6'>
            <a href={project.html_url} target='_blank' rel='noopener noreferrer' className='inline-block text-black font-semibold uppercase hover:scale-105'>
              View on GitHub
            </a>
          </div>
        </div>

        <br />
        {/* Back to Projects Link */}
        <div className='text-center mt-10'>
          <Link href='/' className='font-hind text-xl bg-[#e8175d] hover:bg-[#c3144f] text-white py-2 px-4 rounded'>
            ◀ Back to all projects
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
