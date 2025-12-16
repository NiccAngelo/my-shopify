import { useState } from 'react';
import { Package, ShoppingCart, DollarSign, LogOut, ArrowLeft, TrendingUp } from 'lucide-react';

function MyShopifyDashboard({ user, onLogout, onBackToShop }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-green-100">
        <div className="px-6 py-4 flex items-center justify-between">
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
            <button
              onClick={onBackToShop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 transition"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium text-gray-700 hover:text-green-600 transition">Back to Shop</span>
            </button>

            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
              <span className="text-sm font-semibold text-gray-900">{user.name}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">STAFF</span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-green-100 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {[{ id: 'overview', label: 'Overview', icon: TrendingUp },{ id: 'orders', label: 'Orders', icon: ShoppingCart },{ id: 'products', label: 'Products', icon: Package }].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
                <StatCard title="Pending Orders" value={stats.pendingOrders} icon={ShoppingCart} />
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} highlight />
                <StatCard title="Total Products" value={stats.totalProducts} icon={Package} />
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">What you can do</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Manage customer orders</li>
                  <li>• Add and update products</li>
                  <li>• Track sales performance</li>
                </ul>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm">
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