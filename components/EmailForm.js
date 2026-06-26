"use client"

import React, { useState } from "react"

const EmailForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("") // "success" | "error" | ""
  const [loading, setLoading] = useState(false)

  const sendEmail = async e => {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        setStatus("success")
        setName("")
        setEmail("")
        setMessage("")
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Email error:", error)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={sendEmail} className='space-y-4'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          Name
        </label>
        <input type='text' id='name' name='name' value={name} onChange={e => setName(e.target.value)} required className='mt-1 block w-full p-2 border border-gray-300' />
      </div>

      <div className='mb-4'>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          Email
        </label>
        <input type='email' id='email' name='email' value={email} onChange={e => setEmail(e.target.value)} required className='mt-1 block w-full p-2 border border-gray-300' />
      </div>

      <div className='mb-4'>
        <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
          Message
        </label>
        <textarea id='message' name='message' rows='4' value={message} onChange={e => setMessage(e.target.value)} required className='mt-1 block w-full p-2 border border-gray-300' />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full bg-[#e8175d] text-white py-2 md:text-base text-sm uppercase hover:bg-[#c3144f] disabled:opacity-50 disabled:cursor-not-allowed'>
        {loading ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className='mt-4 text-green-600'>Thank you! I&apos;ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className='mt-4 text-[#e8175d]'>Something went wrong. Please try again.</p>
      )}
    </form>
  )
}

export default EmailForm