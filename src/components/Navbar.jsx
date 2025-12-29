import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, ShieldCheck } from 'lucide-react';
import { GiCupcake } from 'react-icons/gi';

const Navbar = ({ cart = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/#shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const scrollToSection = (e, path) => {
    if (path.includes('#')) {
      e.preventDefault();
      const element = document.querySelector(path.split('#')[1] ? `#${path.split('#')[1]}` : '#shop');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    }
  };

  const cartItemCount = cart.length; // Just count items, no quantity

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-effect shadow-2xl border-b border-[#FFD700]/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <GiCupcake className="h-10 w-10 text-[#FFD700] drop-shadow-lg" />
              <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gold-gradient font-['Playfair_Display']">
                MANSOOR HOTEL
              </h1>
              <p className="text-xs text-[#FFD700]/80 font-light tracking-wider">& SWEETS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => scrollToSection(e, link.path)}
                className={`relative text-[#F5F5DC] hover:text-[#FFD700] transition-all duration-300 font-medium group ${
                  location.pathname === link.path ? 'text-[#FFD700]' : ''
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FFD700] to-[#D2691E] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Cart, Admin & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Admin Button */}
            <Link to="/admin-login" className="relative group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-purple-500/50 flex items-center space-x-1 sm:space-x-2 transition-all"
              >
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Admin</span>
              </motion.div>
            </Link>

            {/* Cart Button */}
            <Link to="/cart" className="relative group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-premium bg-gradient-to-r from-[#FFD700] to-[#D2691E] text-[#0D0D0D] px-3 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-[#FFD700]/50 flex items-center space-x-1 sm:space-x-2"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="animate-pulse-gold bg-[#0D0D0D] text-[#FFD700] px-2 py-0.5 rounded-full text-xs font-bold"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#FFD700] p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect border-t border-[#FFD700]/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={(e) => {
                      scrollToSection(e, link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block text-[#F5F5DC] hover:text-[#FFD700] transition-colors font-medium py-2 ${
                      location.pathname === link.path ? 'text-[#FFD700]' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
