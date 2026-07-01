import About from "@/components/About"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import PlayButton from "@/components/PlaygroundButton"
import RepoGallery from "@/components/RepoGallery"
import Skills from "@/components/Skills"
import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Home",
  description: "Portfolio of Miriam Schwartz — fullstack developer and app developer based in Hamburg. Web development with React & Next.js, app development with Flutter & Dart.",
}

export default function Page() {
  return (
    <>
      <Header logoColor="white" burgerColor="white" scrollThreshold={0.8}/>
      <Hero />
      <About />
      <Skills />
      <section id="projects" className="py-section max-w-screen-lg mx-auto px-8">
        <h1 className="md:text-7xl text-6xl uppercase text-black pb-6 tracking-tight">
          Projects
        </h1>
        <RepoGallery />
        <PlayButton />
      </section>
      <Footer />
    </>
  )
}