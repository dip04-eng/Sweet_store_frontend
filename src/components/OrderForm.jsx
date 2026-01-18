import { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, MessageCircle, Calendar } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const OrderForm = ({ cart, totalAmount, onClose, onSuccess }) => {
  // Get server date instead of client date
  const getTodayDate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SERVER_DATE}`);
      const data = await response.json();
      return data.date;
    } catch (error) {
      console.error('Error fetching server date:', error);
      return new Date().toISOString().split('T')[0];
    }
  };
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    preference: '',
    deliveryDate: ''
  });
  const [serverDate, setServerDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch server date on component mount
  useEffect(() => {
    const fetchDate = async () => {
      const date = await getTodayDate();
      setServerDate(date);
      // Auto-fill delivery date with server date
      setFormData(prev => ({
        ...prev,
        deliveryDate: date
      }));
    };
    fetchDate();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Restrict mobile number to 10 digits and numbers only
    if (name === 'mobile') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const orderData = {
      customerName: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      preference: formData.preference,
      orderDate: serverDate, // Use server date instead of client date
      deliveryDate: formData.deliveryDate,
      items: cart.map(item => ({
        sweetId: item.name,  // Use name as ID (backend will find by name)
        sweetName: item.name,
        quantity: item.quantity || 1,
        price: item.rate,
        unit: item.unit || 'piece'  // Include unit field
      })),
      total: totalAmount,
      status: 'pending'
    };

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PLACE_ORDER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to place order');
      }

      console.log('Order placed:', result);
      onSuccess();
    } catch (err) {
      setError(err.message);
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Place Your Order</h2>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-red-100 rounded-full transition-colors hover:scale-110 duration-200"
              title="Close form"
            >
              <X className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 hover:text-red-700 font-bold" />
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Order Summary</h3>
            <div className="mb-2 text-xs sm:text-sm text-gray-700 flex items-center">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
              <span className="font-medium">Order Date: </span>
              <span className="ml-1">{serverDate ? new Date(serverDate + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Loading...'}</span>
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                  <span className="truncate mr-2">{item.name} <span className="text-purple-600 font-semibold">×{Number(item.quantity || 1).toFixed(2).replace(/\.?0+$/, '')}</span></span>
                  <span className="flex-shrink-0">₹{(item.rate * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold text-sm sm:text-base">
              <span>Total</span>
              <span className="text-purple-600">₹{totalAmount}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 text-gray-900 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                maxLength="10"
                pattern="[0-9]{10}"
                className="w-full px-3 text-gray-900 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                Delivery Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 sm:px-4 text-gray-900 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter your complete delivery address"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                Delivery Date *
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
                min={serverDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 text-gray-900 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                Special Preferences (Optional)
              </label>
              <textarea
                name="preference"
                value={formData.preference}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 sm:px-4 text-gray-900 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Any special requests or preferences..."
              ></textarea>
            </div>

            {error && (
              <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform text-sm sm:text-base ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-105 shadow-lg'
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Placing Order...
                </div>
              ) : (
                `Place Order - ₹${totalAmount}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;