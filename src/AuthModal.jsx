import { X } from 'lucide-react';

export default function AuthModal({ authMode, setAuthMode, authForm, setAuthForm, handleAuth, loading, error, setShowAuth }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-green-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
            {authMode === 'login' && (
              <p className="text-sm text-gray-500 mt-1">
                For admin access: <span className="font-semibold">admin@myshopify.com</span> / <span className="font-semibold">Admin123!</span>
              </p>
            )}
          </div>
          <button onClick={() => { setShowAuth(false); }} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="space-y-3">
          {authMode === 'register' && (
            <input 
              type="text" 
              placeholder="Name" 
              value={authForm.name} 
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} 
              className="w-full px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={authForm.email} 
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} 
            className="w-full px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={authForm.password} 
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} 
            className="w-full px-4 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" 
          />
          <button 
            onClick={handleAuth} 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium disabled:opacity-50 transition"
          >
            {loading ? 'Loading...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          {authMode === 'login' ? "Don't have an account? " : 'Have an account? '}
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-green-600 font-semibold hover:text-green-700">
            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
