import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import SweetCard from './SweetCard';
import Hero from './Hero';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const UserPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSweets();
    const savedCart = sessionStorage.getItem('sweetCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Handle scroll to section if hash is present in URL
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SWEETS}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sweets');
      }
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

  const addToCart = (sweet, quantity = 1) => {
    // Add item with specified quantity
    const updatedCart = [...cart, { ...sweet, quantity }];
    
    setCart(updatedCart);
    sessionStorage.setItem('sweetCart', JSON.stringify(updatedCart));
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Navbar */}
      <Navbar cart={cart} />

      {/* Hero Section */}
      <Hero />

      {/* Sweets Catalog Section */}
      <section id="sweets-collection" className="py-16 sm:py-20 md:py-24 px-4 relative bg-[#E08B8B]">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-white mr-2" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Playfair_Display']">
                Our Sweet Collection
              </h2>
              <Sparkles className="h-6 w-6 text-white ml-2" />
            </div>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Handcrafted with love, tradition, and the finest ingredients
            </p>
            <div className="w-24 h-1 bg-white/50 mx-auto mt-4 rounded-full"></div>
          </motion.div>
          
          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <Loader2 className="h-16 w-16 text-[#FFD700]" />
              </motion.div>
              <p className="text-[#F5F5DC]/70 mt-6 text-lg">Loading delicious sweets...</p>
            </div>
          ) : error ? (
            /* Error State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="card-premium max-w-md mx-auto p-8">
                <div className="text-6xl mb-6">😞</div>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-3 font-['Playfair_Display']">
                  Oops! Something went wrong
                </h3>
                <p className="text-[#F5F5DC]/70 mb-6">{error}</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchSweets}
                  className="btn-premium bg-gradient-to-r from-[#FFD700] to-[#D2691E] text-[#0D0D0D] px-8 py-3 rounded-full font-bold inline-flex items-center space-x-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Try Again</span>
                </motion.button>
              </div>
            </motion.div>
          ) : sweets.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="card-premium max-w-md mx-auto p-8">
                <div className="text-6xl mb-6">🍬</div>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-3 font-['Playfair_Display']">
                  No sweets available
                </h3>
                <p className="text-[#F5F5DC]/70">Check back later for delicious treats!</p>
              </div>
            </motion.div>
          ) : (
            /* Sweets Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {sweets.map((sweet, index) => (
                <motion.div
                  key={`${sweet.id || sweet._id || sweet.name}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SweetCard
                    sweet={sweet}
                    onAddToCart={addToCart}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default UserPanel;