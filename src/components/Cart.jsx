import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, ShoppingBag, ShoppingCart, Plus, Minus } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import OrderForm from './OrderForm';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [weightInputs, setWeightInputs] = useState({});

  useEffect(() => {
    // Scroll to top when cart page loads
    window.scrollTo(0, 0);

    const savedCart = sessionStorage.getItem('sweetCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Round all quantities to 3 decimal places when loading from storage
      const cleanedCart = parsedCart.map(item => ({
        ...item,
        quantity: item.quantity ? Math.round(item.quantity * 1000) / 1000 : item.quantity
      }));
      setCart(cleanedCart);
      // Update sessionStorage with cleaned data
      sessionStorage.setItem('sweetCart', JSON.stringify(cleanedCart));
    }
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    sessionStorage.setItem('sweetCart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) return;
    const updatedCart = [...cart];
    // Round to 3 decimal places to prevent excessive precision
    updatedCart[index].quantity = Math.round(newQuantity * 1000) / 1000;
    updateCart(updatedCart);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const itemQuantity = item.quantity ?? 0;
      return total + (Number(item.rate) * itemQuantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.length;
  };

  const handlePlaceOrderClick = () => {
    setShowOrderForm(true);
  };

  const handleOrderSuccess = () => {
    setShowOrderForm(false);
    setOrderPlaced(true);
    setCart([]);
    sessionStorage.removeItem('sweetCart');

    setTimeout(() => {
      setOrderPlaced(false);
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We'll prepare your delicious sweets with care!
          </p>
          <Link
            to="/"
            className="inline-flex items-center bg-[#2874f0] text-white px-8 py-3 rounded-sm font-medium shadow hover:bg-[#1a5dc9] transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar cart={cart} />

      <div className="flex-1 pt-20 sm:pt-24 pb-8 px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center text-[#2874f0] hover:underline text-sm mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Store
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-sm shadow p-8 sm:p-16 text-center">
              <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-8">
                Add some delicious sweets to get started!
              </p>
              <Link
                to="/#sweets-collection"
                className="inline-flex items-center bg-[#2874f0] text-white px-8 py-3 rounded-sm font-medium shadow hover:bg-[#1a5dc9] transition-colors"
              >
                Browse Sweets
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items Container */}
              <div className="bg-white rounded-sm shadow">
                {/* Cart Header */}
                <div className="p-4 border-b border-gray-200">
                  <h1 className="text-lg font-medium text-gray-800">
                    My Cart ({getTotalItems()})
                  </h1>
                </div>

                {/* Cart Items */}
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <div className="p-4 flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f5f5f5" width="100" height="100"/%3E%3Ctext fill="%23999" font-size="30" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬%3C/text%3E%3C/svg%3E'}
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-medium text-gray-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            {item.unit === 'Kg' || item.unit === 'kg'
                              ? `${((item.quantity || 0) * 1000).toFixed(0)}g`
                              : `${item.quantity || 1} piece${(item.quantity || 1) > 1 ? 's' : ''}`}
                          </p>

                          {/* Price */}
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-base sm:text-lg font-semibold text-gray-900">
                              ₹{(item.rate * (item.quantity || 1)).toFixed(0)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              ₹{Math.round(item.rate * (item.quantity || 1) * 1.1)}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls - Right Side */}
                        <div className="flex-shrink-0 flex flex-col items-end justify-between">
                          {(item.unit === 'Kg' || item.unit === 'kg') ? (
                            /* Weight Input for Kg items */
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={weightInputs[index] !== undefined ? weightInputs[index] : (item.quantity > 0 ? ((item.weightUnit || 'Kg') === 'Kg' ? Number(item.quantity).toFixed(3).replace(/\.?0+$/, '') : Math.round(item.quantity * 1000)) : '0')}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (inputValue === '' || /^\d*\.?\d{0,3}$/.test(inputValue)) {
                                    setWeightInputs({ ...weightInputs, [index]: inputValue });

                                    if (inputValue === '' || inputValue === '0') {
                                      const updatedCart = [...cart];
                                      updatedCart[index].quantity = 0;
                                      setCart(updatedCart);
                                      sessionStorage.setItem('sweetCart', JSON.stringify(updatedCart));
                                    } else {
                                      const value = parseFloat(inputValue);
                                      if (!isNaN(value) && value > 0) {
                                        const roundedValue = Math.round(value * 1000) / 1000;
                                        const weightInKg = item.weightUnit === 'Kg' ? roundedValue : roundedValue / 1000;
                                        updateQuantity(index, weightInKg);
                                      }
                                    }
                                  }
                                }}
                                onBlur={() => {
                                  if (cart[index].quantity === 0 || weightInputs[index] === '' || weightInputs[index] === '0') {
                                    setWeightInputs({ ...weightInputs, [index]: '0' });
                                  } else {
                                    setWeightInputs({ ...weightInputs, [index]: undefined });
                                  }
                                }}
                                className="w-14 sm:w-16 px-2 py-1.5 text-center bg-white text-gray-900 font-medium rounded border border-gray-300 focus:outline-none focus:border-[#2874f0] text-sm"
                              />
                              <select
                                value={item.weightUnit || 'Kg'}
                                onChange={(e) => {
                                  const newUnit = e.target.value;
                                  const updatedCart = [...cart];
                                  updatedCart[index] = { ...updatedCart[index], weightUnit: newUnit };
                                  setCart(updatedCart);
                                  sessionStorage.setItem('sweetCart', JSON.stringify(updatedCart));
                                  setWeightInputs({ ...weightInputs, [index]: undefined });
                                }}
                                className="px-2 py-1.5 bg-white text-gray-700 font-medium text-sm border border-gray-300 rounded focus:outline-none focus:border-[#2874f0] cursor-pointer"
                              >
                                <option value="Kg">Kg</option>
                                <option value="grams">g</option>
                              </select>
                            </div>
                          ) : (
                            /* Quantity Buttons for Piece items - Flipkart Style */
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                                disabled={(item.quantity || 1) <= 1}
                                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border ${(item.quantity || 1) <= 1
                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer'
                                  }`}
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <div className="w-8 sm:w-10 text-center">
                                <span className="text-sm sm:text-base font-medium text-gray-800">
                                  {item.quantity || 1}
                                </span>
                              </div>
                              <button
                                onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          )}

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-gray-500 hover:text-red-500 text-xs sm:text-sm font-medium uppercase tracking-wide mt-3 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Price Summary & Place Order - Sticky Bottom on Mobile */}
              <div className="bg-white rounded-sm shadow sticky bottom-0 z-10">
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Price Details */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="text-center sm:text-left">
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                        ₹{getTotalAmount().toFixed(0)}
                      </p>
                    </div>
                    <Link
                      to="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-[#2874f0] text-xs sm:text-sm hover:underline"
                    >
                      View price details
                    </Link>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrderClick}
                    className="w-full sm:w-auto bg-[#fb641b] text-white px-12 py-3 sm:py-3.5 rounded-sm font-semibold shadow-lg hover:bg-[#e85d19] transition-colors text-sm sm:text-base uppercase tracking-wide"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <BackToTop />

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          cart={cart}
          totalAmount={getTotalAmount()}
          onClose={() => setShowOrderForm(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};

export default Cart;