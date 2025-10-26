'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { useNotifications } from '../context/NotificationContext'
import { FiBell, FiX, FiCheck, FiTrash2, FiSettings, FiClock, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi'
import { format } from 'date-fns'

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    settings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings
  } = useNotifications()
  
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead()
    }
  }, [isOpen, unreadCount, markAllAsRead])
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_created':
      case 'task_updated':
        return <FiInfo className="w-4 h-4 text-blue-600" />
      case 'task_status_changed':
      case 'task_approved':
        return <FiCheckCircle className="w-4 h-4 text-green-600" />
      case 'task_rejected':
        return <FiAlertCircle className="w-4 h-4 text-red-600" />
      case 'time_entry_added':
        return <FiClock className="w-4 h-4 text-yellow-600" />
      case 'system_error':
        return <FiAlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <FiBell className="w-4 h-4 text-gray-600" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task_created':
      case 'task_updated':
        return 'border-l-blue-500'
      case 'task_status_changed':
      case 'task_approved':
        return 'border-l-green-500'
      case 'task_rejected':
        return 'border-l-red-500'
      case 'time_entry_added':
        return 'border-l-yellow-500'
      case 'system_error':
        return 'border-l-red-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId)
  }

  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleClearAll = () => {
    clearAllNotifications()
  }

  const handleSettingsChange = (key, value) => {
    updateSettings({ [key]: value })
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-strong border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
            <div className="flex items-center space-x-2">
              <FiBell className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Settings"
              >
                <FiSettings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3">Notification Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.enableDesktopNotifications}
                    onChange={(e) => handleSettingsChange('enableDesktopNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Desktop Notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.enableSoundNotifications}
                    onChange={(e) => handleSettingsChange('enableSoundNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Sound Notifications</span>
                </label>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <FiBell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600 rounded"
                                title="Mark as read"
                              >
                                <FiCheck className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                              title="Delete"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mark all as read
                </button>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}