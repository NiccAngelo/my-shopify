import { TrendingUp, ShoppingCart, Package, LogOut } from 'lucide-react';

function DashboardSidebar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, onLogout }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
  ];

  return (
    <aside className={`bg-white/80 backdrop-blur border-r border-green-100 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 fixed md:static inset-0 md:inset-auto z-20 h-full overflow-y-auto shadow-lg md:shadow-none`}>
      <nav className="p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === id 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105' 
                : 'text-gray-700 hover:bg-green-50 hover:scale-105'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
        
        <button
          onClick={() => { onLogout(); setMobileMenuOpen(false); }}
          className="md:hidden w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-600 hover:bg-red-50 border-t border-gray-200 mt-4 pt-4 hover:scale-105"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;