import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

function ProductModal({ isOpen, onClose, onSave, product = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        image: product.image || ''
      });
      setImagePreview(product.image || '');
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: ''
      });
      setImagePreview('');
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = (url) => {
    setImagePreview(url);
    setFormData(prev => ({ ...prev, image: url }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: product?.id || Date.now(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Enter product description"
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2.5 border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2.5 border ${errors.stock ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                  placeholder="0"
                />
                {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition cursor-pointer`}
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Toys">Toys</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3 relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Upload Options */}
              <div className="space-y-2">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition">
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Or paste image URL"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm"
                    onBlur={(e) => e.target.value && handleImageUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium shadow-lg"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;