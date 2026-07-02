import PlaygroundClient from "./PlaygroundClient";
import type { Locale } from "@/lib/locale";
import { getStrings } from "@/lib/strings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getStrings(locale as Locale)
  return {
    title: t.playground.mobileHeading,
    description:
      locale === "de"
        ? "Ein experimenteller kreativer Raum — KI-Haiku-Generator von Miriam Schwartz."
        : "An experimental creative space — AI haiku generator by Miriam Schwartz.",
  }
}

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <PlaygroundClient locale={locale as Locale} />
}