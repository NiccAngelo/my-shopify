import { useState, useEffect, useContext, createContext } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Search, User, LogOut, Package, X, Check } from 'lucide-react';
import { getProducts, login as loginAPI, register as registerAPI, getProfile, addToCart as addToCartAPI, getCart, removeFromCart as removeFromCartAPI, updateCartItem, createOrder, getOrders } from './services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) loadUser();
    else setLoading(false);
  }, []);

  const loadUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await loginAPI({ email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await registerAPI({ name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};

const Notification = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-slide`}>
    {type === 'success' ? <Check size={18} /> : <X size={18} />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2"><X size={16} /></button>
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
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProducts();
    if (user) fetchCart();
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const showNotif = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ 
        category: category !== 'All' ? category : undefined, 
        search 
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    try {
      await addToCartAPI({ product_id: product.id, quantity: 1 });
      await fetchCart();
      showNotif('Added to cart');
    } catch (error) {
      showNotif(error.response?.data?.error || 'Failed to add', 'error');
    }
  };

  const handleUpdateQuantity = async (id, qty) => {
    if (qty <= 0) {
      await handleRemove(id);
      return;
    }
    try {
      await updateCartItem(id, { quantity: qty });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCartAPI(id);
      await fetchCart();
      showNotif('Removed from cart');
    } catch (error) {
      console.error('Failed to remove:', error);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    try {
      setLoading(true);
      const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price }));
      const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      await createOrder({ items, total_amount: total });
      await fetchCart();
      showNotif('Order placed successfully!');
      setView('orders');
      await fetchOrders();
    } catch (error) {
      showNotif(error.response?.data?.error || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
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
        setShowAuth(false);
        setAuthForm({ name: '', email: '', password: '' });
        await fetchCart();
        showNotif(`Welcome ${authMode === 'login' ? 'back' : ''}!`);
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Clothing', 'Shoes', 'Accessories'];
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="w-screen h-screen overflow-y-auto flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <style>{`
        @keyframes slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide { animation: slide 0.3s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <button onClick={() => setView('products')} className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
                  <ShoppingCart size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">MyShop</span>
              </button>
              <nav className="hidden md:flex gap-6">
                <button onClick={() => setView('products')} className="text-sm font-medium text-gray-700 hover:text-green-600 transition">Products</button>
                {user && <button onClick={() => { setView('orders'); fetchOrders(); }} className="text-sm font-medium text-gray-700 hover:text-green-600 transition">Orders</button>}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <button onClick={() => setView('cart')} className="relative p-2 text-gray-700 hover:bg-green-50 rounded-lg transition">
                    <ShoppingCart size={18} />
                    {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>}
                  </button>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                    <User size={14} className="text-green-700" />
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <button onClick={logout} className="text-gray-600 hover:text-red-600"><LogOut size={14} /></button>
                  </div>
                </>
              ) : (
                <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1.5 rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium transition">Sign In</button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-green-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
              <button onClick={() => { setShowAuth(false); setError(''); }} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            <div className="space-y-3">
              {authMode === 'register' && <input type="text" placeholder="Name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className="w-full px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />}
              <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
              <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
              <button onClick={handleAuth} disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium disabled:opacity-50 transition">{loading ? 'Loading...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}</button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              {authMode === 'login' ? "Don't have an account? " : 'Have an account? '}
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(''); }} className="text-green-600 font-semibold hover:text-green-700">{authMode === 'login' ? 'Sign Up' : 'Sign In'}</button>
            </p>
          </div>
        </div>
      )}

      {/* Products View */}
      {view === 'products' && (
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
      )}

      {/* Detail View */}
      {view === 'detail' && selectedProduct && (
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
      )}

      {/* Cart View */}
      {view === 'cart' && (
        <main className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Shopping Cart</h2>
          {cart.length === 0 ? (
            <div className="bg-white/80 backdrop-blur rounded-2xl p-10 text-center border border-green-100 max-w-2xl mx-auto">
              <ShoppingCart size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4 text-sm">Your cart is empty</p>
              <button onClick={() => setView('products')} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition text-sm">Browse Products</button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              <div className="lg:col-span-2 space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 bg-white/80 backdrop-blur rounded-xl p-3 border border-green-100">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                      <p className="text-green-600 font-bold text-sm">${parseFloat(item.price).toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border border-green-200 rounded-lg flex items-center justify-center hover:bg-green-50 transition"><Minus size={14} /></button>
                        <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 border border-green-200 rounded-lg flex items-center justify-center hover:bg-green-50 transition"><Plus size={14} /></button>
                        <button onClick={() => handleRemove(item.id)} className="ml-auto text-red-500 hover:text-red-600 transition"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="text-right font-bold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-green-100 sticky top-4">
                  <h3 className="text-lg font-bold mb-3 text-gray-900">Order Summary</h3>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">${cartTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-green-600 font-medium">Free</span></div>
                    <div className="border-t border-green-100 pt-2 flex justify-between font-bold"><span>Total</span><span className="text-green-600">${cartTotal.toFixed(2)}</span></div>
                  </div>
                  <button onClick={handleCheckout} disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium disabled:opacity-50 transition mb-2 text-sm">{loading ? 'Processing...' : 'Checkout'}</button>
                  <button onClick={() => setView('products')} className="w-full border border-green-200 py-2.5 rounded-lg hover:bg-green-50 font-medium text-gray-700 transition text-sm">Continue Shopping</button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Orders View */}
      {view === 'orders' && (
        <main className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">My Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-white/80 backdrop-blur rounded-2xl p-10 text-center border border-green-100 max-w-2xl mx-auto">
              <Package size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4 text-sm">No orders yet</p>
              <button onClick={() => setView('products')} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition text-sm">Shop Now</button>
            </div>
          ) : (
            <div className="space-y-3 max-w-4xl mx-auto">
              {orders.map(order => (
                <div key={order.id} className="bg-white/80 backdrop-blur rounded-xl p-5 border border-green-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{order.status}</span>
                    </div>
                  </div>
                  {order.items && (
                    <div className="border-t border-green-100 pt-3 space-y-1 text-xs text-gray-600">
                      {order.items.map((item, idx) => (
                        <p key={idx}>{item.product_name} × {item.quantity} — ${parseFloat(item.price).toFixed(2)}</p>
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