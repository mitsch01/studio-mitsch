import Image from "next/image"
import HeaderWhiteBlack from "components/HeaderWhiteBlack"
import HeaderWhite from "components/HeaderWhite"
import ConnectingDots from "components/ConnectingDots"
import EmailForm from "components/EmailForm"


export default function Page() {
  return (
    <div>
      <div>
        {/* Component for large screens */}
        <div className='hidden md:block'>
          <HeaderWhiteBlack />
        </div>
        {/* Component for small screens */}
        <div className='block md:hidden'>
          <HeaderWhite />
        </div>
      </div>

      {/* Grid Layout */}
      <div className='grid grid-cols-1 md:grid-cols-2'>
        {/* Left: Image */}
        <div className='relative w-full h-screen overflow-hidden'>
          <Image src='/images/contact-image.jpeg' alt='Header Image' layout='fill' className='object-cover' />
          <div className='absolute top-52 left-10 z-10'>
            <ConnectingDots />
          </div>
        </div>
        {/* Right: Contact Form */}
        <div className='flex flex-col justify-center max-w-screen-sm mx-auto p-8 my-12'>
          <h1 className='md:text-7xl text-6xl font-bold uppercase text-black mb-8 tracking-tight'>Contact</h1>
          <p className='mb-4'>I would love to hear from you! Feel free to reach out to me through the form below or connect with me via social media.</p>

          {/* Signup Form */}
          <EmailForm />
        </div>
      </div>
    </div>
  )
}
