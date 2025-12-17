import { Check, X } from 'lucide-react';

export const Notification = ({ message, type = 'success', onClose }) => (
  <div className={`fixed top-4 right-4 z-50 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-slide`}>
    {type === 'success' ? <Check size={18} /> : <X size={18} />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2"><X size={16} /></button>
  </div>
);
