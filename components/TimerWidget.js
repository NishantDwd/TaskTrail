'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { FiPlay, FiPause, FiSquare, FiClock } from 'react-icons/fi'

export default function TimerWidget() {
  const { addTimeEntry, updateTask, tasks } = useApp()
  const [selectedTask, setSelectedTask] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

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

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedTimerState = localStorage.getItem('tasktrail-timer')
    if (savedTimerState) {
      try {
        const timerData = JSON.parse(savedTimerState)
        if (timerData.isRunning && timerData.startTime) {
          setSelectedTask(timerData.selectedTask || '')
          setIsRunning(true)
          setStartTime(timerData.startTime)
          setElapsedTime(Math.floor((Date.now() - timerData.startTime) / 1000))
        }
      } catch (error) {
        console.error('Error loading timer state:', error)
        localStorage.removeItem('tasktrail-timer')
      }
    }
  }, [])

  // Save timer state to localStorage
  useEffect(() => {
    const timerState = {
      selectedTask,
      isRunning,
      startTime,
      lastSaved: new Date().toISOString(),
    }
    localStorage.setItem('tasktrail-timer', JSON.stringify(timerState))
  }, [selectedTask, isRunning, startTime])

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

  const handleResume = () => {
    if (startTime) {
      setStartTime(Date.now() - elapsedTime * 1000)
      setIsRunning(true)
    }
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
    localStorage.removeItem('tasktrail-timer')
  }

  const handleReset = () => {
    setIsRunning(false)
    setStartTime(null)
    setElapsedTime(0)
    localStorage.removeItem('tasktrail-timer')
  }

  // Don't show widget if no tasks are available
  if (!tasks || tasks.length === 0) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'transform translate-y-full' : ''
    }`}>
      <div className="bg-white rounded-xl shadow-strong border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiClock className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">Timer</span>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-primary-800 rounded p-1 transition-colors"
          >
            {isMinimized ? '↑' : '↓'}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-gray-900 mb-2">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-xs text-gray-500">
              {isRunning ? 'Running' : 'Stopped'}
            </div>
          </div>

          {/* Task Selection */}
          <div>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isRunning}
            >
              <option value="">Select task</option>
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

          {/* Controls */}
          <div className="flex space-x-2">
            {!isRunning ? (
              <button
                onClick={selectedTask ? handleStart : handleResume}
                disabled={!selectedTask}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <FiPlay className="w-3 h-3" />
                <span>{selectedTask ? 'Start' : 'Resume'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <FiPause className="w-3 h-3" />
                <span>Pause</span>
              </button>
            )}
            
            <button
              onClick={handleStop}
              disabled={!isRunning && !startTime}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <FiSquare className="w-3 h-3" />
              <span>Stop</span>
            </button>
            
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}