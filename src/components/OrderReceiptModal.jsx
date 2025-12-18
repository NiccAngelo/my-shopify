import { X, Download, CheckCircle, Package, Truck, CreditCard, MapPin } from 'lucide-react';

function OrderReceiptModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handleDownloadReceipt = () => {
    // Create a printable receipt
    const receiptContent = `
      ========================================
      MYSHOPIFY - ORDER RECEIPT
      ========================================
      
      Order #${order.orderId || order.id}
      Date: ${new Date().toLocaleDateString()}
      
      ----------------------------------------
      SHIPPING INFORMATION
      ----------------------------------------
      ${order.shippingDetails.fullName}
      ${order.shippingDetails.address}
      ${order.shippingDetails.city}, ${order.shippingDetails.zipCode}
      ${order.shippingDetails.country}
      
      Email: ${order.shippingDetails.email}
      Phone: ${order.shippingDetails.phone}
      
      ----------------------------------------
      PAYMENT INFORMATION
      ----------------------------------------
      Card ending in ${order.paymentDetails.cardNumber.slice(-4)}
      
      ----------------------------------------
      ORDER ITEMS
      ----------------------------------------
      ${order.items.map(item => 
        `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n      ')}
      
      ----------------------------------------
      Subtotal:        $${order.total.toFixed(2)}
      Tax (10%):       $${(order.total * 0.1).toFixed(2)}
      Shipping:        FREE
      ----------------------------------------
      TOTAL:           $${(order.total * 1.1).toFixed(2)}
      ----------------------------------------
      
      Thank you for shopping with MyShopify!
      ========================================
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${order.orderId || order.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                <p className="text-sm text-green-100">Order #{order.orderId || order.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-green-100">
            Thank you for your purchase! Your order has been received and is being processed.
          </p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]" id="receipt-content">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Order Total</p>
              <p className="text-4xl font-bold text-green-600 mb-2">
                ${(order.total * 1.1).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={20} className="text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
              <p className="font-semibold text-gray-900">{order.shippingDetails.fullName}</p>
              <p className="text-gray-600">{order.shippingDetails.address}</p>
              <p className="text-gray-600">
                {order.shippingDetails.city}, {order.shippingDetails.zipCode}
              </p>
              <p className="text-gray-600">{order.shippingDetails.country}</p>
              <div className="pt-2 mt-2 border-t border-gray-200">
                <p className="text-gray-600">📧 {order.shippingDetails.email}</p>
                <p className="text-gray-600">📱 {order.shippingDetails.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={20} className="text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  CARD
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    •••• •••• •••• {order.paymentDetails.cardNumber.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-500">{order.paymentDetails.cardName}</p>
                </div>
              </div>
              <div className="text-green-600 font-semibold text-sm">
                ✓ Paid
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Package size={20} className="text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (10%)</span>
              <span className="font-medium">${(order.total * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-green-600">${(order.total * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Estimate */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Truck className="text-blue-600 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-blue-900 text-sm">Estimated Delivery</p>
              <p className="text-sm text-blue-700 mt-1">
                Your order will arrive in 3-5 business days
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download Receipt
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderReceiptModal;