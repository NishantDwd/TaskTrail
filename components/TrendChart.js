'use client'

import { useMemo, useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'

export default function TrendChart({ tasks, timeEntries }) {
  const [refreshKey, setRefreshKey] = useState(0)

  // Auto-refresh chart data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const chartData = useMemo(() => {
    // Generate data for the last 30 days
    const days = 30
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      // Count tasks by status for this day
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0]
        return taskDate === dateStr
      })
      
      // Count time entries for this day
      const dayTimeEntries = timeEntries.filter(entry => entry.date === dateStr)
      const totalTimeSpent = dayTimeEntries.reduce((total, entry) => total + entry.duration, 0)
      
      data.push({
        date: format(date, 'MMM dd'),
        fullDate: dateStr,
        open: dayTasks.filter(task => task.status === 'open').length,
        inProgress: dayTasks.filter(task => task.status === 'in-progress').length,
        pendingApproval: dayTasks.filter(task => task.status === 'pending-approval').length,
        closed: dayTasks.filter(task => task.status === 'closed').length,
        totalTasks: dayTasks.length,
        timeSpent: Math.round(totalTimeSpent / 3600 * 100) / 100, // Convert to hours
        sessions: dayTimeEntries.length,
      })
    }
    
    return data
  }, [tasks, timeEntries, refreshKey])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-strong">
          <p className="font-bold text-gray-900 mb-3 text-center">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-600">
                    {entry.name}:
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 ml-2">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="open" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
            name="Open Tasks"
          />
          <Line 
            type="monotone" 
            dataKey="inProgress" 
            stroke="#f59e0b" 
            strokeWidth={3}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#f59e0b', strokeWidth: 2 }}
            name="In Progress"
          />
          <Line 
            type="monotone" 
            dataKey="pendingApproval" 
            stroke="#f97316" 
            strokeWidth={3}
            dot={{ fill: '#f97316', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#f97316', strokeWidth: 2 }}
            name="Pending Approval"
          />
          <Line 
            type="monotone" 
            dataKey="closed" 
            stroke="#22c55e" 
            strokeWidth={3}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#22c55e', strokeWidth: 2 }}
            name="Closed Tasks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}