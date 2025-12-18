import { TrendingUp, TrendingDown } from 'lucide-react';

function RevenueChart({ orders }) {
  // Process orders data for chart
  const processChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        return orderDate === dateStr;
      });
      
      const revenue = dayOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: revenue,
        orders: dayOrders.length
      });
    }
    
    return last7Days;
  };

  const chartData = processChartData();
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);
  const maxOrders = Math.max(...chartData.map(d => d.orders), 1);

  // Calculate trends
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0);
  const avgRevenue = totalRevenue / 7;

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            Revenue Trend (Last 7 Days)
          </h3>
          <p className="text-sm text-gray-600 mt-1">Daily revenue and order count</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Total Revenue</p>
        </div>
      </div>
      
      {/* Simple Bar Chart */}
      <div className="space-y-4">
        {chartData.map((day, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 w-20">{day.date}</span>
              <div className="flex-1 mx-4">
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  {/* Revenue Bar */}
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                  >
                    {day.revenue > 0 && (
                      <span className="text-xs font-bold text-white">
                        ${day.revenue.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
                {/* Orders indicator */}
                <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(day.orders / maxOrders) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-600 w-16 text-right">
                {day.orders} {day.orders === 1 ? 'order' : 'orders'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded bg-blue-500"></div>
          <span className="text-sm text-gray-600">Orders</span>
        </div>
        <div className="ml-auto text-sm text-gray-600">
          Avg: <span className="font-semibold">${avgRevenue.toFixed(2)}/day</span>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;