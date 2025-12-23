import { Search, Package, ShoppingCart, Plus } from 'lucide-react';

export default function ProductsView({ products, categories, category, setCategory, search, setSearch, handleAddToCart, setSelectedProduct, setView }) {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Enhanced Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar with Animation */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" size={20} />
          <input 
            type="text" 
            placeholder="Search products by name or category..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all duration-200 text-sm placeholder:text-gray-400 shadow-sm"
          />
        </div>

        {/* Enhanced Category Filters */}
        <div className="flex gap-2.5 flex-wrap">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)} 
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                category === cat 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200' 
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50 hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {products.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Package size={36} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(p => (
            <div 
              key={p.id} 
              className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              {/* Product Image */}
              <div 
                className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 cursor-pointer"
                onClick={() => { setSelectedProduct(p); setView('detail'); }}
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick View Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-semibold text-gray-700">Quick View</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Category Badge */}
                <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full inline-block w-fit mb-3">
                  {p.category}
                </span>

                {/* Product Name */}
                <h3 
                  className="text-base font-bold text-gray-900 cursor-pointer hover:text-green-600 transition-colors duration-200 line-clamp-2 mb-3 flex-1" 
                  onClick={() => { setSelectedProduct(p); setView('detail'); }}
                >
                  {p.name}
                </h3>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between gap-3 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Price</p>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${parseFloat(p.price).toFixed(2)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(p)} 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2 group/btn"
                  >
                    <Plus size={16} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Counter */}
      {products.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{products.length}</span> product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </main>
  );
}