import { Download, X, CheckCircle } from 'lucide-react';

function BulkActionsBar({ 
  selectedCount, 
  onBulkStatusUpdate, 
  onBulkExport, 
  onClearSelection 
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95%] sm:w-auto max-w-4xl animate-slideUp">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl shadow-green-500/40 border border-green-400/50 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 sm:px-6 py-4">
          {/* Selection Count Badge */}
          <div className="flex items-center gap-2 pb-3 sm:pb-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-green-400/50">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <CheckCircle size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm whitespace-nowrap">
              {selectedCount} selected
            </span>
          </div>

          {/* Actions Row */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 flex-1">
            {/* Update Status Dropdown */}
            <div className="relative group flex-1 sm:flex-initial">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkStatusUpdate(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white hover:bg-green-50 text-gray-900 font-semibold text-sm border-2 border-transparent hover:border-green-200 transition-all cursor-pointer appearance-none shadow-lg hover:shadow-xl hover:scale-105 duration-200 sm:min-w-[140px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23059669'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="">Update Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={onBulkExport}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white hover:bg-green-50 text-gray-900 font-semibold text-sm border-2 border-transparent hover:border-green-200 transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-200 flex-1 sm:flex-initial whitespace-nowrap"
            >
              <Download size={16} className="text-green-600 flex-shrink-0" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>

            {/* Clear Selection Button */}
            <button
              onClick={onClearSelection}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-green-700 backdrop-blur text-green-600 hover:text-white transition-all hover:scale-110 duration-200 group flex-shrink-0"
              title="Clear selection"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkActionsBar;