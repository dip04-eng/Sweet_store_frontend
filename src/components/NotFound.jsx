import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from './SEO';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF5] to-[#FFF8E7] flex items-center justify-center px-4">
      <SEO 
        title="Page Not Found (404)"
        description="The page you're looking for doesn't exist. Return to Mansoor Hotel & Sweets homepage to browse our delicious traditional Indian sweets."
        noindex={true}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-9xl font-bold text-[#C41E3A] mb-4"
        >
          404
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#2B1B17] mb-4 font-['Playfair_Display']">
          Oops! Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for seems to have wandered off like a lost laddu. 
          Don't worry, let's get you back to our delicious sweets!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#C41E3A] to-[#8B0000] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all group"
          >
            <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center border-2 border-[#C41E3A] text-[#C41E3A] px-8 py-3 rounded-full font-semibold hover:bg-[#C41E3A] hover:text-white transition-all group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
