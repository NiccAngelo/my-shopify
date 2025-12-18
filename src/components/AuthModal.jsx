 import { X } from 'lucide-react';
import logo from '../assets/quickcart-logo.png';

export default function AuthModal({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  handleAuth,
  loading,
  error,
  setShowAuth
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuth();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden relative border border-white/20 max-h-[95vh] overflow-y-auto">
        
        <button
          onClick={() => setShowAuth(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white/80 rounded-full p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          
          {/* Left Panel */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 sm:p-12 flex flex-col items-center justify-center text-white relative overflow-hidden min-h-[250px] md:min-h-[500px]">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10 text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <img
                    src={logo}
                    alt="MyShop Logo"
                    className="h-20 w-auto object-contain"
                  />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                {authMode === 'login' ? 'Welcome Back' : 'Join Us Today'}
              </h2>

              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                {authMode === 'login'
                  ? 'Sign in to access your account and continue shopping'
                  : 'Create your account and start your shopping journey with us'}
              </p>

              <div className="flex gap-2 justify-center mt-6 sm:mt-8">
                <div className={`w-2 h-2 rounded-full transition-all ${authMode === 'login' ? 'bg-white w-8' : 'bg-white/50'}`} />
                <div className={`w-2 h-2 rounded-full transition-all ${authMode === 'register' ? 'bg-white w-8' : 'bg-white/50'}`} />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>

              <p className="text-gray-500 text-xs sm:text-sm mb-6">
                {authMode === 'login'
                  ? 'Enter your credentials to access your account'
                  : 'Fill in your details to get started'}
              </p>

              {/* ✅ ADMIN LOGIN DISPLAY */}
              {authMode === 'login' && (
                <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs sm:text-sm text-emerald-700">
                  <p className="font-semibold mb-1">Admin Login</p>
                  <p>
                    <span className="font-medium">Email:</span> admin@myshopify.com
                  </p>
                  <p>
                    <span className="font-medium">Password:</span> Admin123!
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 sm:space-y-5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Juan Dela Cruz"
                      value={authForm.name}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., you@example.com"
                    value={authForm.email}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={authForm.password}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {authMode === 'login' && (
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label className="flex items-center text-gray-600">
                      <input type="checkbox" className="mr-2 rounded" />
                      Remember me
                    </label>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  onClick={handleAuth}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-lg font-semibold shadow-lg disabled:opacity-50"
                >
                  {loading
                    ? 'Processing...'
                    : authMode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-xs sm:text-sm">
                  {authMode === 'login'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <button
                    onClick={() =>
                      setAuthMode(authMode === 'login' ? 'register' : 'login')
                    }
                    className="text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    {authMode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
