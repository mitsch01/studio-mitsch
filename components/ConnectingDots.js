"use client"

import React, { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons"

const ConnectingDots = () => {
  // Static setup for the dot positions (looks random, but it's fixed)
  const initialDots = [
    { x: 20, y: 30, id: "dot1" },
    { x: 70, y: 20, id: "dot2" },
    { x: 50, y: 70, id: "dot3" },
    { x: 25, y: 80, id: "dot4" },
    { x: 80, y: 50, id: "dot5" }
  ]

  const [dots, setDots] = useState(initialDots)
  const [selectedDots, setSelectedDots] = useState([])
  const [drawing, setDrawing] = useState(false)
  const canvasRef = useRef(null)

  // Handle when the first dot is clicked
  const handleDotClick = dot => {
    if (!drawing) {
      setSelectedDots([dot]) // Start drawing with the first dot
      setDrawing(true) // Enable drawing mode
      setDots(prevDots => prevDots.filter(d => d.id !== dot.id)) // Remove the first clicked dot
    }
  }

  // Magnetic hover effect to connect the dots
  const handleMouseMove = e => {
    if (!drawing || selectedDots.length === initialDots.length) return // Only act if we're drawing

    const canvas = canvasRef.current
    const canvasRect = canvas.getBoundingClientRect()
    const mouseX = ((e.clientX - canvasRect.left) / canvasRect.width) * 100 // Normalize to percentage
    const mouseY = ((e.clientY - canvasRect.top) / canvasRect.height) * 100

    dots.forEach(dot => {
      const distance = Math.hypot(dot.x - mouseX, dot.y - mouseY)
      if (distance < 5 && !selectedDots.includes(dot)) {
        // Auto-select the dot if close enough and not already selected
        setSelectedDots(prevSelected => [...prevSelected, dot])
        setDots(prevDots => prevDots.filter(d => d.id !== dot.id)) // Remove the dot from visible list
      }
    })
  }

  // Auto-connect the last dot to the first dot once all dots are selected
  useEffect(() => {
    if (selectedDots.length === initialDots.length) {
      // Close the loop by connecting the last dot to the first one
      setSelectedDots(prevSelected => [...prevSelected, prevSelected[0]])
      setDrawing(false) // Disable further drawing
    }
  }, [selectedDots])

  return (
    <div
      ref={canvasRef}
      style={{
        position: "relative",
        width: "400px",
        height: "400px",
        margin: "auto",
        overflow: "hidden"
      }}
      onMouseMove={handleMouseMove}>
      <svg width='100%' height='100%' style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        {/* Define a filter for crayon-like strokes */}
        <defs>
          <filter id='crayonEffect'>
            <feTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='5' />
            <feDisplacementMap in='SourceGraphic' scale='6' />
          </filter>
        </defs>

        {/* Draw lines between selected dots */}
        {selectedDots.length > 1 &&
          selectedDots.map((dot, index) => {
            if (index === 0) return null // Skip the first dot for the initial line
            const prevDot = selectedDots[index - 1]
            return (
              <line
                key={dot.id + "-line"}
                x1={`${prevDot.x}%`}
                y1={`${prevDot.y}%`}
                x2={`${dot.x}%`}
                y2={`${dot.y}%`}
                stroke='#ffffff'
                strokeWidth='6'
                strokeLinecap='round'
                style={{
                  filter: "url(#crayonEffect)", // Apply the crayon filter
                  strokeDasharray: "100%", // For the drawing animation
                  strokeDashoffset: "100%", // Initially hide the line
                  animation: "draw 0.5s ease forwards",
                  animationDelay: `${index * 0.1}s` // Delay each line to draw one after the other
                }}
              />
            )
          })}

        {/* Keyframe animation for drawing lines */}
        <style>
          {`
            @keyframes draw {
              to {
                stroke-dashoffset: 0; // Reveal the line
              }
            }
          `}
        </style>
      </svg>

      {/* Render dots that haven't been selected */}
      {dots.map(dot => (
        <div
          key={dot.id}
          onClick={() => handleDotClick(dot)}
          className='clickable'
          style={{
            position: "absolute",
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            backgroundColor: selectedDots.includes(dot) ? "#e8175d" : "white",
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            cursor: "pointer",
            zIndex: 10
          }}
        />
      ))}
      <button className='absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center' onClick={() => window.location.reload()}>
        <FontAwesomeIcon icon={faSyncAlt} className='text-white text-xl' />
      </button>
    </div>
  )
}

export default ConnectingDots
