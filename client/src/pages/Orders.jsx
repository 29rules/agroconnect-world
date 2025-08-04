import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Search, Download, 
  Eye, Edit, Trash2, Plus, Package, 
  Clock, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import analyticsService from '../services/analyticsService';

const Orders = () => {
  const { i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const statuses = [
    'all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  ];

  useEffect(() => {
    analyticsService.trackPageVisit(window.location.href, document.title, 'orders');
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchQuery, selectedStatus, sortBy]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/orders/`);
      setOrders(response.data);
      analyticsService.trackEvent('orders_loaded', { count: response.data.length });
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to sample data
      setOrders(getSampleOrders());
    } finally {
      setLoading(false);
    }
  };

  const getSampleOrders = () => [
    {
      id: '1',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      companyName: 'Green Farms Ltd',
      totalAmount: 2500.00,
      currency: 'USD',
      status: 'confirmed',
      orderDate: '2024-08-02T10:30:00Z',
      expectedDeliveryDate: '2024-08-15T00:00:00Z',
      items: [
        { productName: 'Black Sesame Seeds', quantity: 100, unitPrice: 3.50 }
      ]
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@example.com',
      companyName: 'Organic Valley Co',
      totalAmount: 1800.00,
      currency: 'USD',
      status: 'processing',
      orderDate: '2024-08-01T14:20:00Z',
      expectedDeliveryDate: '2024-08-12T00:00:00Z',
      items: [
        { productName: 'White Sesame Seeds', quantity: 50, unitPrice: 2.80 }
      ]
    },
    {
      id: '3',
      customerName: 'Raj Patel',
      customerEmail: 'raj.patel@example.com',
      companyName: 'Patel Farms',
      totalAmount: 3200.00,
      currency: 'USD',
      status: 'shipped',
      orderDate: '2024-07-30T09:15:00Z',
      expectedDeliveryDate: '2024-08-10T00:00:00Z',
      items: [
        { productName: 'Premium Organic Sesame Mix', quantity: 200, unitPrice: 4.20 },
        { productName: 'Black Sesame Seeds', quantity: 150, unitPrice: 3.50 }
      ]
    }
  ];

  const filterAndSortOrders = () => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.orderDate) - new Date(a.orderDate);
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'confirmed':
        return <CheckCircle className="status-icon confirmed" />;
      case 'processing':
        return <Package className="status-icon processing" />;
      case 'shipped':
        return <Package className="status-icon shipped" />;
      case 'delivered':
        return <CheckCircle className="status-icon delivered" />;
      case 'cancelled':
        return <XCircle className="status-icon cancelled" />;
      default:
        return <AlertCircle className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  const handleOrderClick = (order) => {
    analyticsService.trackEvent('order_viewed', {
      orderId: order.id,
      customerName: order.customerName,
      status: order.status
    });
  };

  const exportOrders = () => {
    analyticsService.trackEvent('orders_exported', {
      orderCount: filteredOrders.length
    });
    // TODO: Implement CSV/PDF export
    alert('Orders export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Order Management</h1>
          <p>Track and manage all B2B orders and inquiries</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="filters-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search orders by customer, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <button className="btn btn-secondary" onClick={exportOrders}>
              <Download /> Export Orders
            </button>

            <button className="btn btn-primary">
              <Plus /> New Order
            </button>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div 
          className="orders-table-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <ShoppingCart />
              <h3>No orders found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="orders-table">
              <div className="table-header">
                <div className="header-cell">Order ID</div>
                <div className="header-cell">Customer</div>
                <div className="header-cell">Company</div>
                <div className="header-cell">Amount</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Order Date</div>
                <div className="header-cell">Expected Delivery</div>
                <div className="header-cell">Actions</div>
              </div>

              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  className="table-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                >
                  <div className="table-cell">#{order.id}</div>
                  <div className="table-cell">
                    <div className="customer-info">
                      <div className="customer-name">{order.customerName}</div>
                      <div className="customer-email">{order.customerEmail}</div>
                    </div>
                  </div>
                  <div className="table-cell">{order.companyName}</div>
                  <div className="table-cell">
                    <div className="amount">
                      {order.currency} {order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </div>
                  <div className="table-cell">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                  <div className="table-cell">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                  </div>
                  <div className="table-cell">
                    <div className="actions">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleOrderClick(order)}
                        title="View Order"
                      >
                        <Eye />
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        title="Edit Order"
                      >
                        <Edit />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        title="Delete Order"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Results Summary */}
        <motion.div 
          className="results-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>Showing {filteredOrders.length} of {orders.length} orders</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Orders; 