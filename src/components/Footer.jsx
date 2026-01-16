import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/hotel_logo2-removebg-preview.png" 
                alt="Mansoor Hotel Logo" 
                className="h-12 w-12 object-contain" 
              />
              <div>
                <h3 className="text-xl font-bold text-yellow-400">
                  MANSOOR HOTEL
                </h3>
                <p className="text-sm text-yellow-400">& SWEETS</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              MANSOOR & SONS - Crafting happiness in every bite since generations. 
              Experience the finest traditional sweets made with pure ingredients and love.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#shop"
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={scrollToTop}
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="h-4 w-4 text-yellow-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  Madrasa Road, Baisi-854315, Bihar, India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="h-4 w-4 text-yellow-400" />
                <div className="flex flex-col">
                  <a 
                    href="tel:+919155197891" 
                    className="text-gray-300 text-sm hover:text-yellow-400 transition-colors"
                  >
                    +919155197891
                  </a>
                  <a 
                    href="tel:+917463067892" 
                    className="text-gray-300 text-sm hover:text-yellow-400 transition-colors"
                  >
                    +917463067892
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-4 w-4 text-yellow-400" />
                <a 
                  href="mailto:mansoors.info@gmail.com" 
                  className="text-gray-300 text-sm hover:text-yellow-400 transition-colors"
                >
                  mansoors.info@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">
              Opening Hours
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Monday - Saturday</span>
                <span className="text-yellow-400 text-sm">9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">Sunday</span>
                <span className="text-yellow-400 text-sm">10:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} MANSOOR HOTEL & SWEETS (MANSOOR & SONS). All Rights Reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-gray-400 text-sm hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link 
                to="/terms" 
                className="text-gray-400 text-sm hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
