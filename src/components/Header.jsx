import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/quickcart-logo.png';
import UserMenu from './UserMenu';

export default function Header({ user, cartCount, setView, logout, setShowAuth, setAuthMode, onUpdateProfile }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 flex-shrink-0 relative z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <img
              src={logo}
              alt="QuickCart Logo"
              className="h-10 w-auto cursor-pointer"
              onClick={() => setView('products')}
            />

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => setView('products')} 
                className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                Products
              </button>
              {user && (
                <button 
                  onClick={() => setView('orders')} 
                  className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors"
                >
                  Orders
                </button>
              )}
            </nav>
          </div>

          {/* Right: Cart + User Menu / Sign In */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Cart Button */}
                <button 
                  onClick={() => setView('cart')} 
                  className="relative p-2.5 text-gray-700 hover:bg-green-50 rounded-xl transition-colors"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* User Menu (Desktop) */}
                <div className="hidden sm:block">
                  <UserMenu 
                    user={user} 
                    logout={logout}
                    onUpdateProfile={onUpdateProfile}
                  />
                </div>
              </>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setShowAuth(true); }} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="sm:hidden p-2 text-gray-700 rounded-lg hover:bg-green-50 transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="flex flex-col gap-2 py-3 border-t border-green-100 sm:hidden">
            <button 
              onClick={() => { setView('products'); setMobileMenuOpen(false); }} 
              className="text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors text-left px-3 py-2 rounded-lg"
            >
              Products
            </button>
            {user && (
              <>
                <button 
                  onClick={() => { setView('orders'); setMobileMenuOpen(false); }} 
                  className="text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors text-left px-3 py-2 rounded-lg"
                >
                  Orders
                </button>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <UserMenu 
                    user={user} 
                    logout={logout}
                    onUpdateProfile={onUpdateProfile}
                  />
                </div>
              </>
            )}
          </nav>
        )}

      </div>
    </header>
  );
}