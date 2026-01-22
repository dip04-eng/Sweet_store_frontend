import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToShop = () => {
    const shopSection = document.getElementById('sweets-collection');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden min-h-[600px] hero-responsive" role="banner" aria-label="Welcome to Mansoor Hotel & Sweets">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/Background.png"
          alt="Mansoor Hotel & Sweets - Traditional Indian Sweet Shop in Baisi, Bihar featuring our signature sweets and warm hospitality since 1968"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          style={{
            objectPosition: 'center center',
          }}
          onError={(e) => {
            console.error('Failed to load background image');
            // Set a gradient fallback if image fails to load
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #C41E3A 0%, #8B0000 50%, #FFD700 100%)';
          }}
        />
        {/* Responsive Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 md:from-black/20 md:via-transparent md:to-black/40"></div>
      </div>

      {/* Hero Content - Mobile First Design */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-20 sm:py-16">
        <div className="max-w-5xl mx-auto text-center w-full">
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-2 sm:space-y-4"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#FFD700] text-sm sm:text-base md:text-lg font-semibold tracking-widest uppercase mb-4 drop-shadow-lg"
            >
              Welcome to
            </motion.p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight font-['Playfair_Display'] drop-shadow-2xl px-2">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="block text-shadow-strong"
              >
                MANSOOR HOTEL
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="block text-[#FFD700] text-shadow-strong"
              >
                & SWEETS
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#FFD700] font-['Playfair_Display'] italic mt-2 sm:mt-4 drop-shadow-lg"
            >
              MANSOOR & SONS
            </motion.p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4"
          >
            <span className="text-shadow-strong">Taste Happiness in Every Bite</span>
            <span className="block mt-2 text-sm sm:text-base md:text-lg text-[#FFD700] drop-shadow-lg">
              Crafted with love, tradition, and the finest ingredients
            </span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
          >
            <motion.button
              onClick={scrollToShop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-premium bg-gradient-to-r from-[#C41E3A] via-[#DC143C] to-[#8B0000] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-2xl hover:shadow-[#FFD700]/50 border-2 border-[#FFD700] animate-glow touch-manipulation w-full sm:w-auto max-w-xs sm:max-w-none"
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
          <span className="text-[#FFD700] text-sm mb-2 font-semibold drop-shadow-lg">Scroll Down</span>
          <ChevronDown className="h-8 w-8 text-[#FFD700] drop-shadow-lg" />
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