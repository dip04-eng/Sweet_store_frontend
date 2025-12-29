import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setSubmitMessage('Thank you! We will get back to you soon. 🍬');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => setSubmitMessage(''), 3000);
    }, 1500);
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
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gold-gradient mb-6 font-['Playfair_Display']">
              Get In Touch
            </h1>
            <p className="text-lg sm:text-xl text-[#F5F5DC]/80 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you! Whether you have questions, feedback, or special orders, 
              we're here to help make your experience sweet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 text-center hover-glow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#D2691E] rounded-full mb-4">
                  <info.icon className="h-8 w-8 text-[#0D0D0D]" />
                </div>
                <h3 className="text-xl font-bold text-[#FFD700] mb-3 font-['Playfair_Display']">
                  {info.title}
                </h3>
                {info.details.map((detail, idx) => {
                  const link = info.links ? info.links[idx] : null;
                  return link ? (
                    <a
                      key={idx}
                      href={link}
                      className="block text-[#F5F5DC]/70 text-sm mb-1 hover:text-[#FFD700] transition-colors duration-300"
                    >
                      {detail}
                    </a>
                  ) : (
                    <p key={idx} className="text-[#F5F5DC]/70 text-sm mb-1">
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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-premium p-8"
            >
              <h2 className="text-3xl font-bold text-[#FFD700] mb-6 font-['Playfair_Display']">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[#F5F5DC] mb-2 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1a1a1a] border border-[#FFD700]/20 rounded-lg px-4 py-3 text-[#F5F5DC] focus:outline-none focus:border-[#FFD700] transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#F5F5DC] mb-2 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1a1a1a] border border-[#FFD700]/20 rounded-lg px-4 py-3 text-[#F5F5DC] focus:outline-none focus:border-[#FFD700] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[#F5F5DC] mb-2 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-[#FFD700]/20 rounded-lg px-4 py-3 text-[#F5F5DC] focus:outline-none focus:border-[#FFD700] transition-colors"
                    placeholder="+91 123 456 7890"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#F5F5DC] mb-2 font-medium">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full bg-[#1a1a1a] border border-[#FFD700]/20 rounded-lg px-4 py-3 text-[#F5F5DC] focus:outline-none focus:border-[#FFD700] transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full btn-premium bg-gradient-to-r from-[#FFD700] to-[#D2691E] text-[#0D0D0D] py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-[#FFD700]/50 flex items-center justify-center space-x-2 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0D0D0D] border-t-transparent"></div>
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
                    className="text-center text-[#FFD700] font-medium bg-[#FFD700]/10 py-3 rounded-lg border border-[#FFD700]/20"
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
              <div className="card-premium p-2 h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.547891234567!2d87.7435634!3d25.8638469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e545a3856b05bf%3A0x7c6023311a46cddd!2sMANSOOR%20HOTEL!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mansoor Hotel & Sweets Location"
                ></iframe>
              </div>

              {/* Why Visit Us */}
              <div className="card-premium p-6">
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4 font-['Playfair_Display']">
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
                    <li key={index} className="flex items-start space-x-3 text-[#F5F5DC]/70">
                      <span className="text-[#FFD700] mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special Note */}
              <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#D2691E]/10 border border-[#FFD700]/20 rounded-lg p-6">
                <p className="text-[#FFD700] font-semibold mb-2">🎁 Special Orders</p>
                <p className="text-[#F5F5DC]/70 text-sm">
                  Planning a celebration? We accept bulk orders for weddings, parties, and corporate events. 
                  Contact us at least 48 hours in advance for the best service!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#1A0F0A]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFD700] mb-6 font-['Playfair_Display']">
              Ready to Satisfy Your Sweet Cravings?
            </h2>
            <p className="text-[#F5F5DC]/70 text-lg mb-8">
              Visit our store today or order online for home delivery!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="btn-premium bg-gradient-to-r from-[#FFD700] to-[#D2691E] text-[#0D0D0D] px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-[#FFD700]/50"
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
