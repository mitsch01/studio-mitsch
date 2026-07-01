"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function ProjectGallery({ projectName }) {
  const videoPath = `/videos/${projectName}-video.mp4`;
  const [desktopImages, setDesktopImages] = useState([]);
  const [mobileImages, setMobileImages] = useState([]);
  const maxImages = 11;

  useEffect(() => {
    async function fetchImages() {
      const res = await fetch(
        `/api/check-images?projectName=${projectName}&maxImages=${maxImages}`,
      );
      const data = await res.json();
      setDesktopImages(data.desktopImages);
      setMobileImages(data.mobileImages);
    }

    fetchImages();
  }, [projectName]);

  // If no images are found, render nothing
  if (desktopImages.length === 0 && mobileImages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col mt-16">
      {/* Desktop Carousel */}
      <div className="w-full max-w-4xl mx-auto mb-12">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation
          modules={[Navigation, Pagination]}
          onInit={(swiper) => {
            const nextButton = swiper.navigation.nextEl;
            const prevButton = swiper.navigation.prevEl;

            if (nextButton) {
              nextButton.classList.add("clickable");
            }
            if (prevButton) {
              prevButton.classList.add("clickable");
            }
          }}
        >
          {desktopImages.map((desktopImage, index) => (
            <SwiperSlide key={index}>
              <Image
                src={desktopImage}
                alt={`${projectName} desktop mockup ${index + 1}`}
                width={1200}
                height={676}
                className="w-full object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile Carousel */}
      <div className="w-full max-w-4xl mx-auto mb-16">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation
          modules={[Navigation, Pagination]}
          onInit={(swiper) => {
            // Add the clickable class to navigation buttons
            const nextButton = swiper.navigation.nextEl;
            const prevButton = swiper.navigation.prevEl;

            if (nextButton) {
              nextButton.classList.add("clickable");
            }
            if (prevButton) {
              prevButton.classList.add("clickable");
            }
          }}
        >
          {mobileImages.map((mobileImage, index) => (
            <SwiperSlide key={index}>
              <Image
                src={mobileImage}
                alt={`${projectName} mobile mockup ${index + 1}`}
                width={1200}
                height={676}
                className="w-full object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Video Section */}
      {videoPath && (
        <div className="flex justify-center items-center mb-12">
          <video controls className="w-full max-w-4xl">
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
