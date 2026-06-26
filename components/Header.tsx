"use client";

import NavModal from "@/components/NavModal";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeaderColor = "black" | "white";

interface HeaderProps {
  logoColor?: HeaderColor;
  burgerColor?: HeaderColor;
  scrollBackground?: boolean;
}

export default function Header({
  logoColor = "black",
  burgerColor = "black",
  scrollBackground = false,
}: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Scrolled past hero threshold
      setScrolled(currentScrollY > window.innerHeight * 0.8);

      // 2. Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Determine current colors based on scroll position
  const currentLogoColor = scrollBackground && scrolled ? "black" : logoColor;
  const currentBurgerColor =
    scrollBackground && scrolled ? "black" : burgerColor;

  return (
    <header
      className={`fixed top-0 w-full z-40 overflow-hidden flex justify-between items-center transition-all duration-300 
      ${scrolled ? "md:px-16 px-8 py-10 bg-white/95 backdrop-blur-sm" : "md:p-16 p-8 bg-transparent"}
      ${hidden && !isModalOpen ? "-translate-y-full" : "translate-y-0"}
    `}
    >
      {/* Logo */}
      <Link href="/">
        <div
          className={`clickable font-homemade md:text-5xl text-4xl text-${currentLogoColor} transition-colors duration-300`}
        >
          mitsch
        </div>
      </Link>

      {/* Burger Menu Icon */}
      <button
        className={`text-${currentBurgerColor} focus:outline-none transition-colors duration-300`}
        onClick={toggleModal}
        aria-label="Open Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-all duration-300 ${scrolled ? "md:h-8 h-7" : "md:h-12 h-11"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Modal */}
      {isModalOpen && <NavModal toggleModal={toggleModal} />}

      {/* Gradient border bottom */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      )}
    </header>
  );
}
