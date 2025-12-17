export default function DetailView({ selectedProduct, setView, handleAddToCart }) {
  if (!selectedProduct) return null;

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <button onClick={() => setView('products')} className="mb-3 text-sm text-gray-700 hover:text-green-600 font-medium transition">← Back</button>
      <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden border border-green-100 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">{selectedProduct.category}</span>
            <h2 className="text-2xl font-bold mt-3 mb-3 text-gray-900">{selectedProduct.name}</h2>
            <p className="text-2xl font-bold text-green-600 mb-3">${parseFloat(selectedProduct.price).toFixed(2)}</p>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selectedProduct.description || 'Premium quality product crafted with attention to detail.'}</p>
            <p className="text-sm text-gray-600 mb-4">Stock: <span className="font-semibold text-green-600">{selectedProduct.stock} available</span></p>
            <button onClick={() => { handleAddToCart(selectedProduct); setView('cart'); }} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold transition">Add to Cart</button>
          </div>
        </div>
      </div>
    </main>
  );
}
