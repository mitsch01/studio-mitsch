"use client"

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useState } from 'react'

export default function AdminNewsletterPage() {
  const [secret, setSecret] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [resultMessage, setResultMessage] = useState('')
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
const [recentSubscribers, setRecentSubscribers] = useState<{ email: string, subscribedAt: string }[]>([])


const handleUnlock = async (e: React.FormEvent) => {
  e.preventDefault()
  setUnlocked(true)
  try {
    const res = await fetch('/api/newsletter/subscribers/count', {
      headers: { 'Authorization': `Bearer ${secret}` }
    })
    const data = await res.json()
    if (res.ok) {
      setSubscriberCount(data.count)
      setRecentSubscribers(data.recent)
    }
  } catch {}
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
    <div className='min-h-screen flex flex-col'>
         <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-md mx-auto w-full">
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
    <div className='min-h-screen flex flex-col'>
      <Header />
         <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">
          Send Newsletter
        </h1>

        {/* Subscriber count stat */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Count */}
  <div className="border border-gray-200 p-6">
    <p className="font-mono text-[10px] uppercase text-gray-400 tracking-wider mb-1">
      Active Subscribers
    </p>
    <p className="text-4xl font-bold text-black">
      {subscriberCount ?? '—'}
    </p>
  </div>

  {/* Recent */}
  <div className="border border-gray-200 p-6 col-span-2">
    <p className="font-mono text-[10px] uppercase text-gray-400 tracking-wider mb-3">
      Recent Signups
    </p>
    {recentSubscribers.length === 0 ? (
      <p className="text-sm text-gray-400">No subscribers yet.</p>
    ) : (
      <ul className="flex flex-col gap-2">
        {recentSubscribers.map((sub) => (
          <li key={sub.email} className="flex justify-between items-center text-sm">
            <span className="text-black font-mono truncate max-w-[360px]">{sub.email}</span>
            <span className="text-gray-400 text-xs">
              {new Date(sub.subscribedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

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