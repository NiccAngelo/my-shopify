import { Calendar, Filter, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function AdvancedFilters({ onFilterChange, activeFilters }) {
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(activeFilters.startDate || '');
  const [endDate, setEndDate] = useState(activeFilters.endDate || '');
  const [selectedStatuses, setSelectedStatuses] = useState(activeFilters.statuses || []);
  const [sortBy, setSortBy] = useState(activeFilters.sortBy || 'date-desc');

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const handleStatusToggle = (status) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(updated);
  };

  const applyFilters = () => {
    onFilterChange({
      startDate,
      endDate,
      statuses: selectedStatuses,
      sortBy
    });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedStatuses([]);
    setSortBy('date-desc');
    onFilterChange({
      startDate: '',
      endDate: '',
      statuses: [],
      sortBy: 'date-desc'
    });
  };

  const activeFilterCount = [startDate, endDate, ...selectedStatuses].filter(Boolean).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="px-4 sm:px-5 py-2.5 bg-white border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all flex items-center gap-2 text-sm font-semibold relative shadow-sm hover:shadow-md hover:scale-105 duration-200 group"
      >
        <Filter size={18} className="text-green-600 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Advanced Filters</span>
        <span className="sm:hidden">Filters</span>
        <ChevronDown size={16} className={`text-green-600 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-green-500/30 animate-pulse">
            {activeFilterCount}
          </span>
        )}
      </button>

      {showFilters && (
        <>
          {/* Mobile Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Filter Panel */}
          <div className="fixed md:absolute top-1/2 md:top-full left-1/2 md:left-auto md:right-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 md:mt-2 w-[90%] sm:w-96 bg-gradient-to-br from-white to-green-50/30 backdrop-blur-xl border-2 border-green-200/60 rounded-2xl shadow-2xl p-5 sm:p-6 z-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-green-200/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Filter size={16} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Filter Orders</h3>
              </div>
              <button 
                onClick={() => setShowFilters(false)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 max-h-[60vh] md:max-h-none overflow-y-auto pr-2">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-green-600" />
                  Date Range
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-green-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                      placeholder="Start date"
                    />
                    <span className="absolute left-3 -top-2 px-1 bg-white text-xs font-medium text-gray-500">From</span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-green-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                      placeholder="End date"
                    />
                    <span className="absolute left-3 -top-2 px-1 bg-white text-xs font-medium text-gray-500">To</span>
                  </div>
                </div>
              </div>

              {/* Status Multi-Select */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Order Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusToggle(status)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-200 capitalize ${
                        selectedStatuses.includes(status)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500 shadow-lg shadow-green-500/30 scale-105'
                          : 'bg-white text-gray-600 border-green-200 hover:border-green-400 hover:bg-green-50 hover:scale-105'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 pr-10 py-2.5 border-2 border-green-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none cursor-pointer transition-all bg-white appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="amount-desc">Amount (High to Low)</option>
                  <option value="amount-asc">Amount (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-5 mt-5 border-t border-green-200/50">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2.5 border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all text-sm font-semibold text-gray-700 hover:scale-105 duration-200"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:scale-105 duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdvancedFilters;