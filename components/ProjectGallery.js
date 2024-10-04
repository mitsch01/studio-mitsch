export default function ProjectGallery({ items = [] }) {
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
          {item}
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
