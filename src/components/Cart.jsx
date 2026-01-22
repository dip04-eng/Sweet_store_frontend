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
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-[#C41E3A]/20 rounded-2xl shadow-xl p-10 sm:p-12 md:p-16 text-center max-w-md w-full"
        >
          <div className="text-6xl sm:text-7xl mb-6">✓</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C41E3A] mb-4 font-['Playfair_Display']">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for your order. We'll prepare your delicious sweets with care!
          </p>
          <Link
            to="/"
            className="inline-flex items-center bg-[#C41E3A] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#A01828] transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Navbar cart={cart} />

      <div className="pt-20 xs:pt-24 sm:pt-24 md:pt-28 pb-16 px-3 xs:px-4 sm:px-6 safe-area-insets">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8 sm:mb-12"
          >
            {/* Gradient BacKground */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-3xl blur-xl"></div>

            <div className="relative bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to="/"
                  className="flex items-center text-[#C41E3A] hover:text-[#A01828] transition-all hover:scale-105 font-semibold group"
                >
                  <motion.div
                    whileHover={{ x: -5 }}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 group-hover:drop-shadow-lg" />
                  </motion.div>
                  <span className="text-sm sm:text-base">Back to Store</span>
                </Link>
                <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-purple-300 via-pink-300 to-red-300"></div>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-[#C41E3A] drop-shadow-lg" />
                  </motion.div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#C41E3A] via-[#FF1744] to-[#C41E3A] bg-clip-text text-transparent font-['Playfair_Display'] drop-shadow-sm">
                    Your Sweet Cart
                  </h1>
                </div>
              </div>
            </div>
          </motion.div>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-2xl mx-auto"
            >
              {/* Animated gradient bacKground */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-red-400/20 rounded-3xl blur-2xl animate-pulse"></div>

              <div className="relative bg-white/90 backdrop-blur-md border-2 border-purple-200 rounded-3xl shadow-2xl p-12 sm:p-16 text-center overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-pink-300/30 to-purple-300/30 rounded-full blur-3xl"></div>

                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <ShoppingBag className="h-24 w-24 text-[#C41E3A]/70 mx-auto mb-6 drop-shadow-lg" />
                </motion.div>

                <h2 className="relative z-10 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#C41E3A] to-[#FF1744] bg-clip-text text-transparent mb-4 font-['Playfair_Display']">
                  Your cart is empty
                </h2>
                <p className="relative z-10 text-gray-600 mb-8 text-lg">
                  Add some delicious sweets to get started!
                </p>
                <Link
                  to="/#sweets-collection"
                  className="relative z-10 inline-flex items-center bg-gradient-to-r from-[#C41E3A] to-[#FF1744] text-white px-10 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-[#C41E3A]/50 hover:scale-105 transition-all duration-300"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Browse Sweets
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="relative bg-white border-2 border-purple-100 rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 hover:shadow-2xl hover:shadow-purple-200/50 hover:border-purple-300 transition-all duration-300 overflow-hidden"
                    >
                      {/* Gradient accent */}
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-red-500"></div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <div className="relative flex-shrink-0 group">
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/50 to-orange-300/50 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <img
                            src={item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" font-size="40" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬%3C/text%3E%3C/svg%3E'}
                            alt={item.name}
                            className="relative w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-purple-200 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-[#C41E3A] truncate font-['Playfair_Display']">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            ₹{item.rate} per {item.unit || 'piece'}
                          </p>

                          {/* Quantity/Weight Controls with Price and Delete */}
                          {(item.unit === 'Kg' || item.unit === 'kg') ? (
                            // Weight input with unit selector, price, and delete for Kg items - all in one row
                            <div className="mt-3 flex items-center gap-2 sm:gap-4 flex-wrap">
                              <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-2 sm:px-4 py-1.5 sm:py-2">
                                <span className="text-white text-xs sm:text-sm font-semibold">Weight:</span>
                                <input
                                  type="text"
                                  value={weightInputs[index] !== undefined ? weightInputs[index] : (item.quantity > 0 ? ((item.weightUnit || 'Kg') === 'Kg' ? Number(item.quantity).toFixed(3).replace(/\.?0+$/, '') : Math.round(item.quantity * 1000)) : '0')}
                                  onFocus={(e) => e.target.select()}
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    const pastedText = e.clipboardData.getData('text');
                                    // Clean pasted value to max 3 decimals
                                    if (/^\d*\.?\d{0,3}$/.test(pastedText)) {
                                      e.target.dispatchEvent(new Event('change', { bubbles: true }));
                                    }
                                  }}
                                  onInput={(e) => {
                                    // Additional safeguard - limit input length
                                    const value = e.target.value;
                                    if (!/^\d*\.?\d{0,3}$/.test(value)) {
                                      e.target.value = weightInputs[index] || '';
                                    }
                                  }}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    // Allow decimal input with up to 3 decimal places
                                    if (inputValue === '' || /^\d*\.?\d{0,3}$/.test(inputValue)) {
                                      setWeightInputs({ ...weightInputs, [index]: inputValue });

                                      if (inputValue === '' || inputValue === '0') {
                                        // Set quantity to 0 when input is empty or 0
                                        const updatedCart = [...cart];
                                        updatedCart[index].quantity = 0;
                                        setCart(updatedCart);
                                        sessionStorage.setItem('sweetCart', JSON.stringify(updatedCart));
                                      } else {
                                        const value = parseFloat(inputValue);
                                        if (!isNaN(value) && value > 0) {
                                          // Round to 3 decimal places before converting to Kg
                                          const roundedValue = Math.round(value * 1000) / 1000;
                                          const weightInKg = item.weightUnit === 'Kg' ? roundedValue : roundedValue / 1000;
                                          updateQuantity(index, weightInKg);
                                        }
                                      }
                                    }
                                  }}
                                  onBlur={() => {
                                    // Reset input to show "0" if quantity is 0 or empty
                                    if (cart[index].quantity === 0 || weightInputs[index] === '' || weightInputs[index] === '0') {
                                      setWeightInputs({ ...weightInputs, [index]: '0' });
                                    } else {
                                      setWeightInputs({ ...weightInputs, [index]: undefined });
                                    }
                                  }}
                                  className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center bg-white text-gray-900 font-bold rounded border-0 focus:outline-none focus:ring-2 focus:ring-white text-sm"
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
                                  className="bg-purple-600 text-white px-3 sm:px-4 py-1.5 rounded-lg font-bold text-sm border-2 border-white focus:outline-none focus:ring-2 focus:ring-white cursor-pointer shadow-md min-w-[70px]"
                                >
                                  <option value="Kg" className="bg-white text-gray-900 font-semibold">Kg</option>
                                  <option value="grams" className="bg-white text-gray-900 font-semibold">grams</option>
                                </select>
                              </div>

                              {/* Price with left margin and Delete button immediately to its right */}
                              <div className="flex items-center gap-2 ml-auto sm:ml-2">
                                <div className="text-lg sm:text-xl font-bold text-[#C41E3A]">
                                  ₹{(item.rate * (item.quantity ?? 0)).toFixed(2)}
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeFromCart(index)}
                                  className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                </motion.button>
                              </div>
                            </div>
                          ) : (
                            // Quantity controls with price and delete for piece items - all in one row
                            <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                                  disabled={(item.quantity || 1) <= 1}
                                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${(item.quantity || 1) <= 1
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-[#C41E3A]/10 text-[#C41E3A] hover:bg-[#C41E3A]/20'
                                    }`}
                                >
                                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </motion.button>
                                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 rounded-lg text-[#C41E3A] font-bold text-sm sm:text-base min-w-[50px] sm:min-w-[60px] text-center border-2 border-gray-200">
                                  {item.quantity || 1}
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                                  className="p-1.5 sm:p-2 rounded-lg bg-[#C41E3A]/10 text-[#C41E3A] hover:bg-[#C41E3A]/20 transition-all"
                                >
                                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </motion.button>
                              </div>

                              {/* Price with left margin and Delete button immediately to its right */}
                              <div className="flex items-center gap-2 ml-auto sm:ml-2">
                                <div className="text-lg sm:text-xl font-bold text-[#C41E3A]">
                                  ₹{(item.rate * (item.quantity ?? 0)).toFixed(2)}
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeFromCart(index)}
                                  className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                </motion.button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative bg-white border-2 border-purple-200 rounded-2xl shadow-2xl p-6 lg:sticky lg:top-24 overflow-hidden"
                >
                  {/* Decorative gradient bacKground */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-300/20 to-orange-300/20 rounded-full blur-2xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                        <ShoppingCart className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C41E3A] to-[#FF1744] bg-clip-text text-transparent font-['Playfair_Display']">
                        Order Summary
                      </h3>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-xl p-4 mb-6 border border-purple-100">
                      <div className="flex justify-between text-gray-700 mb-3">
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-purple-500" />
                          Items ({getTotalItems()})
                        </span>
                        <span className="font-semibold text-gray-900">₹{getTotalAmount().toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 my-3"></div>
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-gray-900">Total</span>
                        <span className="bg-gradient-to-r from-[#C41E3A] to-[#FF1744] bg-clip-text text-transparent">₹{getTotalAmount().toFixed(2)}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlaceOrderClick}
                      className="w-full bg-gradient-to-r from-[#C41E3A] to-[#FF1744] text-white py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-[#C41E3A]/50 transition-all duration-300 text-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Place Order
                    </motion.button>
                  </div>
                </motion.div>
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