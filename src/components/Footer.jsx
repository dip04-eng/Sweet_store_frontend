import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { GiCupcake, GiCandyCanes, GiDonut, GiCookie } from 'react-icons/gi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: FaFacebook, url: 'https://facebook.com', color: '#1877F2' },
    { icon: FaInstagram, url: 'https://instagram.com', color: '#E4405F' },
    { icon: FaWhatsapp, url: 'https://wa.me/', color: '#25D366' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/#shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const sweetIcons = [GiCupcake, GiCandyCanes, GiDonut, GiCookie];

  return (
    <footer className="relative bg-gradient-to-b from-[#0D0D0D] to-[#1A0F0A] border-t border-[#FFD700]/20 pt-16 pb-8" role="contentinfo" aria-label="Site footer">
      {/* Decorative Sweet Icons */}
      <div className="absolute top-0 left-0 right-0 flex justify-around opacity-10 -mt-8" aria-hidden="true">
        {sweetIcons.map((Icon, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
          >
            <Icon className="h-16 w-16 text-[#FFD700]" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 sm:gap-6 md:gap-8 mb-8 xs:mb-10 sm:mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <img src="/hotel_logo2-removebg-preview.png" alt="Mansoor Hotel & Sweets Logo" className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 object-contain" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-bold text-gold-gradient font-['Playfair_Display']">
                  MANSOOR HOTEL
                </h3>
                <p className="text-xs text-[#FFD700]/80">& SWEETS</p>
              </div>
            </div>
            <p className="text-[#F5F5DC]/70 text-sm leading-relaxed">
              MANSOOR & SONS - Crafting happiness in every bite since generations. 
              Experience the finest traditional sweets made with pure ingredients and love.
            </p>
            <nav aria-label="Social media links">
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.icon.name?.replace('Fa', '') || 'social media'}`}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-[#1a1a1a] p-3 rounded-full hover:shadow-lg transition-all duration-300"
                    style={{ '--hover-color': social.color }}
                    onMouseEnter={(e) => e.currentTarget.style.background = social.color}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
                  >
                    <social.icon className="h-5 w-5 text-[#F5F5DC]" aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            </nav>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-[#FFD700] mb-4 font-['Playfair_Display']">
              Quick Links
            </h4>
            <nav aria-label="Quick navigation links">
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      onClick={scrollToTop}
                    className="text-[#F5F5DC]/70 hover:text-[#FFD700] transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#FFD700] group-hover:w-4 transition-all duration-300" aria-hidden="true"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            </nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-[#FFD700] mb-4 font-['Playfair_Display']">
              Contact Us
            </h4>
            <address className="not-italic">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 text-[#F5F5DC]/70">
                  <FaMapMarkerAlt className="h-5 w-5 text-[#FFD700] mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm">Madrasa Road, Baisi-854315, Bihar, India</span>
                </li>
                <li className="flex items-center space-x-3 text-[#F5F5DC]/70">
                  <FaPhone className="h-5 w-5 text-[#FFD700] flex-shrink-0" aria-hidden="true" />
                  <div className="flex flex-col space-y-1">
                    <a 
                      href="tel:+919155197891" 
                      className="text-sm hover:text-[#FFD700] transition-colors duration-300"
                      aria-label="Call us at +91 9155197891"
                    >
                      +919155197891
                    </a>
                    <a 
                      href="tel:+917463067892" 
                      className="text-sm hover:text-[#FFD700] transition-colors duration-300"
                      aria-label="Call us at +91 7463067892"
                    >
                      +917463067892
                    </a>
                  </div>
                </li>
                <li className="flex items-center space-x-3 text-[#F5F5DC]/70">
                  <FaEnvelope className="h-5 w-5 text-[#FFD700] flex-shrink-0" aria-hidden="true" />
                  <a 
                    href="mailto:mansoors.info@gmail.com" 
                    className="text-sm hover:text-[#FFD700] transition-colors duration-300"
                    aria-label="Email us at mansoors.info@gmail.com"
                  >
                    mansoors.info@gmail.com
                  </a>
                </li>
              </ul>
            </address>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-bold text-[#FFD700] mb-4 font-['Playfair_Display']">
              Opening Hours
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-[#F5F5DC]/70">
                <span>Monday - Saturday</span>
                <span className="text-[#FFD700]">9:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between text-[#F5F5DC]/70">
                <span>Sunday</span>
                <span className="text-[#FFD700]">10:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FFD700]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#F5F5DC]/50 text-sm text-center md:text-left">
              © {currentYear} MANSOOR HOTEL & SWEETS (MANSOOR & SONS). All Rights Reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-[#F5F5DC]/50">
              <Link to="/privacy" className="hover:text-[#FFD700] transition-colors">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-[#FFD700] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
      ></motion.div>
    </footer>
  );
};

export default Footer;
