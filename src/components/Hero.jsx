import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToShop = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Solid Red Background - Om Sweets Style */}
      <div className="absolute inset-0 bg-[#C41E3A]">
        
        {/* Decorative Floral Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23000' d='M50 30c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 25c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z'/%3E%3C/svg%3E")`,
        }}></div>

        {/* Left Side - Floating Sweet Icons */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [-12, -8, -12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-8 top-[20%] text-7xl drop-shadow-2xl"
        >
          🍬
        </motion.div>
        <motion.div 
          animate={{ y: [0, 10, 0], rotate: [6, 10, 6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute left-12 bottom-[25%] text-6xl drop-shadow-2xl"
        >
          🍪
        </motion.div>

        {/* Right Side - Floating Sweet Icons */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [12, 16, 12] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute right-8 top-[22%] text-7xl drop-shadow-2xl"
        >
          🧁
        </motion.div>
        <motion.div 
          animate={{ y: [0, 12, 0], rotate: [-6, -2, -6] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          className="absolute right-12 bottom-[22%] text-6xl drop-shadow-2xl"
        >
          🍩
        </motion.div>

        {/* Center floating sweets */}
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[12%] left-[45%] text-5xl drop-shadow-xl"
        >
          🥧
        </motion.div>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute bottom-[28%] left-[30%] text-5xl drop-shadow-xl"
        >
          🍫
        </motion.div>
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="absolute top-[15%] right-[35%] text-4xl drop-shadow-xl"
        >
          🍯
        </motion.div>

        {/* Decorative Pink Flowers - Left */}
        <svg className="absolute left-12 bottom-32 w-32 h-32 opacity-80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="20" fill="#E91E63" />
          <circle cx="30" cy="35" r="15" fill="#E91E63" />
          <circle cx="70" cy="35" r="15" fill="#E91E63" />
          <circle cx="30" cy="65" r="15" fill="#E91E63" />
          <circle cx="70" cy="65" r="15" fill="#E91E63" />
          <circle cx="50" cy="50" r="8" fill="#FFD700" />
        </svg>

        {/* Decorative Pink Flowers - Right */}
        <svg className="absolute right-20 top-40 w-28 h-28 opacity-80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="18" fill="#E91E63" />
          <circle cx="32" cy="38" r="13" fill="#E91E63" />
          <circle cx="68" cy="38" r="13" fill="#E91E63" />
          <circle cx="32" cy="62" r="13" fill="#E91E63" />
          <circle cx="68" cy="62" r="13" fill="#E91E63" />
          <circle cx="50" cy="50" r="6" fill="#FFD700" />
        </svg>

        {/* Golden Snowflake Decorations */}
        <svg className="absolute top-32 right-1/4 w-12 h-12 opacity-70" viewBox="0 0 24 24" fill="#FFD700">
          <path d="M12 0L14 8L22 8L16 13L18 21L12 16L6 21L8 13L2 8L10 8Z"/>
        </svg>
        <svg className="absolute bottom-40 left-1/3 w-10 h-10 opacity-60" viewBox="0 0 24 24" fill="#FFD700">
          <path d="M12 0L14 8L22 8L16 13L18 21L12 16L6 21L8 13L2 8L10 8Z"/>
        </svg>

        {/* Golden Leaf Decorations */}
        <div className="absolute top-16 right-8 w-20 h-24 opacity-50">
          <svg viewBox="0 0 50 60" fill="#C4A35A">
            <path d="M25 0 C40 20, 45 40, 25 60 C5 40, 10 20, 25 0 Z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-4 w-16 h-20 opacity-40 transform rotate-45">
          <svg viewBox="0 0 50 60" fill="#C4A35A">
            <path d="M25 0 C40 20, 45 40, 25 60 C5 40, 10 20, 25 0 Z"/>
          </svg>
        </div>

      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-4"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#FFB300] text-sm sm:text-base md:text-lg font-semibold tracking-widest uppercase mb-4"
            >
              Welcome to
            </motion.p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight font-['Playfair_Display']">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="block"
              >
                MANSOOR HOTEL
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="block text-[#FFB300]"
              >
                & SWEETS
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-xl sm:text-2xl md:text-3xl text-[#FFB300]/90 font-['Playfair_Display'] italic mt-4"
            >
              MANSOOR & SONS
            </motion.p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="text-lg sm:text-xl md:text-2xl text-white/90 mt-8 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Taste Happiness in Every Bite 🍬
            <span className="block mt-2 text-base sm:text-lg text-[#FFB300]/80">
              Crafted with love, tradition, and the finest ingredients
            </span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={scrollToShop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-premium bg-gradient-to-r from-[#FFB300] to-[#FF6B35] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold shadow-2xl hover:shadow-[#FFB300]/50 animate-glow"
            >
              Shop Now
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center cursor-pointer"
          onClick={scrollToShop}
        >
          <span className="text-[#FFC107] text-sm mb-2 font-semibold">Scroll Down</span>
          <ChevronDown className="h-8 w-8 text-[#FFC107]" />
        </motion.div>
      </motion.div>

      {/* Decorative Wavy Border at Bottom - Om Sweets Style */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path 
            fill="#FFFBF5" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>    </div>
  );
};

export default Hero;