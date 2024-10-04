"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"

const RepoGallery = () => {
  const [repos, setRepos] = useState([])
  const [cardImages, setCardImages] = useState([])
  const [visibleRepos, setVisibleRepos] = useState(4) // State for managing visible repos
  const canvasRef = useRef(null)
  const username = "mitsch01"

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch(`https://api.github.com/users/${username}/repos`)
      const data = await response.json()
      setRepos(data)
    }

    fetchRepos()
  }, [])

  useEffect(() => {
    if (repos.length > 0) {
      // Load the background image and create random images for each card
      const loadImageAndGenerateCards = async () => {
        const canvas = canvasRef.current // The invisible canvas
        const ctx = canvas.getContext("2d")

        const img = new window.Image()
        img.src = "/images/sprite-background.png"

        img.onload = () => {
          const cardImages = repos.map(() => {
            const sectionWidth = 1000 // Width of the section to take from the original image
            const sectionHeight = 1000 // Height of the section to take from the original image
            const randomX = Math.floor(Math.random() * (img.width - sectionWidth))
            const randomY = Math.floor(Math.random() * (img.height - sectionHeight))

            canvas.width = 320
            canvas.height = 320

            ctx.drawImage(img, randomX, randomY, sectionWidth, sectionHeight, 0, 0, 320, 320)

            return canvas.toDataURL("image/png")
          })

          setCardImages(cardImages) 
        }
      }

      loadImageAndGenerateCards()
    }
  }, [repos])

  const transformString = input => {
    return input
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const loadMoreRepos = () => {
    setVisibleRepos(prev => prev + 4) // Load 4 more repos on button click
  }

  return (
    <div className='flex flex-col items-center py-8'>
      {/* Invisible canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {/* Repo Cards */}
      <div className='clickable flex flex-wrap justify-center'>
        {repos.slice(0, visibleRepos).map((repo, index) => (
          <Link href={`/project/${repo.name}`} key={repo.id} className='mr-8 mb-8 w-80 flex flex-col justify-between overflow-hidden transition-transform duration-100 hover:scale-110 hover:rounded'>
            {/* Top Part: Image */}
            <div className='w-full'>{cardImages[index] ? <Image src={cardImages[index]} alt={`${repo.name} header`} width={320} height={320} className='w-full h-full object-cover' /> : null}</div>

            {/* Bottom Part: Content */}
            <div className='flex flex-col flex-grow justify-center items-center p-4 bg-black text-center'>
              <h3 className='text-white font-hind font-bold text-xl'>{transformString(repo.name)}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {visibleRepos < repos.length && (
        <button onClick={loadMoreRepos} className='text-lg w-80 bg-[#e8175d] text-white py-2 px-4 hover:bg-[#c3144f]'>
          Load More
        </button>
      )}
    </div>
  )
}

export default RepoGallery
