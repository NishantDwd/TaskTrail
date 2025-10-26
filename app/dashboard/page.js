'use client'

import { useApp } from '../../context/AppContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Dashboard from '../../components/Dashboard'

export default function DashboardPage() {
  const { isAuthenticated } = useApp()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
      setHydrated(true)
    }, [])

    useEffect(() => {
      if (hydrated && !isAuthenticated) {
        router.push('/')
      }
    }, [isAuthenticated, hydrated, router])
  
  if (!hydrated) {
    // Prevent rendering until client-side hydration is complete
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Show nothing or loading while redirecting
    return null
  }

  return (
    <>
      <Header />
      <Dashboard />
    </>
  )
}