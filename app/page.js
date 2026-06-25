"use client";

import Footer from "components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderBlack from "../components/HeaderBlack";
import HeaderWhite from "../components/HeaderWhite";
import PlayButton from "../components/PlayButton";
import RepoGallery from "../components/RepoGallery";

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
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 1200px) 1170px, 2400px"
          />
        </div>

        {/* Image for small screens */}
        <div className="block sm:hidden">
          <Image
            src="/images/header-portrait.jpg"
            alt="Responsive header image for small screens"
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 600px) 100vw, 320px"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-screen-lg mx-auto p-8">
        {/* About */}
        <section id="about">
          <h1 className="md:text-7xl text-6xl uppercase pt-20 pb-6 tracking-tight">
            About
          </h1>
          <div className="flex flex-wrap gap-3 mb-8 md:text-base text-sm uppercase">
            {[
              "Fullstack Development",
              "Frontend Development",
              "HTML & CSS",
              "JavaScript",
              "React",
              "Next JS",
              "UI / UX",
              "Tailwind CSS",
              "Daisy UI",
              "Google Firebase",
              "Procreate",
              "Photoshop",
            ].map((skill) => (
              <span key={skill} className="bg-[#e8175d] text-white py-2 px-6">
                {skill}
              </span>
            ))}
          </div>
          <div className="text-lg text-gray-800 leading-relaxed text-justify">
            <p className="mb-4">
              Hi, I&apos;m Miriam – a fullstack developer based in Hamburg –
              passionate about art, design, and everything related to making
              things functional and visually appealing. I specialize in building
              responsive websites and apps that not only look great across all
              devices but also work seamlessly in the background. My focus is on
              creating digital experiences that align with my customers&apos;
              corporate identity while adding a personal, unique touch to each
              project.{" "}
            </p>
            <p className="mb-4">
              With a solid background in both frontend and backend development,
              I bring together UI/UX design and the technical logic needed to
              bring ideas to life. Whether it&apos;s working with APIs,
              databases, or deploying fully functional websites, I always aim to
              make things work smoothly.
            </p>
            <p className="mb-4">
              I&apos;m currently available for freelance work – whether
              you&apos;re looking for someone to build a fullstack application
              or enhance your website&apos;s design and performance, feel free
              to send me a message through the contact form.
            </p>
            <p className="mb-4">
              When I&apos;m not coding, you&apos;ll find me in my art studio or
              biking through the city seeking inspiration and enjoying the fresh
              air to stay energized.
            </p>
          </div>
        </section>

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
