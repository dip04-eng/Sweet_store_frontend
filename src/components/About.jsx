import { motion } from 'framer-motion';
import { Award, Heart, Users, Clock } from 'lucide-react';
import { GiCupcake } from 'react-icons/gi';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  const stats = [
    { icon: Clock, label: 'Years of Excellence', value: '50+' },
    { icon: Users, label: 'Happy Customers', value: '100K+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Heart, label: 'Sweets Varieties', value: '100+' },
  ];

  const traditions = [
    {
      title: 'Pure Ingredients',
      description: 'We use only the finest quality ingredients sourced from trusted suppliers.',
      icon: '🌾',
    },
    {
      title: 'Traditional Recipes',
      description: 'Time-tested family recipes passed down through generations.',
      icon: '📜',
    },
    {
      title: 'Handcrafted Love',
      description: 'Every sweet is made with care and attention to detail by expert artisans.',
      icon: '👨‍🍳',
    },
    {
      title: 'Hygiene First',
      description: 'Maintaining the highest standards of cleanliness and quality.',
      icon: '✨',
    },
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80',
    'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    'https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=600&q=80',
    'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&q=80',
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">

          "mainEntity": {
            "@type": "Organization",
            "name": "Mansoor & Sons",
            "foundingDate": "1976",
            "foundingLocation": {
              "@type": "Place",
              "name": "Baisi, Bihar, India"
            }
          }
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <GiCupcake className="absolute top-20 left-10 h-32 w-32 text-[#FFD700] animate-float" />
          <GiCupcake className="absolute bottom-20 right-10 h-40 w-40 text-[#FFD700] animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gold-gradient mb-4 sm:mb-6 font-['Playfair_Display'] px-4">
              Our Story
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#F5F5DC]/80 max-w-3xl mx-auto leading-relaxed px-4">
              A legacy of sweetness that has been delighting families for over five decades
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-4 sm:p-6 text-center"
              >
                <stat.icon className="h-10 w-10 sm:h-12 sm:w-12 text-[#FFD700] mx-auto mb-3 sm:mb-4" />
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFD700] mb-1 sm:mb-2">{stat.value}</h3>
                <p className="text-[#F5F5DC]/70 text-xs sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFD700] font-['Playfair_Display']">
                The MANSOOR Legacy
              </h2>
              <div className="space-y-4 text-[#F5F5DC]/80 leading-relaxed">
                <p>
                  Established in the heart of tradition, <span className="text-[#FFD700] font-semibold">MANSOOR HOTEL & SWEETS</span> began its journey 
                  with a simple mission: to bring the authentic taste of homemade sweets to every household.
                </p>
                <p>
                  What started as a small family venture by the founders, <span className="text-[#FFD700] font-semibold">MANSOOR & SONS</span>, 
                  has now blossomed into a beloved destination for sweet lovers across the region. Our commitment to quality, 
                  purity, and taste has remained unchanged through the generations.
                </p>
                <p>
                  Every sweet we create tells a story of dedication, craftsmanship, and love. From our signature rasgullas 
                  to the melt-in-your-mouth laddoos, each delicacy is prepared using time-honored recipes and the finest ingredients.
                </p>
                <p>
                  Today, we continue to uphold the values our founders instilled in us: <span className="text-[#FFD700]">purity, quality, and tradition</span>. 
                  Join us in celebrating the sweet moments of life.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-premium p-2">
                <img
                  src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80"
                  alt="Mansoor Sweets"
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#FFD700] to-[#D2691E] rounded-full blur-3xl opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Traditions Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#1A0F0A]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFD700] mb-4 font-['Playfair_Display']">
              Our Tradition
            </h2>
            <p className="text-[#F5F5DC]/70 text-lg max-w-2xl mx-auto">
              What makes us special and sets us apart
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditions.map((tradition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 text-center hover-glow"
              >
                <div className="text-5xl mb-4">{tradition.icon}</div>
                <h3 className="text-xl font-bold text-[#FFD700] mb-3 font-['Playfair_Display']">
                  {tradition.title}
                </h3>
                <p className="text-[#F5F5DC]/70 text-sm leading-relaxed">
                  {tradition.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFD700] mb-4 font-['Playfair_Display']">
              Our Sweet Gallery
            </h2>
            <p className="text-[#F5F5DC]/70 text-lg">
              A visual feast of our handcrafted delicacies
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card-premium p-2 cursor-pointer overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Sweet ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#1A0F0A] to-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <div className="card-premium p-2">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                  alt="Our Chef"
                  className="w-full h-[500px] object-cover rounded-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFD700] font-['Playfair_Display']">
                Meet Our Master Chef
              </h2>
              <p className="text-[#F5F5DC]/80 leading-relaxed">
                With over 30 years of expertise, our master chef has perfected the art of sweet-making. 
                Trained under the guidance of veteran confectioners and armed with secret family recipes, 
                he brings passion and precision to every creation.
              </p>
              <p className="text-[#F5F5DC]/80 leading-relaxed">
                His dedication to maintaining traditional methods while embracing modern hygiene standards 
                ensures that every bite you take is both authentic and safe.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="w-16 h-1 bg-gradient-to-r from-[#FFD700] to-[#D2691E]"></div>
                <p className="text-[#FFD700] font-semibold italic">
                  "Sweetness is not just taste, it's an emotion"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
