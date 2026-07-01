"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 max-w-md mx-auto px-8 pt-48 pb-section">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">
          Forgot Password
        </h1>

        {status === 'sent' ? (
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              If an account exists for that email address, you'll receive a 
              reset link shortly. Check your inbox.
            </p>
            <Link
              href="/account/login"
              className="block text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 leading-relaxed mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-raspberry uppercase tracking-widest">
                  Something went wrong — please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <Link
              href="/account/login"
              className="block mt-8 text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
            >
              ← Back to Login
            </Link>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}