"use client"

import NavModal from "@/components/NavModal"
import Link from "next/link"
import { useState, useEffect } from "react"

type HeaderColor = "black" | "white"

interface HeaderProps {
  logoColor?: HeaderColor
  burgerColor?: HeaderColor
  scrollBackground?: boolean // fades in a background on scroll
}

export default function Header({
  logoColor = "black",
  burgerColor = "black",
  scrollBackground = false,
}: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleModal = () => setIsModalOpen(!isModalOpen)

  useEffect(() => {
    if (!scrollBackground) return
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollBackground])

  return (
    <header className={`fixed top-0 w-full md:p-16 p-8 z-40 flex justify-between items-center transition-all duration-300 ${
      scrollBackground && scrolled
        ? "bg-white/90 backdrop-blur-sm shadow-sm"
        : "bg-transparent"
    }`}>
      {/* Logo */}
      <Link href="/">
        <div className={`clickable font-homemade md:text-5xl text-4xl text-${logoColor}`}>
          mitsch
        </div>
      </Link>

      {/* Burger Menu Icon */}
      <button
        className={`text-${burgerColor} focus:outline-none`}
        onClick={toggleModal}
        aria-label="Open Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="md:h-12 h-11"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Modal */}
      {isModalOpen && <NavModal toggleModal={toggleModal} />}
    </header>
  )
}