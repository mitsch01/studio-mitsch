import Image from "next/image"

export default function ProjectGallery({ projectName }) {
  // Define image and video paths based on the project name
  const desktopImages = [`/images/${projectName}-desktop-1.png`, `/images/${projectName}-desktop-2.png`]

  const mobileImages = [`/images/${projectName}-mobile-1.png`, `/images/${projectName}-mobile-2.png`]

  const videoPath = `/videos/${projectName}-video.mp4`

  // Combine all items into a single array for rendering
  const items = [...desktopImages, ...mobileImages, videoPath]

  // Filter out any empty content items
  const filteredItems = items.filter(item => item)

  // If there are no items to display, return null (gallery won't render)
  if (filteredItems.length === 0) {
    return null
  }

  return (
    <div className='clickable flex flex-col space-y-4'>
      {filteredItems.map((item, index) => (
        <div key={index} className={`flex justify-center items-center h-40 rounded-md text-white font-bold text-center p-4 ${getColorClass(index)}`}>
          {item.endsWith(".mp4") ? (
            // Render video element for video paths
            <video controls className='h-full w-auto'>
              <source src={item} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          ) : (
            // Render image element for image paths
            <Image
              src={item}
              alt={`${projectName} image ${index + 1}`}
              layout='responsive' // Make the image responsive
              width={500} // Set a width based on your design
              height={300} // Set a height based on your design
              objectFit='cover' // Adjust how the image should be resized
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Function to return different background colors based on index
function getColorClass(index) {
  const colors = ["bg-red-500", "bg-purple-500", "bg-green-500", "bg-pink-500", "bg-teal-500"]
  return colors[index % colors.length]
}
