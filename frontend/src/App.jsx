
import { useState, useEffect, useContext, createContext } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Search, User, LogOut, Package, Heart, X, Check, Menu, Star, TrendingUp, Zap, Shield, Truck } from 'lucide-react';
import { getProducts, login as loginAPI, register as registerAPI, getProfile, addToCart as addToCartAPI, getCart, removeFromCart as removeFromCartAPI, updateCartItem, createOrder, getOrders } from './services/api';

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginAPI({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await registerAPI({ name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Notification Component
const Notification = ({ message, type, onClose }) => (
  <div className={`fixed top-24 right-6 z-50 ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideIn backdrop-blur-xl`}>
    {type === 'success' ? <Check size={20} /> : <X size={20} />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition-colors">
      <X size={16} />
    </button>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { user, login, register, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchCart();
    }
  }, [user]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ 
        category: selectedCategory !== 'All' ? selectedCategory : undefined, 
        search: searchTerm 
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const handleAddToCart = async (product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await addToCartAPI({ product_id: product.id, quantity: 1 });
      await fetchCart();
      showNotification('Added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showNotification(error.response?.data?.error || 'Failed to add to cart', 'error');
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveFromCart(cartItemId);
      return;
    }
    try {
      await updateCartItem(cartItemId, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await removeFromCartAPI(cartItemId);
      await fetchCart();
      showNotification('Removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      const items = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));
      const total_amount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await createOrder({ items, total_amount });
      await fetchCart();
      showNotification('Order placed successfully!');
      setView('orders');
      await fetchOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
      showNotification(error.response?.data?.error || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const result = authMode === 'login'
        ? await login(authForm.email, authForm.password)
        : await register(authForm.name, authForm.email, authForm.password);

      if (result.success) {
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', password: '' });
        await fetchCart();
        showNotification(`Welcome ${authMode === 'login' ? 'back' : 'to MyShopify'}!`);
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Clothing', 'Shoes', 'Accessories'];
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-screen h-screen overflow-y-auto flex flex-col bg-gray-50">
      <style>{`
      
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Header */}
<header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200 flex-shrink-0">
  <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('products')}>
                <div className="bg-black p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                  <ShoppingCart size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">MyShopify</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-8">
                <button onClick={() => setView('products')} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  Products
                </button>
                <button className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  Deals
                </button>
                <button className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  New
                </button>
                {user && (
                  <button onClick={() => { setView('orders'); fetchOrders(); }} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                    Orders
                  </button>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button 
                    onClick={() => setView('cart')} 
                    className="relative p-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center gap-3 bg-gray-100 px-4 py-2.5 rounded-xl">
                    <div className="bg-black p-2 rounded-lg">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <button 
                      onClick={logout} 
                      className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} 
                  className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-medium text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {authMode === 'login' ? 'Welcome Back' : 'Get Started'}
                </h2>
                <button onClick={() => { setShowAuthModal(false); setError(''); }} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-4 flex items-center gap-2">
                <X size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <div className="space-y-4">
              {authMode === 'register' && (
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={authForm.name} 
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors" 
                />
              )}
              <input 
                type="email" 
                placeholder="Email Address" 
                value={authForm.email} 
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={authForm.password} 
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors" 
              />
              <button 
                onClick={handleAuth} 
                disabled={loading} 
                className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-gray-600">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button 
                onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(''); }} 
                className="text-black font-semibold hover:underline"
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Products View */}
      {view === 'products' && (
        <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-3xl p-12 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">Discover Amazing Products</h2>
              <p className="text-xl text-gray-600 mb-8">Shop the latest trends in fashion and accessories</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <Truck size={20} className="text-emerald-500" />
                  <span className="text-sm font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <Shield size={20} className="text-blue-500" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-10 space-y-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:border-black focus:outline-none transition-all shadow-sm" 
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-black text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
              <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={64} className="text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg mb-2">No products found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="relative overflow-hidden bg-gray-50">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-72 object-cover cursor-pointer transform group-hover:scale-105 transition-transform duration-500" 
                      onClick={() => { setSelectedProduct(product); setView('detail'); }} 
                    />
                    <button className="absolute top-3 right-3 bg-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-gray-100 shadow-lg">
                      <Heart size={18} className="text-gray-700" />
                    </button>
                    {product.stock < 10 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        Low Stock
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold">4.5</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">{product.category}</span>
                    </div>
                    <h3 
                      className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 cursor-pointer hover:text-gray-600 transition-colors min-h-[3rem]" 
                      onClick={() => { setSelectedProduct(product); setView('detail'); }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(product)} 
                        className="bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all font-medium text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Product Detail View */}
      {view === 'detail' && selectedProduct && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
          <button 
            onClick={() => setView('products')} 
            className="mb-8 text-gray-700 hover:text-black font-medium flex items-center gap-2 transition-all"
          >
            ← Back to Products
          </button>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2 gap-12 p-12">
              <div className="rounded-2xl overflow-hidden bg-gray-50">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-semibold px-4 py-2 bg-gray-100 text-gray-700 rounded-full w-fit mb-4">{selectedProduct.category}</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(128 reviews)</span>
                </div>
                <p className="text-5xl font-bold text-gray-900 mb-6">${parseFloat(selectedProduct.price).toFixed(2)}</p>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">{selectedProduct.description || 'Premium quality product crafted with attention to detail. Perfect for everyday use and built to last.'}</p>
                <div className="flex items-center gap-2 mb-8">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span className={`font-semibold ${selectedProduct.stock > 10 ? 'text-emerald-600' : 'text-orange-600'}`}>{selectedProduct.stock} available</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { handleAddToCart(selectedProduct); setView('cart'); }} 
                    className="flex-1 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all text-lg font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button className="bg-gray-100 text-gray-900 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all">
                    <Heart size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}


      {/* Cart View */}
      {view === 'cart' && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">Shopping Cart</h2>
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={64} className="text-purple-600" />
              </div>
              <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
              <button 
                onClick={() => setView('products')} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-semibold hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 hover:shadow-xl transition-shadow">
                    <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">${parseFloat(item.price).toFixed(2)}</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} 
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} 
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                        <button 
                          onClick={() => handleRemoveFromCart(item.id)} 
                          className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8 sticky top-24 border-2 border-purple-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t-2 border-purple-200 pt-4">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout} 
                    disabled={loading} 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-2xl transition-all text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 mb-3"
                  >
                    {loading ? 'Processing...' : 'Checkout'}
                  </button>
                  <button 
                    onClick={() => setView('products')} 
                    className="w-full bg-white text-purple-600 border-2 border-purple-200 px-6 py-4 rounded-xl hover:bg-purple-50 transition-all font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
      {/* Orders View */}
      {view === 'orders' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <button onClick={() => setView('products')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${parseFloat(order.total_amount).toFixed(2)}</p>
                      <span className={`text-sm px-2 py-1 rounded ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  {order.items && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold mb-2">Items:</p>
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {item.product_name} x{item.quantity} - ${parseFloat(item.price).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;