'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const NotificationContext = createContext()

// Notification types
const NOTIFICATION_TYPES = {
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
  TASK_STATUS_CHANGED: 'task_status_changed',
  TIME_ENTRY_ADDED: 'time_entry_added',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  SYSTEM_ERROR: 'system_error',
  TASK_APPROVED: 'task_approved',
  TASK_REJECTED: 'task_rejected',
}

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    enableDesktopNotifications: true,
    enableEmailNotifications: false,
    enableSoundNotifications: true,
    notificationTypes: Object.values(NOTIFICATION_TYPES)
  }
}

// Action types
const actionTypes = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  CLEAR_ALL_NOTIFICATIONS: 'CLEAR_ALL_NOTIFICATIONS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  LOAD_NOTIFICATIONS: 'LOAD_NOTIFICATIONS'
}

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_NOTIFICATION:
      const newNotification = {
        id: Date.now(),
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        timestamp: new Date().toISOString(),
        read: false,
        userId: action.payload.userId,
        taskId: action.payload.taskId,
        priority: action.payload.priority || 'normal'
      }
      
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 100), // Keep only last 100
        unreadCount: state.unreadCount + 1
      }
      
    case actionTypes.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }
      
    case actionTypes.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        })),
        unreadCount: 0
      }
      
    case actionTypes.DELETE_NOTIFICATION:
      const notificationToDelete = state.notifications.find(n => n.id === action.payload)
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: notificationToDelete && !notificationToDelete.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      }
      
    case actionTypes.CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      }
      
    case actionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
      
    case actionTypes.LOAD_NOTIFICATIONS:
      return {
       ...state,
    notifications: action.payload.notifications || [],
    unreadCount: typeof action.payload.unreadCount === 'number'
      ? action.payload.unreadCount
      : (action.payload.notifications || []).filter(n => !n.read).length,
    settings: action.payload.settings || state.settings
      }
      
    default:
      return state
  }
}

// Provider component
export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('tasktrail-notifications')
      if (savedNotifications) {
        const data = JSON.parse(savedNotifications)
        dispatch({ type: actionTypes.LOAD_NOTIFICATIONS, payload: data })
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }, [])

  // Save notifications to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('tasktrail-notifications', JSON.stringify({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        settings: state.settings
      }))
    } catch (error) {
      console.error('Error saving notifications:', error)
    }
  }, [state.notifications, state.unreadCount, state.settings])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && state.settings.enableDesktopNotifications) {
      Notification.requestPermission()
    }
  }, [state.settings.enableDesktopNotifications])

  // Action creators
  const addNotification = (notification) => {
    dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification })
    
    // Show toast notification
    const getToastType = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.TASK_CREATED:
      case NOTIFICATION_TYPES.TASK_APPROVED:
        return 'success'
      case NOTIFICATION_TYPES.TASK_DELETED:
      case NOTIFICATION_TYPES.TASK_REJECTED:
      case NOTIFICATION_TYPES.SYSTEM_ERROR:
        return 'error'
      default:
        return 'default'
    }
  }
    
    const toastType = getToastType(notification.type)
  if (toastType === 'success') {
    toast.success(notification.message, {
      duration: notification.priority === 'high' ? 6000 : 4000,
      position: 'top-right'
    })
  } else if (toastType === 'error') {
    toast.error(notification.message, {
      duration: notification.priority === 'high' ? 6000 : 4000,
      position: 'top-right'
    })
  } else {
    toast(notification.message, {
      duration: notification.priority === 'high' ? 6000 : 4000,
      position: 'top-right'
    })
  }
    
    // Show desktop notification if enabled
    if (state.settings.enableDesktopNotifications && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  const markAsRead = (notificationId) => {
    dispatch({ type: actionTypes.MARK_AS_READ, payload: notificationId })
  }

  const markAllAsRead = () => {
    dispatch({ type: actionTypes.MARK_ALL_AS_READ })
  }

  const deleteNotification = (notificationId) => {
    dispatch({ type: actionTypes.DELETE_NOTIFICATION, payload: notificationId })
  }

  const clearAllNotifications = () => {
    dispatch({ type: actionTypes.CLEAR_ALL_NOTIFICATIONS })
  }

  const updateSettings = (settings) => {
    dispatch({ type: actionTypes.UPDATE_SETTINGS, payload: settings })
  }

  // Helper functions for common notifications
  const notifyTaskCreated = (task, userId) => {
    addNotification({
      type: NOTIFICATION_TYPES.TASK_CREATED,
      title: 'New Task Created',
      message: `"${task.title}" has been created`,
      userId,
      taskId: task.id,
      priority: 'normal'
    })
  }

  const notifyTaskUpdated = (task, userId) => {
    addNotification({
      type: NOTIFICATION_TYPES.TASK_UPDATED,
      title: 'Task Updated',
      message: `"${task.title}" has been updated`,
      userId,
      taskId: task.id,
      priority: 'normal'
    })
  }

  const notifyTaskStatusChanged = (task, oldStatus, newStatus, userId) => {
    const statusMessages = {
      'open': 'opened',
      'in-progress': 'started',
      'pending-approval': 'submitted for approval',
      'closed': 'completed'
    }
    
    addNotification({
      type: NOTIFICATION_TYPES.TASK_STATUS_CHANGED,
      title: 'Task Status Changed',
      message: `"${task.title}" has been ${statusMessages[newStatus]}`,
      userId,
      taskId: task.id,
      priority: newStatus === 'closed' ? 'high' : 'normal'
    })
  }

  const notifyTaskApproved = (task, userId) => {
    addNotification({
      type: NOTIFICATION_TYPES.TASK_APPROVED,
      title: 'Task Approved',
      message: `"${task.title}" has been approved`,
      userId,
      taskId: task.id,
      priority: 'high'
    })
  }

  const notifyTaskRejected = (task, userId) => {
    addNotification({
      type: NOTIFICATION_TYPES.TASK_REJECTED,
      title: 'Task Rejected',
      message: `"${task.title}" has been rejected and needs revision`,
      userId,
      taskId: task.id,
      priority: 'high'
    })
  }

  const notifyTimeEntryAdded = (timeEntry, userId) => {
    const hours = Math.floor(timeEntry.duration / 3600)
    const minutes = Math.floor((timeEntry.duration % 3600) / 60)
    
    addNotification({
      type: NOTIFICATION_TYPES.TIME_ENTRY_ADDED,
      title: 'Time Entry Added',
      message: `Added ${hours}h ${minutes}m to "${timeEntry.taskTitle}"`,
      userId,
      taskId: timeEntry.taskId,
      priority: 'normal'
    })
  }

  const notifySystemError = (error, userId) => {
    addNotification({
      type: NOTIFICATION_TYPES.SYSTEM_ERROR,
      title: 'System Error',
      message: `An error occurred: ${error.message}`,
      userId,
      priority: 'high'
    })
  }

  const value = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    notifyTaskCreated,
    notifyTaskUpdated,
    notifyTaskStatusChanged,
    notifyTaskApproved,
    notifyTaskRejected,
    notifyTimeEntryAdded,
    notifySystemError,
    NOTIFICATION_TYPES
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Custom hook to use the context
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}