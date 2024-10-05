"use client"
import Link from "next/link"

export default function NavModal({ toggleModal }) {
  return (
    <div className='fixed inset-0 bg-black z-50 flex flex-col justify-center items-center'>
      {/* Logo */}
      <div className='clickable absolute md:top-16 md:left-16 top-10 left-10'>
        <Link href='/'>
          <div className='font-homemade md:text-5xl text-4xl text-white'>mitsch</div>
        </Link>
      </div>

      {/* Close Button */}
      <button className='absolute md:top-16 top-8 md:right-16 right-10 text-white text-5xl' onClick={toggleModal} aria-label='Close Menu'>
        &times;
      </button>

      {/* Navigation Items */}
      <nav className='font-cooperhewitt mt-16 flex flex-col space-y-8 text-center text-white md:text-6xl text-5xl font-bold uppercase tracking-wider'>
        <Link href='/' onClick={toggleModal}>
          Home
        </Link>
        <Link href='/#about' onClick={toggleModal}>
          About
        </Link>
        <Link href='/#projects' onClick={toggleModal}>
          Projects
        </Link>
        <Link href='/playground' onClick={toggleModal}>
          Playground
        </Link>
        <Link href='/contact' onClick={toggleModal}>
          Contact
        </Link>
      </nav>
    </div>
  )
}
