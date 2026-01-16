import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, ShieldCheck } from 'lucide-react';
import { GiCupcake } from 'react-icons/gi';

const Navbar = ({ cart = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    // Logo/Name already goes to home, so Home link is removed
    { name: 'About Us', path: '/about' },
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

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If already on home page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If on different page, navigate to home
      navigate('/');
      // Wait a bit for navigation to complete, then scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const cartItemCount = cart.length; // Just count items, no quantity

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b-2 border-[#FFD700]/30' 
          : 'bg-gradient-to-b from-white via-white/98 to-white/95 backdrop-blur-md shadow-xl border-b border-[#FFD700]/20'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20 lg:h-22">
          {/* Logo & Brand */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 md:gap-4 group touch-manipulation hover:opacity-90 transition-opacity" aria-label="Mansoor Hotel & Sweets - Home">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative flex-shrink-0 drop-shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-[#C41E3A]/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
              <img 
                src="\hotel_logo2-removebg-preview.png" 
                alt="Mansoor Hotel & Sweets Logo" 
                className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-18 lg:w-18 object-contain transition-all duration-300" 
                aria-hidden="true" 
                
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="relative flex-shrink-0 drop-shadow-lg hidden xs:block"
            >
              <img 
                src="/Name.png" 
                alt="Mansoor Hotel & Sweets Name" 
                className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain transition-all duration-300 opacity-90 group-hover:opacity-100" 
                aria-hidden="true" 
              />
            </motion.div>
          </Link>

          {/* Right Section: Navigation + Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2" role="menubar">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => scrollToSection(e, link.path)}
                  role="menuitem"
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                  className={`relative px-4 xl:px-5 py-2.5 text-sm xl:text-base font-semibold tracking-wide transition-all duration-300 group ${
                    location.pathname === link.path 
                      ? 'text-[#C41E3A]' 
                      : 'text-[#2B1B17] hover:text-[#C41E3A]'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FFD700]/10 to-[#C41E3A]/10 opacity-0 group-hover:opacity-100 transition-all duration-300" aria-hidden="true"></span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#C41E3A] to-[#FFD700] group-hover:w-3/4 transition-all duration-300" aria-hidden="true"></span>
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              {/* Admin Button */}
              <Link to="/admin-login" className="relative group" aria-label="Admin Login">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative overflow-hidden bg-gradient-to-r from-[#8B0000] via-[#C41E3A] to-[#8B0000] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-2xl hover:shadow-[#C41E3A]/40 flex items-center gap-1 sm:gap-2 transition-all duration-300 border-2 border-[#FFD700]/40 hover:border-[#FFD700]/60"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 relative z-10" aria-hidden="true" />
                <span className="hidden sm:inline relative z-10">Admin</span>
              </motion.div>
            </Link>

            {/* Cart Button */}
            <Link to="/cart" className="relative group" aria-label={`Shopping cart with ${cartItemCount} items`}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative overflow-hidden bg-gradient-to-r from-[#C41E3A] via-[#8B0000] to-[#C41E3A] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-2xl hover:shadow-[#FFD700]/40 flex items-center gap-1 sm:gap-2 transition-all duration-300 border-2 border-[#FFD700]/40 hover:border-[#FFD700]/60"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 relative z-10" aria-hidden="true" />
                <span className="hidden sm:inline relative z-10">Cart</span>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 bg-[#FFD700] text-[#8B0000] px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shadow-lg animate-pulse"
                    aria-label={`${cartItemCount} items in cart`}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden text-[#C41E3A] p-2 rounded-lg hover:bg-[#FFD700]/10 touch-manipulation transition-all duration-300"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />}
              </motion.div>
            </motion.button>
            </div>
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
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/98 backdrop-blur-xl border-t-2 border-[#FFD700]/30 shadow-2xl"
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 space-y-2 max-w-7xl mx-auto safe-area-insets">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <Link
                    to={link.path}
                    onClick={(e) => {
                      scrollToSection(e, link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    role="menuitem"
                    aria-current={location.pathname === link.path ? 'page' : undefined}
                    className={`relative block px-4 xs:px-5 py-3 xs:py-3.5 sm:py-3.5 rounded-xl font-semibold text-base xs:text-base sm:text-base transition-all duration-300 group overflow-hidden touch-manipulation min-h-[48px] flex items-center ${
                      location.pathname === link.path 
                        ? 'text-white bg-gradient-to-r from-[#C41E3A] to-[#8B0000] shadow-lg' 
                        : 'text-[#2B1B17] hover:text-[#C41E3A] hover:bg-gradient-to-r hover:from-[#FFD700]/10 hover:to-[#C41E3A]/10'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-between">
                      {link.name}
                      <motion.span
                        initial={{ x: -10, opacity: 0 }}
                        whileHover={{ x: 0, opacity: 1 }}
                        className="text-[#FFD700]"
                      >
                        →
                      </motion.span>
                    </span>
                    {location.pathname !== link.path && (
                      <span className="absolute inset-0 border-2 border-[#FFD700]/0 group-hover:border-[#FFD700]/30 rounded-xl transition-all duration-300"></span>
                    )}
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
