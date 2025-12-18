import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';

function OverviewTab({ stats, statsLoading, orders = [] }) {  // Added default empty array
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Overview</h2>
        <p className="text-gray-600 text-sm">Your store performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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

      {/* Revenue Chart - Only show if we have orders */}
      {!statsLoading && orders && orders.length > 0 && (
        <div className="mb-8">
          <RevenueChart orders={orders} />
        </div>
      )}

      <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border border-green-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-600" />
          Quick Actions & Features
        </h3>
        <ul className="space-y-3 text-gray-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>View and manage all customer orders in real-time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Update order status (pending → processing → shipped → delivered)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Track sales performance and revenue metrics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Search and filter orders by customer or status</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Bulk select and update multiple orders at once</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>Export order data to CSV for analysis</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default OverviewTab;