"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AdminNewsletterPage() {
  const [secret, setSecret] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [resultMessage, setResultMessage] = useState('')

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    setUnlocked(true)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`,
        },
        body: JSON.stringify({ subject, html }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setResultMessage(`Sent to ${data.sent} subscribers.`)
        setSubject('')
        setHtml('')
      } else {
        setStatus('error')
        setResultMessage(data.error ?? 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setResultMessage('Something went wrong.')
    }
  }

  if (!unlocked) {
    return (
      <div>
        <Header />
        <main className="max-w-md mx-auto px-8 pt-48 pb-section">
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">
            Admin Access
          </h1>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Secret key"
              required
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry transition-colors"
            >
              Unlock
            </button>
          </form>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <main className="max-w-2xl mx-auto px-8 pt-48 pb-section">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">
          Send Newsletter
        </h1>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              Body (HTML)
            </label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={12}
              required
              placeholder="<h1>Hey there!</h1><p>Here's what's new...</p>"
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Basic HTML supported — headings, paragraphs, links, bold/italic.
            </p>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending...' : 'Send to all subscribers'}
          </button>

          {status === 'success' && (
            <p className="text-sm text-green-600 uppercase tracking-widest">
              {resultMessage}
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-raspberry uppercase tracking-widest">
              {resultMessage}
            </p>
          )}
        </form>
      </main>
      <Footer />
    </div>
  )
}