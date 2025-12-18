import { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, Calendar, User, Mail } from 'lucide-react';

function OrderCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-green-100 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-3 flex-1">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-48"></div>
          <div className="h-3 bg-gray-200 rounded w-40"></div>
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
      <div className="border-t border-green-100 pt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

function OrderCard({ order, onStatusUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div className="bg-white/80 backdrop-blur rounded-xl border border-green-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                <span><strong className="text-gray-700">Customer:</strong> {order.user_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <span><strong className="text-gray-700">Email:</strong> {order.user_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span><strong className="text-gray-700">Date:</strong> {new Date(order.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 mb-3">${parseFloat(order.total_amount).toFixed(2)}</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Update Status</label>
              <select
                value={order.status}
                onChange={e => onStatusUpdate(order.id, e.target.value)}
                className="px-3 py-2 border border-green-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer bg-white hover:border-green-400 transition"
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
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors mb-2"
          >
            <span>Order Items ({order.items?.length || 0})</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-2 pt-2">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { OrderCard, OrderCardSkeleton };