"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function ProjectGallery({ projectName }) {
  const videoPath = `/videos/${projectName}-video.mp4`
  const desktopImages = [`/images/${projectName}-desktop-1.jpg`, `/images/${projectName}-desktop-2.jpg`]
  const mobileImages = [`/images/${projectName}-mobile-1.jpg`, `/images/${projectName}-mobile-2.jpg`]

  const items = [videoPath, ...desktopImages, ...mobileImages]
  const filteredItems = items.filter(item => item)

  if (filteredItems.length === 0) {
    return null
  }

  return (
    <div className='flex flex-col mt-16'>
      {/* Video Section */}
      {filteredItems[0].endsWith(".mp4") && (
        <div className='flex justify-center items-center mb-12'>
          <video controls className='w-full max-w-4xl'>
            <source src={filteredItems[0]} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Desktop Carousel */}
      <div className='w-full max-w-4xl mx-auto mb-12'>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation 
          modules={[Navigation, Pagination]}>
          {desktopImages.map((desktopImage, index) => (
            <SwiperSlide key={index}>
              <Image src={desktopImage} alt={`${projectName} desktop mockup ${index + 1}`} layout='responsive' width={1200} height={676} objectFit='cover' className='w-full' />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile Carousel */}
      <div className='w-full max-w-4xl mx-auto mb-16'>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation 
          modules={[Navigation, Pagination]}>
          {mobileImages.map((mobileImage, index) => (
            <SwiperSlide key={index}>
              <Image src={mobileImage} alt={`${projectName} mobile mockup ${index + 1}`} layout='responsive' width={1200} height={676} objectFit='cover' className='w-full' />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
