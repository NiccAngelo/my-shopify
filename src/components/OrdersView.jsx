import { useEffect, useState, useContext } from 'react';
import { Package, Calendar, ChevronDown, ChevronUp, CheckCircle, Circle, Truck, Home, Clock } from 'lucide-react';
import { getOrders as getOrdersAPI } from '../services/api';
import { AuthContext } from '../AuthContext';

// Order Status Timeline Component
function OrderStatusTimeline({ status, createdAt, compact = false }) {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'processing', label: 'Processing', icon: Clock },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home },
  ];

  const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === 'cancelled';

  const getStepStatus = (stepIndex) => {
    if (isCancelled) return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  stepStatus === 'completed'
                    ? 'bg-green-500 text-white shadow-md'
                    : stepStatus === 'current'
                    ? 'bg-blue-500 text-white animate-pulse shadow-md'
                    : stepStatus === 'cancelled'
                    ? 'bg-red-100 text-red-400'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {stepStatus === 'completed' ? (
                  <CheckCircle size={16} />
                ) : (
                  <step.icon size={16} />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 transition-all duration-300 ${
                    stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 mt-4">
      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Truck size={18} className="text-green-600" />
        Order Tracking
      </h4>

      {isCancelled ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Circle size={32} className="text-red-500" />
          </div>
          <h4 className="text-lg font-bold text-red-600 mb-1">Order Cancelled</h4>
          <p className="text-sm text-gray-600">This order has been cancelled</p>
        </div>
      ) : (
        <div className="space-y-6">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(index);
            const StepIcon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.key} className="relative flex gap-4">
                {!isLast && (
                  <div
                    className={`absolute left-5 top-12 w-0.5 h-full transition-all duration-500 ${
                      stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}

                <div className="relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      stepStatus === 'completed'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                        : stepStatus === 'current'
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 animate-pulse'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {stepStatus === 'completed' ? (
                      <CheckCircle size={20} />
                    ) : (
                      <StepIcon size={20} />
                    )}
                  </div>
                </div>

                <div className="flex-1 pt-1">
                  <h5
                    className={`font-bold mb-1 transition-colors ${
                      stepStatus === 'completed' || stepStatus === 'current'
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </h5>
                  {stepStatus === 'completed' && (
                    <p className="text-sm text-gray-600">
                      Completed on {new Date(createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {stepStatus === 'current' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      In Progress
                    </div>
                  )}
                  {stepStatus === 'upcoming' && (
                    <p className="text-sm text-gray-400">Pending</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isCancelled && currentIndex < steps.length - 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Estimated Delivery:</span>{' '}
            {new Date(Date.now() + (3 - currentIndex) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}

// Loading Skeleton Component
function OrderSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-green-100 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-5 bg-gray-200 rounded w-20 ml-auto"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16 ml-auto"></div>
        </div>
      </div>
      <div className="border-t border-green-100 pt-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

// Individual Order Card with Expand/Collapse
function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur rounded-xl border border-green-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Package size={16} className="text-green-600" />
              <p className="font-semibold text-sm text-gray-900">Order #{order.id}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{new Date(order.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
            <span
              className={`inline-block mt-1 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : order.status === 'processing'
                  ? 'bg-blue-100 text-blue-700'
                  : order.status === 'shipped'
                  ? 'bg-purple-100 text-purple-700'
                  : order.status === 'completed' || order.status === 'delivered'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Compact Timeline - Always visible */}
        <div className="mb-4">
          <OrderStatusTimeline status={order.status} createdAt={order.created_at} compact />
        </div>

        {/* Items Preview */}
        {order.items?.length > 0 && (
          <div className="border-t border-green-100 pt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left text-sm text-gray-700 hover:text-green-600 transition-colors"
            >
              <span className="font-medium">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {/* Expandable Items List */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-2 text-xs text-gray-600 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Full Timeline in Expanded View */}
              <OrderStatusTimeline status={order.status} createdAt={order.created_at} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyOrdersState({ setView }) {
  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-12 text-center border border-green-100 max-w-2xl mx-auto shadow-sm">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package size={40} className="text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
      <p className="text-gray-600 mb-6 text-sm max-w-sm mx-auto">
        Start shopping to see your orders here. We have amazing products waiting for you!
      </p>
      <button
        onClick={() => setView('products')}
        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all transform hover:scale-105 shadow-md text-sm inline-flex items-center gap-2"
      >
        <Package size={16} />
        Start Shopping
      </button>
    </div>
  );
}

// Main Component
export default function OrdersView({ setView }) {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await getOrdersAPI(); 
        console.log('Fetched orders:', res.data); 
        setOrders(res.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">My Orders</h2>
        <p className="text-gray-600 text-sm">Track and manage your purchases</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <OrderSkeleton />
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <EmptyOrdersState setView={setView} />
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}