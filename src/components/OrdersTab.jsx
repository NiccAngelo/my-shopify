import { Search, Package, RefreshCw, Filter, CheckSquare, Square, MinusSquare } from 'lucide-react';
import { OrderCard, OrderCardSkeleton } from './OrderCard';
import AdvancedFilters from './AdvancedFilters';
import BulkActionsBar from './BulkActionsBar';

function OrdersTab({ 
  filteredOrders, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  onRefresh, 
  onStatusUpdate,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onBulkStatusUpdate,
  onBulkExport,
  onClearSelection,
  onAdvancedFilterChange,
  advancedFilters
}) {
  const allSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;
  const someSelected = selectedOrders.length > 0 && !allSelected;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
            Orders Management
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            Manage and track all customer orders
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <AdvancedFilters 
            onFilterChange={onAdvancedFilterChange}
            activeFilters={advancedFilters}
          />
          <button 
            onClick={onRefresh} 
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:scale-105 duration-200"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh Orders</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Card */}
      <div className="bg-gradient-to-br from-white to-green-50/30 backdrop-blur-xl rounded-2xl p-5 border border-green-200/60 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white/80 backdrop-blur placeholder:text-gray-400 font-medium text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative group sm:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-green-600 transition-colors" size={16} />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-10 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none cursor-pointer transition-all bg-white/80 backdrop-blur font-semibold text-sm appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.25rem'
              }}
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
      </div>

      {/* Select All Section */}
      {filteredOrders.length > 0 && (
        <div className="bg-white/80 backdrop-blur rounded-xl px-5 py-3.5 border border-green-200/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer transition-all"
              />
              {someSelected && !allSelected && (
                <MinusSquare className="absolute inset-0 text-green-600 pointer-events-none" size={20} />
              )}
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors">
              {allSelected ? 'Deselect All Orders' : someSelected ? `${selectedOrders.length} Order${selectedOrders.length > 1 ? 's' : ''} Selected` : 'Select All Orders'}
            </span>
          </label>
          
          {/* Order Count Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Total:</span>
            <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
              <span className="text-sm font-bold text-green-700">{filteredOrders.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 rounded-2xl p-12 sm:p-16 border border-green-200/60 shadow-lg text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
            <Package size={40} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders found</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto">
            Try adjusting your search or filter criteria to find what you're looking for
          </p>
          <button 
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:scale-105 duration-200"
          >
            <RefreshCw size={16} />
            Refresh Orders
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-24">
          {filteredOrders.map((order, index) => (
            <div
              key={order.id}
              className="animate-fadeIn"
              style={{ 
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <OrderCard 
                order={order} 
                onStatusUpdate={onStatusUpdate}
                isSelected={selectedOrders.includes(order.id)}
                onSelect={onSelectOrder}
              />
            </div>
          ))}
        </div>
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedOrders.length}
        onBulkStatusUpdate={onBulkStatusUpdate}
        onBulkExport={onBulkExport}
        onClearSelection={onClearSelection}
      />
    </div>
  );
}

export default OrdersTab;