"use client";

import About from "@/components/About";
import Footer from "@/components/Footer";
import HeaderBlack from "@/components/HeaderBlack";
import HeaderWhite from "@/components/HeaderWhite";
import PlayButton from "@/components/PlayButton";
import RepoGallery from "@/components/RepoGallery";
import Skills from "@/components/Skills";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const [activeHeader, setActiveHeader] = useState(<HeaderWhite />);
  const [scrollThreshold, setScrollThreshold] = useState(0);

  useEffect(() => {
    setScrollThreshold(window.innerHeight * 0.9);

    const handleHashChange = () => {
      if (typeof window !== "undefined") {
        // Check if we're on the client side
        const hash = window.location.hash;
        updateHeader(hash);
      }
    };

    const updateHeader = (hash) => {
      switch (hash) {
        case "":
        case "#":
          setActiveHeader(<HeaderWhite />);
          break;
        case "#about":
        case "#projects":
          setActiveHeader(<HeaderBlack />);
          break;
        default:
          setActiveHeader(<HeaderWhite />);
          break;
      }
    };

    // Add event listener for hash changes
    if (typeof window !== "undefined") {
      window.addEventListener("hashchange", handleHashChange);
      // Run it initially to set the correct component on mount
      handleHashChange();

      // Add scroll event listener to update the header based on scroll position
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const sections = document.querySelectorAll("section");

        // Check if we're within the threshold of the top of the page
        if (scrollY <= scrollThreshold) {
          setActiveHeader(<HeaderWhite />);
          return;
        }

        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            // Update header based on the current section
            const hash = `#${section.id}`;
            updateHeader(hash);
          }
        });
      };

      window.addEventListener("scroll", handleScroll);

      // Cleanup event listeners
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <>
      {/* Header */}
      {activeHeader}

      <div className="relative w-full h-screen overflow-hidden">
        {/* Image for large screens */}
        <div className="hidden sm:block">
          <Image
            src="/images/header-landscape.jpg"
            alt="Responsive header image for large screens"
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 1170px, 2400px"
          />
        </div>

        {/* Image for small screens */}
        <div className="block sm:hidden">
          <Image
            src="/images/header-portrait.jpg"
            alt="Responsive header image for small screens"
            fill
            className="object-cover"
            sizes="(max-width: 600px) 100vw, 320px"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-screen-lg mx-auto p-8">
        {/* About */}
        <About />

        {/* Skills */}
        <Skills />

        {/* Projects */}
        <section id="projects" className="mb-24">
          <h1 className="md:text-7xl text-6xl font-bold uppercase text-black pt-20 pb-6 tracking-tight">
            Projects
          </h1>
          <RepoGallery />
          <PlayButton />
        </section>
      </div>
      <Footer />
    </>
  );
}
