import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalEmployees: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        toast.error("Failed to load Dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- PREPARE DATA FOR CHART ---
  const pieData = [
    { name: 'Pending', value: stats.pendingTasks },
    { name: 'In Progress', value: stats.inProgressTasks },
    { name: 'Completed', value: stats.completedTasks },
  ];

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981']; // Yellow, Blue, Green

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>📊 Loading Dashboard...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Dashboard Overview</h2>
      
      {/* 1. TOP CARDS */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0', color: '#666' }}>Total Employees</h3>
          <p style={bigNumberStyle}>{stats.totalEmployees}</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0', color: '#666' }}>Total Tasks</h3>
          <p style={bigNumberStyle}>{stats.totalTasks}</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0', color: '#666' }}>Completion Rate</h3>
          <p style={{ ...bigNumberStyle, color: '#10b981' }}>
             {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* 2. CHART SECTION (New Feature) */}
      <div style={{ marginTop: '40px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Task Status Distribution</h3>
        
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} // Makes it a "Donut" chart (looks more modern)
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* 3. DETAILED BREAKDOWN */}
      <h3 style={{ marginTop: '30px', color: '#333' }}>Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{ ...statusCardStyle, borderLeft: '5px solid #f59e0b' }}>
          <h4>⏳ Pending</h4>
          <p style={statusNumberStyle}>{stats.pendingTasks}</p>
        </div>
        <div style={{ ...statusCardStyle, borderLeft: '5px solid #3b82f6' }}>
          <h4>🚀 In Progress</h4>
          <p style={statusNumberStyle}>{stats.inProgressTasks}</p>
        </div>
        <div style={{ ...statusCardStyle, borderLeft: '5px solid #10b981' }}>
          <h4>✅ Completed</h4>
          <p style={statusNumberStyle}>{stats.completedTasks}</p>
        </div>
      </div>
    </div>
  );
}

// Styles
const statCardStyle = { flex: '1', minWidth: '250px', background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', border: '1px solid #eaeaea' };
const statusCardStyle = { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const bigNumberStyle = { fontSize: '3rem', fontWeight: 'bold', margin: '10px 0', color: '#333' };
const statusNumberStyle = { fontSize: '1.5rem', fontWeight: 'bold', margin: '0' };

export default Dashboard;