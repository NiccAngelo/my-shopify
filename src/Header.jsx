import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Header({ user, cartCount, setView, logout, setShowAuth, setAuthMode }) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <button onClick={() => setView('products')} className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
                <ShoppingCart size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">MyShop</span>
            </button>
            <nav className="hidden md:flex gap-6">
              <button onClick={() => setView('products')} className="text-sm font-medium text-gray-700 hover:text-green-600 transition">Products</button>
              {user && <button onClick={() => setView('orders')} className="text-sm font-medium text-gray-700 hover:text-green-600 transition">Orders</button>}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button onClick={() => setView('cart')} className="relative p-2 text-gray-700 hover:bg-green-50 rounded-lg transition">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>}
                </button>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  <User size={14} className="text-green-700" />
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <button onClick={logout} className="text-gray-600 hover:text-red-600"><LogOut size={14} /></button>
                </div>
              </>
            ) : (
              <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1.5 rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium transition">Sign In</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
