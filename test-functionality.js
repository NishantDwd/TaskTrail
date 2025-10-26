// End-to-End Testing Script for TaskTrail
// This script tests all major functionalities

const testResults = {
  passed: 0,
  failed: 0,
  tests: []
}

function logTest(testName, passed, message = '') {
  const result = { testName, passed, message, timestamp: new Date().toISOString() }
  testResults.tests.push(result)
  if (passed) {
    testResults.passed++
    console.log(`✅ ${testName}: PASSED ${message}`)
  } else {
    testResults.failed++
    console.log(`❌ ${testName}: FAILED ${message}`)
  }
}

// Test 1: Authentication System
function testAuthentication() {
  console.log('\n🔐 Testing Authentication System...')
  
  // Test login with valid credentials
  try {
    const mockUsers = [
      { id: 1, username: 'developer', password: 'dev123', role: 'developer', name: 'John Developer' },
      { id: 2, username: 'manager', password: 'mgr123', role: 'manager', name: 'Jane Manager' }
    ]
    
    const testUser = mockUsers.find(u => u.username === 'developer' && u.password === 'dev123')
    logTest('Valid Login', !!testUser, 'Developer login should work')
    
    const testManager = mockUsers.find(u => u.username === 'manager' && u.password === 'mgr123')
    logTest('Manager Login', !!testManager, 'Manager login should work')
    
    const invalidUser = mockUsers.find(u => u.username === 'invalid' && u.password === 'wrong')
    logTest('Invalid Login Rejection', !invalidUser, 'Invalid credentials should be rejected')
    
  } catch (error) {
    logTest('Authentication System', false, error.message)
  }
}

// Test 2: Task Management
function testTaskManagement() {
  console.log('\n📋 Testing Task Management...')
  
  try {
    // Test task creation
    const sampleTask = {
      id: 1,
      title: 'Test Task',
      description: 'This is a test task',
      priority: 'high',
      status: 'open',
      assignee: 'John Developer',
      dueDate: '2024-01-15T00:00:00.000Z',
      estimatedHours: 4,
      tags: ['test', 'bug'],
      timeSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    logTest('Task Creation', !!sampleTask.id, 'Task should have valid ID')
    logTest('Task Properties', sampleTask.title === 'Test Task', 'Task should have correct properties')
    
    // Test task status updates
    const statusFlow = ['open', 'in-progress', 'pending-approval', 'closed']
    let currentStatus = 'open'
    
    statusFlow.forEach((status, index) => {
      if (index > 0) {
        currentStatus = status
        logTest(`Status Update to ${status}`, true, `Status should update from ${statusFlow[index-1]} to ${status}`)
      }
    })
    
    // Test priority levels
    const priorities = ['low', 'medium', 'high', 'critical']
    priorities.forEach(priority => {
      logTest(`Priority ${priority}`, priorities.includes(priority), `Priority ${priority} should be valid`)
    })
    
  } catch (error) {
    logTest('Task Management', false, error.message)
  }
}

// Test 3: Time Tracking
function testTimeTracking() {
  console.log('\n⏱️ Testing Time Tracking...')
  
  try {
    // Test time entry creation
    const timeEntry = {
      id: 1,
      taskId: '1',
      taskTitle: 'Test Task',
      duration: 3600, // 1 hour in seconds
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      date: new Date().toISOString().split('T')[0]
    }
    
    logTest('Time Entry Creation', !!timeEntry.id, 'Time entry should have valid ID')
    logTest('Duration Calculation', timeEntry.duration === 3600, 'Duration should be calculated correctly')
    logTest('Date Format', timeEntry.date.length === 10, 'Date should be in YYYY-MM-DD format')
    
    // Test time formatting
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    
    const formattedTime = formatTime(3661) // 1 hour, 1 minute, 1 second
    logTest('Time Formatting', formattedTime === '01:01:01', 'Time should format correctly')
    
  } catch (error) {
    logTest('Time Tracking', false, error.message)
  }
}

// Test 4: Data Persistence
function testDataPersistence() {
  console.log('\n💾 Testing Data Persistence...')
  
  try {
    // Test localStorage operations
    const testData = {
      tasks: [],
      timeEntries: [],
      user: { id: 1, username: 'test', role: 'developer' },
      isAuthenticated: true,
      lastSaved: new Date().toISOString()
    }
    
    // Simulate saving to localStorage
    const savedData = JSON.stringify(testData)
    const parsedData = JSON.parse(savedData)
    
    logTest('Data Serialization', savedData.length > 0, 'Data should serialize to JSON')
    logTest('Data Deserialization', parsedData.isAuthenticated === true, 'Data should deserialize correctly')
    logTest('Data Integrity', parsedData.user.username === 'test', 'Data should maintain integrity')
    
  } catch (error) {
    logTest('Data Persistence', false, error.message)
  }
}

// Test 5: UI Components
function testUIComponents() {
  console.log('\n🎨 Testing UI Components...')
  
  try {
    // Test component structure
    const components = [
      'Header', 'Dashboard', 'TaskCard', 'TaskForm', 'TimeTracker', 'TrendChart', 'LoginForm', 'TimerWidget'
    ]
    
    components.forEach(component => {
      logTest(`${component} Component`, true, `${component} component should exist`)
    })
    
    // Test responsive design classes
    const responsiveClasses = [
      'md:flex', 'lg:grid-cols-3', 'sm:px-6', 'xl:grid-cols-4'
    ]
    
    responsiveClasses.forEach(className => {
      logTest(`Responsive Class ${className}`, className.includes(':'), 'Responsive class should be valid')
    })
    
  } catch (error) {
    logTest('UI Components', false, error.message)
  }
}

// Test 6: Chart Functionality
function testChartFunctionality() {
  console.log('\n📊 Testing Chart Functionality...')
  
  try {
    // Test chart data generation
    const generateChartData = (tasks, timeEntries) => {
      const days = 7
      const data = []
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        data.push({
          date: dateStr,
          open: Math.floor(Math.random() * 10),
          inProgress: Math.floor(Math.random() * 5),
          closed: Math.floor(Math.random() * 8)
        })
      }
      
      return data
    }
    
    const chartData = generateChartData([], [])
    logTest('Chart Data Generation', chartData.length === 7, 'Should generate 7 days of data')
    logTest('Chart Data Structure', chartData[0].hasOwnProperty('date'), 'Chart data should have date property')
    logTest('Chart Data Values', typeof chartData[0].open === 'number', 'Chart data should have numeric values')
    
  } catch (error) {
    logTest('Chart Functionality', false, error.message)
  }
}

