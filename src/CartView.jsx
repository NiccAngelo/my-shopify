import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

export default function CartView({ cart, cartTotal, setView, handleUpdateQuantity, handleRemove, handleCheckout, loading }) {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-10 text-center border border-green-100 max-w-2xl mx-auto">
          <ShoppingCart size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-4 text-sm">Your cart is empty</p>
          <button onClick={() => setView('products')} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition text-sm">Browse Products</button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3 bg-white/80 backdrop-blur rounded-xl p-3 border border-green-100">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                  <p className="text-green-600 font-bold text-sm">${parseFloat(item.price).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border border-green-200 rounded-lg flex items-center justify-center hover:bg-green-50 transition"><Minus size={14} /></button>
                    <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 border border-green-200 rounded-lg flex items-center justify-center hover:bg-green-50 transition"><Plus size={14} /></button>
                    <button onClick={() => handleRemove(item.id)} className="ml-auto text-red-500 hover:text-red-600 transition"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="text-right font-bold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-green-100 sticky top-4">
              <h3 className="text-lg font-bold mb-3 text-gray-900">Order Summary</h3>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-green-600 font-medium">Free</span></div>
                <div className="border-t border-green-100 pt-2 flex justify-between font-bold"><span>Total</span><span className="text-green-600">${cartTotal.toFixed(2)}</span></div>
              </div>
              <button onClick={handleCheckout} disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium disabled:opacity-50 transition mb-2 text-sm">{loading ? 'Processing...' : 'Checkout'}</button>
              <button onClick={() => setView('products')} className="w-full border border-green-200 py-2.5 rounded-lg hover:bg-green-50 font-medium text-gray-700 transition text-sm">Continue Shopping</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
