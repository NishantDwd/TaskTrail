'use client'

import { useEffect } from 'react'
import { useNotifications } from '../context/NotificationContext'

export default function NotificationListener() {
  const {
    notifyTaskCreated,
    notifyTaskUpdated,
    notifyTaskStatusChanged,
    notifyTimeEntryAdded,
    notifyTaskApproved,
    notifyTaskRejected
  } = useNotifications()

  useEffect(() => {
    const handleTaskCreated = (event) => {
      const { task, userId } = event.detail
      notifyTaskCreated(task, userId)
    }

    const handleTaskUpdated = (event) => {
      const { task, userId } = event.detail
      notifyTaskUpdated(task, userId)
    }

    const handleTaskStatusChanged = (event) => {
      const { task, oldStatus, newStatus, userId } = event.detail
      notifyTaskStatusChanged(task, oldStatus, newStatus, userId)
    }

    const handleTimeEntryAdded = (event) => {
      const { timeEntry, userId } = event.detail
      notifyTimeEntryAdded(timeEntry, userId)
    }

    // Add event listeners
    window.addEventListener('taskCreated', handleTaskCreated)
    window.addEventListener('taskUpdated', handleTaskUpdated)
    window.addEventListener('taskStatusChanged', handleTaskStatusChanged)
    window.addEventListener('timeEntryAdded', handleTimeEntryAdded)

    // Cleanup
    return () => {
      window.removeEventListener('taskCreated', handleTaskCreated)
      window.removeEventListener('taskUpdated', handleTaskUpdated)
      window.removeEventListener('taskStatusChanged', handleTaskStatusChanged)
      window.removeEventListener('timeEntryAdded', handleTimeEntryAdded)
    }
  }, [notifyTaskCreated, notifyTaskUpdated, notifyTaskStatusChanged, notifyTimeEntryAdded])

  return null // This component doesn't render anything
}