"use client"
import { useState } from "react"
import Link from "next/link"
import NavModal from "components/NavModal"

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => setIsModalOpen(!isModalOpen)

  return (
    <header className={`fixed top-0 w-full md:p-16 p-10 z-50 flex justify-between items-center`}>
      {/* Logo */}
      <Link href='/'>
        <div className='clickable text-white font-homemade md:text-5xl text-4xl'>{`mitsch`}</div>
      </Link>
      {/* Burger Menu Icon */}
      <button className=' text-black focus:outline-none' onClick={toggleModal} aria-label='Open Menu'>
        <svg xmlns='http://www.w3.org/2000/svg' className='md:h-12 h-11' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
        </svg>
      </button>
      {/* Modal */}
      {isModalOpen && <NavModal toggleModal={toggleModal} />}
    </header>
  )
}
