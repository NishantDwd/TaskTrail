'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { FiClock, FiUser, FiEdit, FiTrash2, FiCheck, FiX, FiPlus } from 'react-icons/fi'
import { format } from 'date-fns'

export default function ActivityLog() {
  const { tasks, timeEntries, user } = useApp()
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const generateActivities = () => {
      const activityList = []

      // Add task activities
      tasks.forEach(task => {
        // Task creation
        activityList.push({
          id: `task-created-${task.id}`,
          type: 'task_created',
          title: 'Task Created',
          description: `"${task.title}" was created`,
          timestamp: task.createdAt,
          user: task.assignee,
          icon: FiPlus,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        })

        // Task updates
        if (task.updatedAt && task.updatedAt !== task.createdAt) {
          activityList.push({
            id: `task-updated-${task.id}`,
            type: 'task_updated',
            title: 'Task Updated',
            description: `"${task.title}" was updated`,
            timestamp: task.updatedAt,
            user: task.assignee,
            icon: FiEdit,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
          })
        }

        // Status changes
        if (task.status === 'closed') {
          activityList.push({
            id: `task-closed-${task.id}`,
            type: 'task_completed',
            title: 'Task Completed',
            description: `"${task.title}" was completed`,
            timestamp: task.updatedAt,
            user: task.assignee,
            icon: FiCheck,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          })
        }
      })

      // Add time entry activities
      timeEntries.forEach(entry => {
        activityList.push({
          id: `time-entry-${entry.id}`,
          type: 'time_entry',
          title: 'Time Logged',
          description: `${Math.floor(entry.duration / 60)}m logged for "${entry.taskTitle}"`,
          timestamp: entry.endTime,
          user: user?.name || 'Unknown',
          icon: FiClock,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        })
      })

      // Sort by timestamp (newest first)
      activityList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

      setActivities(activityList.slice(0, 20)) // Show last 20 activities
    }

    generateActivities()
  }, [tasks, timeEntries, user])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
        return FiPlus
      case 'task_updated':
        return FiEdit
      case 'task_completed':
        return FiCheck
      case 'time_entry':
        return FiClock
      default:
        return FiUser
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_created':
        return 'text-blue-600 bg-blue-50'
      case 'task_updated':
        return 'text-yellow-600 bg-yellow-50'
      case 'task_completed':
        return 'text-green-600 bg-green-50'
      case 'time_entry':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="card shadow-medium">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <div className="text-sm text-gray-500">
          {activities.length} activities
        </div>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const IconComponent = activity.icon
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type).split(' ')[1]}`}>
                  <IconComponent className={`w-4 h-4 ${getActivityColor(activity.type).split(' ')[0]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <FiUser className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">{activity.user}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}