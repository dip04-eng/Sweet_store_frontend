import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './SEO';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setMessageType('');
    
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SUBMIT_CONTACT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessageType('success');
        setSubmitMessage(data.message || 'Thank you! We will get back to you soon. 🍬');
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setSubmitMessage('');
          setMessageType('');
        }, 5000);
      } else {
        setMessageType('error');
        setSubmitMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessageType('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Madrasa Road', 'Baisi-854315', 'Bihar, India'],
      link: null,
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+919155197891', '+917463067892', 'Mon-Sat: 9AM - 9PM'],
      links: ['tel:+919155197891', 'tel:+917463067892', null],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['mansoors.info@gmail.com', 'We reply within 24 hours'],
      links: ['mailto:mansoors.info@gmail.com', null],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Sat: 9:00 AM - 9:00 PM', 'Sunday: 10:00 AM - 8:00 PM'],
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6E3] via-white to-[#FFF8E7]">
      <SEO 
        title="Contact Us - Get in Touch"
        description="Contact Mansoor Hotel & Sweets in Baisi, Bihar. Call +919155197891 or email mansoors.info@gmail.com. Visit us at Madrasa Road, Baisi-854315. Open Mon-Sat 9AM-9PM, Sun 10AM-8PM."
        keywords="contact Mansoor Sweets, Baisi sweet shop phone number, sweet shop address Bihar, order sweets phone, Madrasa Road Baisi"
        url="/contact"
        type="ContactPage"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Mansoor Hotel & Sweets",
          "description": "Get in touch with us for orders, inquiries, and bulk booking",
          "url": "https://sweet-store-frontend-ten.vercel.app/contact",
          "mainEntity": {
            "@type": "LocalBusiness",
            "name": "Mansoor Hotel & Sweets",
            "telephone": "+919155197891",
            "email": "mansoors.info@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Madrasa Road",
              "addressLocality": "Baisi",
              "addressRegion": "Bihar",
              "postalCode": "854315",
              "addressCountry": "IN"
            }
          }
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C41E3A]/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#C41E3A] via-[#8B0000] to-[#C41E3A] bg-clip-text text-transparent mb-6 font-['Playfair_Display'] px-4">
              Get In Touch
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
              We'd love to hear from you! Whether you have questions, feedback, or special orders, 
              we're here to help make your experience sweet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#C41E3A]/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#C41E3A] to-[#8B0000] rounded-2xl mb-4 shadow-lg">
                  <info.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#C41E3A] mb-3 font-['Playfair_Display']">
                  {info.title}
                </h3>
                {info.details.map((detail, idx) => {
                  const link = info.links ? info.links[idx] : null;
                  return link ? (
                    <a
                      key={idx}
                      href={link}
                      className="block text-gray-700 text-sm mb-1 hover:text-[#C41E3A] transition-colors duration-300 font-medium"
                    >
                      {detail}
                    </a>
                  ) : (
                    <p key={idx} className="text-gray-600 text-sm mb-1">
                      {detail}
                    </p>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
            >
              <h2 className="text-3xl font-bold text-[#C41E3A] mb-6 font-['Playfair_Display']">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-gray-800 mb-2 font-semibold text-sm">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#C41E3A] focus:bg-white transition-all placeholder-gray-400"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-800 mb-2 font-semibold text-sm">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#C41E3A] focus:bg-white transition-all placeholder-gray-400"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-800 mb-2 font-semibold text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#C41E3A] focus:bg-white transition-all placeholder-gray-400"
                    placeholder="+91 123 456 7890"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-800 mb-2 font-semibold text-sm">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-[#C41E3A] focus:bg-white transition-all resize-none placeholder-gray-400"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r from-[#C41E3A] to-[#8B0000] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center font-semibold py-3 rounded-xl border-2 ${
                      messageType === 'success'
                        ? 'text-green-700 bg-green-50 border-green-200'
                        : 'text-red-700 bg-red-50 border-red-200'
                    }`}
                  >
                    {submitMessage}
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Google Map */}
              <div className="bg-white rounded-2xl p-3 shadow-xl border border-gray-100 h-[420px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.547891234567!2d87.7435634!3d25.8638469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e545a3856b05bf%3A0x7c6023311a46cddd!2sMANSOOR%20HOTEL!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mansoor Hotel & Sweets Location"
                ></iframe>
              </div>

              {/* Why Visit Us */}
              <div className="bg-gradient-to-br from-[#C41E3A]/5 to-white rounded-2xl p-6 shadow-lg border border-[#C41E3A]/10">
                <h3 className="text-2xl font-bold text-[#C41E3A] mb-5 font-['Playfair_Display']">
                  Why Visit Us?
                </h3>
                <ul className="space-y-3">
                  {[
                    'Wide variety of traditional sweets',
                    'Fresh preparations daily',
                    'Special orders for events & festivals',
                    'Customized gift packaging',
                    'Hygiene certified kitchen',
                    'Home delivery available',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-700">
                      <span className="text-[#C41E3A] font-bold text-lg">✓</span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special Note */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
                <p className="text-[#C41E3A] font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">🎁</span> Special Orders
                </p>
                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                  Planning a celebration? We accept bulk orders for weddings, parties, and corporate events. 
                  Contact us at least 48 hours in advance for the best service!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#C41E3A] via-[#8B0000] to-[#C41E3A]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-['Playfair_Display'] drop-shadow-lg">
              Ready to Satisfy Your Sweet Cravings?
            </h2>
            <p className="text-white/90 text-lg mb-8 font-medium">
              Visit our store today or order online for home delivery!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="bg-white text-[#C41E3A] px-12 py-4 rounded-xl text-xl font-bold shadow-2xl hover:shadow-white/30 transition-all duration-300"
            >
              Browse Our Menu
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
