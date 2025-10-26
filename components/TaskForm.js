'use client'

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { FiX } from 'react-icons/fi'

export default function TaskForm({ onClose, onSubmit, task = null }) {
  const { user, addTask, updateTask } = useApp()
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'open',
    assignee: task?.assignee || user?.name || '',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    estimatedHours: task?.estimatedHours || '',
    tags: task?.tags || '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.assignee.trim()) {
      newErrors.assignee = 'Assignee is required'
    }

    if (formData.estimatedHours && (isNaN(formData.estimatedHours) || formData.estimatedHours < 0)) {
      newErrors.estimatedHours = 'Estimated hours must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      timeSpent: task?.timeSpent || 0,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (task) {
      updateTask({ ...task, ...taskData })
    } else {
      addTask(taskData)
    }

    onSubmit?.(taskData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-strong animate-bounce-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {task ? 'Update task details and save changes' : 'Fill in the details to create a new task'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${errors.title ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-danger-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`input-field resize-none ${errors.description ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-danger-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="select-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select-field"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="pending-approval">Pending Approval</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="assignee" className="block text-sm font-semibold text-gray-700 mb-2">
                Assignee *
              </label>
              <input
                id="assignee"
                name="assignee"
                type="text"
                value={formData.assignee}
                onChange={handleChange}
                className={`input-field ${errors.assignee ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="Enter assignee name"
              />
              {errors.assignee && (
                <p className="mt-2 text-sm text-danger-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.assignee}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Hours
              </label>
              <input
                id="estimatedHours"
                name="estimatedHours"
                type="number"
                step="0.5"
                min="0"
                value={formData.estimatedHours}
                onChange={handleChange}
                className={`input-field ${errors.estimatedHours ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                placeholder="0"
              />
              {errors.estimatedHours && (
                <p className="mt-2 text-sm text-danger-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.estimatedHours}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter tags separated by commas"
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}