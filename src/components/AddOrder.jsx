import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Calendar, ShoppingCart, Plus, Minus, Trash2, Save, RefreshCw, Search, UserCog } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const AddOrder = () => {
  const [sweets, setSweets] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverDate, setServerDate] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  const [formData, setFormData] = useState({
    adminName: '',
    customerName: '',
    mobile: '',
    address: '',
    preference: '',
    deliveryDate: ''
  });

  // List of admins
  const adminList = [
    'Nawed Ashraf',
    'Intekhab Ashraf',
    'Intezar Ashraf',
    'Nehal Ashraf',
    'Nadeem Ashraf'
  ];

  useEffect(() => {
    fetchSweets();
    fetchServerDate();
  }, []);

  const fetchServerDate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SERVER_DATE}`);
      const data = await response.json();
      setServerDate(data.date);

      // Set delivery date to tomorrow
      const today = new Date(data.date);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      setFormData(prev => ({ ...prev, deliveryDate: tomorrowDate }));
    } catch (error) {
      console.error('Error fetching server date:', error);
      const today = new Date();
      setServerDate(today.toISOString().split('T')[0]);

      // Set delivery date to tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      setFormData(prev => ({ ...prev, deliveryDate: tomorrowDate }));
    }
  };

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SWEETS}`);
      if (!response.ok) throw new Error('Failed to fetch sweets');
      const data = await response.json();
      setSweets(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (sweet) => {
    const existingIndex = cart.findIndex(item => item._id === sweet._id);
    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...sweet, quantity: 1, weightUnit: (sweet.unit === 'Kg' || sweet.unit === 'kg') ? 'Kg' : undefined }]);
    }

    // Show toast message
    setToast({ show: true, message: `${sweet.name} added to cart` });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const updateWeightUnit = (index, newUnit) => {
    const updatedCart = [...cart];
    const oldUnit = updatedCart[index].weightUnit || 'Kg';
    updatedCart[index].weightUnit = newUnit;

    // Convert quantity when switching units
    if (oldUnit === 'Kg' && newUnit === 'grams') {
      updatedCart[index].quantity = updatedCart[index].quantity * 1000;
    } else if (oldUnit === 'grams' && newUnit === 'Kg') {
      updatedCart[index].quantity = updatedCart[index].quantity / 1000;
    }

    setCart(updatedCart);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const qty = item.quantity === '' ? 0 : item.quantity;
      const qtyInKg = (item.weightUnit === 'grams') ? qty / 1000 : qty;
      return total + (item.rate * qtyInKg);
    }, 0);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Restrict mobile number to 10 digits only
    if (name === 'mobile') {
      // Only allow digits and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.adminName) {
      alert('Please select which admin is placing this order');
      return;
    }

    if (cart.length === 0) {
      alert('Please add items to cart');
      return;
    }

    setSubmitting(true);
    setError(null);

    const orderData = {
      customerName: formData.customerName,
      mobile: formData.mobile,
      address: formData.address,
      preference: `[${formData.adminName}] ${formData.preference || 'Order placed by admin'}`,
      orderDate: serverDate,
      deliveryDate: formData.deliveryDate,
      items: cart.map(item => ({
        sweetId: item.name,
        sweetName: item.name,
        quantity: item.quantity,
        price: item.rate,
        unit: item.unit || 'piece'
      })),
      total: getTotalAmount(),
      status: 'pending'
    };

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PLACE_ORDER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order');
      }

      setSuccess(true);
      setCart([]);
      setFormData({
        adminName: '',
        customerName: '',
        mobile: '',
        address: '',
        preference: '',
        deliveryDate: serverDate
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSweets = sweets.filter(sweet =>
    sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sweet.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[60vh] px-4"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12 text-center w-full max-w-md">
          <div className="text-4xl sm:text-6xl mb-4">✓</div>
          <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h3>
          <p className="text-sm sm:text-base text-gray-600">The order has been created and customer will be notified.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Add Order Manually</h2>
            <p className="text-sm sm:text-base text-purple-100">Place orders on behalf of customers</p>
          </div>
          <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 opacity-50" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Customer Details */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
                Customer Details
              </h3>

              {/* Admin Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <UserCog className="h-4 w-4 inline mr-2" />
                  Placed By (Admin) *
                </label>
                <select
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Admin</option>
                  {adminList.map((admin, index) => (
                    <option key={index} value={admin}>{admin}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter complete delivery address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Delivery Date *
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleFormChange}
                  required
                  min={serverDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="preference"
                  value={formData.preference}
                  onChange={handleFormChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any special requests or notes"
                />
              </div>
            </div>

            {/* Cart Summary - Mobile Responsive */}
            <div className="bg-white rounded-lg shadow">
              {/* Cart Header */}
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-medium text-gray-800">
                  Cart Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </h3>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No items added yet</p>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="divide-y divide-gray-100">
                    {cart.map((item, index) => (
                      <div key={index} className="p-3 sm:p-4">
                        {/* Top Row: Image + Details + Price */}
                        <div className="flex gap-3">
                          {/* Product Image */}
                          <img
                            src={item.image || '/placeholder.png'}
                            alt={item.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                          />

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              ₹{item.rate}/{item.unit === 'Kg' || item.unit === 'kg' ? 'Kg' : 'pc'}
                            </p>
                            {/* Price */}
                            <p className="text-base font-semibold text-gray-900 mt-1">
                              ₹{(() => {
                                const qty = item.quantity === '' ? 0 : item.quantity;
                                const qtyInKg = (item.weightUnit === 'grams') ? qty / 1000 : qty;
                                return (item.rate * qtyInKg).toFixed(0);
                              })()}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Row: Quantity Controls + Remove */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          {(item.unit === 'Kg' || item.unit === 'kg') ? (
                            /* Weight Input for Kg items */
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={item.quantity === '' ? '' : item.quantity}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const updatedCart = [...cart];

                                  if (inputValue === '') {
                                    updatedCart[index].quantity = '';
                                    setCart(updatedCart);
                                    return;
                                  }

                                  if (!/^\d*\.?\d{0,3}$/.test(inputValue)) {
                                    return;
                                  }
                                  updatedCart[index].quantity = inputValue;
                                  setCart(updatedCart);
                                }}
                                onBlur={(e) => {
                                  const inputValue = e.target.value;
                                  const value = parseFloat(inputValue);
                                  const isInGrams = item.weightUnit === 'grams';

                                  if (inputValue === '' || isNaN(value) || value <= 0) {
                                    const minValue = isInGrams ? 1 : 0.01;
                                    const updatedCart = [...cart];
                                    updatedCart[index].quantity = minValue;
                                    setCart(updatedCart);
                                  } else {
                                    const updatedCart = [...cart];
                                    updatedCart[index].quantity = Math.round(value * 1000) / 1000;
                                    setCart(updatedCart);
                                  }
                                }}
                                className="w-16 text-center font-medium text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-purple-500"
                              />
                              <select
                                value={item.weightUnit || 'Kg'}
                                onChange={(e) => updateWeightUnit(index, e.target.value)}
                                className="px-2 py-1.5 bg-white text-gray-700 font-medium text-sm border border-gray-300 rounded focus:outline-none cursor-pointer"
                              >
                                <option value="Kg">Kg</option>
                                <option value="grams">gm</option>
                              </select>
                            </div>
                          ) : (
                            /* Quantity Buttons for Piece items */
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                                disabled={(item.quantity || 1) <= 1}
                                className={`w-7 h-7 flex items-center justify-center rounded-full border ${(item.quantity || 1) <= 1
                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                  }`}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-gray-800">
                                {item.quantity || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <span className="text-xs text-gray-500 ml-1">pcs</span>
                            </div>
                          )}

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(index)}
                            className="text-red-500 hover:text-red-600 text-xs font-medium uppercase tracking-wide transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Amount */}
                  <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="text-lg sm:text-xl font-semibold text-gray-900">₹{getTotalAmount().toFixed(0)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Sweet Selection */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Add Items</h3>
                <button
                  type="button"
                  onClick={fetchSweets}
                  disabled={loading}
                  className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Items..."
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Sweets List */}
              <div className="max-h-[600px] overflow-y-auto space-y-2">
                {loading ? (
                  <p className="text-center py-4 text-gray-500">Loading sweets...</p>
                ) : filteredSweets.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No sweets found</p>
                ) : (
                  filteredSweets.map((sweet) => (
                    <motion.div
                      key={sweet._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={sweet.image || '/placeholder.png'}
                          alt={sweet.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{sweet.name}</p>
                          <p className="text-xs text-gray-500">{sweet.category}</p>
                          <p className="text-sm font-bold text-purple-600">₹{sweet.rate}/{sweet.unit}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(sweet)}
                        className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting || cart.length === 0}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save className="h-5 w-5" />
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddOrder;
