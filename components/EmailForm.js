"use client"

import React, { useState, useRef } from "react"
import emailjs from "emailjs-com"
import Swal from "sweetalert2"

const EmailForm = () => {
  // state management of the imput fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const form = useRef()

  const sendEmail = e => {
    e.preventDefault()
    emailjs.sendForm(process.env.NEXT_PUBLIC_EMAILJS_SERVER_ID, process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, form.current, process.env.NEXT_PUBLIC_EMAILJS_USER_ID).then(
      result => {
        console.log(result.text)
        Swal.fire({
          title: "Thank you!",
          text: "I'll get back to you soon.",
          icon: "success"
        })
        // setStatus("Email sent successfully!")
        setName("")
        setEmail("")
        setMessage("")
      },
      error => {
        console.log(error.text)
        Swal.fire({
          title: "Oops!",
          text: "Something went wrong.",
          icon: "error"
        })
        // setStatus("Failed to send EmailForm. Please try again.")
      }
    )
  }

  return (
    <>
      <form ref={form} onSubmit={sendEmail} className='space-y-4'>
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

        <button type='submit' className='w-full bg-[#e8175d] text-white py-2 md:text-base text-sm uppercase hover:bg-[#c3144f]'>
          Send Message
        </button>
        {status && <p className='mt-4 text-[#e8175d]'>{status}</p>}
      </form>
    </>
  )
}

export default EmailForm
