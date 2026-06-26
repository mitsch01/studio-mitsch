import Footer from "@/components/Footer"
import Header from "@/components/Header"
import ProjectDetail from "@/components/ProjectDetail"

export async function generateMetadata({ params }: { params: { "project-name": string } }) {
  const projectName = params["project-name"]
  const formatted = projectName
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
  return {
    title: formatted,
    description: `${formatted} — a project by Miriam Schwartz, fullstack web and app developer based in Hamburg.`,
  }
}

export default function ProjectPage({ params }: { params: { "project-name": string } }) {
  return (
    <>
      <Header logoColor="white" burgerColor="white" />
      <ProjectDetail projectName={params["project-name"]} isModal={false} />
      <Footer />
    </>
  )
}