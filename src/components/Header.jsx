import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/quickcart-logo.png';

export default function Header({ user, cartCount, setView, logout, setShowAuth, setAuthMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}



            <img
              src={logo}
              alt="MyShop Logo"
              className="h-10 w-auto"
            />



            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6">
              <button onClick={() => setView('products')} className="text-sm font-medium text-gray-700 hover:text-green-600 transition">Products</button>
              {user && <button onClick={() => setView('orders')} className="text-sm font-medium text-gray-700 hover:text-green-600 transition">Orders</button>}
            </nav>
          </div>

          {/* Right: User / Cart / Mobile Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Cart */}
                <button onClick={() => setView('cart')} className="relative p-2 text-gray-700 hover:bg-green-50 rounded-lg transition">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
                  )}
                </button>

                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  <User size={14} className="text-green-700" />
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <button onClick={logout} className="text-gray-600 hover:text-red-600"><LogOut size={14} /></button>
                </div>
              </>
            ) : (
              <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1.5 rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium transition">Sign In</button>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 text-gray-700 rounded-lg hover:bg-green-50 transition">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="flex flex-col gap-2 mt-2 pb-2 border-t border-green-100 sm:hidden">
            <button onClick={() => { setView('products'); setMobileMenuOpen(false); }} className="text-sm font-medium text-gray-700 hover:text-green-600 transition text-left">Products</button>
            {user && <button onClick={() => { setView('orders'); setMobileMenuOpen(false); }} className="text-sm font-medium text-gray-700 hover:text-green-600 transition text-left">Orders</button>}
            {user && (
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-sm font-medium text-red-600 hover:text-red-700 transition text-left">Logout</button>
            )}
          </nav>
        )}

      </div>
    </header>
  );
}
