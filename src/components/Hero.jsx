import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Premium sweet images (using high-quality Indian sweets images)
  const heroImages = [
    'https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=1920&q=80', // Gulab Jamun
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1920&q=80', // Rasgulla
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=1920&q=80', // Jalebi
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1920&q=80', // Kaju Katli
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollToShop = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center parallax"
            style={{
              backgroundImage: `url(${heroImages[currentImage]})`,
              transform: 'translateZ(0)',
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0D0D0D]"></div>
        </motion.div>
      </AnimatePresence>

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
              className="text-[#FFD700] text-sm sm:text-base md:text-lg font-semibold tracking-widest uppercase mb-4"
            >
              Welcome to
            </motion.p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#F5F5DC] leading-tight font-['Playfair_Display']">
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
                className="block text-gold-gradient"
              >
                & SWEETS
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-xl sm:text-2xl md:text-3xl text-[#FFD700]/90 font-['Playfair_Display'] italic mt-4"
            >
              MANSOOR & SONS
            </motion.p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="text-lg sm:text-xl md:text-2xl text-[#F5F5DC]/80 mt-8 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Taste Happiness in Every Bite 🍬
            <span className="block mt-2 text-base sm:text-lg text-[#FFD700]/70">
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
              className="btn-premium bg-gradient-to-r from-[#FFD700] to-[#D2691E] text-[#0D0D0D] px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold shadow-2xl hover:shadow-[#FFD700]/50 animate-glow"
            >
              Shop Now
            </motion.button>

           
          </motion.div>

          {/* Slideshow Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="flex justify-center space-x-3 mt-12"
          >
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`transition-all duration-300 ${
                  currentImage === index
                    ? 'w-12 h-2 bg-[#FFD700] rounded-full'
                    : 'w-2 h-2 bg-[#F5F5DC]/30 rounded-full hover:bg-[#F5F5DC]/60'
                }`}
              />
            ))}
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
          <span className="text-[#FFD700] text-sm mb-2 font-semibold">Scroll Down</span>
          <ChevronDown className="h-8 w-8 text-[#FFD700]" />
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent z-10"></div>
    </div>
  );
};

export default Hero;
