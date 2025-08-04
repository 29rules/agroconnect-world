import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, ShoppingCart, 
  Eye, MessageCircle, Download, Settings,
  Activity, DollarSign, Package, Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import analyticsService from '../services/analyticsService';

const Dashboard = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    orders: 0,
    revenue: 0,
    products: 0,
    chatMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.trackPageVisit(window.location.href, document.title, 'dashboard');
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAnalytics({
          pageViews: 15420,
          uniqueVisitors: 3240,
          orders: 156,
          revenue: 45600,
          products: 89,
          chatMessages: 234
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Page Views',
      value: analytics.pageViews.toLocaleString(),
      icon: <Eye />,
      color: 'blue',
      change: '+12.5%'
    },
    {
      title: 'Unique Visitors',
      value: analytics.uniqueVisitors.toLocaleString(),
      icon: <Users />,
      color: 'green',
      change: '+8.3%'
    },
    {
      title: 'Orders',
      value: analytics.orders.toLocaleString(),
      icon: <ShoppingCart />,
      color: 'purple',
      change: '+15.2%'
    },
    {
      title: 'Revenue',
      value: `$${analytics.revenue.toLocaleString()}`,
      icon: <DollarSign />,
      color: 'orange',
      change: '+22.1%'
    },
    {
      title: 'Products',
      value: analytics.products.toLocaleString(),
      icon: <Package />,
      color: 'red',
      change: '+5.7%'
    },
    {
      title: 'Chat Messages',
      value: analytics.chatMessages.toLocaleString(),
      icon: <MessageCircle />,
      color: 'teal',
      change: '+18.9%'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <h1>Analytics Dashboard</h1>
            <p>Monitor your website performance and business metrics</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <Download /> Export Report
            </button>
            <button className="btn btn-primary">
              <Settings /> Settings
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`stat-card ${stat.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-change positive">
                  <TrendingUp />
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          className="charts-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="section-header">
            <h2>Performance Overview</h2>
            <p>Track key metrics over time</p>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Page Views Trend</h3>
                <div className="chart-actions">
                  <button className="btn-small">7D</button>
                  <button className="btn-small active">30D</button>
                  <button className="btn-small">90D</button>
                </div>
              </div>
              <div className="chart-placeholder">
                <BarChart3 />
                <p>Chart visualization would go here</p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Revenue Growth</h3>
                <div className="chart-actions">
                  <button className="btn-small">7D</button>
                  <button className="btn-small active">30D</button>
                  <button className="btn-small">90D</button>
                </div>
              </div>
              <div className="chart-placeholder">
                <TrendingUp />
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="activity-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>Recent Activity</h2>
            <p>Latest events and interactions</p>
          </div>

          <div className="activity-list">
            {[
              {
                type: 'order',
                message: 'New order #1234 received from John Doe',
                time: '2 minutes ago',
                icon: <ShoppingCart />
              },
              {
                type: 'chat',
                message: 'Chat message from Sarah Johnson',
                time: '5 minutes ago',
                icon: <MessageCircle />
              },
              {
                type: 'product',
                message: 'New product "Organic Seeds" added',
                time: '1 hour ago',
                icon: <Package />
              },
              {
                type: 'visitor',
                message: 'New visitor from United States',
                time: '2 hours ago',
                icon: <Globe />
              },
              {
                type: 'revenue',
                message: 'Revenue milestone: $50,000 reached',
                time: '3 hours ago',
                icon: <DollarSign />
              }
            ].map((activity, index) => (
              <motion.div
                key={index}
                className={`activity-item ${activity.type}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div className="activity-icon">
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="quick-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Common tasks and shortcuts</p>
          </div>

          <div className="actions-grid">
            <button className="action-card">
              <Activity />
              <span>View Live Analytics</span>
            </button>
            <button className="action-card">
              <Users />
              <span>Manage Users</span>
            </button>
            <button className="action-card">
              <Package />
              <span>Add Products</span>
            </button>
            <button className="action-card">
              <ShoppingCart />
              <span>Process Orders</span>
            </button>
            <button className="action-card">
              <MessageCircle />
              <span>Chat Support</span>
            </button>
            <button className="action-card">
              <Download />
              <span>Export Data</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 