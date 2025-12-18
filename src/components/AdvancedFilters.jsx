import { Calendar, Filter, X } from 'lucide-react';
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
        className="px-4 py-2.5 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition flex items-center gap-2 text-sm font-medium relative"
      >
        <Filter size={18} />
        Advanced Filters
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {showFilters && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-white border border-green-200 rounded-xl shadow-xl p-4 z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Filter Orders</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Status Multi-Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                      selectedStatuses.includes(status)
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;