"use client";

import { useAuth } from "@/context/AuthContext";
import { useDarkCursor } from '@/hooks/useDarkCursor';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";


export default function NavModal({ toggleModal }) {
  useDarkCursor()

  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") toggleModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleModal]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout()
    toggleModal()
    router.push('/')
    router.refresh()
  }

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
      {/* Logo — hidden on mobile to save space */}
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
                : "text-white/70 hover:text-white transition-colors duration-200 no-underline"
            }
          >
            {label}
          </Link>
        ))}

        {/* Auth link — conditional */}
  {user ? (
  <>
    <Link
      href="/account/dashboard"
      onClick={toggleModal}
      className={
        isActive("/account")
          ? "text-raspberry no-underline"
          : "text-white/70 hover:text-white transition-colors duration-200 no-underline"
      }
    >
      My Account
    </Link>
    <button
      onClick={handleLogout}
      className="text-white/70 hover:text-white transition-colors duration-200 uppercase tracking-wider font-bold"
    >
      Logout
    </button>
  </>
) : (
  <Link
    href="/account/login"
    onClick={toggleModal}
    className={
      isActive("/account")
        ? "text-raspberry no-underline"
        : "text-white/70 hover:text-white transition-colors duration-200 no-underline"
    }
  >
    Login
  </Link>
)}
      </nav>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}