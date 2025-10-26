'use client'

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { FiUsers, FiPlus, FiEdit, FiTrash2, FiMail, FiPhone, FiMapPin, FiCalendar, FiX } from 'react-icons/fi'

export default function TeamManagement() {
  const { user } = useApp()
  const [showAddMember, setShowAddMember] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  
  // Mock team data - in a real app, this would come from an API
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Developer',
      email: 'john@company.com',
      role: 'developer',
      department: 'Engineering',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      joinDate: '2023-01-15',
      status: 'active',
      avatar: null
    },
    {
      id: 2,
      name: 'Jane Manager',
      email: 'jane@company.com',
      role: 'manager',
      department: 'Engineering',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      joinDate: '2022-08-20',
      status: 'active',
      avatar: null
    },
    {
      id: 3,
      name: 'Mike Designer',
      email: 'mike@company.com',
      role: 'designer',
      department: 'Design',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      joinDate: '2023-03-10',
      status: 'active',
      avatar: null
    }
  ])

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'developer',
    department: '',
    phone: '',
    location: '',
    status: 'active'
  })

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const member = {
        ...newMember,
        id: Date.now(),
        joinDate: new Date().toISOString().split('T')[0]
      }
      setTeamMembers([...teamMembers, member])
      setNewMember({
        name: '',
        email: '',
        role: 'developer',
        department: '',
        phone: '',
        location: '',
        status: 'active'
      })
      setShowAddMember(false)
    }
  }

  const handleEditMember = (member) => {
    setEditingMember(member)
    setNewMember(member)
    setShowAddMember(true)
  }

  const handleUpdateMember = () => {
    if (editingMember) {
      setTeamMembers(teamMembers.map(member => 
        member.id === editingMember.id ? { ...newMember, id: editingMember.id } : member
      ))
      setEditingMember(null)
      setNewMember({
        name: '',
        email: '',
        role: 'developer',
        department: '',
        phone: '',
        location: '',
        status: 'active'
      })
      setShowAddMember(false)
    }
  }

  const handleDeleteMember = (memberId) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId))
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'manager':
        return 'bg-purple-100 text-purple-800'
      case 'developer':
        return 'bg-blue-100 text-blue-800'
      case 'designer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Only show team management to managers
  if (user?.role !== 'manager') {
    return null
  }

  return (
    <div className="card shadow-medium">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FiUsers className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Team Management</h2>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FiMail className="w-4 h-4" />
                      <span>{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center space-x-2">
                        <FiPhone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.location && (
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>{member.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditMember(member)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit member"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete member"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-strong">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button
                onClick={() => {
                  setShowAddMember(false)
                  setEditingMember(null)
                  setNewMember({
                    name: '',
                    email: '',
                    role: 'developer',
                    department: '',
                    phone: '',
                    location: '',
                    status: 'active'
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="input-field"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="input-field"
                  placeholder="Enter email address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    className="select-field"
                  >
                    <option value="developer">Developer</option>
                    <option value="manager">Manager</option>
                    <option value="designer">Designer</option>
                    <option value="tester">Tester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newMember.status}
                    onChange={(e) => setNewMember({...newMember, status: e.target.value})}
                    className="select-field"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={newMember.department}
                  onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                  className="input-field"
                  placeholder="Enter department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newMember.location}
                  onChange={(e) => setNewMember({...newMember, location: e.target.value})}
                  className="input-field"
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddMember(false)
                  setEditingMember(null)
                  setNewMember({
                    name: '',
                    email: '',
                    role: 'developer',
                    department: '',
                    phone: '',
                    location: '',
                    status: 'active'
                  })
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={editingMember ? handleUpdateMember : handleAddMember}
                className="flex-1 btn-primary"
              >
                {editingMember ? 'Update' : 'Add'} Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}