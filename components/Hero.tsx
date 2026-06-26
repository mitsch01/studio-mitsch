import Image from "next/image"

export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Landscape — large screens */}
      <div className="hidden sm:block">
        <Image
          src="/images/header-landscape.jpg"
          alt="Studio Mitsch — Hamburg based web and app developer"
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 1170px, 2400px"
          priority
        />
      </div>

      {/* Portrait — small screens */}
      <div className="block sm:hidden">
        <Image
          src="/images/header-portrait.jpg"
          alt="Studio Mitsch — Hamburg based web and app developer"
          fill
          className="object-cover"
          sizes="(max-width: 600px) 100vw, 320px"
          priority
        />
      </div>
    </div>
  )
}