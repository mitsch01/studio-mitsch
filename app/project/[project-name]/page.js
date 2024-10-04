import Link from "next/link"
import Image from "next/image"
import HeaderBlack from "components/HeaderBlack"
import ProjectGallery from "components/ProjectGallery"

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
      <div className='mt-16 p-28 max-w-screen-lg mx-auto'>
        {/* Header */}
        <h1 className='text-4xl font-bold uppercase text-black mb-6'>{transformString(project.name)}</h1>

        {/* Description */}
        <p className='text-lg text-gray-800 leading-relaxed mb-6'>{project.description || "No description available."}</p>

        <div className='relative w-full h-80 overflow-hidden'>
          {/* Background Image */}
          <Image
            src='/images/sprite-background.png'
            alt='Description of the background'
            layout='fill' // Use 'fill' to cover the container
            objectFit='cover' // Cover the entire container
            className='absolute inset-0 z-0' // Position the image absolutely
          />
          {/* Video (Replace this with your video logic) */}
          <div className='absolute inset-0 z-10 flex justify-center items-center'>
            <iframe width='560' height='315' src='https://www.vimeo.com/embed/your-video-id' title='YouTube Video' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen></iframe>
          </div>
        </div>

        <div className='flex justify-between items-start'>
          {/* Left Column: Project Details */}
          <div className='flex-grow'>
            {/* Languages */}
            <p className='text-lg text-gray-800 leading-relaxed mt-8'>
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

            {/* Project Gallery */}
            <ProjectGallery projectName={projectName} />
          </div>

          {/* Right Column: GitHub Link */}
          <div className='ml-6'>
            <a href={project.html_url} target='_blank' rel='noopener noreferrer' className='inline-block bg-[#e8175d] text-white font-semibold uppercase mt-6 py-2 px-4 rounded mb-6 hover:bg-[#e1175d]'>
              View on GitHub
            </a>
          </div>
        </div>

        <br />
        {/* Back to Projects Link */}
        <div className='text-center'>
          <Link href='/' className='font-hind text-xl'>
            ◀ Back to all projects
          </Link>
        </div>
      </div>
    </div>
  )
}
