import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, ShoppingCart } from 'lucide-react';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    error: <AlertCircle size={20} className="text-red-600" />,
    info: <Info size={20} className="text-blue-600" />,
    order: <ShoppingCart size={20} className="text-green-600" />
  };

  const colors = {
    success: 'from-green-50 to-emerald-50 border-green-200',
    error: 'from-red-50 to-rose-50 border-red-200',
    info: 'from-blue-50 to-indigo-50 border-blue-200',
    order: 'from-green-50 to-emerald-50 border-green-200'
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`bg-gradient-to-r ${colors[type]} border rounded-xl shadow-lg p-4 flex items-center gap-3 min-w-[300px]`}>
        {icons[type]}
        <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </>
  );
}

export default Toast;