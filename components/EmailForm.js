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
          title: "Success!",
          text: "We'll get back to you soon.",
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
      <form ref={form} onSubmit={sendEmail} className='max-w-lg mx-auto bg-gray-900 p-8 rounded-lg shadow-lg text-white min-h-screen flex flex-col justify-center'>
        <h1 className='text-7xl p-9 font-extrabold text-white'>Contact Form</h1>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-left text-sm font-bold mb-2 text-teal-400'>
            Name:
          </label>
          <input type='text' id='name' name='name' value={name} onChange={e => setName(e.target.value)} required className='w-full p-2 bg-gray-800 border border-teal-400 rounded focus:outline-none focus:border-teal-300 placeholder-gray-400' placeholder='Your Name' />
        </div>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-left text-sm font-bold mb-2 text-teal-400'>
            Email:
          </label>
          <input type='email' id='email' name='email' value={email} onChange={e => setEmail(e.target.value)} required className='w-full p-2 bg-gray-800 border border-teal-400 rounded focus:outline-none focus:border-teal-300 placeholder-gray-400' placeholder='Your Email' />
        </div>
        <div className='mb-4'>
          <label htmlFor='message' className='block  text-left text-sm font-bold mb-2 text-teal-400'>
            Message:
          </label>
          <textarea id='message' name='message' value={message} onChange={e => setMessage(e.target.value)} required className='w-full p-2 bg-gray-800 border border-teal-400 rounded focus:outline-none focus:border-teal-300 placeholder-gray-400' placeholder='Your Message' />
        </div>
        <button type='submit' className='w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-lg'>
          Send Email
        </button>
        {status && <p className='mt-4 text-teal-400'>{status}</p>}
      </form>
    </>
  )
}

export default EmailForm
