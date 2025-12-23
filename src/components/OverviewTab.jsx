import { ShoppingCart, DollarSign, Package, TrendingUp, Zap, Search, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';

function OverviewTab({ stats, statsLoading, orders = [] }) {
  const quickActions = [
    { icon: Search, text: 'Search and filter orders by customer or status', color: 'from-blue-500 to-cyan-500' },
    { icon: RefreshCw, text: 'Bulk select and update multiple orders at once', color: 'from-purple-500 to-pink-500' },
    { icon: Download, text: 'Export order data to CSV for analysis', color: 'from-amber-500 to-orange-500' },
    { icon: CheckCircle2, text: 'Update order status seamlessly', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
            Overview
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            Your store performance at a glance
          </p>
        </div>
        
        {/* Time indicator */}
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-200/80">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold text-green-700">Live Data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingCart} 
          loading={statsLoading}
          trend={stats.ordersTrend}
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.pendingOrders} 
          icon={ShoppingCart} 
          loading={statsLoading}
          trend={stats.pendingTrend}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          icon={DollarSign} 
          highlight 
          loading={statsLoading}
          trend={stats.revenueTrend}
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={Package} 
          loading={statsLoading}
        />
      </div>

      {/* Revenue Chart */}
      {!statsLoading && orders && orders.length > 0 && (
        <div className="animate-fade-in">
          <RevenueChart orders={orders} />
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-green-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <Zap size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Quick Actions & Features
          </h3>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, idx) => (
            <div 
              key={idx}
              className="group relative bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon size={18} className="text-white" />
                </div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  {action.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-6 pt-6 border-t border-green-200/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp size={16} className="text-green-600 flex-shrink-0" />
              <span className="font-medium">Track sales performance and revenue metrics</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package size={16} className="text-green-600 flex-shrink-0" />
              <span className="font-medium">Manage customer orders in real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tip Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-green-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Pro Tip</h4>
            <p className="text-green-50 text-sm leading-relaxed">
              Keep your inventory updated and monitor pending orders daily to ensure smooth operations and customer satisfaction. Use bulk actions to save time on repetitive tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;