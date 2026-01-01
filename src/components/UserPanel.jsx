import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Sparkles, Filter } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Sweet', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverage', 'Dessert', 'Other'];

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
      console.log('📦 Fetched sweets:', data);
      console.log('🎉 Festival sweets:', data.filter(s => s.isFestival));
      console.log('🍬 Regular sweets:', data.filter(s => !s.isFestival));
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

  // Filter sweets by selected category
  const filteredSweets = selectedCategory === 'All' 
    ? sweets.filter(sweet => !sweet.isFestival) // Exclude festival sweets from main collection
    : sweets.filter(sweet => sweet.category === selectedCategory && !sweet.isFestival);

  // Get festival sweets separately
  const festivalSweets = sweets.filter(sweet => sweet.isFestival);

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

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all shadow-md ${
                    selectedCategory === category
                      ? 'bg-white text-[#C41E3A] shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
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
          ) : filteredSweets.length === 0 ? (
            /* No Results for Selected Category */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="card-premium max-w-md mx-auto p-8">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-3 font-['Playfair_Display']">
                  No items in this category
                </h3>
                <p className="text-[#F5F5DC]/70 mb-6">Try selecting a different category</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory('All')}
                  className="btn-premium bg-gradient-to-r from-[#FFD700] to-[#D2691E] text-[#0D0D0D] px-8 py-3 rounded-full font-bold"
                >
                  View All
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Sweets Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredSweets.map((sweet, index) => (
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

      {/* Festival Special Sweets Section */}
      {!loading && festivalSweets.length > 0 && (
        <section id="festival-collection" className="py-16 sm:py-20 md:py-24 px-4 relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
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
                <Sparkles className="h-6 w-6 text-yellow-300 mr-2" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Playfair_Display']">
                  Festival Special Collection
                </h2>
                <Sparkles className="h-6 w-6 text-yellow-300 ml-2" />
              </div>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Celebrate special occasions with our exclusive festival sweets
              </p>
              <div className="w-24 h-1 bg-yellow-300/70 mx-auto mt-4 rounded-full"></div>
            </motion.div>

            {/* Festival Sweets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {festivalSweets.map((sweet, index) => (
                <motion.div
                  key={`festival-${sweet.id || sweet._id || sweet.name}-${index}`}
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
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default UserPanel;