import { TrendingUp, ShoppingCart, Package, LogOut } from 'lucide-react';

function DashboardSidebar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, onLogout }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
  ];

  return (
    <aside className={`bg-gradient-to-b from-white via-green-50/30 to-emerald-50/50 backdrop-blur-xl border-r border-green-200/60 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 fixed md:static inset-0 md:inset-auto z-20 h-full overflow-y-auto shadow-xl md:shadow-none`}>
      <div className="p-6">
        {/* Logo/Brand Section */}
        <div className="mb-8 pb-6 border-b border-green-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Package className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">QuickCart</h2>
              <p className="text-xs text-green-600 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
              className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium relative overflow-hidden ${
                activeTab === id 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                  : 'text-gray-700 hover:bg-green-100/70 hover:text-green-700'
              }`}
            >
              {/* Hover shine effect for inactive items */}
              {activeTab !== id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
              
              <div className={`transition-transform duration-200 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon size={20} />
              </div>
              <span className="relative">{label}</span>
              
              {/* Active indicator */}
              {activeTab === id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
            </button>
          ))}
        </nav>
        
        {/* Mobile Logout Button */}
        <div className="md:hidden mt-8 pt-6 border-t border-green-200/50">
          <button
            onClick={() => { onLogout(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200/50"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;