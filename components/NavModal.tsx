"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useDarkCursor } from '@/hooks/useDarkCursor';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface NavModalProps {
  toggleModal: () => void
}
  
export default function NavModal({ toggleModal }: NavModalProps) {
  useDarkCursor()

  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth()
const { items } = useCart()

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleModal]);

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/shop", label: "Shop" },
    { href: "/playground", label: "Playground" },
    { href: "/contact", label: "Contact" },
  ];

  const modal = (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center pt-28 md:pt-0 md:justify-center">
      {/* Logo */}
      <div className="clickable absolute top-10 left-10 md:top-16 md:left-16 hidden md:block">
        <Link href="/" onClick={toggleModal}>
          <div className="font-homemade text-4xl md:text-5xl text-white">
            mitsch
          </div>
        </Link>
      </div>

      {/* Close Button */}
      <button
        className="absolute top-10 right-10 md:top-16 md:right-16 text-white text-5xl leading-none hover:text-raspberry transition-colors"
        onClick={toggleModal}
        aria-label="Close Menu"
      >
        &times;
      </button>

      {/* Navigation Items */}
      <nav className="font-cooperhewitt flex flex-col space-y-5 md:space-y-8 text-center text-4xl md:text-6xl font-bold uppercase tracking-wider">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={toggleModal}
            className={
              isActive(href)
                ? "text-raspberry no-underline"
                : "text-white transition-colors duration-200"
            }
          >
            {label}
          </Link>
        ))}
        {/* Mobile only — account + cart icons */}
<div className="sm:hidden absolute bottom-10 left-0 right-0 flex justify-center gap-12">
  <Link
    href={user ? "/account/dashboard" : "/account/login"}
    onClick={toggleModal}
    aria-label={user ? "My Account" : "Login"}
    className="relative text-white hover:text-raspberry transition-colors p-4"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {user && (
      <span className="absolute top-3 right-3 bg-raspberry rounded-full w-2.5 h-2.5" />
    )}
  </Link>

  <Link
    href="/shop/cart"
    onClick={toggleModal}
    aria-label="Cart"
    className="relative text-white hover:text-raspberry transition-colors p-4"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
    {items.length > 0 && (
      <span className="absolute top-3 right-3 bg-raspberry text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
        {items.length}
      </span>
    )}
  </Link>
</div>
      </nav>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}