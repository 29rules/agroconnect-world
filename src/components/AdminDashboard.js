import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Users, Eye, MousePointer, TrendingUp, TrendingDown, 
  Smartphone, Monitor, Globe, Clock, Target 
} from 'lucide-react';
import analyticsService from '../services/analyticsService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getAnalyticsSummary();
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadAnalyticsData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="admin-dashboard">
        <p>No analytics data available</p>
      </div>
    );
  }

  // Prepare data for charts
  const dailyTrendsData = Object.entries(analyticsData.dailyPageVisitTrends || {}).map(([date, visits]) => ({
    date,
    visits,
    contacts: analyticsData.dailyContactTrends?.[date] || 0
  }));

  const deviceData = Object.entries(analyticsData.deviceDistribution || {}).map(([device, count]) => ({
    name: device,
    value: count
  }));

  const browserData = Object.entries(analyticsData.browserDistribution || {}).map(([browser, count]) => ({
    name: browser,
    value: count
  }));

  const mostVisitedPagesData = (analyticsData.mostVisitedPages || []).slice(0, 10).map((page, index) => ({
    name: page.pageTitle || page.pageUrl,
    visits: 1, // This would need to be aggregated properly
    rank: index + 1
  }));

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Eye />
          </div>
          <div className="metric-content">
            <h3>Total Visits</h3>
            <p className="metric-value">{formatNumber(analyticsData.totalVisits)}</p>
            <span className="metric-change positive">
              <TrendingUp size={16} />
              +12.5%
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Users />
          </div>
          <div className="metric-content">
            <h3>Unique Sessions</h3>
            <p className="metric-value">{formatNumber(analyticsData.uniqueSessions)}</p>
            <span className="metric-change positive">
              <TrendingUp size={16} />
              +8.3%
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <MousePointer />
          </div>
          <div className="metric-content">
            <h3>Total Contacts</h3>
            <p className="metric-value">{formatNumber(analyticsData.totalContacts)}</p>
            <span className="metric-change positive">
              <TrendingUp size={16} />
              +15.2%
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Clock />
          </div>
          <div className="metric-content">
            <h3>Avg. Time on Page</h3>
            <p className="metric-value">{formatTime(analyticsData.avgTimeOnPage)}</p>
            <span className="metric-change negative">
              <TrendingDown size={16} />
              -2.1%
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Target />
          </div>
          <div className="metric-content">
            <h3>Conversion Rate</h3>
            <p className="metric-value">{formatPercentage(analyticsData.contactConversionRate)}</p>
            <span className="metric-change positive">
              <TrendingUp size={16} />
              +5.7%
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Globe />
          </div>
          <div className="metric-content">
            <h3>Today's Visits</h3>
            <p className="metric-value">{formatNumber(analyticsData.todayVisits)}</p>
            <span className="metric-change positive">
              <TrendingUp size={16} />
              +18.9%
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Daily Trends Chart */}
        <div className="chart-card">
          <h3>Daily Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="visits" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Page Visits"
              />
              <Area 
                type="monotone" 
                dataKey="contacts" 
                stackId="2" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Contacts"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device Distribution */}
        <div className="chart-card">
          <h3>Device Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Browser Distribution */}
        <div className="chart-card">
          <h3>Browser Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={browserData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Visited Pages */}
        <div className="chart-card">
          <h3>Most Visited Pages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mostVisitedPagesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="visits" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h2>Performance Metrics</h2>
        <div className="performance-grid">
          <div className="performance-card">
            <h4>Contact Growth</h4>
            <p className="performance-value">
              {analyticsData.performanceMetrics?.contactGrowthRate > 0 ? '+' : ''}
              {formatPercentage(analyticsData.performanceMetrics?.contactGrowthRate || 0)}
            </p>
            <p className="performance-label">vs last week</p>
          </div>

          <div className="performance-card">
            <h4>Visit Growth</h4>
            <p className="performance-value">
              {analyticsData.performanceMetrics?.visitGrowthRate > 0 ? '+' : ''}
              {formatPercentage(analyticsData.performanceMetrics?.visitGrowthRate || 0)}
            </p>
            <p className="performance-label">vs last week</p>
          </div>

          <div className="performance-card">
            <h4>Avg Contacts/Day</h4>
            <p className="performance-value">
              {analyticsData.performanceMetrics?.avgContactsPerDay?.toFixed(1) || 0}
            </p>
            <p className="performance-label">last 30 days</p>
          </div>

          <div className="performance-card">
            <h4>Avg Visits/Day</h4>
            <p className="performance-value">
              {analyticsData.performanceMetrics?.avgVisitsPerDay?.toFixed(1) || 0}
            </p>
            <p className="performance-label">last 30 days</p>
          </div>
        </div>
      </div>

      {/* Page Category Distribution */}
      <div className="category-section">
        <h2>Page Category Distribution</h2>
        <div className="category-grid">
          {Object.entries(analyticsData.pageCategoryDistribution || {}).map(([category, count], index) => (
            <div key={category} className="category-card">
              <h4>{category}</h4>
              <p className="category-count">{formatNumber(count)} visits</p>
              <div className="category-bar">
                <div 
                  className="category-fill" 
                  style={{ 
                    width: `${(count / Math.max(...Object.values(analyticsData.pageCategoryDistribution || {}))) * 100}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 