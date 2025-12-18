import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ProductsView from './components/ProductsView';
import DetailView from './components/DetailView';
import CartView from './components/CartView';
import OrdersView from './components/OrdersView';
import AdminDashboard from './components/AdminDashboard';
import { getProducts, getCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeFromCartAPI, createOrder, getOrders } from './services/api';
import { Notification } from './components/Notification';

function MainApp() {
  const { user, logout, login, register } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  const categories = ['All', 'Clothing', 'Shoes', 'Accessories'];
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts({ category: category !== 'All' ? category : undefined, search });
      setProducts(res.data);
    } catch (err) { console.error(err); }
  }, [category, search]);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try { const res = await getCart(); setCart(res.data); } 
    catch (err) { console.error(err); }
  }, [user]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try { const res = await getOrders(); setOrders(res.data); } 
    catch (err) { console.error(err); }
  }, [user]);

  // Initial fetch
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { if (user) fetchCart(); }, [user, fetchCart]);

  // Fetch orders when view changes to 'orders'
  useEffect(() => {
    if (view === 'orders' && user) {
      fetchOrders();
    }
  }, [view, user, fetchOrders]);

  const showNotif = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = async (product) => {
    if (!user) { setShowAuth(true); return; }
    try { await addToCartAPI({ product_id: product.id, quantity: 1 }); await fetchCart(); showNotif('Added to cart'); } 
    catch (err) { showNotif(err.response?.data?.error || 'Failed to add', 'error'); }
  };

  const handleUpdateQuantity = async (id, qty) => {
    if (qty <= 0) { await handleRemove(id); return; }
    try { await updateCartItem(id, { quantity: qty }); await fetchCart(); } 
    catch (err) { console.error(err); }
  };

  const handleRemove = async (id) => {
    try { await removeFromCartAPI(id); await fetchCart(); showNotif('Removed from cart'); } 
    catch (err) { console.error(err); }
  };

  const handleCheckout = async () => {
    if (!user) { setShowAuth(true); return; }
    try {
      setLoading(true);
      const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price }));
      await createOrder({ items, total_amount: cartTotal });
      await fetchCart();
      showNotif('Order placed successfully!');
      setView('orders');
      await fetchOrders();
    } catch (err) { showNotif(err.response?.data?.error || 'Failed to place order', 'error'); }
    finally { setLoading(false); }
  };

  const handleAuth = async () => {
    setError(''); setLoading(true);
    try {
      const result = authMode === 'login'
        ? await login(authForm.email, authForm.password)
        : await register(authForm.name, authForm.email, authForm.password);
      if (result.success) {
        setShowAuth(false); setAuthForm({ name:'',email:'',password:'' }); await fetchCart();
        showNotif(`Welcome ${authMode === 'login'?'back':''}!`);
      } else setError(result.error);
    } finally { setLoading(false); }
  };

  if (user?.role === 'admin') return <AdminDashboard user={user} onLogout={logout} />;

  return (
    <div className="w-screen h-screen overflow-y-auto flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50 relative">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      <Header user={user} cartCount={cartCount} setView={setView} logout={logout} setShowAuth={setShowAuth} setAuthMode={setAuthMode} />
      {showAuth && <AuthModal authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} handleAuth={handleAuth} loading={loading} error={error} setShowAuth={setShowAuth} />}
      {view === 'products' && <ProductsView products={products} categories={categories} category={category} setCategory={setCategory} search={search} setSearch={setSearch} handleAddToCart={handleAddToCart} setSelectedProduct={setSelectedProduct} setView={setView} />}
      {view === 'detail' && selectedProduct && <DetailView product={selectedProduct} handleAddToCart={handleAddToCart} setView={setView} />}
      {view === 'cart' && <CartView cart={cart} handleUpdateQuantity={handleUpdateQuantity} handleRemove={handleRemove} handleCheckout={handleCheckout} cartTotal={cartTotal} loading={loading} setView={setView} />}
      {view === 'orders' && <OrdersView orders={orders} setView={setView} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
