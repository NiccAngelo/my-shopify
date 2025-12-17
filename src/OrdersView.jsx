import { useEffect, useState, useContext } from 'react';
import { Package } from 'lucide-react';
import { getOrders as getOrdersAPI } from './services/api';
import { AuthContext } from './AuthContext';

export default function OrdersView({ setView }) {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await getOrdersAPI(); // Ensure your API sends the token
        console.log('Fetched orders:', res.data); // Debug log
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

  if (loading) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-gray-600 text-sm">Loading orders...</p>
      </main>
    );
  }

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">My Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-10 text-center border border-green-100 max-w-2xl mx-auto">
          <Package size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-4 text-sm">No orders yet</p>
          <button
            onClick={() => setView('products')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition text-sm"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl mx-auto">
          {orders.map(order => (
            <div key={order.id} className="bg-white/80 backdrop-blur rounded-xl p-5 border border-green-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-sm text-gray-900">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {order.items?.length > 0 && (
                <div className="border-t border-green-100 pt-3 space-y-1 text-xs text-gray-600">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.product_name} × {item.quantity} — ${parseFloat(item.price).toFixed(2)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
