import React, { useState, useMemo, useContext } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import './InsightsPage.css';
import { StoreContext } from '../../Context/StoreContext';

const InsightsPage = () => {
  const [timeFrame, setTimeFrame] = useState('weekly');
  const {tasks} = useContext(StoreContext)

  // Process task data
  const processedData = useMemo(() => {
    // Group tasks by priority
    const priorityGroups = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 }
    };

    tasks.forEach(task => {
      const priority = task.priority || 'low';
      priorityGroups[priority].total++;
      if (task.completed) {
        priorityGroups[priority].completed++;
      }
    });

    // Transform for chart data
    const chartData = Object.entries(priorityGroups).map(([priority, data]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      total: data.total,
      completed: data.completed,
      incomplete: data.total - data.completed
    }));

    return {
      priorityGroups,
      chartData
    };
  }, [tasks]);

  // Calculate overall statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = ((completedTasks / totalTasks) * 100).toFixed(2);

  // Color palette
  const COLORS = [
    'var(--priority-high-color)', 
    'var(--priority-medium-color)', 
    'var(--priority-low-color)'
  ];

  return (
    <div className="insights-page">
      <h1>Todo List Insights</h1>
      
      <div className="time-frame-selector">
        <label>Time Frame:</label>
        <select 
          value={timeFrame} 
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p>{completedTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <p>{completionRate}%</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Task Distribution by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedData.chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {processedData.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Task Completion by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.chartData}>
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incomplete" stackId="a" fill="var(--priority-high-color)" />
              <Bar dataKey="completed" stackId="a" fill="var(--priority-low-color)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;