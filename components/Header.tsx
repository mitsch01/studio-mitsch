"use client";

import NavModal from "@/components/NavModal";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeaderColor = "black" | "white";

interface HeaderProps {
  logoColor?: HeaderColor;
  burgerColor?: HeaderColor;
  mobileBurgerColor?: HeaderColor;
  scrollBackground?: boolean;
  scrollThreshold?: number;
}

export default function Header({
  logoColor = "black",
  burgerColor = "black",
  mobileBurgerColor,
  scrollBackground = true,
  scrollThreshold = 0.05,
}: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { items } = useCart();
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > window.innerHeight * (scrollThreshold ?? 0.05));
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

  const currentLogoColor = scrollBackground && scrolled ? "black" : logoColor;
  const currentBurgerColor = scrollBackground && scrolled ? "black" : burgerColor;

  return (
    <header
      className={`fixed top-0 w-full z-40 flex justify-between items-center transition-all duration-300 
${scrolled ? `md:px-16 px-8 py-10 ${scrollBackground ? "bg-white/95 backdrop-blur-sm" : "bg-transparent"}` : "md:p-16 p-8 bg-transparent"}
      ${hidden && !isModalOpen ? "-translate-y-full" : "translate-y-0"}
    `}
    >
      {/* Logo */}
      <Link href="/">
        <div className={`clickable font-homemade md:text-5xl text-4xl text-${currentLogoColor} transition-colors duration-300`}>
          mitsch
        </div>
      </Link>

      {/* Right side: cart + burger */}
      <div className="flex items-center gap-12">
        {/* Cart icon */}
        <Link
          href="/shop/cart"
          aria-label="Cart"
          className={`relative text-${mobileBurgerColor ?? currentBurgerColor} md:text-${currentBurgerColor} transition-colors duration-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-all duration-300 ${scrolled ? "md:h-7 h-6" : "md:h-18 h-9"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {/* Item count badge */}
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-raspberry text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Link>

        {/* Burger Menu Icon */}
        <button
          className={`focus:outline-none transition-colors duration-300 
          text-${mobileBurgerColor ?? currentBurgerColor} 
          md:text-${currentBurgerColor}`}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && <NavModal toggleModal={toggleModal} />}
    </header>
  );
}