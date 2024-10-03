"use client"
import Link from "next/link"


export default function NavModal({toggleModal}) {
  return (
    <div className='fixed inset-0 bg-black z-50 flex flex-col justify-center items-center'>
      {/* Logo */}
      <div className='clickable absolute top-16 left-16'>
        <Link href='/'>
          <div className='font-homemade text-5xl text-white'>mitsch</div>
        </Link>
      </div>

      {/* Close Button */}
      <button className='absolute top-16 right-16 text-white text-6xl' onClick={toggleModal} aria-label='Close Menu'>
        &times;
      </button>

      {/* Navigation Items */}
      <nav className='font-cooperhewitt mt-16 flex flex-col space-y-8 text-center text-white'>
        <Link href='/' onClick={toggleModal} className={`text-6xl font-bold uppercase tracking-wider`}>
          Home
        </Link>
        <Link href='/#about' onClick={toggleModal} className={`text-6xl font-bold uppercase tracking-wider`}>
          About
        </Link>
        <Link href='/#projects' onClick={toggleModal} className={`text-6xl font-bold uppercase tracking-wider`}>
          Projects
        </Link>
        <Link href='/playground' onClick={toggleModal} className={`text-6xl font-bold uppercase tracking-wider`}>
          Playground
        </Link>
        <Link href='/contact' onClick={toggleModal} className={`text-6xl font-bold uppercase tracking-wider`}>
          Contact
        </Link>
      </nav>
    </div>
  )
}

