'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNotifications } from './NotificationContext'

const AppContext = createContext()

// Mock users for authentication
const mockUsers = [
  { id: 1, username: 'developer', password: 'dev123', role: 'developer', name: 'John Developer' },
  { id: 2, username: 'manager', password: 'mgr123', role: 'manager', name: 'Jane Manager' },
]

// Sample data for demonstration
const sampleTasks = [
  {
    id: 1,
    title: 'Fix login authentication bug',
    description: 'Users are unable to login with special characters in their password. Need to update regex validation.',
    priority: 'high',
    status: 'in-progress',
    assignee: 'John Developer',
    dueDate: '2024-01-15T00:00:00.000Z',
    estimatedHours: 4,
    tags: ['authentication', 'security', 'bug'],
    timeSpent: 120, // 2 hours in minutes
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: '2024-01-12T14:30:00.000Z',
  },
  {
    id: 2,
    title: 'Implement dark mode toggle',
    description: 'Add a dark mode toggle to the application header for better user experience.',
    priority: 'medium',
    status: 'open',
    assignee: 'John Developer',
    dueDate: '2024-01-20T00:00:00.000Z',
    estimatedHours: 6,
    tags: ['ui', 'feature', 'accessibility'],
    timeSpent: 0,
    createdAt: '2024-01-11T10:15:00.000Z',
    updatedAt: '2024-01-11T10:15:00.000Z',
  },
  {
    id: 3,
    title: 'Database optimization for large datasets',
    description: 'Optimize database queries to handle large datasets more efficiently. Current queries are too slow.',
    priority: 'critical',
    status: 'pending-approval',
    assignee: 'John Developer',
    dueDate: '2024-01-12T00:00:00.000Z',
    estimatedHours: 8,
    tags: ['database', 'performance', 'optimization'],
    timeSpent: 480, // 8 hours in minutes
    createdAt: '2024-01-08T08:00:00.000Z',
    updatedAt: '2024-01-12T16:45:00.000Z',
  },
  {
    id: 4,
    title: 'Add user profile pictures',
    description: 'Allow users to upload and display profile pictures in their dashboard.',
    priority: 'low',
    status: 'closed',
    assignee: 'John Developer',
    dueDate: '2024-01-05T00:00:00.000Z',
    estimatedHours: 3,
    tags: ['ui', 'profile', 'feature'],
    timeSpent: 180, // 3 hours in minutes
    createdAt: '2024-01-03T11:30:00.000Z',
    updatedAt: '2024-01-05T15:20:00.000Z',
  },
  {
    id: 5,
    title: 'Mobile responsive improvements',
    description: 'Improve mobile responsiveness for the task cards and forms.',
    priority: 'medium',
    status: 'open',
    assignee: 'John Developer',
    dueDate: '2024-01-25T00:00:00.000Z',
    estimatedHours: 5,
    tags: ['mobile', 'responsive', 'ui'],
    timeSpent: 0,
    createdAt: '2024-01-12T13:20:00.000Z',
    updatedAt: '2024-01-12T13:20:00.000Z',
  },
]

const sampleTimeEntries = [
  {
    id: 1,
    taskId: '1',
    taskTitle: 'Fix login authentication bug',
    duration: 120,
    startTime: '2024-01-12T09:00:00.000Z',
    endTime: '2024-01-12T11:00:00.000Z',
    date: '2024-01-12',
  },
  {
    id: 2,
    taskId: '3',
    taskTitle: 'Database optimization for large datasets',
    duration: 240,
    startTime: '2024-01-12T10:00:00.000Z',
    endTime: '2024-01-12T14:00:00.000Z',
    date: '2024-01-12',
  },
  {
    id: 3,
    taskId: '4',
    taskTitle: 'Add user profile pictures',
    duration: 180,
    startTime: '2024-01-05T13:00:00.000Z',
    endTime: '2024-01-05T16:00:00.000Z',
    date: '2024-01-05',
  },
]

// Initial state
const initialState = {
  user: null,
  tasks: sampleTasks,
  timeEntries: sampleTimeEntries,
  isAuthenticated: false,
}

// Action types
const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  ADD_TIME_ENTRY: 'ADD_TIME_ENTRY',
  LOAD_DATA: 'LOAD_DATA',
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      }
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }
    case actionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now() }],
      }
    case actionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      }
    case actionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      }
    case actionTypes.ADD_TIME_ENTRY:
      return {
        ...state,
        timeEntries: [...state.timeEntries, action.payload],
      }
    case actionTypes.LOAD_DATA:
      return {
        ...state,
        tasks: action.payload.tasks ?? state.tasks,
        timeEntries: action.payload.timeEntries ?? state.timeEntries,
        user: action.payload.user ?? null,
        isAuthenticated: action.payload.isAuthenticated ?? false,
      }
    default:
      return state
  }
}

// Synchronous state hydration from localStorage
function getInitialState() {
  if (typeof window !== 'undefined') {
    try {
      const savedData = localStorage.getItem('tasktrail-data')
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data && typeof data === 'object') {
          return {
            tasks: data.tasks ?? sampleTasks,
            timeEntries: data.timeEntries ?? sampleTimeEntries,
            user: data.user ?? null,
            isAuthenticated: data.isAuthenticated ?? false,
          }
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
      localStorage.removeItem('tasktrail-data')
    }
  }
  return initialState
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState,  getInitialState)

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToSave = {
        tasks: state.tasks,
        timeEntries: state.timeEntries,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastSaved: new Date().toISOString(),
      }
      localStorage.setItem('tasktrail-data', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving data to localStorage:', error)
    }
  }, [state.tasks, state.timeEntries, state.user, state.isAuthenticated])

  // Action creators
  const login = (username, password) => {
    const user = mockUsers.find(u => u.username === username && u.password === password)
    if (user) {
      dispatch({ type: actionTypes.LOGIN, payload: user })
      toast.success(`Welcome back, ${user.name}!`)
      return { success: true, user }
    }
    toast.error('Invalid credentials')
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    dispatch({ type: actionTypes.LOGOUT })
    toast.success('Logged out successfully')
  }

  const addTask = (task) => {
    dispatch({ type: actionTypes.ADD_TASK, payload: task })
    toast.success('Task created successfully!')
    
    // Add notification (will be handled by NotificationProvider)
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('taskCreated', { 
        detail: { task, userId: state.user?.id } 
      }))
    }
  }

  const updateTask = (task) => {
    const oldTask = state.tasks.find(t => t.id === task.id)
    dispatch({ type: actionTypes.UPDATE_TASK, payload: task })
    toast.success('Task updated successfully!')
    
    // Add notification for status changes
    if (oldTask && oldTask.status !== task.status) {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('taskStatusChanged', { 
          detail: { task, oldStatus: oldTask.status, newStatus: task.status, userId: state.user?.id } 
        }))
      }
    } else {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('taskUpdated', { 
          detail: { task, userId: state.user?.id } 
        }))
      }
    }
  }

  const deleteTask = (taskId) => {
    dispatch({ type: actionTypes.DELETE_TASK, payload: taskId })
    toast.success('Task deleted successfully!')
  }

  const addTimeEntry = (timeEntry) => {
    dispatch({ type: actionTypes.ADD_TIME_ENTRY, payload: timeEntry })
    toast.success('Time entry added successfully!')
    
    // Add notification
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('timeEntryAdded', { 
        detail: { timeEntry, userId: state.user?.id } 
      }))
    }
  }

  const value = {
    ...state,
    login,
    logout,
    addTask,
    updateTask,
    deleteTask,
    addTimeEntry,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useApp() {
  return useContext(AppContext)
}