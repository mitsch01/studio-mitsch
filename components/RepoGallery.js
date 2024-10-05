"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

const RepoGallery = () => {
  const [repos, setRepos] = useState([])
  const [visibleRepos, setVisibleRepos] = useState(4)
  const username = "mitsch01"

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch(`https://api.github.com/users/${username}/repos`)
      const data = await response.json()
      setRepos(data)
    }

    fetchRepos()
  }, [])

  const transformString = input => {
    return input
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const loadMoreRepos = () => {
    setVisibleRepos(prev => prev + 4)
  }

  return (
    <div className='flex flex-col'>
      {/* Repo Cards */}
      <div className='clickable flex flex-wrap gap-8'>
        {repos.slice(0, visibleRepos).map(repo => (
          <Link href={`/project/${repo.name}`} key={repo.id} className='md:w-80 w-full flex flex-col overflow-hidden transition-transform duration-100 hover:scale-110 hover:rounded'>
            {/* Top Part: Image */}
            <div className='w-full'>
              <Image src={`/images/${repo.name}-desktop-1.jpg`} alt={`${repo.name} header`} width={320} height={0} className='w-full h-full object-cover' />
            </div>

            {/* Bottom Part: Content */}
            <div className='flex flex-col flex-grow p-3 bg-black text-center'>
              <h3 className='text-white font-hind md:text-base text-sm'>{transformString(repo.name)}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {visibleRepos < repos.length && (
        <button onClick={loadMoreRepos} className='md:text-base text-sm w-full uppercase bg-[#e8175d] text-white p-4 hover:bg-[#c3144f] my-12'>
          Load More
        </button>
      )}
    </div>
  )
}

export default RepoGallery
