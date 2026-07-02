import type { Locale } from "@/lib/locale"
import { getStrings } from "@/lib/strings"
import Image from "next/image"

export default function Hero({ locale }: { locale: Locale }) {
  const t = getStrings(locale)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="hidden sm:block relative w-full h-full">
        <Image
          src="/images/header-landscape.webp"
          alt={t.hero.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 1170px, 2400px"
          priority
        />
      </div>
      <div className="block sm:hidden relative w-full h-full">
        <Image
          src="/images/header-portrait.webp"
          alt={t.hero.alt}
          fill
          className="object-cover"
          sizes="(max-width: 600px) 100vw, 320px"
          priority
        />
      </div>
    </div>
  )
}