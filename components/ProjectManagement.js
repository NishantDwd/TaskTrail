'use client'

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { FiFolder, FiPlus, FiEdit, FiTrash2, FiUsers, FiCalendar, FiBarChart2, FiX  } from 'react-icons/fi'
import TeamManagement from './TeamManagement'
import TrendChart from './TrendChart'

export default function ProjectManagement() {
  const { user, tasks } = useApp()
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  
  // Mock project data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX',
      status: 'in-progress',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      budget: 50000,
      teamMembers: ['John Developer', 'Jane Manager', 'Mike Designer'],
      progress: 65,
      priority: 'high',
      tags: ['frontend', 'design', 'ui']
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native mobile app for iOS and Android platforms',
      status: 'planning',
      startDate: '2024-02-15',
      endDate: '2024-06-30',
      budget: 75000,
      teamMembers: ['John Developer'],
      progress: 15,
      priority: 'medium',
      tags: ['mobile', 'ios', 'android']
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Integrate third-party APIs for payment processing',
      status: 'completed',
      startDate: '2023-11-01',
      endDate: '2023-12-15',
      budget: 25000,
      teamMembers: ['John Developer'],
      progress: 100,
      priority: 'high',
      tags: ['backend', 'api', 'integration']
    }
  ])

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: '',
    teamMembers: [],
    priority: 'medium',
    tags: []
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'on-hold':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProjectTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId)
  }

  const calculateProjectProgress = (projectId) => {
    const projectTasks = getProjectTasks(projectId)
    if (projectTasks.length === 0) return 0
    
    const completedTasks = projectTasks.filter(task => task.status === 'closed').length
    return Math.round((completedTasks / projectTasks.length) * 100)
  }

  const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      const project = {
        ...newProject,
        id: Date.now(),
        progress: 0,
        teamMembers: newProject.teamMembers.filter(member => member.trim() !== '')
      }
      setProjects([...projects, project])
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        startDate: '',
        endDate: '',
        budget: '',
        teamMembers: [],
        priority: 'medium',
        tags: []
      })
      setShowAddProject(false)
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setNewProject(project)
    setShowAddProject(true)
  }

  const handleUpdateProject = () => {
    if (editingProject) {
      setProjects(projects.map(project => 
        project.id === editingProject.id ? { ...newProject, id: editingProject.id } : project
      ))
      setEditingProject(null)
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        startDate: '',
        endDate: '',
        budget: '',
        teamMembers: [],
        priority: 'medium',
        tags: []
      })
      setShowAddProject(false)
    }
  }

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId))
  }

  // Only show project management to managers
  if (user?.role !== 'manager') {
    return null
  }

  return (
    <div className="card shadow-medium">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FiFolder className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Project Management</h2>
        </div>
        <button
          onClick={() => setShowAddProject(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                  title="Edit project"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete project"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Project Status and Priority */}
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status.replace('-', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4" />
                <span>
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
              
              {project.budget && (
                <div className="flex items-center space-x-2">
                  <FiBarChart2 className="w-4 h-4" />
                  <span>${project.budget.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <FiUsers className="w-4 h-4" />
                <span>{project.teamMembers.length} members</span>
              </div>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {project.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-strong max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => {
                  setShowAddProject(false)
                  setEditingProject(null)
                  setNewProject({
                    name: '',
                    description: '',
                    status: 'planning',
                    startDate: '',
                    endDate: '',
                    budget: '',
                    teamMembers: [],
                    priority: 'medium',
                    tags: []
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="input-field"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                    className="select-field"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Enter project description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                    className="input-field"
                    placeholder="Enter budget"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                    className="select-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Members (comma-separated)</label>
                <input
                  type="text"
                  value={newProject.teamMembers.join(', ')}
                  onChange={(e) => setNewProject({...newProject, teamMembers: e.target.value.split(',').map(m => m.trim())})}
                  className="input-field"
                  placeholder="Enter team member names"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newProject.tags.join(', ')}
                  onChange={(e) => setNewProject({...newProject, tags: e.target.value.split(',').map(t => t.trim())})}
                  className="input-field"
                  placeholder="Enter tags"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddProject(false)
                  setEditingProject(null)
                  setNewProject({
                    name: '',
                    description: '',
                    status: 'planning',
                    startDate: '',
                    endDate: '',
                    budget: '',
                    teamMembers: [],
                    priority: 'medium',
                    tags: []
                  })
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={editingProject ? handleUpdateProject : handleAddProject}
                className="flex-1 btn-primary"
              >
                {editingProject ? 'Update' : 'Create'} Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}