"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavModal({ toggleModal }) {
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/shop", label: "Shop" },
    { href: "/playground", label: "Playground" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <div className='fixed inset-0 bg-black z-50 flex flex-col justify-center items-center'>
      {/* Logo */}
      <div className='clickable absolute md:top-16 md:left-16 top-10 left-10'>
        <Link href='/'>
          <div className='font-homemade md:text-5xl text-4xl text-white'>mitsch</div>
        </Link>
      </div>

      {/* Close Button */}
      <button className='absolute md:top-16 top-8 md:right-16 right-10 text-white text-5xl' onClick={toggleModal} aria-label='Close Menu'>
        &times;
      </button>

      {/* Navigation Items */}
      <nav className='font-cooperhewitt mt-16 flex flex-col space-y-8 text-center md:text-6xl text-5xl font-bold uppercase tracking-wider'>
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={toggleModal}
            className={isActive(href) ? "text-raspberry" : "text-white hover:text-raspberry transition-colors duration-200"}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}