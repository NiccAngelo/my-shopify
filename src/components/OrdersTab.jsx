import { Search, Package } from 'lucide-react';
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
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Orders Management</h2>
          <p className="text-gray-600 text-sm">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-2">
          <AdvancedFilters 
            onFilterChange={onAdvancedFilterChange}
            activeFilters={advancedFilters}
          />
          <button 
            onClick={onRefresh} 
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {/* Search and Basic Filters */}
      <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer transition"
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

      {/* Select All Checkbox */}
      {filteredOrders.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={allSelected}
            ref={input => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
          />
          <span className="text-gray-700 font-medium">
            {allSelected ? 'Deselect All' : someSelected ? `${selectedOrders.length} selected` : 'Select All'}
          </span>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-12 border border-green-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 text-sm mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={onRefresh}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition text-sm font-medium"
          >
            Refresh Orders
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-24">
          {filteredOrders.map((order, index) => (
            <div
              key={order.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
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
    </>
  );
}

export default OrdersTab;