import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const FestivalCard = ({ sweet, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const isKgItem = sweet.unit === 'kg';
  
  // Generate weight options based on the item
  const weightOptions = isKgItem 
    ? ['200g', '400g', '800g'] 
    : null;

  const getWeightInKg = (weightStr) => {
    if (!weightStr) return 0.5; // Default 500g
    const numValue = parseInt(weightStr);
    return weightStr.includes('kg') ? numValue : numValue / 1000;
  };

  const calculatePrice = () => {
    if (isKgItem && selectedWeight) {
      return (sweet.rate * getWeightInKg(selectedWeight)).toFixed(0);
    }
    return (sweet.rate * quantity).toFixed(0);
  };

  const handleAddToCart = () => {
    if (isKgItem && !selectedWeight) {
      // Auto-select first weight option
      setSelectedWeight(weightOptions[0]);
      return;
    }
    
    setIsAdding(true);
    const finalQuantity = isKgItem ? getWeightInKg(selectedWeight) : quantity;
    onAddToCart(sweet, finalQuantity);
    
    setTimeout(() => {
      setIsAdding(false);
      setSelectedWeight(null);
      setQuantity(1);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group"
    >
      {/* Decorative Frame */}
      <div className="relative bg-[#FFFEF9] rounded-lg overflow-hidden shadow-lg">
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#C9A227] rounded-tl-lg z-10"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#C9A227] rounded-tr-lg z-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#C9A227] rounded-bl-lg z-10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#C9A227] rounded-br-lg z-10"></div>
        
        {/* Inner decorative line */}
        <div className="absolute inset-3 border-2 border-[#C9A227]/30 rounded-lg pointer-events-none"></div>
        
        {/* Content Container */}
        <div className="p-4 pt-5">
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-lg mb-4">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={sweet.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%230D0D0D" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬 Sweet%3C/text%3E%3C/svg%3E'}
              alt={sweet.name}
              className="w-full h-44 sm:h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23FFD700" width="400" height="300"/%3E%3Ctext fill="%230D0D0D" font-size="24" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🍬 Sweet%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#333] text-center mb-3 font-['Playfair_Display'] truncate px-2">
            {sweet.name}
          </h3>
          
          {/* Weight/Quantity Options */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {isKgItem ? (
              // Weight options for kg items
              weightOptions.map((weight) => (
                <motion.button
                  key={weight}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedWeight(weight)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                    selectedWeight === weight
                      ? 'bg-[#333] text-white border-[#333]'
                      : 'bg-transparent text-[#333] border-[#333] hover:bg-[#333]/10'
                  }`}
                >
                  {weight}
                </motion.button>
              ))
            ) : (
              // Quantity display for piece items
              <div className="flex items-center gap-3 bg-[#333] text-white rounded-full px-4 py-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-lg font-bold hover:text-[#FFD700] transition-colors"
                >
                  −
                </button>
                <span className="font-semibold min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-lg font-bold hover:text-[#FFD700] transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>
          
          {/* Price Display */}
          {(selectedWeight || !isKgItem) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-center mb-3"
            >
              <span className="text-lg font-bold text-[#C41E3A]">₹{calculatePrice()}</span>
            </motion.div>
          )}
          
          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-2.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isAdding
                ? 'bg-green-500 text-white'
                : 'bg-[#333] text-white hover:bg-[#444]'
            }`}
          >
            {isAdding ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  ✓
                </motion.div>
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add To Cart
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FestivalCard;