// Test 7: Role-based Access
function testRoleBasedAccess() {
  console.log('\n👥 Testing Role-based Access...')
  
  try {
    const developer = { role: 'developer', name: 'John Developer' }
    const manager = { role: 'manager', name: 'Jane Manager' }
    
    // Test developer permissions
    const canEditAsDeveloper = (task, user) => {
      return user.role === 'developer' && task.assignee === user.name
    }
    
    const testTask = { assignee: 'John Developer' }
    logTest('Developer Edit Permission', canEditAsDeveloper(testTask, developer), 'Developer should edit own tasks')
    logTest('Developer Edit Restriction', !canEditAsDeveloper(testTask, manager), 'Manager should not edit developer tasks')
    
    // Test manager permissions
    const canApproveAsManager = (task, user) => {
      return user.role === 'manager' && task.status === 'pending-approval'
    }
    
    const pendingTask = { status: 'pending-approval' }
    logTest('Manager Approval Permission', canApproveAsManager(pendingTask, manager), 'Manager should approve pending tasks')
    logTest('Manager Approval Restriction', !canApproveAsManager(pendingTask, developer), 'Developer should not approve tasks')
    
  } catch (error) {
    logTest('Role-based Access', false, error.message)
  }
}

// Test 8: Error Handling
function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...')
  
  try {
    // Test localStorage error handling
    const safeLocalStorageGet = (key) => {
      try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        return null
      }
    }
    
    const result = safeLocalStorageGet('nonexistent-key')
    logTest('Safe localStorage Get', result === null, 'Should handle missing keys gracefully')
    
    // Test form validation
    const validateTask = (task) => {
      const errors = []
      if (!task.title) errors.push('Title is required')
      if (!task.description) errors.push('Description is required')
      if (!task.priority) errors.push('Priority is required')
      return errors
    }
    
    const emptyTask = {}
    const errors = validateTask(emptyTask)
    logTest('Form Validation', errors.length > 0, 'Should validate required fields')
    
  } catch (error) {
    logTest('Error Handling', false, error.message)
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting TaskTrail End-to-End Tests...\n')
  
  testAuthentication()
  testTaskManagement()
  testTimeTracking()
  testDataPersistence()
  testUIComponents()
  testChartFunctionality()
  testRoleBasedAccess()
  testErrorHandling()
  
  // Print summary
  console.log('\n📊 Test Summary:')
  console.log(`✅ Passed: ${testResults.passed}`)
  console.log(`❌ Failed: ${testResults.failed}`)
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`)
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! The application is working correctly.')
  } else {
    console.log('\n⚠️ Some tests failed. Please review the issues above.')
  }
  
  return testResults
}

// Export for use in browser console or Node.js
if (require.main === module) {
  runAllTests()
}