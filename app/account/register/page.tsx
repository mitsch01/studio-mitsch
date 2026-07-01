"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { refetch } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        await refetch()
        router.push('/account/dashboard')
        router.refresh()
      } else {
        setError(data.error)
      }
    } catch {
      setError('Something went wrong — try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col flex-1'>
      <Header />
      <main className="flex-1 max-w-md mx-auto px-8 pt-48 pb-section">
        <h1 className="text-5xl font-bold uppercase tracking-tight mb-12">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
            />
          </div>

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

          <div>
            <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="block w-full p-3 border border-black focus:outline-none focus:border-raspberry transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
          </div>

          {error && (
            <p className="text-sm text-raspberry uppercase tracking-widest">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-sm uppercase tracking-widest hover:bg-raspberry transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/account/login" className="font-bold text-black hover:text-raspberry transition-colors">
            Login
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}