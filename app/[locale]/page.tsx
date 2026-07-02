import About from "@/components/About"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import PlayButton from "@/components/PlaygroundButton"
import RepoGallery from "@/components/RepoGallery"
import Skills from "@/components/Skills"
import type { Locale } from "@/lib/locale"
import { getSiteContent } from "@/lib/siteContent"
import { getStrings } from "@/lib/strings"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getStrings(locale as Locale)
  return {
    title: "Home",
    description: t.meta.homeDescription,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getStrings(locale as Locale)
  const content = await getSiteContent()

  return (
    <>
      <Header logoColor="white" burgerColor="white" scrollThreshold={0.8} />
      <Hero locale={locale as Locale} />
      <About data={content.about} />
      <Skills data={content.skills} />
      <section id="projects" className="py-section max-w-screen-lg mx-auto px-8">
        <h1 className="md:text-7xl text-6xl uppercase text-black pb-6 tracking-tight">
          {t.projects.heading}
        </h1>
        <RepoGallery locale={locale as Locale} />
        <PlayButton locale={locale as Locale} />
      </section>
      <Footer />
    </>
  )
}