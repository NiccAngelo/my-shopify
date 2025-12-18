import { TrendingUp, TrendingDown } from 'lucide-react';

function StatCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, highlight, loading, trend }) {
  if (loading) return <StatCardSkeleton />;

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className={`inline-flex p-3 rounded-xl mb-4 shadow-sm ${highlight ? 'bg-gradient-to-br from-emerald-600 to-green-600' : 'bg-gradient-to-br from-green-600 to-emerald-600'}`}>
        <Icon className="text-white" size={22} />
      </div>
      <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      {trend && (
        <p className="text-xs text-gray-500 mt-2">vs last week</p>
      )}
    </div>
  );
}

export default StatCard;