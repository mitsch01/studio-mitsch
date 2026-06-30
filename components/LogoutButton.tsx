"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm uppercase tracking-widest font-bold px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors"
    >
      Logout
    </button>
  )
}