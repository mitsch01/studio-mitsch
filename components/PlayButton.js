"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const PlayButton = () => {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          // Calculate new scale based on scroll position
          const newScale = Math.max(0.8, Math.min(1.2, 1 + Math.sin(scrollY * 0.01) * 0.1))
          setScale(newScale)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Link href='/playground'>
      <button className='fixed z-10 md:bottom-4 md:right-6 bottom-0 right-2 transition-transform duration-200' aria-label='Create a poem'>
        <div
          className='clickable relative md:w-36 md:h-36 w-24 h-24 flex items-center justify-center'
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.1s ease-out"
          }}>
          <Image src='/images/create-button.png' alt='Play Button' width={100} height={100} className='absolute w-full h-full transition-transform duration-200 hover:scale-125' />
        </div>
      </button>
    </Link>
  )
}

export default PlayButton
