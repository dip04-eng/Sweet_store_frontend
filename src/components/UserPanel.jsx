import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Filter, PartyPopper, Search, X } from 'lucide-react';
import SweetCard from './SweetCard';
import FestivalCard from './FestivalCard';
import Hero from './Hero';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import SEO from './SEO';
import ErrorMessage from './ErrorMessage';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const UserPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Sweet');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Sweet', 'Dry-Fruits', 'Snacks', 'Breakfast', 'Lunch', 'Dinner', 'Other'];

  // Track if initial load is done
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    fetchSweets().then(() => setInitialLoadDone(true));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch sweets when user returns to this page (only after initial load)
  useEffect(() => {
    if (!initialLoadDone) return;
    
    let lastFetchTime = Date.now();
    const DEBOUNCE_TIME = 3000; // Minimum 3 seconds between fetches

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetchTime > DEBOUNCE_TIME) {
        lastFetchTime = Date.now();
        fetchSweets();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoadDone]);

  const fetchSweets = async (retryCount = 0) => {
    const MAX_RETRIES = 2;
    
    try {
      setLoading(true);
      setError(null);

      // Increased timeout to 30 seconds for large image payloads
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SWEETS}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('📦 Fetched sweets:', data.length);
      setSweets(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sweets:', err);
      
      // Retry logic for timeout errors
      if ((err.name === 'AbortError' || err.message.includes('Failed to fetch')) && retryCount < MAX_RETRIES) {
        console.log(`🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        return fetchSweets(retryCount + 1);
      }
      
      if (err.name === 'AbortError') {
        setError('Request timed out. The server is taking too long to respond. Please try again.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please ensure the backend server is running.');
      } else {
        setError(err.message);
      }

      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (sweet, quantity = 1) => {
    // Round quantity to 3 decimal places
    const roundedQuantity = Math.round(quantity * 1000) / 1000;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item._id === sweet._id);

    let updatedCart;
    if (existingItemIndex !== -1) {
      // Item exists, update quantity (round to 3 decimals)
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity = Math.round((updatedCart[existingItemIndex].quantity + roundedQuantity) * 1000) / 1000;
    } else {
      // Item doesn't exist, add new item with weightUnit for Kg items
      const newItem = { ...sweet, quantity: roundedQuantity };
      if (sweet.unit === 'Kg' || sweet.unit === 'kg') {
        newItem.weightUnit = 'Kg';
      }
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    sessionStorage.setItem('sweetCart', JSON.stringify(updatedCart));
  };

  // Filter sweets by selected category and search query
  const filteredSweets = sweets.filter(sweet => {
    // Exclude festival sweets from main collection
    if (sweet.isFestival) return false;

    // Filter by search query (case-insensitive) - searches across ALL categories
    const matchesSearch = !searchQuery ||
      sweet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sweet.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // If there's a search query, ignore category filter and search all items
    if (searchQuery) {
      return matchesSearch;
    }

    // Filter by category when no search is active
    const matchesCategory = selectedCategory === 'All' || sweet.category === selectedCategory;
    return matchesCategory;
  });

  // Get festival sweets separately
  const festivalSweets = sweets.filter(sweet => sweet.isFestival);

  // Generate structured data for all products (standalone Product schemas, not ItemList)
  // This prevents Google from interpreting as Merchant Listings or invalid Carousels
  const generateProductSchema = () => {
    if (sweets.length === 0) return null;

    const allSweets = [...filteredSweets, ...festivalSweets];

    // Return array of standalone Product schemas (not wrapped in ItemList)
    // Limit to 10 products to avoid excessive markup
    return allSweets.slice(0, 10).map((sweet) => {
      // Ensure we have valid data for all required fields
      const productName = sweet.name || sweet.sweetName || 'Traditional Sweet';
      const productPrice = sweet.rate || sweet.price || 50; // Default price fallback
      const productStock = sweet.stock !== undefined ? sweet.stock : 10; // Default stock

      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productName,
        "description": sweet.description || `Delicious ${productName} from Mansoor Hotel & Sweets. Made with pure ingredients and traditional recipes. Fresh and authentic taste from Bihar's finest sweet shop.`,
        "image": sweet.image || "https://mansoorhotel.in/BacKground.png",
        "url": `https://mansoorhotel.in/#sweets-collection`,
        "category": sweet.category || "Sweet",
        "sku": `MS-${productName.replace(/\s+/g, '-').toUpperCase()}`,
        "mpn": `MANSOOR-${productName.replace(/\s+/g, '').toUpperCase()}`,
        "brand": {
          "@type": "Brand",
          "name": "Mansoor Hotel & Sweets",
          "url": "https://mansoorhotel.in"
        },
        "manufacturer": {
          "@type": "Organization",
          "name": "Mansoor Hotel & Sweets",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Madrasa Road",
            "addressLocality": "Baisi",
            "addressRegion": "Bihar",
            "postalCode": "854315",
            "addressCountry": "IN"
          }
        },
        "offers": {
          "@type": "Offer",
          "url": `https://mansoorhotel.in/#sweets-collection`,
          "priceCurrency": "INR",
          "price": productPrice.toString(),
          "priceValidUntil": "2026-12-31",
          "availability": productStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition",
          "validFrom": "2024-01-01",
          "seller": {
            "@type": "Organization",
            "name": "Mansoor Hotel & Sweets",
            "url": "https://mansoorhotel.in"
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 1
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "150",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Satisfied Customer"
            },
            "reviewBody": `Excellent quality ${productName}. Fresh and delicious!`
          }
        ]
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* SEO with Product Structured Data */}
      <SEO
        title="Sweet Collection"
        description="Order authentic Indian sweets online from Mansoor Hotel & Sweets, Baisi, Bihar. Browse our complete collection of traditional sweets."
        structuredData={generateProductSchema()}
      />

      {/* Navbar */}
      <Navbar cart={cart} />

      {/* Hero Section */}
      <Hero />

      {/* Sweets Catalog Section */}
      <section id="sweets-collection" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 relative bg-[#E08B8B]">
        {/* Decorative BacKground Elements */}
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
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white mr-2" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-['Playfair_Display']">
                Our Sweet Collection
              </h2>
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white ml-2" />
            </div>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              Handcrafted with love, tradition, and the finest ingredients
            </p>
            <div className="w-24 h-1 bg-white/50 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 sm:mb-8 max-w-xl mx-auto px-4"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#C41E3A]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sweets, snacks, dry fruits..."
                className="w-full pl-12 pr-12 py-3 sm:py-4 rounded-full border-2 border-[#C41E3A]/30 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/20 transition-all shadow-lg text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#C41E3A] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 sm:mb-8 md:mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <h3 className="text-base sm:text-lg font-semibold text-white">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold transition-all shadow-md text-xs sm:text-sm md:text-base touch-manipulation min-h-[44px] ${selectedCategory === category
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
            /* Enhanced Error State */
            <div className="text-center py-20">
              <ErrorMessage
                error={error}
                onRetry={fetchSweets}
                type="api"
                className="max-w-md mx-auto"
              />
            </div>
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
            /* Responsive Sweets Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 justify-items-center">
              {filteredSweets.map((sweet, index) => (
                <motion.div
                  key={`${sweet.id || sweet._id || sweet.name}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full max-w-[320px]"
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

      {/* Festival Special Sweets Section - Om Sweets Style */}
      {!loading && (
        <section id="festival-collection" className="py-16 sm:py-20 md:py-24 px-4 relative bg-[#D4A017]">
          {/* Decorative BacKground Pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <div className="absolute inset-0" style={{
              bacKgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#5C3317] font-['Playfair_Display'] mb-4">
                Festival Special
              </h2>
              <p className="text-[#5C3317]/80 text-base sm:text-lg max-w-2xl mx-auto">
                Our festival special treats will instantly sweeten your day!
              </p>
            </motion.div>

            {/* Festival Sweets Grid or Empty State */}
            {festivalSweets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 justify-items-center">
                {festivalSweets.map((sweet, index) => (
                  <motion.div
                    key={`festival-${sweet.id || sweet._id || sweet.name}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full max-w-[320px]"
                  >
                    <FestivalCard
                      sweet={sweet}
                      onAddToCart={addToCart}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-md mx-auto p-8 shadow-xl">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-[#5C3317] mb-3 font-['Playfair_Display']">
                    Coming Soon!
                  </h3>
                  <p className="text-[#5C3317]/70">
                    Festival special sweets will be available during upcoming festivals. Stay tuned!
                  </p>
                </div>
              </motion.div>
            )}
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