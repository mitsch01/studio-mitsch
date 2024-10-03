import Image from "next/image"
import HeaderWhiteBlack from "components/HeaderWhiteBlack"

export default function Page() {
  return (
    <div>
      <HeaderWhiteBlack />
      {/* Grid Layout */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-0'>
        {/* Left: Image */}
        <div className='relative w-full h-screen overflow-hidden'>
          <Image
            src='/images/contact-image.jpeg'
            alt='Header Image'
            layout='fill' // Fill the container completely
            className='object-cover' // Ensures the image covers the container with aspect ratio maintained
          />
        </div>

        {/* Right: Contact Form */}
        <div className='flex flex-col justify-center p-28'>
          <h1 className='text-7xl font-bold uppercase text-black mb-8 tracking-tight'>Contact</h1>
          <p className='mb-4'>I would love to hear from you! Feel free to reach out to me through the form below or connect with me via social media.</p>

          {/* Signup Form */}
          <form className='space-y-4'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                Name
              </label>
              <input type='text' id='name' className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500' />
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input type='email' id='email' className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500' />
            </div>

            <div>
              <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
                Message
              </label>
              <textarea id='message' rows='4' className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500' />
            </div>

            <button type='submit' className='w-full bg-[#e8175d] text-white py-2 px-4 rounded-md hover:bg-[#c3144f]'>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
