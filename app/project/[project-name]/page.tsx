import Footer from "@/components/Footer"
import Header from "@/components/Header"
import ProjectDetail from "@/components/ProjectDetail"
import { use } from "react"


export async function generateMetadata({ params }: { params: Promise<{ "project-name": string }> }) {
  const { "project-name": projectName } = await params;
  const formatted = projectName
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
  return {
    title: formatted,
    description: `${formatted} — a project by Miriam Schwartz, fullstack web and app developer based in Hamburg.`,
  }
}

export default function ProjectPage({ params }: { params: Promise<{ "project-name": string }> }) {
  const { "project-name": projectName } = use(params);
  return (
    <>
      <Header logoColor="white" burgerColor="white" />
      <ProjectDetail projectName={projectName} isModal={false} />
      <Footer />
    </>
  )
}