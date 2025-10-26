'use client'

import { useApp } from '../context/AppContext'
import { useRouter } from 'next/navigation'
import { FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import NotificationCenter from './NotificationCenter'

export default function Header() {
  const { user, logout } = useApp()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-soft border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                TaskTrail
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
            </div>
            
            {/* Notifications */}
            <NotificationCenter />
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}