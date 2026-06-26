import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className='bg-black text-white p-4'>
      <nav className='flex justify-center'>
        <ul className='flex m-6 space-x-4'>
          <li>
            <Link href='https://github.com/mitsch01' target='_blank' aria-label='GitHub' className='hover:opacity-75'>
              <Image src='/images/iconmonstr-github-1-24.png' alt='GitHub' width={50} height={50} className='w-6 h-6' />
            </Link>
          </li>
          <li>
            <Link href='https://www.linkedin.com/in/miriam-schwartz-568aaa30b/' target='_blank' aria-label='LinkedIn' className='hover:opacity-75'>
              <Image src='/images/iconmonstr-linkedin-3-24.png' alt='LinkedIn' width={50} height={50} className='w-6 h-6' />
            </Link>
          </li>
        </ul>
      </nav>
      <p className='mt-4 text-center'>© {new Date().getFullYear()} Miriam Schwartz. All rights reserved.</p>
    </footer>
  )
}
 