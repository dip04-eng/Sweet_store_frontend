import { motion } from 'framer-motion';
import { Award, Heart, Users, Clock, Star, ChefHat, Sparkles, TrendingUp } from 'lucide-react';
import { GiCupcake, GiCandyCanes } from 'react-icons/gi';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './SEO';

const About = () => {
  // eslint-disable-next-line no-unused-vars
  const milestones = [
    { year: '1968', title: 'The Beginning', description: 'Mansoor & Sons started with a dream to serve authentic sweets' },
    { year: '1990', title: 'Expansion', description: 'Opened our iconic Madrasa Road location in Baisi' },
    { year: '2010', title: 'Recognition', description: 'Became Bihar\'s most trusted sweet shop' },
    { year: '2026', title: 'Digital Era', description: 'Launched online ordering to serve customers nationwide' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Pure Ingredients',
      description: 'Only the finest quality ghee, milk, and ingredients in every sweet',
      color: '#C41E3A',
    },
    {
      icon: ChefHat,
      title: 'Traditional Recipes',
      description: 'Time-tested family recipes passed down through generations',
      color: '#FFD700',
    },
    {
      icon: Users,
      title: 'Family Heritage',
      description: 'Three generations of sweet-making excellence and dedication',
      color: '#8B0000',
    },
    {
      icon: Award,
      title: 'Quality Promise',
      description: 'Freshly prepared daily with uncompromising quality standards',
      color: '#C41E3A',
    },
  ];

  const stats = [
    { number: '50+', label: 'Years of Excellence', icon: Clock },
    { number: '100+', label: 'Sweet Varieties', icon: GiCupcake },
    { number: '10,000+', label: 'Happy Customers', icon: Users },
    { number: '4.8', label: 'Customer Rating', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#1A0F0A] to-[#0D0D0D] flex flex-col">
      {/* SEO Component */}
      <SEO
        title="About Us - Mansoor Hotel & Sweets | Family-Owned Since 1968"
        description="Learn about Mansoor Hotel & Sweets' 50+ year journey in Baisi, Bihar. Family-owned since 1968, serving authentic Indian sweets with traditional recipes and pure ingredients."
        keywords="About Mansoor Hotel, Mansoor & Sons history, traditional sweet shop, Baisi Bihar sweets heritage, family-owned business"
        url="/about"
      />

      {/* Navbar */}
      <Navbar cart={[]} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[550px] xs:min-h-[600px] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden mt-16 xs:mt-18 sm:mt-20 py-8">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/Background.png"
            alt="Mansoor Hotel & Sweets Heritage"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/80 via-[#C41E3A]/20 to-[#0D0D0D]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-3 xs:px-4 sm:px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <Sparkles className="h-16 w-16 sm:h-20 sm:w-20 text-[#FFD700] animate-pulse" />
                <div className="absolute inset-0 bg-[#FFD700]/20 blur-2xl"></div>
              </div>
            </motion.div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-['Playfair_Display']">
              Our <span className="text-[#FFD700]">Sweet</span> Story
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-[#F5F5DC]/80 max-w-3xl mx-auto leading-relaxed mb-6"
            >
              Crafting happiness in every bite since <span className="text-[#FFD700] font-bold">1968</span>
            </motion.p>
            
            {/* Additional Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#FFD700]/30 max-w-4xl mx-auto"
            >
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-4">
                <span className="text-[#FFD700] font-bold text-xl sm:text-2xl">Mansoor Hotel & Sweets</span> has been a beacon of authentic taste and tradition in Baisi, Bihar for over half a century.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-[#F5F5DC]/80 leading-relaxed mb-6 pb-4">
                From our humble beginnings to becoming a household name, we've preserved the art of traditional sweet-making while embracing modern quality standards. Every sweet tells a story of dedication, passion, and the pure joy of authentic flavors that have been cherished by generations.
              </p>
              
              {/* Since 1968 Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="inline-flex items-center gap-2 bg-white/95 px-4 py-2 rounded-full mt-4 shadow-2xl border-2 border-[#FFD700]"
              >
                <span className="text-2xl">🏆</span>
                <div className="text-left">
                  <div className="text-[#C41E3A] text-base font-bold">Since 1968</div>
                  <div className="text-gray-600 text-xs">Trusted by Thousands</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Sweet Icons */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 opacity-20"
        >
          <GiCupcake className="h-24 w-24 text-[#FFD700]" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 opacity-20"
        >
          <GiCandyCanes className="h-24 w-24 text-[#C41E3A]" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-[#C41E3A]/10 to-[#8B0000]/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 to-[#FFD700]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <stat.icon className="h-10 w-10 sm:h-12 sm:w-12 text-[#FFD700] mb-4 mx-auto" />
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-['Playfair_Display']">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base text-[#F5F5DC]/70">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '60px' }}
                  viewport={{ once: true }}
                  className="h-1 bg-gradient-to-r from-[#C41E3A] to-[#FFD700] mb-4"
                ></motion.div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFD700] font-['Playfair_Display'] mb-6">
                  The MANSOOR Legacy
                </h2>
              </div>

              <div className="space-y-5 text-[#F5F5DC]/80 leading-relaxed text-base sm:text-lg">
                <p className="bg-gradient-to-r from-[#C41E3A]/5 to-transparent p-4 rounded-lg border-l-4 border-[#FFD700]">
                  In <span className="text-[#FFD700] font-semibold">1968</span>, in the historic town of <span className="text-[#FFD700] font-semibold">Baisi, Bihar</span>, a sweet dream was born.
                  <span className="text-[#FFD700] font-semibold"> Mansoor & Sons</span> started with a simple vision: to share the authentic taste of traditional Indian sweets made with love, care, and the finest ingredients.
                </p>

                <p>
                  What began as a modest sweet shop on <span className="text-[#FFD700] font-semibold">Madrasa Road</span> has grown into a beloved institution,
                  serving generations of families with the same dedication to quality and authenticity that our founders instilled from day one.
                </p>

                <p>
                  For over <span className="text-[#FFD700] font-semibold">50 years</span>, <span className="text-[#FFD700] font-semibold">Mansoor Hotel & Sweets</span> has been
                  the heartbeat of celebrations, festivals, and everyday joys in Bihar and beyond. From weddings to Eid,Diwali, from simple family gatherings to grand
                  celebrations, our sweets have been part of countless precious memories.
                </p>

                <p className="text-[#FFD700] font-semibold italic">
                  "We don't just make sweets; we create moments of happiness that last a lifetime."
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <div className="bg-gradient-to-r from-[#C41E3A] to-[#8B0000] text-white px-8 py-4 rounded-full font-bold shadow-2xl border-2 border-[#FFD700]/50">
                  <TrendingUp className="inline-block mr-2 h-5 w-5" />
                  Three Generations of Excellence
                </div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/Background.png"
                  alt="Mansoor Hotel & Sweets - Traditional Sweet Making"
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 via-[#0D0D0D]/40 to-transparent"></div>

                {/* Center Text Overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <GiCupcake className="h-16 w-16 sm:h-20 sm:w-20 text-[#FFD700]" />
                  </motion.div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 font-['Playfair_Display'] drop-shadow-2xl">
                    Authentic Taste
                  </h3>
                  <p className="text-base sm:text-lg text-[#FFD700] font-semibold mb-2 drop-shadow-lg">
                    Handcrafted with Love
                  </p>
                  <p className="text-sm sm:text-base text-white/90 max-w-xs drop-shadow-lg">
                    Traditional recipes passed down through three generations
                  </p>
                </motion.div>

                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Award className="h-10 w-10 text-[#FFD700]" />
                    <div>
                      <div className="text-2xl font-bold text-[#C41E3A] font-['Playfair_Display']">Since 1968</div>
                      <div className="text-sm text-gray-600">Trusted by Thousands</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#FFD700] to-[#C41E3A] rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#C41E3A] to-[#8B0000] rounded-full blur-3xl opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-transparent to-[#1A0F0A]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-['Playfair_Display']">
              What Makes Us <span className="text-[#FFD700]">Special</span>
            </h2>
            <p className="text-[#F5F5DC]/70 text-lg max-w-2xl mx-auto">
              Our commitment to excellence is built on these core values
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-[#FFD700]/10 hover:border-[#FFD700]/40 transition-all duration-500 h-full">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 to-[#C41E3A]/0 group-hover:from-[#FFD700]/10 group-hover:to-[#C41E3A]/10 rounded-2xl transition-all duration-500"></div>

                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className="inline-block p-4 bg-gradient-to-br from-[#C41E3A]/20 to-[#8B0000]/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="h-10 w-10" style={{ color: value.color }} />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-['Playfair_Display']">
                      {value.title}
                    </h3>

                    <p className="text-[#F5F5DC]/70 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-[#1A0F0A] to-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-['Playfair_Display']">
              Visit Our <span className="text-[#FFD700]">Sweet Home</span>
            </h2>
            <p className="text-[#F5F5DC]/70 text-lg">
              Located in the heart of Baisi, Bihar
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#1A0F0A] rounded-3xl p-8 border border-[#FFD700]/20 shadow-2xl"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C41E3A]/30 rounded-lg">
                    <Award className="h-6 w-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Address</h3>
                    <p className="text-[#F5F5DC]/80">
                      Madrasa Road, Baisi<br />
                      Bihar - 854315, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C41E3A]/30 rounded-lg">
                    <Clock className="h-6 w-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Business Hours</h3>
                    <p className="text-[#F5F5DC]/80">
                      Monday - Saturday: 9:00 AM - 9:00 PM<br />
                      Sunday: 10:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C41E3A]/30 rounded-lg">
                    <Users className="h-6 w-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Contact</h3>
                    <p className="text-[#F5F5DC]/80">
                      +91 9155197891<br />
                      +91 7463067892<br />
                      mansoors.info@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-[350px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FFD700]/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3591.123456789!2d87.7311!3d25.8597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDUxJzM1LjAiTiA4N8KwNDMnNTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mansoor Hotel & Sweets Location"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#C41E3A] to-[#8B0000] rounded-3xl p-12 relative overflow-hidden shadow-2xl"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <Heart className="h-16 w-16 text-[#FFD700] mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-['Playfair_Display']">
              Be Part of Our Sweet Journey
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the taste of tradition. Order your favorite sweets today and become part of our growing family!
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-[#C41E3A] px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-[#FFD700]/50 transition-all duration-300"
            >
              Explore Our Collection
            </motion.a>
          </div>
        </motion.div>
      </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
