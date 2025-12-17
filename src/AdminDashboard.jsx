import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, LogOut, TrendingUp, Search, Menu, X } from 'lucide-react';
import { getAllOrders, updateOrderStatus as updateOrderStatusAPI, getProducts } from './services/api';

function MyShopifyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, totalRevenue: 0, totalProducts: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([getAllOrders(), getProducts({})]);
      const allOrders = ordersRes.data;
      const pendingCount = allOrders.filter(o => o.status === 'pending').length;
      const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
      setStats({
        totalOrders: allOrders.length,
        pendingOrders: pendingCount,
        totalRevenue: totalRevenue,
        totalProducts: productsRes.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    if (statusFilter !== 'all') filtered = filtered.filter(o => o.status === statusFilter);
    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.id.toString().includes(searchTerm) ||
        o.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAPI(orderId, newStatus);
      await fetchOrders();
      await fetchStats();
    } catch {
      alert('Failed to update order status');
    }
  };

  const getStatusColor = status => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
  ];

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-green-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl shadow">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MyShopify</h1>
            <p className="text-sm text-gray-600">Store overview & management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
            <span className="text-sm font-semibold text-gray-900">{user.name}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">ADMIN</span>
          </div>
          <button onClick={onLogout} className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition">
            <LogOut size={20} />
          </button>

          {/* Mobile menu toggle */}
          <button className="sm:hidden p-2 text-gray-700 rounded-lg hover:bg-green-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className={`bg-white border-r border-green-100 min-h-[calc(100vh-73px)] transition-transform duration-300 sm:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'} fixed sm:static z-20 w-64`}>
          <nav className="p-4 space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                  activeTab === id ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow' : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
                <StatCard title="Pending Orders" value={stats.pendingOrders} icon={ShoppingCart} />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} highlight />
                <StatCard title="Total Products" value={stats.totalProducts} icon={Package} />
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">What you can do</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• View and manage all customer orders</li>
                  <li>• Update order status (pending → processing → shipped → delivered)</li>
                  <li>• Track sales performance and revenue</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
                <button onClick={fetchOrders} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition text-sm font-medium shadow">
                  Refresh
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by order ID, customer name or email..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders list */}
              {loading ? (
                <div className="bg-white/80 backdrop-blur rounded-xl p-8 border border-green-100 shadow-sm text-center">
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white/80 backdrop-blur rounded-xl p-8 border border-green-100 shadow-sm text-center">
                  <Package size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white/80 backdrop-blur rounded-xl p-5 border border-green-100 shadow-sm hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Customer:</strong> {order.user_name}</p>
                            <p><strong>Email:</strong> {order.user_email}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
                          <div className="mt-2">
                            <select
                              value={order.status}
                              onChange={e => handleStatusUpdate(order.id, e.target.value)}
                              className="px-3 py-1.5 border border-green-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-green-100 pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Order Items:</p>
                        <div className="space-y-2">
                          {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm text-gray-600 bg-green-50 p-2 rounded">
                              <span>{item.product_name} × {item.quantity}</span>
                              <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'products' && (
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Products Management</h2>
              <p className="text-gray-600">This section will be available soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, highlight }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm">
      <div className={`inline-flex p-3 rounded-xl mb-4 ${highlight ? 'bg-emerald-600' : 'bg-green-600'}`}>
        <Icon className="text-white" size={22} />
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default MyShopifyDashboard;
