'use client'

import { useApp } from '../context/AppContext'
import { useState } from 'react'
import { FiEdit, FiTrash2, FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi'
import { format } from 'date-fns'
import TaskForm from './TaskForm'

export default function TaskCard({ task }) {
  const { user, updateTask, deleteTask } = useApp()
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'priority-critical'
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'status-open'
      case 'in-progress': return 'status-in-progress'
      case 'pending-approval': return 'status-pending-approval'
      case 'closed': return 'status-closed'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusChange = (newStatus) => {
    updateTask({
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    })
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setShowConfirmDelete(false)
  }

  const canEdit = user?.role === 'developer' && task.assignee === user.name
  const canApprove = user?.role === 'manager' && task.status === 'pending-approval'

  return (
    <div className="task-card group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {task.title}
        </h3>
        <div className="flex space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {canEdit && (
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                title="Edit task"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200"
                title="Delete task"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {task.description}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Priority:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Assignee:</span>
          <span className="text-sm font-semibold text-gray-900">{task.assignee}</span>
        </div>

        {task.dueDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Due Date:</span>
            <span className="text-sm font-semibold text-gray-900">
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        {task.timeSpent > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Time Spent:</span>
            <span className="text-sm font-semibold text-gray-900 flex items-center">
              <FiClock className="w-3 h-3 mr-1" />
              {Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m
            </span>
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  +{task.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {task.status === 'open' && canEdit && (
          <button
            onClick={() => handleStatusChange('in-progress')}
            className="flex-1 btn-warning text-sm flex items-center justify-center space-x-1"
          >
            <FiClock className="w-4 h-4" />
            <span>Start Work</span>
          </button>
        )}

        {task.status === 'in-progress' && canEdit && (
          <button
            onClick={() => handleStatusChange('pending-approval')}
            className="flex-1 btn-primary text-sm flex items-center justify-center space-x-1"
          >
            <FiCheck className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>
        )}

        {canApprove && (
          <>
            <button
              onClick={() => handleStatusChange('closed')}
              className="flex-1 btn-success text-sm flex items-center justify-center space-x-1"
            >
              <FiCheck className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => handleStatusChange('in-progress')}
              className="flex-1 btn-warning text-sm flex items-center justify-center space-x-1"
            >
              <FiX className="w-4 h-4" />
              <span>Reopen</span>
            </button>
          </>
        )}

        {task.status === 'closed' && (
          <div className="flex-1 text-center text-sm text-success-600 font-semibold flex items-center justify-center space-x-1">
            <FiCheck className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <TaskForm
          task={task}
          onClose={() => setShowEditModal(false)}
          onSubmit={(updatedTask) => {
            setShowEditModal(false)
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-strong animate-bounce-in">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center mr-3">
                <FiX className="w-5 h-5 text-danger-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Delete Task
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}