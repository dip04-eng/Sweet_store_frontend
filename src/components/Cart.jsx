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
      setCart(JSON.parse(savedCart));
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
    updatedCart[index].quantity = newQuantity;
    updateCart(updatedCart);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const itemQuantity = item.quantity ?? 0;
      return total + (Number(item.rate) * itemQuantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity ?? 0), 0);
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
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-12 gap-2 sm:gap-4"
          >
            <Link
              to="/"
              className="flex items-center text-[#C41E3A] hover:text-[#A01828] transition-colors font-semibold"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              <span className="text-sm sm:text-base">Back to Shop</span>
            </Link>
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#C41E3A] font-['Playfair_Display']">
              Your Sweet Cart
            </h1>
          </motion.div>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-12 sm:p-16 text-center max-w-2xl mx-auto"
            >
              <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#C41E3A] mb-4 font-['Playfair_Display']">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Add some delicious sweets to get started!
              </p>
              <Link
                to="/#sweets-collection"
                className="inline-flex items-center bg-[#C41E3A] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#A01828] transition-colors"
              >
                Browse Sweets
              </Link>
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
                      className="bg-white border-2 border-gray-200 rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" font-size="40" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬%3C/text%3E%3C/svg%3E'}
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-gray-100"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-[#C41E3A] truncate font-['Playfair_Display']">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            ₹{item.rate} per {item.unit || 'piece'}
                          </p>
                          
                          {/* Quantity/Weight Controls */}
                          {item.unit === 'kg' ? (
                            // Weight input with unit selector for kg items
                            <div className="mt-3">
                              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-4 py-2 w-fit">
                                <span className="text-white text-sm font-semibold">Weight:</span>
                                <input
                                  type="text"
                                  value={weightInputs[index] !== undefined ? weightInputs[index] : (item.quantity > 0 ? ((item.weightUnit || 'kg') === 'kg' ? item.quantity : Math.round(item.quantity * 1000)) : '0')}
                                  onFocus={(e) => e.target.select()}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
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
                                        const weightInKg = item.weightUnit === 'kg' ? value : value / 1000;
                                        updateQuantity(index, weightInKg);
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
                                  className="w-16 px-2 py-1 text-center bg-white text-gray-900 font-bold rounded border-0 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                                <select
                                  value={item.weightUnit || 'kg'}
                                  onChange={(e) => {
                                    const newUnit = e.target.value;
                                    const updatedCart = [...cart];
                                    updatedCart[index] = { ...updatedCart[index], weightUnit: newUnit };
                                    setCart(updatedCart);
                                    sessionStorage.setItem('sweetCart', JSON.stringify(updatedCart));
                                    setWeightInputs({ ...weightInputs, [index]: undefined });
                                  }}
                                  className="bg-red-700 text-white px-2 py-1 rounded font-semibold text-sm border-0 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                                >
                                  <option value="kg">kg</option>
                                  <option value="grams">grams</option>
                                </select>
                                <span className="text-white text-sm font-semibold">
                                  ≈₹{(item.rate * (item.quantity ?? 0.5)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            // Quantity controls for piece items
                            <div className="flex items-center gap-2 mt-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                                disabled={(item.quantity || 1) <= 1}
                                className={`p-2 rounded-lg transition-all ${
                                  (item.quantity || 1) <= 1
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-[#C41E3A]/10 text-[#C41E3A] hover:bg-[#C41E3A]/20'
                                }`}
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              <div className="px-4 py-2 bg-gray-50 rounded-lg text-[#C41E3A] font-bold text-base min-w-[60px] text-center border-2 border-gray-200">
                                {item.quantity || 1}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                                className="p-2 rounded-lg bg-[#C41E3A]/10 text-[#C41E3A] hover:bg-[#C41E3A]/20 transition-all"
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>
                          )}
                          
                          {/* Mobile Layout */}
                          <div className="flex items-center justify-between mt-3 sm:hidden">
                            <div className="text-lg font-bold text-[#C41E3A]">
                              ₹{(item.rate * (item.quantity ?? 0)).toFixed(2)}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center gap-4">
                          <div className="text-right min-w-[100px]">
                            <div className="text-xl font-bold text-[#C41E3A]">
                              ₹{(item.rate * (item.quantity ?? 0)).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ₹{item.rate} × {(item.quantity ?? 0) < 1 ? (item.quantity ?? 0).toFixed(3) : (item.quantity ?? 0).toFixed(2)}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
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
                  className="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 lg:sticky lg:top-24"
                >
                  <h3 className="text-2xl font-bold text-[#C41E3A] mb-6 font-['Playfair_Display']">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({getTotalItems().toFixed(2)})</span>
                      <span className="font-semibold text-gray-900">₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-[#C41E3A]">₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrderClick}
                    className="w-full bg-[#C41E3A] text-white py-4 rounded-lg font-semibold shadow-lg hover:bg-[#A01828] transition-colors text-lg"
                  >
                    Place Order
                  </motion.button>
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