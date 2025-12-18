import { useState, useEffect } from 'react';
import { Search, Plus, Package, Grid, List, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life',
    price: 299.99,
    stock: 45,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Feature-packed smartwatch with health tracking',
    price: 399.99,
    stock: 8,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Running Shoes',
    description: 'Lightweight and comfortable running shoes',
    price: 129.99,
    stock: 0,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 89.99,
    stock: 23,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: 'Backpack',
    description: 'Durable laptop backpack with multiple compartments',
    price: 59.99,
    stock: 67,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 39.99,
    stock: 15,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop'
  }
];

function ProductsTab() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, stockFilter, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Stock filter
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter(p => p.stock > 10);
    } else if (stockFilter === 'low-stock') {
      filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter(p => p.stock === 0);
    }

    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
    } else {
      // Add new product
      setProducts(prev => [...prev, productData]);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 10).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Products Management</h2>
          <p className="text-gray-600 text-sm">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">In Stock</p>
          <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-yellow-100 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-red-100 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer transition"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value)}
            className="px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer transition"
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg border transition ${viewMode === 'grid' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg border transition ${viewMode === 'list' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-12 border border-green-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 text-sm mb-4">Try adjusting your filters or add a new product</p>
          <button
            onClick={handleAddProduct}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition text-sm font-medium inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </>
  );
}

export default ProductsTab;