import { Package, LogOut, Menu, X } from 'lucide-react';

function DashboardHeader({ user, onLogout, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-green-100 px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 sm:p-3 rounded-xl shadow-lg">
          <Package className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">MyShopify</h1>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Store overview & management</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-green-50 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
          <span className="text-sm font-semibold text-gray-900">{user.name}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm">ADMIN</span>
        </div>
        <button onClick={onLogout} className="hidden md:block p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;