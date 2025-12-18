import { Trash2, Check, Download } from 'lucide-react';

function BulkActionsBar({ selectedCount, onBulkStatusUpdate, onBulkExport, onClearSelection }) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-slideUp">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 border border-green-500">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 rounded-full px-3 py-1">
            <span className="font-bold">{selectedCount}</span>
          </div>
          <span className="font-medium">selected</span>
        </div>
        
        <div className="h-6 w-px bg-white/30"></div>
        
        <select
          onChange={(e) => {
            if (e.target.value) {
              onBulkStatusUpdate(e.target.value);
              e.target.value = '';
            }
          }}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white cursor-pointer hover:bg-white/20 transition outline-none text-sm font-medium"
        >
          <option value="">Update Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <button
          onClick={onBulkExport}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2 border border-white/20 text-sm font-medium"
        >
          <Download size={16} />
          Export CSV
        </button>
        
        <button
          onClick={onClearSelection}
          className="px-4 py-2 bg-white/10 hover:bg-red-500/50 rounded-lg transition flex items-center gap-2 border border-white/20 text-sm font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default BulkActionsBar;