import { useState } from 'react';
import { X, CreditCard, Lock, ShoppingBag, CheckCircle } from 'lucide-react';

function CheckoutModal({ isOpen, onClose, cartItems, totalAmount, onOrderComplete }) {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = value.slice(0, 19); // 16 digits + 3 spaces
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    }
    
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingDetails.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!shippingDetails.email.trim()) newErrors.email = 'Email is required';
    if (!shippingDetails.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingDetails.address.trim()) newErrors.address = 'Address is required';
    if (!shippingDetails.city.trim()) newErrors.city = 'City is required';
    if (!shippingDetails.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shippingDetails.country.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    const cardNum = paymentDetails.cardNumber.replace(/\s/g, '');
    
    if (!paymentDetails.cardNumber || cardNum.length !== 16) {
      newErrors.cardNumber = 'Valid card number required';
    }
    if (!paymentDetails.cardName.trim()) newErrors.cardName = 'Cardholder name required';
    if (!paymentDetails.expiryDate || paymentDetails.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Valid expiry date required';
    }
    if (!paymentDetails.cvv || paymentDetails.cvv.length !== 3) {
      newErrors.cvv = 'Valid CVV required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setLoading(true);
    
    // Mock payment processing
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      
      // Call the order complete callback after another delay
      setTimeout(() => {
        onOrderComplete({
          shippingDetails,
          paymentDetails: {
            ...paymentDetails,
            cardNumber: `****${paymentDetails.cardNumber.slice(-4)}`
          },
          items: cartItems,
          total: totalAmount
        });
      }, 2000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag size={28} />
            <div>
              <h2 className="text-2xl font-bold">Checkout</h2>
              <p className="text-sm text-green-100">
                {step === 1 && 'Shipping Information'}
                {step === 2 && 'Payment Details'}
                {step === 3 && 'Order Confirmed'}
              </p>
            </div>
          </div>
          {step !== 3 && (
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Progress Steps */}
        {step !== 3 && (
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className={`h-px w-12 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Shipping Details */}
          {step === 1 && (
            <form onSubmit={handleContinueToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingDetails.fullName}
                    onChange={handleShippingChange}
                    className={`w-full px-4 py-2.5 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="Juan Dela Cruz"
                  />
                  {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingDetails.email}
                    onChange={handleShippingChange}
                    className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="juan@example.com"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleShippingChange}
                    className={`w-full px-4 py-2.5 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleShippingChange}
                    className={`w-full px-4 py-2.5 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleShippingChange}
                    className={`w-full px-4 py-2.5 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="New York"
                  />
                  {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingDetails.zipCode}
                    onChange={handleShippingChange}
                    className={`w-full px-4 py-2.5 border ${errors.zipCode ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="10001"
                  />
                  {errors.zipCode && <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingDetails.country}
                    onChange={handleShippingChange}
                    className={`w-full px-4 py-2.5 border ${errors.country ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="United States"
                  />
                  {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {/* Step 2: Payment Details */}
          {step === 2 && (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Lock className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                  <p className="text-xs text-blue-700 mt-1">Your payment information is encrypted and secure</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentChange}
                    className={`w-full pl-11 pr-4 py-2.5 border ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                {errors.cardNumber && <p className="text-red-600 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentDetails.cardName}
                  onChange={handlePaymentChange}
                  className={`w-full px-4 py-2.5 border ${errors.cardName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                  placeholder="Juan Dela Cruz"
                />
                {errors.cardName && <p className="text-red-600 text-xs mt-1">{errors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentDetails.expiryDate}
                    onChange={handlePaymentChange}
                    className={`w-full px-4 py-2.5 border ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && <p className="text-red-600 text-xs mt-1">{errors.expiryDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentDetails.cvv}
                    onChange={handlePaymentChange}
                    className={`w-full px-4 py-2.5 border ${errors.cvv ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                    placeholder="123"
                  />
                  {errors.cvv && <p className="text-red-600 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} x {item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}


{/* Step 3: Success - Redirect to Receipt */}
{step === 3 && (
  <div className="text-center py-8">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
      <CheckCircle size={48} className="text-green-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing...</h3>
    <p className="text-gray-600 mb-6">Please wait while we confirm your order</p>
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;