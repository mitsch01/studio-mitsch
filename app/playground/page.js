"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import HeaderWhite from "components/HeaderWhite"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons"
import PlaygroundLayout from "components/PlaygroundLayout"

export default function Playground() {
  const [haikus, setHaikus] = useState([]) // Holds past haikus
  const [word1, setWord1] = useState("")
  const [word2, setWord2] = useState("")
  const [word3, setWord3] = useState("")
  const [currentMachine, setCurrentMachine] = useState("initial")
  const [newHaiku, setNewHaiku] = useState("")
  const [loading, setLoading] = useState(false)
  const dragContainerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const fixedPositions = [
    { top: 480, left: 200 },
    { top: 565, left: 550 },
    { top: 610, left: 860 },
    { top: 450, left: 1250 },
    { top: 550, left: 1600 },
    { top: 800, left: 1400 },
    { top: 900, left: 770 },
    { top: 1050, left: 750 },
    { top: 1100, left: 1600 },
    { top: 800, left: 600 },
    { top: 1350, left: 1100 },
    { top: 1350, left: 1500 },
    { top: 1350, left: 600 },
    { top: 1250, left: 1300 },
    { top: 750, left: 1600 },
    { top: 620, left: 1200 },
    { top: 950, left: 1400 },
    { top: 1050, left: 1200 },
    { top: 1150, left: 600 },
    { top: 1150, left: 1000 }
  ]

  const fixedRotations = [-5, -3, 7, -5, 2, -2, 4, -4, 1, -1, 3, -6, 8, -8, 6, -7, 9, -9, 0, 4]

  const handleClick = async () => {
    if (!word1.trim() || !word2.trim() || !word3.trim()) {
      return
    }

    setCurrentMachine("animating")

    await new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await generateHaiku()
  }

  const handleKeyDown = async e => {
    if (e.key === "Enter" && word1 && word2 && word3) {
      e.preventDefault()
      await handleClick()
    }
  }

  useEffect(() => {
    async function fetchHaikus() {
      const res = await fetch("/api/save-haiku")
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
      const generatedHaiku = haikuData.haiku
      setNewHaiku(generatedHaiku)
      setCurrentMachine("final")
      setHaikus(prevHaikus => [...prevHaikus, { haiku: newHaiku }])

      await fetch("/api/save-haiku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ haiku: generatedHaiku })
      })
    } else {
      setNewHaiku("Error generating haiku")
      setCurrentMachine("initial")
    }

    setLoading(false)
  }

  const startDrag = e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") {
      return
    }

    setIsDragging(true)
    e.preventDefault()

    const dragContainer = dragContainerRef.current
    setStartX(e.clientX)
    setStartY(e.clientY)
  }

  const handleDrag = e => {
    if (!isDragging) return

    const dragContainer = dragContainerRef.current
    let currentX, currentY

    // Get current coordinates based on the event type
    if (e.type === "mousemove") {
      currentX = e.clientX
      currentY = e.clientY
    } else if (e.type === "touchmove") {
      currentX = e.touches[0].clientX
      currentY = e.touches[0].clientY
    }

    // Calculate how far the mouse/touch has moved
    const deltaX = currentX - startX
    const deltaY = currentY - startY

    // Update the position of the drag container
    const newTranslateX = dragContainer.offsetLeft + deltaX
    const newTranslateY = dragContainer.offsetTop + deltaY

    // Set new position directly using left/top instead of transform
    dragContainer.style.left = `${newTranslateX}px`
    dragContainer.style.top = `${newTranslateY}px`

    // Update the starting position for the next move
    setStartX(currentX)
    setStartY(currentY)
  }

  const stopDrag = () => {
    setIsDragging(false)
  }

  const reloadHaiku = () => {
    setCurrentMachine("initial")
    setNewHaiku("")
    setWord1("")
    setWord2("")
    setWord3("")
  }

  useEffect(() => {
    const handleScrollToCenter = () => {
      if (typeof window !== "undefined") {
        // Check if we're on the client side
        const isMobile = window.innerWidth <= 768

        if (isMobile) {
          // Mobile screen logic
          const centerX = window.innerWidth / 0.285
          const centerY = window.innerHeight / 0.65
          window.scrollTo(centerX, centerY)
        } else {
          // Desktop screen logic
          const centerX = window.innerWidth
          const centerY = window.innerHeight / 0.68
          window.scrollTo(centerX, centerY)
        }
      }
    }

    handleScrollToCenter()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleScrollToCenter)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleScrollToCenter)
      }
    }
  }, [])

  return (
    <PlaygroundLayout isBlackBackground={true} showFooter={false}>
      <HeaderWhite />
      <div
        className='scale-75 md:scale-90 overflow-hidden relative'
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        ref={dragContainerRef}
        onMouseMove={handleDrag}
        onMouseUp={stopDrag}
        onTouchMove={handleDrag}
        onTouchEnd={stopDrag}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          position: "absolute",
          backgroundColor: "black"
        }}>
        <div className='scale-90 absolute w-full h-full z-30'>
          <div className='flex flex-col items-center justify-center'>
            <div className='relative' style={{ padding: 0, margin: 0 }}>
              {/* Machine Image */}
              <div className='relative' style={{ padding: 0, margin: 0 }}>
                <div
                  className='relative'
                  style={{
                    top: `${fixedPositions[0].top * 2.5}px`, // Adjust multiplier as needed for vertical positioning
                    left: `${fixedPositions[0].left * 1.5}px` // Adjust multiplier as needed for horizontal positioning
                  }}>
                  {currentMachine === "initial" && <Image src='/images/poem-machine-without-poem.png' alt='Machine' width={800} height={555} className='w-[800px] h-[555px] object-cover block' onClick={handleClick} />}
                  {currentMachine === "initial" && <button className='absolute top-52 right-4 w-12 h-12 bg-[#e8175d] hover:bg-[#a3144f] rounded-full z-20 flex items-center justify-center text-white font-bold' onClick={handleClick}></button>}
                  {currentMachine === "animating" && <Image src='/videos/poem-machine-animation.png' alt='Generating' width={800} height={555} className='w-[800px] h-[555px] object-cover block' />}
                  {currentMachine === "final" && <Image src='/images/poem-machine-with-poem.png' alt='Final Machine' width={800} height={555} className='w-[800px] h-[555px] object-cover block' />}
                  {/* Replace Input Fields with Final Haiku Display */}
                  {currentMachine === "final" ? (
                    <pre className='absolute top-32 -left-32 p-4 text-white font-grace tracking-wider text-center text-2xl border-[#e8175d] border-4'>{newHaiku}</pre>
                  ) : (
                    <div className='absolute flex flex-col top-32 p-4 w-72 z-30'>
                      <input type='text' value={word1} onChange={e => setWord1(e.target.value)} onKeyDown={handleKeyDown} className='p-2 mb-2 uppercase' placeholder='First noun (EN)' />
                      <input type='text' value={word2} onChange={e => setWord2(e.target.value)} onKeyDown={handleKeyDown} className='p-2 mb-2 uppercase' placeholder='Second noun (EN)' />
                      <input type='text' value={word3} onChange={e => setWord3(e.target.value)} onKeyDown={handleKeyDown} className='p-2 uppercase' placeholder='Third noun (EN)' />
                    </div>
                  )}

                  {/* Reload button */}
                  <div className='absolute max-w-96 right-0'>
                    <button className='z-30' onClick={reloadHaiku}>
                      <FontAwesomeIcon icon={faSyncAlt} className='text-white text-3xl' />
                    </button>
                  </div>
                  {/* Haiku definition */}
                  <div className='absolute text-white max-w-96 ml-48 mt-12'>
                    <h1 className='text-xl font-bold italic'>haiku</h1>
                    <p className='italic text-gray-600'>/ˈhaɪkuː/ noun</p>
                    <p className='mt-2 text-justify'>Rooted in Japanese tradition, Haikus capture the beauty of fleeting moments in just three lines. They invite you to pause, reflect, and appreciate the world around you. Try creating your own!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Display existing haikus */}
        <div className='relative w-[4000px] h-[4000px]'>
          {haikus.length > 0 &&
            haikus.map((haikuItem, index) => (
              <div
                key={index}
                className='text-white'
                style={{
                  position: "absolute",
                  top: fixedPositions[index] ? `${fixedPositions[index].top * 2}px` : "0px", // Fallback if undefined
                  left: fixedPositions[index] ? `${fixedPositions[index].left * 2}px` : "0px", // Fallback if undefined
                  transform: fixedRotations[index] !== undefined ? `rotate(${fixedRotations[index]}deg)` : "rotate(0deg)"
                }}>
                <pre className='font-grace tracking-wider text-center text-2xl'>{haikuItem.haiku}</pre>
              </div>
            ))}
          {/* Display the newly generated haiku with a pink border */}
          {newHaiku && (
            <div
              className='text-white p-4'
              style={{
                position: "absolute",
                top: `${fixedPositions[haikus.length % fixedPositions.length].top}px`,
                left: `${fixedPositions[haikus.length % fixedPositions.length].left}px`,
                transform: `rotate(${fixedRotations[haikus.length % fixedRotations.length]}deg)`
              }}>
              <pre className='font-grace tracking-wider text-center text-2xl'>{newHaiku}</pre> {/* Display only haiku text */}
            </div>
          )}
        </div>
      </div>
    </PlaygroundLayout>
  )
}
