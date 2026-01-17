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
      setCart([...cart, { ...sweet, quantity: 1, weightUnit: sweet.unit === 'Kg' ? 'Kg' : undefined }]);
    }
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
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h3>
          <p className="text-gray-600">The order has been created and customer will be notified.</p>
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

            {/* Cart Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Cart Summary</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items added yet</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">₹{item.rate} per {item.unit || 'piece'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min={item.unit === 'Kg' ? (item.weightUnit === 'grams' ? '1' : '0.01') : '1'}
                          step={item.unit === 'Kg' ? (item.weightUnit === 'grams' ? '1' : '0.01') : '1'}
                          value={item.quantity === '' ? '' : item.quantity}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const updatedCart = [...cart];

                            // Allow empty or any input during editing
                            if (inputValue === '') {
                              updatedCart[index].quantity = '';
                              setCart(updatedCart);
                              return;
                            }

                            const value = parseFloat(inputValue);
                            if (!isNaN(value)) {
                              updatedCart[index].quantity = value;
                              setCart(updatedCart);
                            }
                          }}
                          onBlur={(e) => {
                            // If empty or invalid on blur, reset to minimum value
                            const value = parseFloat(e.target.value);
                            if (e.target.value === '' || isNaN(value) || value <= 0) {
                              const isInGrams = item.weightUnit === 'grams';
                              const minValue = item.unit === 'Kg' ? (isInGrams ? 1 : 0.01) : 1;
                              const updatedCart = [...cart];
                              updatedCart[index].quantity = minValue;
                              setCart(updatedCart);
                            }
                          }}
                          className="w-16 text-center font-semibold text-sm border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        {item.unit === 'Kg' && (
                          <select
                            value={item.weightUnit || 'Kg'}
                            onChange={(e) => updateWeightUnit(index, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="Kg">Kg</option>
                            <option value="grams">grams</option>
                          </select>
                        )}
                        {item.unit !== 'Kg' && (
                          <span className="text-xs text-gray-600 px-1">{item.unit || 'pcs'}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-purple-600">₹{getTotalAmount()}</span>
                    </div>
                  </div>
                </div>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Items..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
    </div>
  );
};

export default AddOrder;
