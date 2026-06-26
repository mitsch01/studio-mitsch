import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import HeaderBlack from "@/components/HeaderBlack";
import ProjectGallery from "@/components/ProjectGallery";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const projectName = params["project-name"];
  const formatted = projectName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: formatted,
    description: `${formatted} — a project by Miriam Schwartz, fullstack web and app developer based in Hamburg.`,
  };
}

export default async function ProjectDetail({ params }) {
  const username = "mitsch01";
  const { "project-name": projectName } = params;

  // Fetch project details from GitHub
  const res = await fetch(
    `https://api.github.com/repos/${username}/${projectName}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    },
  );
  if (!res.ok) {
    return <div>Project not found</div>;
  }
  const project = await res.json();

  // Fetch languages used in the project
  const languagesRes = await fetch(
    `https://api.github.com/repos/${username}/${projectName}/languages`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    },
  );
  const languagesData = await languagesRes.json();
  const languages = Object.keys(languagesData);

  const transformString = (input) => {
    return input
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <ErrorBoundary
      fallback={
        <p className="text-gray-400 text-sm uppercase tracking-widest py-8">
          Project details unavailable right now — check back soon.
        </p>
      }
    >
      <div className="overflow-y-auto scroll-smooth">
        <HeaderBlack />
        <div className="mt-24 p-8 md:p-28 max-w-screen-lg mx-auto min-h-screen">
          {/* Header */}
          <h1 className="text-4xl font-bold uppercase text-black mb-6">
            {transformString(project.name)}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            {project.description || "No description available."}
          </p>

          {/* Project Gallery */}
          <ProjectGallery projectName={projectName} />

          <div className="flex justify-between items-start">
            {/* Left Column: Project Details */}
            <div className="flex-grow">
              {/* Languages */}
              <p className="text-lg text-gray-800 leading-relaxed">
                <strong>Languages:</strong> {languages.join(", ")}
              </p>
              {/* Tags */}
              <p className="text-lg text-gray-800 leading-relaxed">
                <strong>Tags:</strong>{" "}
                {project.topics.length > 0 ? project.topics.join(", ") : "none"}
              </p>
              {/* Created At */}
              <p className="text-lg text-gray-800 leading-relaxed">
                <strong>Created at:</strong>{" "}
                {new Date(project.created_at).toLocaleDateString()}
              </p>
              {/* Updated At */}
              <p className="text-lg text-gray-800 leading-relaxed">
                <strong>Last updated:</strong>{" "}
                {new Date(project.updated_at).toLocaleDateString()}
              </p>
            </div>

            {/* Right Column: GitHub Link */}
            <div className="ml-6">
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-black font-semibold uppercase hover:scale-105"
              >
                View on GitHub
              </a>
            </div>
          </div>

          <br />
          {/* Back to Projects Link */}
          <div className="text-center mt-10">
            <Link
              href="/#projects"
              className="font-hind text-xl bg-raspberry hover:bg-raspberry-hover text-white py-2 px-4 rounded"
            >
              ◀ Back to all projects
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
