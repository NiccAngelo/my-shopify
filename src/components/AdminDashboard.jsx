import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus as updateOrderStatusAPI, getProducts } from '../services/api';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import OverviewTab from './OverviewTab';
import OrdersTab from './OrdersTab';
import ProductsTab from './ProductsTab';
import { ToastContainer } from './Toast';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalOrders: 0, 
    pendingOrders: 0, 
    totalRevenue: 0, 
    totalProducts: 0,
    ordersTrend: null,
    pendingTrend: null,
    revenueTrend: null
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    startDate: '',
    endDate: '',
    statuses: [],
    sortBy: 'date-desc'
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchStats();
    
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, advancedFilters]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await getAllOrders();
      const newOrders = res.data;
      
      if (orders.length > 0 && newOrders.length > orders.length) {
        addToast('🎉 New order received!', 'success');
      }
      
      setOrders(newOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      addToast('Failed to fetch orders', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const [ordersRes, productsRes] = await Promise.all([getAllOrders(), getProducts({})]);
      const allOrders = ordersRes.data;
      
      const pendingCount = allOrders.filter(o => o.status === 'pending').length;
      const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const lastWeekOrders = allOrders.filter(o => new Date(o.created_at) < oneWeekAgo);
      const thisWeekOrders = allOrders.filter(o => new Date(o.created_at) >= oneWeekAgo);
      
      const lastWeekRevenue = lastWeekOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
      const thisWeekRevenue = thisWeekOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
      
      const revenueTrend = lastWeekRevenue > 0 
        ? { direction: thisWeekRevenue >= lastWeekRevenue ? 'up' : 'down', value: Math.abs(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100).toFixed(1) }
        : null;
      
      const ordersTrend = lastWeekOrders.length > 0
        ? { direction: thisWeekOrders.length >= lastWeekOrders.length ? 'up' : 'down', value: Math.abs(((thisWeekOrders.length - lastWeekOrders.length) / lastWeekOrders.length) * 100).toFixed(1) }
        : null;
      
      setStats({
        totalOrders: allOrders.length,
        pendingOrders: pendingCount,
        totalRevenue: totalRevenue,
        totalProducts: productsRes.data.length,
        ordersTrend,
        revenueTrend,
        pendingTrend: null
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    
    if (advancedFilters.statuses.length > 0) {
      filtered = filtered.filter(o => advancedFilters.statuses.includes(o.status));
    }
    
    if (advancedFilters.startDate) {
      filtered = filtered.filter(o => new Date(o.created_at) >= new Date(advancedFilters.startDate));
    }
    if (advancedFilters.endDate) {
      filtered = filtered.filter(o => new Date(o.created_at) <= new Date(advancedFilters.endDate));
    }
    
    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.id.toString().includes(searchTerm) ||
        o.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      switch (advancedFilters.sortBy) {
        case 'date-desc':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'date-asc':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'amount-desc':
          return parseFloat(b.total_amount) - parseFloat(a.total_amount);
        case 'amount-asc':
          return parseFloat(a.total_amount) - parseFloat(b.total_amount);
        default:
          return 0;
      }
    });
    
    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAPI(orderId, newStatus);
      await fetchOrders();
      await fetchStats();
      addToast(`✅ Order #${orderId} updated to ${newStatus}`, 'success');
    } catch {
      addToast('❌ Failed to update order status', 'error');
    }
  };

  const handleSelectOrder = (orderId, isSelected) => {
    setSelectedOrders(prev => 
      isSelected ? [...prev, orderId] : prev.filter(id => id !== orderId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedOrders(isSelected ? filteredOrders.map(o => o.id) : []);
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      await Promise.all(
        selectedOrders.map(orderId => updateOrderStatusAPI(orderId, newStatus))
      );
      await fetchOrders();
      await fetchStats();
      addToast(`✅ ${selectedOrders.length} orders updated to ${newStatus}`, 'success');
      setSelectedOrders([]);
    } catch {
      addToast('❌ Failed to update orders', 'error');
    }
  };

  const handleBulkExport = () => {
    const selectedOrdersData = orders.filter(o => selectedOrders.includes(o.id));
    
    const headers = ['Order ID', 'Customer', 'Email', 'Status', 'Total', 'Date'];
    const rows = selectedOrdersData.map(o => [
      o.id,
      o.user_name,
      o.user_email,
      o.status,
      o.total_amount,
      new Date(o.created_at).toLocaleString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickcart-orders-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    addToast(`📊 Exported ${selectedOrders.length} orders to CSV`, 'success');
  };

  const handleClearSelection = () => {
    setSelectedOrders([]);
  };

  const handleAdvancedFilterChange = (filters) => {
    setAdvancedFilters(filters);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-indigo-50 overflow-hidden">
      <DashboardHeader 
        user={user} 
        onLogout={onLogout} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
          onLogout={onLogout} 
        />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewTab 
                stats={stats} 
                statsLoading={statsLoading}
                orders={orders}
              />
            )}
            
            {activeTab === 'orders' && (
              <OrdersTab 
                filteredOrders={filteredOrders}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onRefresh={fetchOrders}
                onStatusUpdate={handleStatusUpdate}
                selectedOrders={selectedOrders}
                onSelectOrder={handleSelectOrder}
                onSelectAll={handleSelectAll}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkExport={handleBulkExport}
                onClearSelection={handleClearSelection}
                onAdvancedFilterChange={handleAdvancedFilterChange}
                advancedFilters={advancedFilters}
              />
            )}
            
            {activeTab === 'products' && <ProductsTab />}
          </div>
        </main>
      </div>
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default AdminDashboard;