import { Package, Edit2, Trash2, AlertCircle } from 'lucide-react';

function ProductCard({ product, onEdit, onDelete }) {
  const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
  
  const stockColors = {
    'in-stock': 'bg-green-100 text-green-700 border-green-200',
    'low-stock': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'out-of-stock': 'bg-red-100 text-red-700 border-red-200'
  };

  const stockLabels = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock'
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-xl border border-green-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${stockColors[stockStatus]}`}>
            {stockLabels[stockStatus]}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-white rounded-lg hover:bg-green-50 transition"
            title="Edit Product"
          >
            <Edit2 size={18} className="text-green-600" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 bg-white rounded-lg hover:bg-red-50 transition"
            title="Delete Product"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
          <p className="text-xs text-gray-500 uppercase font-medium">{product.category}</p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-[40px]">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <p className="text-2xl font-bold text-green-600">${parseFloat(product.price).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Stock</p>
            <p className={`text-lg font-bold ${product.stock > 10 ? 'text-gray-900' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {product.stock}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;