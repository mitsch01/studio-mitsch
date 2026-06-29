"use client";

import NavModal from "@/components/NavModal";
import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();
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
  const iconColor = `text-${mobileBurgerColor ?? currentBurgerColor} md:text-${currentBurgerColor}`;

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

      {/* Right side: account + cart + burger */}
      <div className="flex items-center gap-12">

        <div className="flex items-center gap-4">
          {/* Account icon */}
          <Link
            href={user ? "/account/dashboard" : "/account/login"}
            aria-label={user ? "My Account" : "Login"}
            className={`relative ${iconColor} transition-colors duration-300 text-gray-600 hover:text-raspberry no-underline`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-all duration-300 ${scrolled ? "md:h-7 h-6" : "md:h-9 h-8"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Logged in indicator dot */}
            {user && (
              <span className="absolute -top-1 -right-1 bg-raspberry rounded-full w-2.5 h-2.5" />
            )}
          </Link>
          {/* Cart icon */}
          <Link
            href="/shop/cart"
            aria-label="Cart"
            className={`relative ${iconColor} transition-colors duration-300 text-gray-500 hover:text-raspberry no-underline`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-all duration-300 ${scrolled ? "md:h-7 h-6" : "md:h-9 h-8"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-raspberry text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
        </div>

        {/* Burger Menu Icon */}
        <button
          className={`focus:outline-none transition-colors duration-300 ${iconColor}`}
          onClick={toggleModal}
          aria-label="Open Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-all duration-300 ${scrolled ? "md:h-12 h-10" : "md:h-14 h-12"}`}
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