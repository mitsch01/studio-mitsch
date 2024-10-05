"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import RepoGallery from "../components/RepoGallery"
import HeaderWhite from "../components/HeaderWhite"
import HeaderBlack from "../components/HeaderBlack"
import PlayButton from "../components/PlayButton"
import Footer from "components/Footer"


export default function Page() {
  const [activeHeader, setActiveHeader] = useState(<HeaderWhite />)
  const scrollThreshold = window.innerHeight * 0.9

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      updateHeader(hash)
    }

    const updateHeader = hash => {
      switch (hash) {
        case "":
        case "#":
          setActiveHeader(<HeaderWhite />)
          break
        case "#about":
        case "#projects":
          setActiveHeader(<HeaderBlack />)
          break
        default:
          setActiveHeader(<HeaderWhite />)
          break
      }
    }

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)
    // Run it initially to set the correct component on mount
    handleHashChange()

    // Add scroll event listener to update the header based on scroll position
    const handleScroll = () => {
      const scrollY = window.scrollY
      const sections = document.querySelectorAll("section")

      // Check if we're within the threshold of the top of the page
      if (scrollY <= scrollThreshold) {
        setActiveHeader(<HeaderWhite />)
        return
      }

      sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          // Update header based on the current section
          const hash = `#${section.id}`
          updateHeader(hash)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)

    // Cleanup event listeners
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {/* Header */}
      {activeHeader}

      <div className='relative w-full h-screen overflow-hidden'>
        {/* Image for large screens */}
        <div className='hidden sm:block'>
          <Image src='/images/header-landscape.jpg' alt='Responsive header image for large screens' layout='fill' objectFit='cover' sizes='(max-width: 1200px) 1170px, 2400px' />
        </div>

        {/* Image for small screens */}
        <div className='block sm:hidden'>
          <Image src='/images/header-portrait.jpg' alt='Responsive header image for small screens' layout='fill' objectFit='cover' sizes='(max-width: 600px) 100vw, 320px' />
        </div>
      </div>

      <div className='relative z-10 max-w-screen-md mx-auto p-8'>
        {/* About */}
        <section id='about'>
          <h1 className='md:text-7xl text-6xl uppercase pt-20 pb-6 tracking-tight'>About</h1>
          <div className='flex flex-wrap gap-3 mb-8 md:text-base text-sm uppercase'>
            {["Fullstack Development", "Frontend Development", "HTML & CSS", "JavaScript", "React", "Next JS", "Tailwind CSS", "Daisy UI", "Google Firebase", "Procreate", "Photoshop"].map(skill => (
              <span key={skill} className='bg-[#e8175d] text-white py-2 px-6'>
                {skill}
              </span>
            ))}
          </div>
          <div className='text-lg text-gray-800 leading-relaxed'>
            <p className='mb-4'>Hi, I&apos;m Miriam – a frontend developer based in Hamburg, passionate about art, design, and everything related to making things visually appealing. I&apos;m currently looking for a part-time position as a frontend developer where I can focus on the digital side of design, helping clients bring their ideas to life through websites and apps that align with their corporate identity. Outside of my work, I will continue to spend time in my art studio, painting and illustrating to unwind. I bike everywhere and love being outdoors. </p>
          </div>
        </section>

        {/* Projects */}
        <section id='projects' className='mb-24'>
          <h1 className='md:text-7xl text-6xl font-bold uppercase text-black pt-20 pb-6 tracking-tight'>Projects</h1>
          <RepoGallery />
          <PlayButton />
        </section>
      </div>
      <Footer />
    </>
  )
}
