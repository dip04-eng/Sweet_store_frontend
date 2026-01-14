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
    // { name: 'Shop', path: '/#shop' }, // Hidden for now - may be needed in future
    // { name: 'About', path: '/about' },
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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-effect shadow-lg border-b border-[#8B0000]/10"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group touch-manipulation" aria-label="Mansoor Hotel & Sweets - Home">
            <motion.div
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.3 }}
              className="relative flex-shrink-0 drop-shadow-lg"
            >
              <img src="/hotel_logo2-removebg-preview.png" alt="Mansoor Hotel & Sweets Logo" className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 object-contain transition-all duration-300" aria-hidden="true" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => scrollToSection(e, link.path)}
                role="menuitem"
                aria-current={location.pathname === link.path ? 'page' : undefined}
                className={`relative text-[#2B1B17] hover:text-[#C41E3A] transition-all duration-300 font-medium group ${
                  location.pathname === link.path ? 'text-[#C41E3A]' : ''
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#C41E3A] to-[#FFD700] group-hover:w-full transition-all duration-300" aria-hidden="true"></span>
              </Link>
            ))}
          </div>

          {/* Cart, Admin & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Admin Button */}
            <Link to="/admin-login" className="relative group" aria-label="Admin Login">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#8B0000] to-[#C41E3A] text-white px-3 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-[#FFD700]/50 flex items-center space-x-1 sm:space-x-2 transition-all border border-[#FFD700]/30"
              >
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="hidden sm:inline">Admin</span>
              </motion.div>
            </Link>

            {/* Cart Button */}
            <Link to="/cart" className="relative group" aria-label={`Shopping cart with ${cartItemCount} items`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-premium bg-gradient-to-r from-[#C41E3A] to-[#8B0000] text-white px-3 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-[#FFD700]/50 flex items-center space-x-1 sm:space-x-2 border border-[#FFD700]/30"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="animate-pulse-gold bg-[#FFD700] text-[#C41E3A] px-2 py-0.5 rounded-full text-xs font-bold"
                    aria-label={`${cartItemCount} items in cart`}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#C41E3A] p-2 touch-manipulation active:scale-95 transition-transform"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect border-t border-[#FFD700]/20"
            role="menu"
            aria-label="Mobile navigation"
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
                    role="menuitem"
                    aria-current={location.pathname === link.path ? 'page' : undefined}
                    className={`block text-[#2B1B17] hover:text-[#C41E3A] transition-colors font-medium py-2 ${
                      location.pathname === link.path ? 'text-[#C41E3A]' : ''
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
