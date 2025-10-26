'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { FiX, FiPlay, FiPause, FiClock } from 'react-icons/fi'
import { format } from 'date-fns'

export default function TimeTracker({ onClose, tasks }) {
  const { addTimeEntry, updateTask, timeEntries } = useApp()
  const [selectedTask, setSelectedTask] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
 

  // Update elapsed time every second when timer is running
  useEffect(() => {
    let interval = null
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else if (!isRunning && startTime) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning, startTime])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (!selectedTask) return
    
    setStartTime(Date.now())
    setIsRunning(true)
    setElapsedTime(0)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStop = () => {
    if (!selectedTask || !startTime) return

    const duration = Math.floor((Date.now() - startTime) / 1000)
    const timeEntry = {
      id: Date.now(),
      taskId: selectedTask,
      taskTitle: tasks.find(t => t.id.toString() === selectedTask)?.title || 'Unknown Task',
      duration: duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    }

    // Add time entry
    addTimeEntry(timeEntry)

    // Update task's total time spent
    const task = tasks.find(t => t.id.toString() === selectedTask)
    if (task) {
      updateTask({
        ...task,
        timeSpent: (task.timeSpent || 0) + duration,
        updatedAt: new Date().toISOString(),
      })
    }

    // Reset timer
    setIsRunning(false)
    setStartTime(null)
    setElapsedTime(0)
  }

  const handleReset = () => {
    setIsRunning(false)
    setStartTime(null)
    setElapsedTime(0)
  }

  const getTotalTimeForTask = (taskId) => {
    return timeEntries
      .filter(entry => entry.taskId === taskId)
      .reduce((total, entry) => total + entry.duration, 0)
  }

  const getTotalTimeToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return timeEntries
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.duration, 0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-strong animate-bounce-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Time Tracker</h2>
            <p className="text-sm text-gray-600 mt-1">Track time spent on tasks and monitor productivity</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Timer Display */}
          <div className="text-center">
            <div className="inline-block p-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl mb-6">
              <div className="text-6xl font-mono font-bold text-primary-600 mb-2">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-sm text-gray-600">
                {isRunning ? 'Timer Running' : 'Timer Stopped'}
              </div>
            </div>
            
            <div className="mb-8">
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="select-field w-full max-w-md"
                disabled={isRunning}
              >
                <option value="">Select a task to track</option>
                {tasks
                  .filter(task => task.status !== 'closed')
                  .map(task => (
                    <option key={task.id} value={task.id}>
                      {task.title} ({task.priority})
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  disabled={!selectedTask}
                  className="btn-success flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <FiPlay className="w-4 h-4" />
                  <span>Start Timer</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="btn-warning flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <FiPause className="w-4 h-4" />
                  <span>Pause Timer</span>
                </button>
              )}
              
              <button
                onClick={handleStop}
                disabled={!isRunning && !startTime}
                className="btn-danger flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <FiClock className="w-4 h-4" />
                <span>Stop & Save</span>
              </button>
              
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="card shadow-medium">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiClock className="w-5 h-5 mr-2 text-primary-600" />
              Today's Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                <p className="text-3xl font-bold text-primary-600 mb-1">
                  {formatTime(getTotalTimeToday())}
                </p>
                <p className="text-sm font-semibold text-gray-600">Total Time Today</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl">
                <p className="text-3xl font-bold text-success-600 mb-1">
                  {timeEntries.filter(entry => entry.date === new Date().toISOString().split('T')[0]).length}
                </p>
                <p className="text-sm font-semibold text-gray-600">Sessions</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-warning-50 to-warning-100 rounded-xl">
                <p className="text-3xl font-bold text-warning-600 mb-1">
                  {new Set(timeEntries.filter(entry => entry.date === new Date().toISOString().split('T')[0]).map(entry => entry.taskId)).size}
                </p>
                <p className="text-sm font-semibold text-gray-600">Tasks Worked On</p>
              </div>
            </div>
          </div>

          {/* Task Time Summary */}
          <div className="card shadow-medium">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiClock className="w-5 h-5 mr-2 text-primary-600" />
              Task Time Summary
            </h3>
            <div className="space-y-4">
              {tasks
                .filter(task => task.timeSpent > 0 || timeEntries.some(entry => entry.taskId === task.id.toString()))
                .map(task => {
                  const totalTime = task.timeSpent || 0
                  const todayTime = timeEntries
                    .filter(entry => entry.taskId === task.id.toString() && entry.date === new Date().toISOString().split('T')[0])
                    .reduce((total, entry) => total + entry.duration, 0)
                  
                  return (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{task.title}</p>
                        <p className="text-sm text-gray-600 capitalize">{task.status.replace('-', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatTime(totalTime)}</p>
                        <p className="text-sm text-gray-600">
                          Today: {formatTime(todayTime)}
                        </p>
                      </div>
                    </div>
                  )
                })
              }
              
              {tasks.filter(task => task.timeSpent > 0 || timeEntries.some(entry => entry.taskId === task.id.toString())).length === 0 && (
                <div className="text-center py-12">
                  <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No time tracked yet</p>
                  <p className="text-gray-400 text-sm mt-2">Start tracking time on your tasks to see summaries here</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Time Entries */}
          {timeEntries.length > 0 && (
            <div className="card shadow-medium">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiClock className="w-5 h-5 mr-2 text-primary-600" />
                Recent Time Entries
              </h3>
              <div className="space-y-3">
                {timeEntries
                  .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
                  .slice(0, 10)
                  .map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{entry.taskTitle}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(entry.startTime), 'MMM dd, yyyy HH:mm')} - 
                          {format(new Date(entry.endTime), 'HH:mm')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatTime(entry.duration)}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}