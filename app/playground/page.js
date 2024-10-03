"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import HeaderWhite from "components/HeaderWhite"

export default function Playground() {
  const [haikus, setHaikus] = useState([])
  const [word1, setWord1] = useState("")
  const [word2, setWord2] = useState("")
  const [word3, setWord3] = useState("")
  const [currentMachine, setCurrentMachine] = useState("initial")
  const [haiku, setHaiku] = useState("")
  const [loading, setLoading] = useState(false)
  const dragContainerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const fixedPositions = [
    { top: 100, left: 200 },
    { top: 300, left: 500 },
    { top: 150, left: 800 },
    { top: 400, left: 1200 },
    { top: 250, left: 1600 },
    { top: 500, left: 2000 },
    { top: 600, left: 300 },
    { top: 700, left: 900 },
    { top: 800, left: 1300 },
    { top: 900, left: 400 },
    { top: 1050, left: 1100 },
    { top: 1150, left: 1700 },
    { top: 1250, left: 600 },
    { top: 1350, left: 1500 },
    { top: 1450, left: 1800 },
    { top: 1550, left: 700 },
    { top: 1650, left: 1400 },
    { top: 1750, left: 1900 },
    { top: 1850, left: 300 },
    { top: 1950, left: 1000 }
  ]

  const fixedRotations = [5, -3, 7, -5, 2, -2, 4, -4, 1, -1, 3, -6, 8, -8, 6, -7, 9, -9, 0, 4]

  const handleClick = async () => {
    setCurrentMachine("animating")

    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 3000)
    })

    await generateHaiku()
  }

  useEffect(() => {
    async function fetchHaikus() {
      const res = await fetch("/api/haikus")
      const data = await res.json()

      if (data.length > 20) {
        setHaikus(data.slice(-20))
      } else {
        setHaikus(data)
      }
    }

    fetchHaikus()
  }, [])

  const generateHaiku = async () => {
    if (!word1.trim() || !word2.trim() || !word3.trim()) return

    setLoading(true)
    const newPrompt = `${word1} ${word2} ${word3}`

    const haikuRes = await fetch("/api/generate-haiku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: newPrompt })
    })

    const haikuData = await haikuRes.json()

    if (haikuRes.ok) {
      const newHaiku = haikuData.haiku
      setHaiku(newHaiku)
      setCurrentMachine("final")

      // Save the generated haiku to the database
      await fetch("/api/save-haiku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ haiku: newHaiku })
      })

      // Add the new haiku to the local state
      setHaikus(prevHaikus => [...prevHaikus, newHaiku])
    } else {
      setHaiku("Error generating haiku")
      setCurrentMachine("initial")
    }

    setLoading(false)
  }

  const startDrag = e => {
    setIsDragging(true)
    if (e.type === "mousedown") {
      setStartX(e.clientX)
      setStartY(e.clientY)
    } else if (e.type === "touchstart") {
      setStartX(e.touches[0].clientX)
      setStartY(e.touches[0].clientY)
    }
  }

  const handleDrag = e => {
    if (!isDragging) return

    const dragContainer = dragContainerRef.current
    let currentX, currentY

    if (e.type === "mousemove") {
      currentX = e.clientX
      currentY = e.clientY
    } else if (e.type === "touchmove") {
      currentX = e.touches[0].clientX
      currentY = e.touches[0].clientY
    }

    const deltaX = currentX - startX
    const deltaY = currentY - startY

    const newTranslateX = dragContainer.offsetLeft + deltaX
    const newTranslateY = dragContainer.offsetTop + deltaY

    dragContainer.style.left = `${newTranslateX}px`
    dragContainer.style.top = `${newTranslateY}px`

    setStartX(currentX)
    setStartY(currentY)
  }

  const stopDrag = () => {
    setIsDragging(false)
  }

  return (
    <div className='bg-black min-h-screen overflow-hidden relative'>
      <HeaderWhite />
      <div className='zoom-out absolute top-0 left-0 w-full h-full' onMouseDown={startDrag} onTouchStart={startDrag} ref={dragContainerRef} onMouseMove={handleDrag} onMouseUp={stopDrag} onTouchMove={handleDrag} onTouchEnd={stopDrag} style={{ position: "relative", cursor: isDragging ? "grabbing" : "grab" }}>
        <div className='flex flex-col items-center pt-36'>
          <div className='relative justify-center items-center'>
            {currentMachine === "initial" && (
              <div className='relative'>
                <Image src='/images/poem-machine-without-poem.png' alt='A hand-drawn machine to generate a poem' width={800} height={555} className='clickable' onClick={handleClick} />
                <div className='absolute flex flex-col top-32 left-16 p-4'>
                  <input type='text' value={word1} onChange={e => setWord1(e.target.value)} className='p-2 mb-2 uppercase' placeholder='First noun' />
                  <input type='text' value={word2} onChange={e => setWord2(e.target.value)} className='p-2 mb-2 uppercase' placeholder='Second noun' />
                  <input type='text' value={word3} onChange={e => setWord3(e.target.value)} className='p-2 uppercase' placeholder='Third noun' />
                </div>
              </div>
            )}
            {currentMachine === "animating" && <Image src='/videos/poem-machine-animation.png' alt='A hand-drawn machine that is generating a poem' width={800} height={555} />}
            {currentMachine === "final" && (
              <div className='relative'>
                <Image src='/images/poem-machine-with-poem.png' alt='A hand-drawn machine that has generated a poem' width={800} height={555} />
                <pre className='absolute bottom-72 -left-4 p-4 text-white font-grace tracking-wider text-center text-2xl'>{haiku}</pre>
              </div>
            )}
          </div>
          <div className='text-white max-w-96 mt-24'>
            <h1 className='text-xl font-bold italic'>haiku</h1>
            <p className='italic text-gray-600'>
              /ˈhaɪkuː/ <span className='font-normal'>noun</span>
            </p>
            <p className='mt-2 text-justify'>Rooted in Japanese tradition, the Haiku captures the beauty of fleeting moments in just three lines: The first line has 5 syllables, the second has 7 syllables, and the third has 5 syllables. Haikus invite you to pause, reflect, and appreciate the world around you. Try creating your own!</p>
          </div>
        </div>
        <div className='relative w-[4000px] h-[4000px]'>
          {haikus.length > 0 &&
            haikus.map((haikuItem, index) => (
              <div
                key={index}
                className={`text-white p-4 ${index === haikus.length - 1 ? "border-[#e8175d] border-4" : ""}`}
                style={{
                  position: "absolute",
                  top: `${fixedPositions[index].top}px`,
                  left: `${fixedPositions[index].left}px`,
                  transform: `rotate(${fixedRotations[index]}deg)`
                }}>
                <pre className='font-grace tracking-wider text-center text-2xl'>{haikuItem.haiku}</pre>
              </div>
            ))}
          {/* Display the generated haiku in a new div with a pink border */}
          {haiku && (
            <div
              className='text-white p-4 border-[#e8175d] border-4'
              style={{
                position: "absolute",
                top: `${fixedPositions[haikus.length % fixedPositions.length].top}px`,
                left: `${fixedPositions[haikus.length % fixedPositions.length].left}px`,
                transform: `rotate(${fixedRotations[haikus.length % fixedRotations.length]}deg)`
              }}>
              <pre className='font-grace tracking-wider text-center text-2xl'>{haiku}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
