"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { LogOut } from 'lucide-react'


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
      aria-label="Logout"
      className="text-black hover:text-raspberry transition-colors"
    >
      <LogOut size={20} />
    </button>
  )
}