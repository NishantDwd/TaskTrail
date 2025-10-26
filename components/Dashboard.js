'use client'

import { useApp } from '../context/AppContext'
import { useState, useMemo } from 'react'
import { FiPlus, FiFilter, FiSearch, FiClock, FiCheckCircle, FiAlertCircle, FiXCircle, FiActivity } from 'react-icons/fi'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import TimeTracker from './TimeTracker'
import TrendChart from './TrendChart'
import TimerWidget from './TimerWidget'
import NotificationListener from './NotificationListener'
import ActivityLog from './ActivityLog'
import DraggableSidebar from './DraggableSidebar'
import TeamManagement from './TeamManagement'
import ProjectManagement from './ProjectManagement'
import { format, subDays } from 'date-fns'

export default function Dashboard() {
  const { user, tasks, timeEntries } = useApp()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showTimeTracker, setShowTimeTracker] = useState(false)
  const [activitySidebarOpen, setActivitySidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  // Filter and sort tasks based on user role and filters
  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Role-based filtering
    if (user?.role === 'developer') {
      filtered = filtered.filter(task => task.assignee === user.name)
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status)
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignee.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority] || 0
          bValue = priorityOrder[b.priority] || 0
          break
        case 'status':
          const statusOrder = { open: 1, 'in-progress': 2, 'pending-approval': 3, closed: 4 }
          aValue = statusOrder[a.status] || 0
          bValue = statusOrder[b.status] || 0
          break
        case 'dueDate':
          aValue = new Date(a.dueDate || 0)
          bValue = new Date(b.dueDate || 0)
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [tasks, user, filters])

  // Calculate statistics
  const stats = useMemo(() => {
    const userTasks = user?.role === 'developer' 
      ? tasks.filter(task => task.assignee === user.name)
      : tasks

    return {
      total: userTasks.length,
      open: userTasks.filter(task => task.status === 'open').length,
      inProgress: userTasks.filter(task => task.status === 'in-progress').length,
      pendingApproval: userTasks.filter(task => task.status === 'pending-approval').length,
      closed: userTasks.filter(task => task.status === 'closed').length,
    }
  }, [tasks, user])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* Activity Sidebar Button */}
      <button
        onClick={() => setActivitySidebarOpen(true)}
        className="fixed top-1/2 left-0 z-40 bg-primary-600 text-white p-3 rounded-r-xl shadow-lg hover:bg-primary-700 transition-all"
        style={{ transform: 'translateY(-50%)' }}
        title="Show Recent Activity"
      >
        <FiActivity className="w-6 h-6" />
      </button>
      {/* Activity Sidebar */}
      {activitySidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Overlay */}
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setActivitySidebarOpen(false)}
          />
          {/* Sidebar */}
          <DraggableSidebar onClose={() => setActivitySidebarOpen(false)}>
            <ActivityLog />
          </DraggableSidebar>
        </div>
      )}

    <div className="min-h-screen bg-gray-50">
      <NotificationListener />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'developer' 
              ? 'Manage your tasks and track your progress'
              : 'Monitor team progress and approve task closures'
            }
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card group">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
                <FiAlertCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-warning-100 to-warning-200 rounded-xl group-hover:from-warning-200 group-hover:to-warning-300 transition-all duration-300">
                <FiClock className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-warning-600 transition-colors duration-300">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
                <FiXCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{stats.pendingApproval}</p>
              </div>
            </div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-success-100 to-success-200 rounded-xl group-hover:from-success-200 group-hover:to-success-300 transition-all duration-300">
                <FiCheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Closed</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-success-600 transition-colors duration-300">{stats.closed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Trend Chart */}
          <div className="lg:col-span-2 card shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Task Trends</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span>Open</span>
                <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                <span>In Progress</span>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Pending</span>
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span>Closed</span>
              </div>
            </div>
            <TrendChart tasks={tasks} timeEntries={timeEntries} />
          </div>
          
        </div>

        {/* Team Management - Only for managers */}
        {user?.role === 'manager' && (
          <div className="mb-8">
            <TeamManagement />
          </div>
        )}

        {/* Project Management - Only for managers */}
        {user?.role === 'manager' && (
          <div className="mb-8">
            <ProjectManagement />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 input-field w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="select-field w-full sm:w-40"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-approval">Pending Approval</option>
              <option value="closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="select-field w-full sm:w-40"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="select-field w-full sm:w-40"
            >
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="dueDate">Due Date</option>
            </select>

            {/* Sort Order */}
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="select-field w-full sm:w-32"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
            <button
              onClick={() => setShowTimeTracker(true)}
              className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto ml-4"
            >
              <FiClock className="w-4 h-4" />
              <span>Time Tracker</span>
            </button>
            {user?.role === 'developer' && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            )}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task, index) => (
            <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <TaskCard task={task} />
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <FiAlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No tasks found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'Try adjusting your filters to see more tasks.'
                : 'Get started by creating your first task.'
              }
            </p>
            {user?.role === 'developer' && !filters.search && filters.status === 'all' && filters.priority === 'all' && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>Create Your First Task</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSubmit={(task) => {
            // Task will be added via context
            setShowTaskForm(false)
          }}
        />
      )}

      {showTimeTracker && (
        <TimeTracker
          onClose={() => setShowTimeTracker(false)}
          tasks={user?.role === 'developer' 
            ? tasks.filter(task => task.assignee === user.name)
            : tasks
          }
        />
      )}

      {/* Persistent Timer Widget */}
      <TimerWidget />
    </div>
    </div>
  )
}