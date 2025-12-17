import { Search, Package } from 'lucide-react';

export default function ProductsView({ products, categories, category, setCategory, search, setSearch, handleAddToCart, setSelectedProduct, setView }) {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-3">
      <div className="mb-3">
        <div className="relative mb-2.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${category === cat ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' : 'bg-white border border-green-200 text-gray-700 hover:bg-green-50'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-8 text-center border border-green-100">
          <Package size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 text-sm">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {products.map(p => (
            <div key={p.id} className="bg-white/80 backdrop-blur rounded-xl overflow-hidden border border-green-100 hover:shadow-xl hover:border-green-300 transition group">
              <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                <img src={p.image} alt={p.name} className="w-full h-44 object-cover cursor-pointer group-hover:scale-105 transition duration-500" onClick={() => { setSelectedProduct(p); setView('detail'); }} />
              </div>
              <div className="p-3">
                <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{p.category}</span>
                <h3 className="text-sm font-semibold mt-2 mb-2 text-gray-900 cursor-pointer hover:text-green-600 transition line-clamp-2" onClick={() => { setSelectedProduct(p); setView('detail'); }}>{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">${parseFloat(p.price).toFixed(2)}</span>
                  <button onClick={() => handleAddToCart(p)} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3.5 py-1.5 rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium transition">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
